import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface JWTPayload {
  sub: string
  email: string
  username: string
  exp: number
  iat: number
  [key: string]: unknown
}

export interface AuthContextType {
  token: string | null
  user: JWTPayload | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  getAuthHeaders: () => Record<string, string>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const parseJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error parsing JWT:', error)
    return null
  }
}

const isTokenExpired = (token: string): boolean => {
  const payload = parseJWT(token)
  if (!payload) return true

  const currentTime = Date.now() / 1000
  return payload.exp < currentTime
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<JWTPayload | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initAuth = (): void => {
      const storedToken = localStorage.getItem('token')

      if (storedToken && !isTokenExpired(storedToken)) {
        const payload = parseJWT(storedToken)
        if (payload) {
          setToken(storedToken)
          setUser(payload)
        } else {
          localStorage.removeItem('token')
        }
      } else if (storedToken) {
        localStorage.removeItem('token')
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const logout = (): void => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  const contextValue: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    isLoading,
    logout,
    getAuthHeaders
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
