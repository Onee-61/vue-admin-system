// v-hasRole 指令实现
// 用于判断用户是否有某个角色

import { useUserStore } from '@/store/modules/user'

export default {
  mounted(el, binding, vnode) {
    const { value } = binding
    const super_admin = 'admin'
    const roles = useUserStore().roles

    if (value && value instanceof Array && value.length > 0) {
      // 检查是否有所有角色或者任意一个角色
      const hasRole = value.includes(super_admin) || value.includes(...roles)
      
      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('请设置操作角色标签值')
    }
  }
}