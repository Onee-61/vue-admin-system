<script setup>
import { reactive } from 'vue'
import { useRouter } from '@/router'

import { register } from '@/api/login'

const router = useRouter()
const registerForm = reactive({
  username: '',
  password: ''
})

const handleRegister = async () => {
  try {
    const res = await register(registerForm)
    console.log("注册成功:", res)
    ElMessage.success('注册成功')
  } catch (error) {
    console.error("注册失败:", error)
    ElMessage.error(error.message || '注册失败')
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
  <el-input v-model="registerForm.password" placeholder="密码" type="password"></el-input>
  <el-button @click="handleRegister()">注册</el-button>
  <el-button @click="goToLogin()">前往登录</el-button>
</template>

<style scoped>

</style>