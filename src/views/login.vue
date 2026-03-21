<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()
const loginForm = reactive({
  username: 'admin',
  password: 'admin123'
})

const handleLogin = async () => {
  try {
    await userStore.userLogin(loginForm)
    ElMessage.success('登录成功')
    router.push('/index')
  } catch (error) {
    console.log(error)
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <el-form class="login-form">
      <h3 class="login-title">后台管理系统</h3>
      <el-form-item label="用户名">
        <el-input
          v-model="loginForm.username"
          placeholder="用户名"
        >
          <el-icon><User /></el-icon>
        </el-input>
      </el-form-item>

      <el-form-item label="密码">
        <el-input
        v-model="loginForm.password"
        placeholder="密码"
        type="password"
        @keyup.enter="handleLogin"
      >
      </el-input>
      </el-form-item>
      <el-button @click="handleLogin">登录</el-button>
      <el-button @click="goToRegister">前往注册</el-button>
    </el-form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-form {
  width: 300px;
  border: 1px solid #e6e6e6;
  padding: 20px;
  border-radius: 6px;
  background-color: #fff;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>