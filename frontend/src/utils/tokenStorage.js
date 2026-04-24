// Tokens stored in localStorage for persistence across page refresh

export const tokenStorage = {
  getAccess: () => localStorage.getItem('nw_access'),

  setAccess: (token) => {
    localStorage.setItem('nw_access', token)
  },

  clearAccess: () => {
    localStorage.removeItem('nw_access')
  },
}