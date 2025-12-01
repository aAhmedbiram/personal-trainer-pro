import { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [trainer, setTrainer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchTrainer()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchTrainer = async () => {
    try {
      const response = await api.get('/auth/me')
      setTrainer(response.data)
    } catch (error) {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, trainer } = response.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setTrainer(trainer)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = 'Login failed'
      
      if (error.response) {
        errorMessage = error.response.data?.error || `Server error: ${error.response.status}`
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your internet connection or contact support.'
      } else {
        errorMessage = error.message || 'An unexpected error occurred'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const register = async (data) => {
    try {
      const response = await api.post('/auth/register', data)
      const { token, trainer } = response.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setTrainer(trainer)
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      let errorMessage = 'Registration failed'
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.error || `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request made but no response (network error)
        errorMessage = 'Cannot connect to server. Please check your internet connection or contact support.'
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setTrainer(null)
  }

  const value = {
    trainer,
    loading,
    login,
    register,
    logout,
    fetchTrainer
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

