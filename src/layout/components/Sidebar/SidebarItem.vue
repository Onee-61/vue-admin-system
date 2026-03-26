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
        <el-icon><component :is="props.item.meta.icon" /></el-icon>
        <span>{{ props.item.meta.title }}</span>
      </el-menu-item>
    </template>
    
    <!-- 有多个子菜单或需要显示父级 -->
    <el-sub-menu v-else :index="resolvePath(props.item.path)">
      <template #title v-if="props.item.meta">
        <el-icon><component :is="props.item.meta.icon" /></el-icon>
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

</style>
