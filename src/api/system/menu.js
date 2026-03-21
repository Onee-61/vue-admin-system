import request from '@/utils/request'

// 获取菜单列表
export const getMenuList = () => {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}