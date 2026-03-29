<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listRole, changeRoleStatus } from '@/api/system/role'

import { parseTime } from '@/utils/common'
import EditDialog from './editDialog.vue'

const router = useRouter()
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const roleList = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  roleName: undefined,
  roleKey: undefined,
  status: undefined
})
const dialogForm = ref({
  visible: false,
  dialogMode: 'edit', // 编辑edit、新增add、删除delete、数据权限分配dataScope
  roleId: null,
  roleName: null,
})

// 获取角色列表
const getRoleList = async () => {
  try {
    queryParams.value.pageNum = currentPage.value
    queryParams.value.pageSize = pageSize.value
    const res = await listRole(queryParams.value)
    roleList.value = res.rows
    total.value = res.total
  } catch (error) {
    console.log(error)
  }
}

// 角色状态切换
const handleStatusChange = async (row) => {
  try {
    const res = await changeRoleStatus(row.roleId, row.status)
    ElMessage.success(res.msg ||'修改成功')
  } catch (error) {
    row.status = row.status === '0' ? '1' : '0'
    console.log(error)
  }
}

// 新增角色
const handleAdd = () => {
  dialogForm.value.visible = true
  dialogForm.value.dialogMode = 'add'
}

// 编辑角色
const handleUpdate = async (row) => {
  dialogForm.value.visible = true
  dialogForm.value.dialogMode = 'edit'
  dialogForm.value.roleId = row.roleId ||ids.value
  dialogForm.value.roleName = row.roleName
}

// 删除角色
const handleDelete = (row) => {
  dialogForm.value.visible = true
  dialogForm.value.dialogMode = 'delete'
  dialogForm.value.roleId = row.roleId || ids.value
  console.log('删除角色ID:',dialogForm.value.roleId)
}

// 数据权限分配
const handleDataScope = (row) => {
  dialogForm.value.visible = true
  dialogForm.value.dialogMode = 'dataScope'
  dialogForm.value.roleId = row.roleId
  dialogForm.value.roleName = row.roleName
}

// 将角色分配给用户
const handleAuthUser = (row) => {
  router.push({
    path: '/system/role-auth/user/' + row.roleId
  })
}

// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map(item => item.roleId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

// 每页显示数量变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  getRoleList()
}

// 当前页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  getRoleList()
}

// 搜索角色
const handleQuery = () => {
  currentPage.value = 1
  getRoleList()
}

// 重置查询
const resetQuery = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: pageSize.value,
    roleName: undefined,
    roleKey: undefined,
    status: undefined
  }
  currentPage.value = 1
  getRoleList()
}

onMounted(() => {
  getRoleList()
})
</script>

<template>
  <h1>角色管理</h1>
  
  <el-form :model="queryParams" :inline="true" style="margin-bottom: 10px;">
    <el-form-item label="角色名称">
      <el-input
        v-model="queryParams.roleName"
        placeholder="请输入角色名称"
        clearable
        style="width: 200px;"
        @keyup.enter="handleQuery"
      />
    </el-form-item>
    <el-form-item label="权限字符">
      <el-input
        v-model="queryParams.roleKey"
        placeholder="请输入权限字符"
        clearable
        style="width: 200px;"
        @keyup.enter="handleQuery"
      />
    </el-form-item>
    <el-form-item label="状态">
      <el-select
        v-model="queryParams.status"
        placeholder="角色状态"
        clearable
        style="width: 200px;"
      >
        <el-option label="正常" value="0" />
        <el-option label="停用" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
      <el-button icon="Refresh" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>

  <el-row :gutter="10" style="margin-bottom: 10px;">
    <el-col :span="1.5">
      <el-button
        type="primary"
        plain
        icon="Plus"
        @click="handleAdd"
        v-hasPerm="['system:role:add']"
      >新增</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="single"
        @click="handleUpdate"
        v-hasPerm="['system:role:edit']"
      >编辑</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="multiple"
        @click="handleDelete"
        v-hasPerm="['system:role:remove']"
      >删除</el-button>
    </el-col>
  </el-row>

  <el-table :data="roleList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="角色编号" prop="roleId" width="120" />
    <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
    <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
    <el-table-column label="角色顺序" prop="roleSort" width="100" />
    <el-table-column label="状态" align="center" width="100">
      <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center" prop="createTime">
      <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" fixed="right">
      <template #default="scope">
        <el-tooltip content="编辑" placement="top" v-if="scope.row.roleId !== 1">
          <el-button type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPerm="['system:role:edit']"></el-button>
        </el-tooltip>
        <el-tooltip content="删除" placement="top" v-if="scope.row.roleId !== 1">
          <el-button type="danger" icon="Delete" @click="handleDelete(scope.row)" v-hasPerm="['system:role:remove']"></el-button>
        </el-tooltip>
        <el-tooltip content="数据权限" placement="top" v-if="scope.row.roleId !== 1">
          <el-button type="warning" icon="CircleCheck" @click="handleDataScope(scope.row)" v-hasPerm="['system:role:edit']"></el-button>
        </el-tooltip>
        <el-tooltip content="分配用户" placement="top" v-if="scope.row.roleId !== 1">
          <el-button type="success" icon="User" @click="handleAuthUser(scope.row)" v-hasPerm="['system:role:edit']"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 30, 50]"
    :background="true"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    style="margin-top: 20px; display: flex; justify-content: flex-end;"
  />

  <EditDialog
    v-model:visible="dialogForm.visible"
    :dialog-mode="dialogForm.dialogMode"
    :role-id="dialogForm.roleId"
    :role-name="dialogForm.roleName"
    @refresh="getRoleList"
  />
</template>