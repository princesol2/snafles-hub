import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await authAPI.getCurrentUser()
          setUser(response.user)
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      
      // Store token and user data
      localStorage.setItem('token', response.token)
      setUser(response.user)
      
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, message: error.message || 'Login failed. Please try again.' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      
      // Store token and user data
      localStorage.setItem('token', response.token)
      setUser(response.user)
      
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  const updateProfile = async (updatedData) => {
    try {
      const response = await authAPI.updateProfile(updatedData)
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, message: error.message || 'Profile update failed' }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
