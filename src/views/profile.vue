<script setup>
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
const user = userStore.userInfo
</script>

<template>
  <div>
    <h3>用户信息</h3>
  </div>
  <div>
    <div>登陆状态：{{ user.token ? '已登录' : '未登录' }}</div>
  </div>
  <div>
    <img :src="user.avatar" alt="用户头像" />
  </div>
  <div>
    <div>用户ID：{{ user.id }}</div>
  </div>
  <div>
    <div>昵称：{{ user.nickname }}</div>
  </div>
  <div>
    <div>用户名：{{ user.username }}</div>
  </div>
  <div>
    <div>角色：{{ user.roles }}</div>
  </div>
  <div>
    <div>权限：{{ user.permissions }}</div>
  </div>
</template>

<style scoped>
  
</style>