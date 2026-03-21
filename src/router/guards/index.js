import router from './index'

import { useUserStore } from '@/stores/modules/user'

const whiteList = ['/login', '/register']

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const hasToken = userStore.userInfo.token
  const isWhiteList = whiteList.includes(to.path)

  if (hasToken && isWhiteList) {
    return next({ path: '/' })
  }

  if (!hasToken && isWhiteList) {
    return next()
  }

  if (!hasToken && !isWhiteList) {
    return next({ path: '/login' })
  }

  if (userStore.userInfo.roles.length === 0) {
    try {
      await userStore.setUserInfo()
      return next()
    } catch {
      userStore.userLogout()
      return next({ path: '/login' })
    }
  }

  next()
})
