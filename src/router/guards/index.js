import router from '../index'

import { useUserStore } from '@/stores/modules/user'

const whiteList = ['/login', '/register']

// 路由守卫
// vue-router 4.x写法
router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const hasToken = userStore.userInfo.token
  const isWhiteList = whiteList.includes(to.path)

  // 已登录的用户访问白名单页面，重定向到首页
  if (hasToken && isWhiteList) {
    return { path: '/' }
  }

  // 未登录的用户访问白名单页面，直接放行
  if (!hasToken && isWhiteList) {
    return true
  }

  // 未登录的用户访问非白名单页面，重定向到登录页
  if (!hasToken && !isWhiteList) {
    return { path: '/login' }
  }

  // 已登录的用户访问非白名单页面，尝试获取用户信息
  if (userStore.userInfo.roles.length === 0) {
    try {
      await userStore.setUserInfo()
      return true
    } catch {
      userStore.userLogout()
      ElMessage.error('用户信息过期，请重新登录')
      return { path: '/login' }
    }
  }

  // 其他情况，直接放行
  return true
})

// vue-router 3.x写法
// router.beforeEach(async (to, from, next) => {
//   const userStore = useUserStore()
//   const hasToken = userStore.userInfo.token
//   const isWhiteList = whiteList.includes(to.path)

  
//   if (isWhiteList) {
//     if (hasToken) {
//       // 已登录的用户访问白名单页面，重定向到首页
//       next({ path: '/' })
//     } else {
//       // 未登录的用户访问白名单页面，直接放行
//       next()
//     }
//   } else {
//     if (hasToken) {
//       // 已登录的用户访问非白名单页面，直接放行
//       // 重新获取用户信息
//       if (userStore.userInfo.roles.length === 0) {
//         try {
//           await userStore.setUserInfo()
//           next()
//         } catch {
//           userStore.userLogout()
//           next({ path: '/login' })
//           ElMessage.error('用户信息过期，请重新登录')
//         }
//       }
//       next()
//     } else {
//       // 未登录的用户访问非白名单页面，重定向到登录页
//       next({ path: '/login' })
//     }
//   }
// })
