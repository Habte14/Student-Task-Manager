import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import type { AppRouter } from '../server/src/router'

// In dev, Vite proxies /rpc -> http://localhost:3001 (see vite.config.ts).
// In production, the API should be served from the same origin under /rpc.
const link = new RPCLink({
  url: () => `${window.location.origin}/rpc`,
  // Session auth uses an httpOnly cookie, so every request must include it.
  fetch: (request, init) => fetch(request, { ...init, credentials: 'include' }),
})

// Fully typed client: every method, its input shape, and its return type
// are inferred directly from the server's router — no manual typing needed,
// and a server-side schema change will surface as a type error here.
export const orpc: RouterClient<AppRouter> = createORPCClient(link)
