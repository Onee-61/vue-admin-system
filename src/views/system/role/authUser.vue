<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { allocatedUserList, unallocatedUserList, authUserCancel, authUserCancelAll } from "@/api/system/role"
import { parseTime } from "@/utils/common"
import selectUser from "@/views/system/role/selectUser.vue"

const route = useRoute()
const router = useRouter()
const userList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const multiple = ref(true)
const total = ref(0)
const userIds = ref([])
const selectRef = ref(null)

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  roleId: route.params.roleId,
  userName: undefined,
  phonenumber: undefined,
})

// 查询授权用户列表
const getUserList = async () => {
  loading.value = true
  try {
    const res = await allocatedUserList(queryParams.value)
    userList.value = res.rows
    total.value = res.total
    loading.value = false
  } catch (error) {
    console.log(error)
    loading.value = false
  }
}

// 返回按钮
const handleClose = () => {
  router.push({ path: "/system/role" })
}

// 重置按钮操作
const reset = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    roleId: route.params.roleId,
    userName: undefined,
    phonenumber: undefined,
  }
  getUserList()
}

// 多选框选中数据
const handleSelectionChange = (selection) => {
  userIds.value = selection.map(item => item.userId)
  multiple.value = !selection.length
}

// 打开授权用户表弹窗
const openSelectUser = () => {
  selectRef.value.show()
}

// 取消授权按钮操作
const cancelAuthUser = async (row) => {
  try {
    await authUserCancel({ userId: row.userId, roleId: queryParams.value.roleId })
    ElMessage.success("取消授权成功")
  } catch (error) {
    console.log(error)
    ElMessage.error(error.message || "取消授权失败")
  }
}

// 批量取消授权按钮操作
const cancelAuthUserAll = async () => {
  const roleId = queryParams.value.roleId
  const uIds = userIds.value.join(",")
  try {
    await authUserCancelAll({ roleId: roleId, userIds: uIds })
    ElMessage.success("取消授权成功")
  } catch (error) {
    console.log(error)
    ElMessage.error(error.message || "取消授权失败")
  }
}

// 每页显示数量变化
const handleSizeChange = (val) => {
  queryParams.value.pageSize = val
  queryParams.value.pageNum = 1
  getUserList()
}

// 当前页码变化
const handleCurrentChange = (val) => {
  queryParams.value.pageNum = val
  getUserList()
}

onMounted(() => {
  getUserList()
})
</script>

<template>
  <div class="app-container">
    <el-form :model="queryParams.value" ref="queryRef" v-show="showSearch" :inline="true">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px"
          @keyup.enter="getUserList"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          style="width: 240px"
          @keyup.enter="getUserList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getUserList">搜索</el-button>
        <el-button icon="Refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" style="margin-bottom: 10px;">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="openSelectUser"
          v-hasPerm="['system:role:add']"
        >添加用户</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="CircleClose"
          :disabled="multiple"
          @click="cancelAuthUserAll"
          v-hasPerm="['system:role:remove']"
        >批量取消授权</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button 
          type="warning" 
          plain 
          icon="Close"
          @click="handleClose"
        >关闭</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
      <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
      <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag :type="scope.row.status === '0' ? 'primary' : 'danger'">
            {{ scope.row.status === '0' ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="CircleClose" @click="cancelAuthUser(scope.row)" v-hasPerm="['system:role:remove']">取消授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :page-sizes="[10, 20, 30, 50]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; display: flex; justify-content: flex-end;"
    />

    <select-user ref="selectRef" :roleId="queryParams.roleId" @ok="getUserList" />
  </div>
</template>