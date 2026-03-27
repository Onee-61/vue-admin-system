import { defineStore } from 'pinia'
import { ref, markRaw } from 'vue'
import { getRouters } from '@/api/route'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView/index.vue'
import { constantRoutes } from '@/router/index.js'

// 自动导入所有vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

export const useRouteStore = defineStore('route', () => {
  // 完整路由（静态路由+动态路由）
  const allRoutes = ref([])
  const dynamicRoutes = ref([])
  const sidebarRoutes = ref([])
  const topbarRoutes = ref([])

  const getRoutes = async () => {
    try {
      const res = await getRouters()
      const allData = JSON.parse(JSON.stringify(res.data))
      const sidebarData = JSON.parse(JSON.stringify(res.data))
      const topbarData = JSON.parse(JSON.stringify(res.data))
      
      allRoutes.value = constantRoutes.concat(filterRouter(allData))
      sidebarRoutes.value = constantRoutes.concat(filterRouter(sidebarData))
      topbarRoutes.value = filterRouter(topbarData)
    
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
    dynamicRoutes,
    sidebarRoutes,
    topbarRoutes,
    getRoutes,
    filterRouter,
    loadView
  }
})