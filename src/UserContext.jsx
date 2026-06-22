import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const TOKEN_KEY = 'nl_user_token'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY))

  const fetchMe = useCallback(async (t) => {
    if (!t) return
    try {
      const res = await fetch(`${API}/api/user/me`, {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.ok) {
        setUser(await res.json())
      } else {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
      }
    } catch {
      // network error — keep token, try again next session
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) fetchMe(token)
    else setLoading(false)
  }, [token, fetchMe])

  const login = async (email, password) => {
    let res, data
    try {
      res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      data = await res.json()
    } catch {
      throw new Error('Could not reach the server. Try again later.')
    }
    if (!res.ok) throw new Error(data.error || 'Login failed')
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password) => {
    let res, data
    try {
      res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      data = await res.json()
    } catch {
      throw new Error('Could not reach the server. Try again later.')
    }
    if (!res.ok) throw new Error(data.error || 'Registration failed')
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const refreshUser = useCallback(() => fetchMe(token), [token, fetchMe])

  return (
    <UserContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
