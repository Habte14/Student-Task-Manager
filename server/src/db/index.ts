import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Copy server/.env.example to server/.env and fill in your Postgres connection string.',
  )
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })
