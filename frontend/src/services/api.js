import axios from 'axios'

// Use environment variable for API URL, fallback to proxy for local development
const API_URL = import.meta.env.VITE_API_URL || '/api'

// Debug: Always log the API URL being used (helps diagnose connection issues)
console.log('🔗 API URL configured:', API_URL)
if (!import.meta.env.VITE_API_URL) {
  console.warn('⚠️ VITE_API_URL not set! Using relative URL. This will not work on Vercel.')
  console.warn('💡 Set VITE_API_URL in Vercel: https://personal-trainer-pro-personal-trainer-pro.up.railway.app')
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default api

