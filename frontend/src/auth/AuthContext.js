import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

// { user, checking, sessionExpired, login, logout }
export function useAuth() {
  return useContext(AuthContext)
}
