import { useUserStore } from '@/stores/modules/user'

// 检查是否有任意一个权限
export const hasPermOr = (permission) => {
  const allPermission = '*:*:*'
  const userStore = useUserStore()
  const permissions = userStore.userInfo.permissions
  return permissions.includes(allPermission) || permissions.includes(...permission)
}

// 检查是否有所有权限
export const hasPermAnd = (permission) => {
  if (permission.includes('*:*:*')) return true
  return permission.every(item => hasPermOr(item))
}

// 检查是否有任意一个角色
export const hasRoleOr = (role) => {
  const super_admin = 'admin'
  const userStore = useUserStore()
  const roles = userStore.userInfo.roles
  return roles.includes(super_admin) || roles.includes(role)
}

// 检查是否有所有角色
export const hasRoleAnd = (role) => {
  if (role.includes('admin')) return true
  return role.every(item => hasRoleOr(item))
}