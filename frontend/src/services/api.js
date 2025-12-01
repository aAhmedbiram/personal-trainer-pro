import axios from 'axios'

// Railway backend URL - هذا هو الرابط الصحيح
const RAILWAY_API_URL = 'https://personal-trainer-pro-personal-trainer-pro.up.railway.app'

// Use environment variable if set, otherwise use Railway URL directly, fallback to proxy for local dev
const API_URL = import.meta.env.VITE_API_URL || 
                 (window.location.hostname.includes('vercel.app') ? RAILWAY_API_URL : '/api')

// Debug: Always log the API URL being used
console.log('🔗 API URL configured:', API_URL)
if (!import.meta.env.VITE_API_URL && window.location.hostname.includes('vercel.app')) {
  console.warn('⚠️ VITE_API_URL not set in Vercel, using hardcoded Railway URL')
  console.warn('💡 For better control, set VITE_API_URL in Vercel environment variables')
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

