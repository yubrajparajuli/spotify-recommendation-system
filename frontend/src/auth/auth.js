export function getUser() {
  return JSON.parse(localStorage.getItem('user'))
}

export function isLoggedIn() {
  return !!localStorage.getItem('token')
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('auth-change'))
}

// 
export function notifyAuthChange() {
  window.dispatchEvent(new Event('auth-change'))
}