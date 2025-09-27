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
      const getDemoUser = () => {
        const role = (import.meta.env.VITE_AUTO_LOGIN_ROLE || 'customer').toLowerCase()
        const email = import.meta.env.VITE_DEMO_EMAIL || 'demo@snafles.com'
        const name = role === 'admin' ? 'Admin User' : role === 'vendor' ? 'Vendor User' : 'Demo User'
        return { id: 'demo', name, email, role }
      }

      const token = localStorage.getItem('token')
      if (token) {
        // Support client-side demo sessions without backend
        if (token === 'demo') {
          setUser(getDemoUser())
          setLoading(false)
          return
        }
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

      // Optional auto-login only if explicitly enabled
      const autoEnabled = import.meta.env.VITE_AUTO_LOGIN === 'true'
      const autoRole = (import.meta.env.VITE_AUTO_LOGIN_ROLE || '').toLowerCase()
      if (autoEnabled && (autoRole === 'vendor' || autoRole === 'admin')) {
        const email = import.meta.env.VITE_DEMO_EMAIL || 'vendor@snafles.com'
        const password = import.meta.env.VITE_DEMO_PASSWORD || 'vendor123'
        try {
          const res = autoRole === 'vendor'
            ? await authAPI.vendorLogin({ email, password })
            : await authAPI.login({ email, password })
          localStorage.setItem('token', res.token || 'demo')
          setUser(res.user || getDemoUser())
        } catch (e) {
          console.warn('Auto-login via API failed, falling back to client demo:', e?.message)
          localStorage.setItem('token', 'demo')
          setUser(getDemoUser())
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
      // Graceful demo fallback (works without backend)
      const allowDemo = import.meta.env.VITE_ALLOW_DEMO_LOGIN === 'true' || import.meta.env.DEV
      const demoMap = {
        'demo@snafles.com': { name: 'Sarah Johnson', role: 'customer' },
        'admin@snafles.com': { name: 'Admin User', role: 'admin' },
      }
      const passMap = {
        'demo@snafles.com': 'demo123',
        'admin@snafles.com': 'admin123',
      }
      if (allowDemo && demoMap[email] && passMap[email] === password) {
        const demoUser = { id: 'demo', email, name: demoMap[email].name, role: demoMap[email].role }
        localStorage.setItem('token', 'demo')
        setUser(demoUser)
        return { success: true, user: demoUser, demo: true }
      }
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
      // Graceful demo fallback (works without backend)
      const allowDemo = import.meta.env.VITE_ALLOW_DEMO_LOGIN === 'true' || import.meta.env.DEV
      if (allowDemo && email === 'vendor@snafles.com' && password === 'vendor123') {
        const demoVendor = { id: 'demo-vendor', email, name: 'Vendor User', role: 'vendor', businessName: 'Demo Vendor' }
        localStorage.setItem('token', 'demo')
        setUser(demoVendor)
        return { success: true, user: demoVendor, demo: true }
      }
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
    registerVendor
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
