import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, getToken, SESSION_EXPIRED_EVENT, setToken } from '../api/client'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }) {
  // Si hay un token guardado, se revisa con /auth/me antes de mostrar páginas protegidas
  const [state, setState] = useState(() => ({
    user: null,
    checking: Boolean(getToken()),
    sessionExpired: false,
  }))

  useEffect(() => {
    if (!getToken()) return
    api('/auth/me').then(
      (user) => setState({ user, checking: false, sessionExpired: false }),
      () => setState({ user: null, checking: false, sessionExpired: false }),
    )
  }, [])

  // El cliente de la API avisa cuando una llamada responde 401 con sesión iniciada
  useEffect(() => {
    const handleExpired = () => setState({ user: null, checking: false, sessionExpired: true })
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired)
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user } = await api('/auth/login', { method: 'POST', body: { email, password } })
    setToken(token)
    setState({ user, checking: false, sessionExpired: false })
    return user
  }, [])

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch {
      // Si la sesión ya había expirado, igual se cierra en el navegador
    }
    setToken(null)
    setState({ user: null, checking: false, sessionExpired: false })
  }, [])

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
