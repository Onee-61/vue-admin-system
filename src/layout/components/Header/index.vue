<script setup>
import { ElIcon, ElButton } from 'element-plus'
import { Expand, Fold } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/modules/layout'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'

const layoutStore = useLayoutStore()
const userStore = useUserStore()
const user = userStore.userInfo
const router = useRouter()

const toggleSidebar = () => {
  layoutStore.toggleSidebar()
}

const handleCommand = (command) => {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    userStore.userLogout()
    router.push('/login')
    ElMessage.success('退出登录成功')
  }
}
</script>

<template>
  <el-header style="background-color: #fff; border-bottom: 1px solid #e6e6e6; display: flex; align-items: center; justify-content: space-between; padding: 0 20px;">
    <!-- 左侧：汉堡菜单和面包屑 -->
    <div style="display: flex; align-items: center;">
      <el-button
        @click="toggleSidebar"
        style="font-size: 20px; color: #666;"
      >
        <el-icon><Expand v-if="layoutStore.isCollapse" /><Fold v-else /></el-icon>
      </el-button>
      <el-breadcrumb separator="/" style="margin-left: 15px;">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>工作台</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧：用户信息 -->
    <el-dropdown @command="handleCommand">
      <div style="display: flex; align-items: center; cursor: pointer;">
        <el-avatar :src="user.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" size="small" style="margin-right: 10px;"></el-avatar>
        <div>
          <div style="font-weight: bold; color: #333;">{{ user.nickname }}</div>
          <div style="font-size: 12px; color: #666;">{{ user.roles?.[0] }}</div>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>

<style scoped>  

</style>