import { os, ORPCError } from '@orpc/server'
import { z } from 'zod'
import { SignupInputSchema, LoginInputSchema, UserSchema } from './schemas.ts'
import { createUser, verifyCredentials, getUserById } from './auth-store.ts'
import { createSession, destroySession } from './session-store.ts'
import type { AuthContext } from './context.ts'

const base = os.$context<AuthContext>()

export const SESSION_COOKIE = 'task_session'

const OkSchema = z.object({ ok: z.boolean() })

// --- auth.signup ---
const signup = base
  .input(SignupInputSchema)
  .output(UserSchema)
  .handler(async ({ input, context }) => {
    let user
    try {
      user = await createUser(input.name, input.email, input.password)
    } catch (err) {
      if (err instanceof Error && err.message === 'EMAIL_TAKEN') {
        throw new ORPCError('CONFLICT', { message: 'An account with this email already exists' })
      }
      throw err
    }

    const token = createSession(user.id)
    context.setSessionCookie(token)
    return user
  })

// --- auth.login ---
const login = base
  .input(LoginInputSchema)
  .output(UserSchema)
  .handler(async ({ input, context }) => {
    const user = await verifyCredentials(input.email, input.password)

    if (!user) {
      throw new ORPCError('UNAUTHORIZED', { message: 'Invalid email or password' })
    }

    const token = createSession(user.id)
    context.setSessionCookie(token)
    return user
  })

// --- auth.logout ---
const logout = base
  .output(OkSchema)
  .handler(async ({ context }) => {
    destroySession(context.sessionToken)
    context.clearSessionCookie()
    return { ok: true }
  })

// --- auth.me ---
const me = base
  .output(UserSchema.nullable())
  .handler(async ({ context }) => {
    if (!context.userId) return null
    return getUserById(context.userId)
  })

export const authRouter = {
  signup,
  login,
  logout,
  me,
}
