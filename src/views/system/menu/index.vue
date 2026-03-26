<script setup>
import { ref, onMounted } from 'vue'

import { listMenu } from '@/api/system/menu'
import { handleTree } from '@/utils/common'

const menuList = ref([])
const getMenuList = async () => {
  try {
    const res = await listMenu()
    // 扁平数组树形化
    menuList.value = handleTree(res.data,'menuId')
  } catch (error) {
    console.log(error.message);
  }
}

onMounted(() => {
  getMenuList()
})
</script>

<template>
  <h1>菜单管理</h1>
  <el-table :data="menuList" style="width: 100%" row-key="menuName">
    
    <el-table-column prop="menuName" label="菜单名称" width="180" />
    <el-table-column prop="icon" label="图标" width="80">
      <template #default="scope">
        <SvgIcon  :icon-class="scope.row.icon" />
      </template>
    </el-table-column>


    <el-table-column prop="menuId" label="菜单ID" width="80" />
    <el-table-column prop="perms" label="权限标识" width="180" />
    <el-table-column prop="path" label="菜单路径" width="140" />
    <el-table-column prop="status" label="状态" width="80" />
    <el-table-column prop="createTime" label="创建时间" width="180" />



    <el-table-column prop="createBy" label="创建人" />
    <el-table-column prop="updateBy" label="更新人" />
    <el-table-column prop="updateTime" label="更新时间" width="180" />
    <el-table-column prop="remark" label="备注" />
    <el-table-column prop="parentId" label="父菜单ID" />
    <el-table-column prop="orderNum" label="排序" />
    <el-table-column prop="menuType" label="菜单类型" />
    <el-table-column prop="visible" label="是否可见" /> -->
    
    
    <el-table-column fixed="right" prop="operation" label="操作" width="200">
      <template #default="scope">
        <el-button type="primary" size="small">编辑</el-button>
        <el-button type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 
 {
          "createBy": null,
          "createTime": "2026-03-09 16:50:23",
          "updateBy": null,
          "updateTime": null,
          "remark": null,
          "menuId": 110,
          "menuName": "定时任务",
          "parentName": null,
          "parentId": 2,
          "orderNum": 2,
          "path": "job",
          "component": "monitor/job/index",
          "query": "",
          "routeName": "",
          "isFrame": "1",
          "isCache": "0",
          "menuType": "C",
          "visible": "0",
          "status": "0",
          "perms": "monitor:job:list",
          "icon": "job",
          "children": []
      }, -->
</template>

<style>
.route span {
  color: red;
}
</style>