<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">抱歉，页面不存在</p>
      <p class="error-description">您访问的页面可能已被删除或暂时不可用</p>
      <div class="error-actions">
        <el-button type="primary" @click="goBack">返回上一页</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.error-content {
  text-align: center;
  padding: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #3498db;
  margin: 0 0 20px 0;
}

.error-message {
  font-size: 24px;
  color: #333;
  margin: 0 0 10px 0;
}

.error-description {
  font-size: 16px;
  color: #666;
  margin: 0 0 30px 0;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}
</style>
