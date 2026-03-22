import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRouters } from '@/api/route'
import Layout from '@/layout/index.vue'
import ParentView from '@/views/ParentView.vue'

// 自动导入所有vue文件
const modules = import.meta.glob('./../../views/**/*.vue')
console.log(modules);

export const useRouteStore = defineStore('route', () => {
  const routes = ref([])

  const getRoutes = async () => {
    const res = await getRouters()
    routes.value = res.data
  }

  const filterRouter = (routeMap) => {
    return routeMap.map(item => {
      if (item.component === 'Layout') {
        item.component = Layout
      } else if (item.component === 'ParentView') {
        item.component = ParentView
      } else {
        item.component = loadView(item.component)
      }

      if (item.children && item.children.length > 0) {
        item.children = filterRouter(item.children)
      } else {
        delete item['children']
        delete item['redirect']
      }
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
    routes,
    getRoutes,
    filterRouter,
    loadView
  }
})