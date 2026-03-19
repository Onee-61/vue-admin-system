<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/modules/layout'

const router = useRouter()
const layoutStore = useLayoutStore()

// 菜单项
const menuItems = [
  { index: '1', icon: 'HomeFilled', title: '首页', path: '/index' },
  { index: '2', icon: 'User', title: '用户管理', path: '/system/user' },
  { index: '3', icon: 'UserFilled', title: '角色管理', path: '/system/role' },
]

// 菜单点击处理
const handleMenuSelect = (index) => {
  const item = menuItems.find(item => item.index === index)
  if (item) {
    router.push(item.path)
  }
}
</script>

<template>
  <el-aside :width="layoutStore.isCollapse ? '64px' : '200px'" style="background-color: #2c3e50;">
    <div class="sidebar-header">
      <h3 v-if="!layoutStore.isCollapse" class="sidebar-title">后台管理系统</h3>
    </div>
    <el-menu
      :default-active="'1'"
      class="sidebar-menu"
      :collapse="layoutStore.isCollapse"
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
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.sidebar-header {
  padding: 20px 10px 10px;
  text-align: center;
}

.sidebar-title {
  color: white;
  font-size: 18px;
  font-weight: 400;
  margin: 0;
}

.sidebar-menu {
  border-right: none;
}
</style>
