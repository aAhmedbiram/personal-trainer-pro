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
// لكن تأكد من أنه الرابط الصحيح (يحتوي على personal-trainer-pro-personal-trainer-pro)
if (import.meta.env.VITE_API_URL) {
  const envUrl = import.meta.env.VITE_API_URL
  // إذا كان الرابط صحيح (يحتوي على personal-trainer-pro-personal-trainer-pro)، استخدمه
  if (envUrl.includes('personal-trainer-pro-personal-trainer-pro')) {
    API_URL = envUrl
    // تأكد من وجود /api في النهاية
    if (!API_URL.endsWith('/api')) {
      API_URL = API_URL.endsWith('/') ? API_URL + 'api' : API_URL + '/api'
    }
    console.log('🔧 Using VITE_API_URL from environment')
  } else {
    // إذا كان الرابط خاطئ (ناقص)، تجاهله واستخدم الرابط الصحيح
    console.warn('⚠️ VITE_API_URL is incorrect, ignoring it and using correct Railway URL')
    API_URL = RAILWAY_API_URL
  }
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
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: false // Important for CORS
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    })
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown'
    })
    return Promise.reject(error)
  }
)

// Add token to requests if available
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default api

