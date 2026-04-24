import { createContext, useCallback, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { tokenStorage } from '../utils/tokenStorage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) // true while we try to restore session

  // On mount: if a refresh token exists in localStorage, silently get
  // a new access token so the user stays logged in across page reloads.
 useEffect(() => {
  const token = tokenStorage.getAccess()

  if (!token) {
    setLoading(false)
    return
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))

    setUser({
      id: payload.user_id,
      role: payload.role,
    })
  } catch (err) {
    console.error("Invalid token:", err)
    tokenStorage.clearAccess()
  } finally {
    setLoading(false)
  }
}, [])

  const login = useCallback(async (email, password) => {
    const u = await authService.login(email, password)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (email, password) => {
    const result = await authService.register(email, password)
    return result
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}