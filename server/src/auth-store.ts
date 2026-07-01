import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { eq } from 'drizzle-orm'
import { db } from './db/index.ts'
import { usersTable, type DbUser } from './db/schema.ts'
import type { User } from './schemas.ts'

const scrypt = promisify(scryptCallback)

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(':')
  if (!salt || !hashHex) return false
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  const storedKey = Buffer.from(hashHex, 'hex')
  if (storedKey.length !== derivedKey.length) return false
  return timingSafeEqual(storedKey, derivedKey)
}

function toPublicUser(user: DbUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const existing = await db.query.usersTable.findFirst({ where: eq(usersTable.email, email) })
  if (existing) {
    throw new Error('EMAIL_TAKEN')
  }

  const passwordHash = await hashPassword(password)

  const [user] = await db
    .insert(usersTable)
    .values({ name, email, passwordHash })
    .returning()

  return toPublicUser(user)
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.email, email) })
  if (!user) return null

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) return null

  return toPublicUser(user)
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, id) })
  return user ? toPublicUser(user) : null
}
