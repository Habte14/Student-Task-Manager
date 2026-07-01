import { useCallback, useEffect, useState } from 'react'
import type { User } from '../types'
import { orpc } from '../api'

/**
 * Encapsulates session bootstrapping (checking for an existing cookie
 * session on mount) and logout. Keeping this out of App.tsx means the
 * component tree only deals with "is there a user, yes/no" rather than
 * the request lifecycle.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    orpc.auth
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true))
  }, [])

  const logout = useCallback(async (onLoggedOut?: () => void) => {
    try {
      await orpc.auth.logout()
    } catch (err) {
      console.error('Failed to logout:', err)
    } finally {
      setUser(null)
      onLoggedOut?.()
    }
  }, [])

  return { user, setUser, authChecked, logout }
}
