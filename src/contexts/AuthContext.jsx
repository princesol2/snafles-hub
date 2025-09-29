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
    // Bootstrap auth on app load (no auto-login by default)
    const bootstrap = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await authAPI.getCurrentUser()
          setUser(response.user)
          setLoading(false)
          return
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('token')
          setUser(null)
        }
      }

      setLoading(false)
    }

    bootstrap()
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

  // Vendor authentication
  const loginVendor = async (email, password) => {
    try {
      const response = await authAPI.vendorLogin({ email, password })
      localStorage.setItem('token', response.token)
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, message: error.message || 'Vendor login failed. Please try again.' }
    }
  }

  const registerVendor = async (vendorData) => {
    try {
      const response = await authAPI.vendorRegister(vendorData)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, message: error.message || 'Vendor registration failed. Please try again.' }
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

  // Google OAuth login
  const googleLogin = async (googleData) => {
    try {
      console.log('Google login attempt with data:', googleData)
      const response = await authAPI.googleLogin(googleData)
      console.log('Google login response:', response)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      console.log('User set in context:', response.user)
      return { success: true, user: response.user }
    } catch (error) {
      console.error('Google login error:', error)
      return { success: false, message: error.message || 'Google login failed. Please try again.' }
    }
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
    updateProfile,
    loginVendor,
    registerVendor,
    googleLogin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
