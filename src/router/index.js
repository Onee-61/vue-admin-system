import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layout/index.vue'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/register',
    component: () => import('@/views/register.vue'),
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/index',
        component: () => import('@/views/index.vue')
      },
      {
        path: '/profile',
        component: () => import('@/views/profile.vue')
      },
      {
        path: '/system',
        children: [
          {
            path: 'user',
            component: () => import('@/views/system/user/index.vue')
          },
          {
            path: 'role',
            component: () => import('@/views/system/role/index.vue')
          }
        ]
      }
    ]
  }
]

export const dynamicRoutes = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

export default router
