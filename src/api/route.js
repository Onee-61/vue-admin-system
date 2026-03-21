import request from '@/utils/request'

// 获取路由列表
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}