<script setup>
import { computed, ref } from 'vue'

import { useRouter, useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/modules/layout'
import { useRouteStore } from '@/stores/modules/route'
import SidebarItem from './SidebarItem.vue'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()
const routeStore = useRouteStore()

const isCollapse = computed(() => layoutStore.isCollapse)
const sidebarRoutes = computed(() => routeStore.sidebarRoutes)

</script>

<template>
  <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
    <div class="sidebar-header">
      <el-icon class="header-icon"><Management /></el-icon>
      <h3 v-show="!isCollapse" class="sidebar-title">后台管理系统</h3>
    </div>
    <el-menu
      :default-active="route.path"
      class="sidebar-menu"
      :collapse="isCollapse"
      :collapse-transition="false"
      background-color="#2c3e50"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      router
    >
      <SidebarItem
        v-for="route in sidebarRoutes"
        :key="route.path"
        :item="route"
        :basePath="'/'"
      />
    </el-menu>
  </el-aside>
</template>

<style scoped>
.sidebar {
  background-color: #2c3e50;
  transition: width 0.3s ease;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  height: 60px;
  padding: 0 20px;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  color: white;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.5px;
}

.header-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #409EFF;
  font-size: 24px;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background-color: transparent;
}

.menu-text {
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
