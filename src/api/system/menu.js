import request from '@/utils/request'

// 获取菜单列表
export const listMenu = () => {
  return request({
    url: '/system/menu/list',
    method: 'get'
  })
}

// 获取菜单详情
export const getMenu = (menuId) => {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export const treeselect = () => {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export const roleMenuTreeselect = (roleId) => {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export const addMenu = (data) => {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export const updateMenu = (data) => {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export const delMenu = (menuId) => {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}