// auth.js
// 获取token
export const getToken = () => {
  return localStorage.getItem('token')
}

// 设置token
export const setToken = (token) => {
  localStorage.setItem('token', token)
}

// 移除token
export const removeToken = () => {
  localStorage.removeItem('token')
}
