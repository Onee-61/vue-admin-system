<script setup>
import { ref, onMounted } from 'vue'

import { listMenu } from '@/api/system/menu'
import { handleTree } from '@/utils/common'
import EditDialog from './EditDialog.vue'

const menuList = ref([])
const dialogForm = ref({
  visible: false,
  dialogMode: 'edit', // 编辑edit、新增add、删除delete
  menuId: null,
  menuName: null,
})

const handleEditSubmit = (formData) => {
  console.log('提交表单数据:', formData)
}

const getMenuList = async () => {
  try {
    const res = await listMenu()
    menuList.value = handleTree(res.data,'menuId')
  } catch (error) {
    console.log(error.message);
  }
}

// 编辑、新增、删除菜单
const handleDialog = (dialogMode, row) => {
  dialogForm.value.dialogMode = dialogMode
  dialogForm.value.visible = true
  dialogForm.value.menuId = row.menuId
  dialogForm.value.menuName = row.menuName
}

onMounted(() => {
  getMenuList()
})
</script>

<template>
  <h1>菜单管理</h1>
  <el-table :data="menuList" style="width: 100%" row-key="menuName">
    <el-table-column prop="menuName" label="菜单名称" width="160" />
    <el-table-column prop="icon" label="图标" width="80">
      <template #default="scope">
        <SvgIcon :icon-class="scope.row.icon" />
      </template>
    </el-table-column>

    <el-table-column prop="orderNum" label="排序" width="60" />
    <el-table-column prop="perms" label="权限标识" />
    <el-table-column prop="component" label="组件" />
    <el-table-column prop="status" label="状态" width="80" >
      <template #default="scope">
        <el-tag :type="scope.row.status === '0' ? 'primary' : 'danger'">{{ scope.row.status === '0' ? '正常' : '停用' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="200" />

    <el-table-column fixed="right" prop="operation" label="操作" width="240">
      <template #default="scope">
        <el-button @click="handleDialog('edit', scope.row)" type="primary" size="small">编辑</el-button>
        <el-button @click="handleDialog('add', scope.row)" type="success" size="small">新增</el-button>
        <el-button @click="handleDialog('delete', scope.row)" type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <EditDialog 
    v-model:visible="dialogForm.visible"
    :dialogMode="dialogForm.dialogMode"
    :menuId="dialogForm.menuId"
    :menuName="dialogForm.menuName"
    @refresh="getMenuList"
  />
</template>
