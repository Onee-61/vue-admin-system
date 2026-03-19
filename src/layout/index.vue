<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <el-container style="height: 100vh">
    <Sidebar />
    <el-container class="main-container">
      <Header />
      <el-main style="background-color: #f5f5f5; padding: 20px;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
}
</style>