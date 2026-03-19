<script setup>
import { reactive } from 'vue'
import { useRouter } from '@/router'

import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()
const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const handleLogin = () => {
  userStore.userLogin(loginForm)
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
  <el-input v-model="loginForm.password" placeholder="密码" type="password"></el-input>
  <el-button @click="handleLogin()">登录</el-button>
  <el-button @click="goToRegister()">前往注册</el-button>
</template>

<style scoped>

</style>