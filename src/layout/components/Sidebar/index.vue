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
  background-color: #1e293b;
  color: #cbd5e1;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transition: width 0.3s ease;
  border-right: 1px solid #334155;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #334155;
  background-color: #1e293b;
  height: 64px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  white-space: nowrap;
  gap: 10px;
}

.header-icon {
  font-size: 24px;
  color: #94a3b8;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 500;
  color: #f1f5f9;
  margin: 0;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  background-color: transparent;
  border-right: none;
  height: calc(100vh - 64px);
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: #1e293b;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
