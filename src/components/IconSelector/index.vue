<script setup>
import { ref, computed, onMounted, watch } from 'vue'

defineOptions({
  name: 'IconSelector'
})

const props = defineProps({
  activeIcon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['selected'])

const iconList = ref([])
const searchKeyword = ref('')
const selectedIcon = ref('')

const filteredIconList = computed(() => {
  if (!searchKeyword.value) {
    return iconList.value
  }
  return iconList.value.filter(icon => 
    icon.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const iconCategories = computed(() => {
  const categories = {}
  filteredIconList.value.forEach(icon => {
    const firstChar = icon.charAt(0).toUpperCase()
    if (!categories[firstChar]) {
      categories[firstChar] = []
    }
    categories[firstChar].push(icon)
  })
  return categories
})

const loadIcons = async () => {
  try {
    const iconsModules = import.meta.glob('@/assets/icons/svg/*.svg')
    iconList.value = Object.keys(iconsModules).map(path => {
      return path.replace(/^.*\/(.*)\.svg$/, '$1')
    }).sort()
  } catch (error) {
    console.error('加载图标失败:', error)
  }
}

const handleIconClick = (icon) => {
  selectedIcon.value = icon
  emit('selected', icon)
}

const handleClear = () => {
  selectedIcon.value = ''
  emit('selected', '')
}

onMounted(() => {
  loadIcons()
})

watch(() => props.activeIcon, (newVal) => {
  selectedIcon.value = newVal
})
</script>

<template>
  <div class="icon-selector">
    <div class="icon-selector-search">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索图标..."
        clearable
        prefix-icon="Search"
        size="small"
      >
        <template #append>
          <el-button @click="handleClear" :disabled="!selectedIcon" size="small">清除</el-button>
        </template>
      </el-input>
    </div>
    
    <div class="icon-selector-content">
      <div v-if="filteredIconList.length === 0" class="icon-empty">
        <el-empty description="未找到匹配的图标" :image-size="60" />
      </div>
      
      <div v-else class="icon-list">
        <div
          v-for="(icons, category) in iconCategories"
          :key="category"
          class="icon-category"
        >
          <div class="category-title">{{ category }}</div>
          <div class="category-icons">
            <div
              v-for="icon in icons"
              :key="icon"
              class="icon-item"
              :class="{ active: selectedIcon === icon }"
              @click="handleIconClick(icon)"
            >
              <div class="icon-wrapper">
                <SvgIcon :icon-class="icon" />
              </div>
              <div class="icon-name">{{ icon }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.icon-selector-search {
  margin-bottom: 4px;
}

.icon-selector-content {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px;
}

.icon-empty {
  padding: 20px 0;
}

.icon-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.icon-category {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 6px;
  border-bottom: 1px solid #ebeef5;
}

.category-icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fff;
}

.icon-item:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.15);
}

.icon-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.icon-wrapper {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.icon-wrapper :deep(.svg-icon) {
  width: 20px;
  height: 20px;
}

.icon-name {
  font-size: 11px;
  color: #606266;
  text-align: center;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.1;
  max-height: 2.2em;
}
</style>
