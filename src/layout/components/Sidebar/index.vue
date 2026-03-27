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
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

</script>

<template>
  <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
    <div class="sidebar-header">
      <el-icon class="header-icon"><Management /></el-icon>
      <h3 v-show="!isCollapse" class="sidebar-title">后台管理系统</h3>
    </div>
    <el-menu
      :default-active="activeMenu"
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
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  margin-bottom: 0 !important;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  position: relative;
  overflow: hidden;
}

:deep(.el-menu-item:before),
:deep(.el-sub-menu__title:before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.2) 0%, transparent 100%);
  transition: width 0.3s ease;
}

:deep(.el-menu-item:hover:before),
:deep(.el-sub-menu__title:hover:before),
:deep(.el-menu-item.is-active:before) {
  width: 100%;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
  color: #409EFF !important;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.2) 0%, rgba(64, 158, 255, 0.05) 100%) !important;
  border-left-color: #409EFF;
  color: #409EFF !important;
}

:deep(.el-menu-item .svg-icon),
:deep(.el-sub-menu__title .svg-icon) {
  width: 16px;
  height: 16px;
  font-size: 16px;
  vertical-align: middle;
  transition: all 0.3s ease;
  fill: currentColor;
}

:deep(.el-menu-item .svg-icon),
:deep(.el-sub-menu__title .svg-icon) {
  margin-right: 10px;
}

:deep(.el-menu--collapse .el-menu-item .svg-icon),
:deep(.el-menu--collapse .el-sub-menu__title .svg-icon) {
  margin-right: 0;
}

:deep(.el-menu-item span),
:deep(.el-sub-menu__title span) {
  vertical-align: middle;
  font-size: 14px;
  transition: all 0.3s ease;
}

:deep(.el-menu-item.is-active .svg-icon),
:deep(.el-menu-item:hover .svg-icon),
:deep(.el-sub-menu__title:hover .svg-icon) {
  fill: #409EFF;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: transparent !important;
  min-width: 180px;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.el-sub-menu__icon-arrow) {
  font-size: 12px;
  color: #bfcbd9;
  transition: all 0.3s ease;
  vertical-align: middle;
}

:deep(.el-sub-menu__title:hover .el-sub-menu__icon-arrow) {
  color: #409EFF;
  transform: rotate(360deg);
}

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
