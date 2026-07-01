import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { RPCHandler } from '@orpc/server/fetch'
import { onError } from '@orpc/server'
import { router } from './router.ts'
import { getSession } from './session-store.ts'
import { SESSION_COOKIE } from './auth-router.ts'
import type { AuthContext } from './context.ts'

const PORT = Number(process.env.PORT ?? 3001)
// The exact origin the frontend is served from. Wildcard CORS ("*") is not
// compatible with credentialed requests (cookies), so this must be a
// concrete origin in both dev and production.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
)

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error('[oRPC error]', error)
    }),
  ],
})

app.use('/rpc/*', async (c, next) => {
  const sessionToken = getCookie(c, SESSION_COOKIE)
  const session = getSession(sessionToken)

  const context: AuthContext = {
    userId: session?.userId ?? null,
    sessionToken,
    setSessionCookie: (token: string) => {
      setCookie(c, SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'Lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    },
    clearSessionCookie: () => {
      deleteCookie(c, SESSION_COOKIE, { path: '/' })
    },
  }

  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: '/rpc',
    context,
  })

  if (matched) {
    return c.newResponse(response.body, response)
  }

  await next()
})

app.get('/health', (c) => c.json({ ok: true }))

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`oRPC + Hono server running on http://localhost:${info.port}`)
})
