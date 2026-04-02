<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuthRole, updateAuthRole } from '@/api/system/user'
import { parseTime } from '@/utils/common'

const route = useRoute()
const router = useRouter()
const roles = ref([])
const form = ref({
  nickName: undefined,
  userName: undefined,
  userId: route.params.userId
})
const queryForm = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
})

// {
//     "msg": "操作成功",
//     "code": 200,
//     "roles": [
//         {
//             "createBy": null,
//             "createTime": "2026-03-09 16:50:23",
//             "updateBy": null,
//             "updateTime": null,
//             "remark": "普通角色",
//             "roleId": 2,
//             "roleName": "普通角色",
//             "roleKey": "common",
//             "roleSort": 2,
//             "dataScope": "2",
//             "menuCheckStrictly": false,
//             "deptCheckStrictly": false,
//             "status": "0",
//             "delFlag": "0",
//             "flag": true,
//             "menuIds": null,
//             "deptIds": null,
//             "permissions": null,
//             "admin": false
//         }
//     ],
//     "user": {
//         "createBy": "admin",
//         "createTime": "2026-03-09 16:50:23",
//         "updateBy": null,
//         "updateTime": null,
//         "remark": "测试员1",
//         "userId": 2,
//         "deptId": 105,
//         "userName": "ry",
//         "nickName": "若依",
//         "email": "ry@qq.com",
//         "phonenumber": "15666666666",
//         "sex": "1",
//         "avatar": "",
//         "status": "0",
//         "delFlag": "0",
//         "loginIp": "127.0.0.1",
//         "loginDate": "2026-03-28T14:42:48.000+08:00",
//         "pwdUpdateDate": "2026-03-09T16:50:23.000+08:00",
//         "dept": {
//             "createBy": null,
//             "createTime": null,
//             "updateBy": null,
//             "updateTime": null,
//             "remark": null,
//             "deptId": 105,
//             "parentId": 101,
//             "ancestors": "0,100,101",
//             "deptName": "测试部门",
//             "orderNum": 3,
//             "leader": "若依",
//             "phone": null,
//             "email": null,
//             "status": "0",
//             "delFlag": null,
//             "parentName": null,
//             "children": []
//         },
//         "roles": [
//             {
//                 "createBy": null,
//                 "createTime": null,
//                 "updateBy": null,
//                 "updateTime": null,
//                 "remark": null,
//                 "roleId": 2,
//                 "roleName": "普通角色",
//                 "roleKey": "common",
//                 "roleSort": 2,
//                 "dataScope": "2",
//                 "menuCheckStrictly": false,
//                 "deptCheckStrictly": false,
//                 "status": "0",
//                 "delFlag": null,
//                 "flag": false,
//                 "menuIds": null,
//                 "deptIds": null,
//                 "permissions": null,
//                 "admin": false
//             }
//         ],
//         "roleIds": null,
//         "postIds": null,
//         "roleId": null,
//         "admin": false
//     }
// }

// 获取授权角色列表
const getAuthRoleList = async () => {
  try {
    const res = await getAuthRole(route.params.userId)
    form.value = res.user
    roles.value = res.roles
    queryForm.value.total = roles.value.length
  } catch (error) {
    console.log(error)
  }
}

// 处理选择变化
const handleSelectionChange = (val) => {
  form.value.roleIds = val.map(item => item.roleId)
}

const handleSubmit = async () => {
  try {
    await updateAuthRole({
    userId: form.value.userId,
    roleIds: form.value.roleIds.join(",")
  })
  ElMessage.success('操作成功')
  handleClose()
} catch (error) {
  ElMessage.error(error.message)
}
}

const handleClose = () => {
  router.back()
}

onMounted(() => {
  getAuthRoleList()
})
</script>

<template>
  <div>
    <h4>用户基本信息</h4>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <h4>角色信息</h4>
    <el-table :data="roles" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="80" type="index" align="center">
        <template #default="scope">
          <span>{{ (queryForm.pageNum - 1) * queryForm.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roleId" label="角色ID" align="center" />
      <el-table-column prop="roleName" label="角色名称" align="center"/>
      <el-table-column prop="roleKey" label="权限字符" align="center"/>
      <el-table-column prop="createTime" label="创建时间" width="180" align="center">
        <template #default="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="queryForm.total"
      v-model:page-size="queryForm.pageSize"
      v-model:current-page="queryForm.pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; display: flex; justify-content: flex-end;"
    />

    <el-form style="text-align: center;">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleClose">返回</el-button>
    </el-form>
  </div>
</template>
