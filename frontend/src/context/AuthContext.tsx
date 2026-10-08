import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { User } from '../types/Auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setIsLoading(false)
      return
    }

    authApi
      .getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('access_token'))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const data = await authApi.login(email, password)
    localStorage.setItem('access_token', data.access_token)
    setUser(data.user)
  }

  async function register(name: string, email: string, password: string, passwordConfirmation: string) {
    const data = await authApi.register(name, email, password, passwordConfirmation)
    localStorage.setItem('access_token', data.access_token)
    setUser(data.user)
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem('access_token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth precisa de estar dentro de um AuthProvider')
  }
  return context
}