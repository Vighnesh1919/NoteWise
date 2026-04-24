import api from './api'
import { tokenStorage } from '../utils/tokenStorage'

export const authService = {
  async register(email, password) {
    const { data } = await api.post('/auth/register', { email, password })
    return data.data
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })

    const { token, user } = data.data  // ✅ correct

    tokenStorage.setAccess(token)      // ✅ store JWT directly
    return user
  },

  logout() {
    tokenStorage.clearAccess()         // ✅ clear only access token
  },
}