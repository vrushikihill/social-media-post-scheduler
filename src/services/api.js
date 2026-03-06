import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000

  // headers: { 'Content-Type': 'application/json' }  <-- Removed to support FormData
})

// Request interceptor
api.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
