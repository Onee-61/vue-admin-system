// v-hasPerm 指令实现
// 用于判断用户是否有某个权限

import { useUserStore } from '@/stores/modules/user'

export default {
  mounted(el, binding, vnode) {
    const { value } = binding
    const allPermission = "*:*:*"
    const permissions = useUserStore().userInfo.permissions

    if (value && value instanceof Array && value.length > 0) {
      // 检查用户是否有所有权限或指定权限
      const hasPerm = permissions.includes(allPermission) || permissions.includes(...value)

      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('请设置操作权限标签值')
    }
  }
 }
