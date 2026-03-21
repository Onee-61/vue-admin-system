import request from "@/utils/request"

// 用户登录
export const login = ({ username, password }) => {
  return request({
    url: '/login',
    method: 'post',
    headers: {
      requireToken: false
    },
    data: {
      username,
      password,
    }
  })
}

// 用户注册
export const register = ({ username, password }) => {
  return request({
    url: '/register',
    method: 'post',
    headers: {
      requireToken: false
    },
    data: {
      username,
      password,
    }
  })
}

export const getInfo = () => {
  return request({
    url: '/getInfo',
    method: 'get',
  })
}