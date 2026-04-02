import { defineStore } from 'pinia'
import { ref, markRaw } from 'vue'
import { getRouters } from '@/api/route'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView/index.vue'
import { constantRoutes, dynamicRoutes } from '@/router/index.js'
import { hasPermOr, hasRoleOr } from '@/utils/permission.js'

// 自动导入所有vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

export const useRouteStore = defineStore('route', () => {
  // 完整路由（静态路由+动态路由）
  const allRoutes = ref([])
  const addRoutes = ref([])

  const getRoutes = async () => {
    try {
      const res = await getRouters()
      const allData = JSON.parse(JSON.stringify(res.data))
      const addData = JSON.parse(JSON.stringify(res.data))
      
      allRoutes.value = constantRoutes.concat(filterRouter(allData))
      addRoutes.value = constantRoutes.concat(filterRouter(addData))

      allRoutes.value = allRoutes.value.concat(filterDynamicRoutes())
    
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  const filterRouter = (routeMap) => {
    return routeMap.map(item => {
      if (item.component) {
        if (item.component === 'Layout') {
          item.component = markRaw(Layout)
        } else if (item.component === 'ParentView') {
          item.component = markRaw(ParentView)
        } else {
          item.component = loadView(item.component)
        }
      }

      if (item.children && item.children.length > 0) {
        item.children = filterRouter(item.children)
      } else {
        delete item['children']
        delete item['redirect']
      }
      
      return item
    })
  }

  const filterDynamicRoutes = () => {
    const res = []
    dynamicRoutes.forEach(route => {
      if (route.permissions) {
        if (hasPermOr(route.permissions)) {
          res.push(route)
        }
      } else if (route.roles) {
        if (hasRoleOr(route.roles)) {
          res.push(route)
        }
      }
    })
    return res
  }

  const removeRoutes = () => {
    allRoutes.value = []
    addRoutes.value = []
  }

  // modules的内容如下：
  // {
  // ../../views/index.vue: () => import("/src/views/index.vue")
  // ../../views/login.vue: () => import("/src/views/login.vue")
  // ../../views/profile.vue: () => import("/src/views/profile.vue")
  // ../../views/register.vue: () => import("/src/views/register.vue")
  // }

  // const dir = path.split('views/')[1].split('.vue')[0]这一句的作用是：
  // 将‘../../views/login.vue’变为‘/login’，即删去‘views/’及以前和最后的’.vue‘

  const loadView = (view) => {
    for (const path in modules) {
      const dir = path.split('views/')[1].split('.vue')[0]
      if (dir === view){
        return () => modules[path]()
      }
    }
  }

  return {
    allRoutes,
    addRoutes,
    getRoutes,
    filterRouter,
    removeRoutes,
    loadView
  }
})