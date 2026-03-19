import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const isCollapse = ref(false)

  const toggleSidebar = () => {
    isCollapse.value = !isCollapse.value
  }

  return {
    isCollapse,
    toggleSidebar
  }
})