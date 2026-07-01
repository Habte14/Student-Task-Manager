export interface AuthContext {
  /** The logged-in user's id, or null if not authenticated. */
  userId: string | null
  /** The raw session token from the cookie, if present. */
  sessionToken: string | undefined
  /** Call to set the session cookie on the outgoing response. */
  setSessionCookie: (token: string) => void
  /** Call to clear the session cookie on the outgoing response. */
  clearSessionCookie: () => void
}
