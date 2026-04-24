import axios from 'axios'
import { tokenStorage } from '../utils/tokenStorage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// ✅ Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ✅ Handle unauthorized (simple version)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid or expired → logout user
      tokenStorage.clearAccess()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api