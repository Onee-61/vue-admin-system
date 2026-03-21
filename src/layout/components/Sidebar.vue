<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/modules/layout'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()

// 菜单项
const menuItems = [
  { index: '1', icon: 'HomeFilled', title: '首页', path: '/index' },
  { index: '2', icon: 'User', title: '用户管理', path: '/system/user' },
  { index: '3', icon: 'UserFilled', title: '角色管理', path: '/system/role' },
]

// 根据当前路由计算激活的菜单项
const activeMenu = computed(() => {
  const item = menuItems.find(item => route.path === item.path)
  return item ? item.index : '0'
})

// 菜单点击处理
const handleMenuSelect = (index) => {
  const item = menuItems.find(item => item.index === index)
  if (item) {
    router.push(item.path)
  }
}
</script>

<template>
  <el-aside :width="layoutStore.isCollapse ? '64px' : '200px'" class="sidebar">
    <div class="sidebar-header">
      <el-icon class="header-icon"><Management /></el-icon>
      <h3 v-show="!layoutStore.isCollapse" class="sidebar-title">后台管理系统</h3>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="layoutStore.isCollapse"
      :collapse-transition="false"
      background-color="#2c3e50"
      text-color="#fff"
      active-text-color="#409EFF"
      @select="handleMenuSelect"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.index"
        :index="item.index"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span class="menu-text">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.sidebar {
  background-color: #2c3e50;
  transition: width 0.3s ease;
}

.sidebar-header {
  display: flex;
  height: 60px;
  padding: 0 20px;
  align-items: center;
  gap: 8px;
}

.sidebar-title {
  color: white;
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  width: 18px;
  height: 18px;
  margin: 0 3px;
}

.sidebar-menu {
  border-right: none;
}

.menu-text {
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
