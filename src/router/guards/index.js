import router from '../index'
import { isHttp } from '@/utils/validate'
import { useUserStore } from '@/stores/modules/user'
import { useRouteStore } from '@/stores/modules/route'

// 白名单页面
const whiteList = ['/login', '/register']

// 路由守卫
// vue-router 4.x写法
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const routeStore = useRouteStore()
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

  const userInfo = userStore.userInfo.roles.length > 0
  const routeInfo = routeStore.allRoutes.length > 0
  
  // 已登录的用户访问非白名单页面，确保用户信息和路由信息已加载
  if (!userInfo || !routeInfo) {
    try {
      // 如果用户信息不存在，获取用户信息
      if (!userInfo) {
        await userStore.getUserInfo()
      }
      
      // 如果路由信息不存在，获取路由信息
      if (!routeInfo) {
        await routeStore.getRoutes()
      }

      // 动态添加路由
      routeStore.allRoutes.forEach(route => {
        if (!isHttp(route.path)) {
          router.addRoute(route)
        }
      })

      return { ...to, replace: true }
    } catch (error) {
      userStore.userLogout()
      console.error('路由守卫报错：', error.message);
      
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
//           await userStore.getUserInfo()
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
