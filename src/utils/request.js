import axios from 'axios'
import { getToken, removeToken } from '@/utils/auth'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 1. 是否携带token（默认需要携带token）
  const requireToken = config.headers?.requireToken !== false
  if (requireToken) {
    // 2. 获取token
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
  }

  return config
}, error => {
  // ELMessage.error(error.message || '请求错误')
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(res => {
  const code = res.data.code || 200
  const msg = res.data.msg || ''

  if (code === 401) {
    // 401: 未登录
    // 清除token或者无感登录
    // 1. 清除token
    removeToken()

    // 2. 无感登录（可选，需后端支持）


    ElMessage.error(msg || '请登录后重试')
    return Promise.reject(new Error(msg))
  } else if (code === 403) {
    // 403: 没有权限
    ElMessage.error(msg || '没有权限')
    return Promise.reject(new Error(msg)) 
  } else if (code === 404) {
    // 404: 请求不存在
    ElMessage.error(msg || '请求不存在')
    return Promise.reject(new Error(msg))
  }else if (code === 500) {
    // 500: 服务器错误
    ElMessage.error(msg || '服务器错误')
    return Promise.reject(new Error(msg))  
  }else if (code !== 200) {
    // 其他错误
    ElMessage.error(msg || '请求错误')
    return Promise.reject(new Error(msg))
  }else {
    return res.data
  }



}, error => {
  // ELMessage.error(error.message || '请求错误')
  return Promise.reject(error)
})

export default request