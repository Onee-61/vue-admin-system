<script setup>
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
const user = userStore.userInfo
</script>

<template>
  <div>用户名：{{ user.username }}</div>
  <div>角色：{{ user.roles?.[0] }}</div>
  <div>权限：{{ user.permissions }}</div>
</template>

<style scoped>
  
</style>