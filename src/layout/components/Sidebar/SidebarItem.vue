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
}

:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(64, 158, 255, 0.15) !important;
  border-left-color: #409EFF;
}

:deep(.el-menu-item .svg-icon) {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  font-size: 18px;
}

:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  transition: all 0.3s ease;
}

:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

:deep(.el-sub-menu__title .svg-icon) {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  font-size: 18px;
}

:deep(.el-menu--collapse .el-menu-item .svg-icon),
:deep(.el-menu--collapse .el-sub-menu__title .svg-icon) {
  width: 20px;
  height: 20px;
  font-size: 20px;
  margin-right: 0;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: #1a252f !important;
  min-width: 180px;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: rgba(64, 158, 255, 0.15) !important;
  border-left-color: #409EFF;
}

:deep(.el-sub-menu__icon-arrow) {
  font-size: 14px;
  color: #bfcbd9;
}
</style>
