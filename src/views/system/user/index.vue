<script setup>
import { listUser } from '@/api/system/user'
import { ref, onMounted } from 'vue'

const userList = ref([])

const getUserList = async () => {
  try {
    const res = await listUser()
    userList.value = res.data
  } catch (error) {
    console.log(error)
    ElMessage.error(error.message)
  }
}

onMounted(() => {
  getUserList()
})
</script>

<template>
  <h1>用户管理</h1>
  <el-table :data="userList">
    
  </el-table>
</template>