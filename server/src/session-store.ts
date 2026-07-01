import { randomBytes } from 'crypto'

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface Session {
  userId: string
  expiresAt: number
}

const sessions = new Map<string, Session>()

export function createSession(userId: string): string {
  const token = randomBytes(32).toString('hex')
  sessions.set(token, { userId, expiresAt: Date.now() + SESSION_TTL_MS })
  return token
}

export function getSession(token: string | undefined): Session | null {
  if (!token) return null
  const session = sessions.get(token)
  if (!session) return null

  if (session.expiresAt < Date.now()) {
    sessions.delete(token)
    return null
  }

  return session
}

export function destroySession(token: string | undefined): void {
  if (token) sessions.delete(token)
}
