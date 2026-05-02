import api from './api'

export const noteService = {
  async getAll() {
    const { data } = await api.get('/notes')
    return data.data ?? []
  },

  async getOne(id) {
    const { data } = await api.get(`/notes/${id}`)
    return data.data
  },

  async create(title = 'Untitled', content = []) {
    const { data } = await api.post('/notes', { title, content })
    return data.data
  },

  async update(id, title, content) {
    const { data } = await api.put(`/notes/${id}`, { title, content })
    return data.data
  },

  async remove(id) {
    await api.delete(`/notes/${id}`)
  },

  async toggleFavorite(id) {
    const { data } = await api.patch(`/notes/${id}/favorite`)
    return data.data
  },

  async restore(id) {
    await api.patch(`/notes/${id}/restore`)
  },

  async hardDelete(id) {
  await api.delete(`/notes/${id}/hard`)
},
}