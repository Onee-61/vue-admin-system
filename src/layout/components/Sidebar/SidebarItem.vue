<script setup>
import { computed } from 'vue'

import { isHttp } from '@/utils/validate'

const props = defineProps({
  item: {
    type: Object,
    required: true
 },
  basePath: {
    type: String,
    default: ''
  }
})

const isHidden = computed(() => props.item.hidden)
const hasChildren = computed(() => props.item.children && props.item.children.length > 0)
const hasOneShowingChild = computed(() => {
  return props.item.children?.filter(child => !child.hidden).length === 1
})

const resolvePath = (path) => {
  if (isHttp(path)) {
    return path
  }

  if (isHttp(props.basePath)) {
    return props.basePath
  }

  if (path.startsWith('/')) {
    return path
  }
  
  return props.basePath + '/' + path
}
</script>

<template>
  <template v-if="!isHidden">
    <!-- 外部链接（path 以 http:// 或 https:// 开头） -->

    <!-- 只有一个可见子菜单时或无子菜单（叶子节点），提升子菜单为当前级 -->
    <template v-if="(hasOneShowingChild && !props.item.alwaysShow) || !hasChildren">
      <el-menu-item :index="resolvePath(props.item.path)">
        <template #title v-if="props.item.meta">
          <SvgIcon :icon-class="props.item.meta.icon" />
          <span>{{ props.item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    
    <!-- 有多个子菜单或需要显示父级 -->
    <el-sub-menu v-else :index="resolvePath(props.item.path)">
      <template #title v-if="props.item.meta">
        <SvgIcon :icon-class="props.item.meta.icon" />
        <span>{{ props.item.meta.title }}</span>
      </template>

      <!-- 递归子菜单 -->
      <SidebarItem
        v-for="child in props.item.children"
        :key="child.path"
        :item="child"
        :basePath="resolvePath(props.item.path)"
      />
    </el-sub-menu>
  </template>
</template>

<style scoped>
:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  position: relative;
  overflow: hidden;
  gap: 10px;
}

:deep(.el-menu-item:before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.2) 0%, transparent 100%);
  transition: width 0.3s ease;
}

:deep(.el-menu-item:hover:before) {
  width: 100%;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
  color: #409EFF !important;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.2) 0%, rgba(64, 158, 255, 0.05) 100%) !important;
  border-left-color: #409EFF;
  color: #409EFF !important;
}

:deep(.el-menu-item.is-active:before) {
  width: 100%;
}

:deep(.el-menu-item .svg-icon) {
  width: 16px;
  height: 16px;
  font-size: 16px;
  vertical-align: middle;
  transition: all 0.3s ease;
  fill: currentColor;
}

:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  position: relative;
  overflow: hidden;
  /* padding: 0 19px; */
}

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

:deep(.el-sub-menu__title:hover:before) {
  width: 100%;
}

:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
  color: #409EFF !important;
}

:deep(.el-sub-menu__title .svg-icon) {
  width: 16px;
  height: 16px;
  font-size: 16px;
  vertical-align: middle;
  transition: all 0.3s ease;
  fill: currentColor;
  margin-right: 10px;
}

:deep(.el-menu--collapse .el-menu-item .svg-icon),
:deep(.el-menu--collapse .el-sub-menu__title .svg-icon) {
  width: 16px;
  height: 16px;
  font-size: 16px;
  margin-right: 0;
  vertical-align: middle;
}

:deep(.el-menu-item span),
:deep(.el-sub-menu__title span) {
  vertical-align: middle;
  font-size: 14px;
  transition: all 0.3s ease;
}

:deep(.el-menu-item.is-active .svg-icon),
:deep(.el-menu-item:hover .svg-icon) {
  fill: #409EFF;
}

:deep(.el-sub-menu__title:hover .svg-icon) {
  fill: #409EFF;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: transparent !important;
  min-width: 180px;
  padding-left: 40px !important;
  border-left: 3px solid transparent;
  position: relative;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #409EFF !important;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.2) 0%, rgba(64, 158, 255, 0.05) 100%) !important;
  border-left-color: #409EFF;
  color: #409EFF !important;
}

:deep(.el-sub-menu .el-menu) {
  background: linear-gradient(90deg, #1a252f 0%, #1e2e3d 100%) !important;
  border-left: 1px solid rgba(64, 158, 255, 0.1);
  box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.2);
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
</style>