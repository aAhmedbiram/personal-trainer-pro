import axios from 'axios'

// Railway backend URL - الرابط الصحيح الكامل
// ⚠️ مهم: تأكد من أن هذا الرابط مطابق تماماً للرابط في Railway
const RAILWAY_API_URL = 'https://personal-trainer-pro-personal-trainer-pro.up.railway.app/api'

// تحديد الـ API URL
let API_URL = '/api' // Default للـ local development

// إذا كان على Vercel، استخدم Railway مباشرة (قبل أي شيء)
if (typeof window !== 'undefined') {
  const hostname = window.location.hostname
  if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
    API_URL = RAILWAY_API_URL
    console.log('🌐 Detected Vercel deployment, using Railway API')
  }
}

// إذا كان هناك environment variable، استخدمه (الأولوية العليا)
if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL
  // تأكد من وجود /api في النهاية
  if (!API_URL.endsWith('/api')) {
    API_URL = API_URL.endsWith('/') ? API_URL + 'api' : API_URL + '/api'
  }
  console.log('🔧 Using VITE_API_URL from environment')
}

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

