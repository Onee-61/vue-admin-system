// v-hasPerm 指令实现
// 用于判断用户是否有某个权限

import { useUserStore } from '@/store/modules/user'

export default {
  mounted(el, binding, vnode) {
    const { value } = binding
    const allPermission = "*:*:*"
    const permissions = useUserStore().permissions

    if (value && value instanceof Array && value.length > 0) {
      // 检查是否有所有权限或者任意一个权限
      const hasPerm = value.includes(allPermission) || permissions.includes(...value)
      
      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('请设置操作权限标签值')
    }
  }
 }
