<script setup>
import { ref, onMounted } from 'vue'
import { parseTime } from '@/utils/common'
import { list, delOperlog, cleanOperlog } from '@/api/system/operlog'

const logList = ref([])
const total = ref(0)
const queryForm = ref({
  pageNum: 1,
  pageSize: 10
})
const dialogForm = ref({
  visible: false,
  form: {}
})

const dictMap = {
  0: { label: '其他', type: 'info' },
  1: { label: '新增', type: 'info' },
  2: { label: '修改', type: 'info' },
  3: { label: '删除', type: 'danger' },
  4: { label: '授权', type: 'primary' },
  5: { label: '导出', type: 'warning' },
  6: { label: '导入', type: 'warning' },
  7: { label: '强退', type: 'danger' },
  8: { label: '生成代码', type: 'warning' },
  9: { label: '清空数据', type: 'danger' }
}

// 查询操作日志列表
const getLogList = async () => {
  try {
    const res = await list(queryForm.value)
    logList.value = res.rows
    total.value = res.total
    } catch (error) {
    ElMessage.error(error.message)
  }
}

// 删除操作日志
const handleDelete = (operId) => {

}

// 清空操作日志
const handleClean = () => {

}

const handleDetail = (row) => {
  dialogForm.value.visible = true
  dialogForm.value.form = row
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  console.log(selection)
}

onMounted(() => {
  getLogList()
})
</script>

<template>
  <el-table :data="logList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="日志编号" prop="operId" align="center" />
    <el-table-column label="系统模块" prop="title" align="center" />
    <el-table-column label="操作类型" prop="businessType" align="center" >
      <template #default="scope">
        <el-tag :type="dictMap[scope.row.businessType]?.type || 'info'">
          {{ dictMap[scope.row.businessType]?.label || '未知' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作人员" prop="operName" align="center" />
    <el-table-column label="操作地址" prop="operIp" align="center" />
    <el-table-column label="操作状态" prop="status" align="center" >
      <template #default="scope">
        <el-tag :type="scope.row.status === 0 ? 'primary' : 'danger'">
          {{ scope.row.status === 0 ? '成功' : '失败' }}
        </el-tag>
      </template>
    </el-table-column> 

    <el-table-column label="操作日期" prop="operTime" width="180" align="center">
      <template #default="scope">
        {{ parseTime(scope.row.operTime) }}
      </template>
    </el-table-column>
    <el-table-column label="消耗时间" prop="costTime" width="100" align="center">
      <template #default="scope">
        {{ scope.row.costTime }}毫秒
      </template>
    </el-table-column>
    <el-table-column label="详细" align="center">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    :total="total"
    v-model:current-page="queryForm.pageNum"
    v-model:page-size="queryForm.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    @current-change="getLogList"
    @size-change="getLogList"
    style="margin-top: 20px; display: flex; justify-content: flex-end;"
  />

  <el-dialog
    v-model="dialogForm.visible"
    title="操作日志详情"
    width="50%"
  >
    <el-form :model="dialogForm.form"  style="width: 100%">
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作模块：">
            {{ dialogForm.form.title }}/{{ dialogForm.form.businessType === 0 ? '其他' : dictMap[dialogForm.form.businessType]?.label || '未知' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求地址：">
            {{ dialogForm.form.operUrl }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录信息：">
            {{ dialogForm.form.operName }} / {{ dialogForm.form.operIp }} / {{ dialogForm.form.operLocation }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求方式：">
            {{ dialogForm.form.requestMethod }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="操作方法：">
            {{ dialogForm.form.method }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="请求参数：" style="word-break: break-all; white-space: pre-wrap;">
            {{ dialogForm.form.operParam }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="返回参数：">
            {{ dialogForm.form.jsonResult }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作状态：">
            {{ dialogForm.form.status === 0 ? '正常' : '失败' }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="消耗时间：">
            {{ dialogForm.form.costTime }}毫秒
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作时间：">
            {{ parseTime(dialogForm.form.operTime) }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="异常信息：" v-if="dialogForm.form.status === 1">{{ dialogForm.form.errorMsg }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div style="text-align: right;">
        <el-button @click="dialogForm.visible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scope>
.el-form-item__label {
  font-weight: 700;
}
</style>

<!-- {
    "total": 126,
    "rows": [
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 225,
            "title": "菜单管理",
            "businessType": 2,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysMenuController.edit()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/menu",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"children\":[],\"component\":\"system/logininfor/index\",\"icon\":\"logininfor\",\"isCache\":\"0\",\"isFrame\":\"1\",\"menuId\":501,\"menuName\":\"登录日志\",\"menuType\":\"C\",\"orderNum\":2,\"params\":{},\"parentId\":108,\"path\":\"logininfor\",\"perms\":\"monitor:logininfor:list\",\"query\":\"\",\"routeName\":\"\",\"status\":\"0\",\"updateBy\":\"admin\",\"visible\":\"0\"} ",
            "jsonResult": "{\"msg\":\"操作成功\",\"code\":200}",
            "status": 0,
            "errorMsg": null,
            "operTime": "2026-04-01 17:18:31",
            "costTime": 24
        },
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 224,
            "title": "菜单管理",
            "businessType": 2,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysMenuController.edit()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/menu",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"children\":[],\"component\":\"system/operlog/index\",\"icon\":\"form\",\"isCache\":\"0\",\"isFrame\":\"1\",\"menuId\":500,\"menuName\":\"操作日志\",\"menuType\":\"C\",\"orderNum\":1,\"params\":{},\"parentId\":108,\"path\":\"operlog\",\"perms\":\"monitor:operlog:list\",\"query\":\"\",\"routeName\":\"\",\"status\":\"0\",\"updateBy\":\"admin\",\"visible\":\"0\"} ",
            "jsonResult": "{\"msg\":\"操作成功\",\"code\":200}",
            "status": 0,
            "errorMsg": null,
            "operTime": "2026-04-01 17:18:24",
            "costTime": 38
        },
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 223,
            "title": "用户管理",
            "businessType": 2,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysUserController.changeStatus()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/user/changeStatus",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"admin\":true,\"params\":{},\"status\":\"1\",\"userId\":1} ",
            "jsonResult": null,
            "status": 1,
            "errorMsg": "不允许操作超级管理员用户",
            "operTime": "2026-04-01 15:03:20",
            "costTime": 6
        },
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 222,
            "title": "用户管理",
            "businessType": 4,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysUserController.insertAuthRole()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/user/authRole",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"roleIds\":\"2\",\"userId\":\"1\"}",
            "jsonResult": "{\"msg\":\"操作成功\",\"code\":200}",
            "status": 0,
            "errorMsg": null,
            "operTime": "2026-04-01 14:51:12",
            "costTime": 9
        },
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 221,
            "title": "用户管理",
            "businessType": 4,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysUserController.insertAuthRole()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/user/authRole",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"roleIds\":\"2\",\"userId\":\"102\"}",
            "jsonResult": "{\"msg\":\"操作成功\",\"code\":200}",
            "status": 0,
            "errorMsg": null,
            "operTime": "2026-04-01 14:50:59",
            "costTime": 10
        },
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 220,
            "title": "用户管理",
            "businessType": 4,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysUserController.insertAuthRole()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/user/authRole",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"roleIds\":\"2\",\"userId\":\"102\"}",
            "jsonResult": "{\"msg\":\"操作成功\",\"code\":200}",
            "status": 0,
            "errorMsg": null,
            "operTime": "2026-04-01 14:46:49",
            "costTime": 40
        },
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 219,
            "title": "用户管理",
            "businessType": 2,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysUserController.changeStatus()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/user/changeStatus",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"admin\":false,\"params\":{},\"status\":\"0\",\"updateBy\":\"admin\",\"userId\":102} ",
            "jsonResult": "{\"msg\":\"操作成功\",\"code\":200}",
            "status": 0,
            "errorMsg": null,
            "operTime": "2026-03-31 20:49:38",
            "costTime": 4
        },
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 218,
            "title": "用户管理",
            "businessType": 2,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysUserController.changeStatus()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/user/changeStatus",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"admin\":false,\"params\":{},\"status\":\"1\",\"updateBy\":\"admin\",\"userId\":102} ",
            "jsonResult": "{\"msg\":\"操作成功\",\"code\":200}",
            "status": 0,
            "errorMsg": null,
            "operTime": "2026-03-31 20:49:36",
            "costTime": 4
        },
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 217,
            "title": "用户管理",
            "businessType": 2,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysUserController.edit()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/user",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"admin\":false,\"avatar\":\"\",\"createBy\":\"admin\",\"createTime\":\"2026-03-31 18:42:30\",\"delFlag\":\"0\",\"deptId\":102,\"email\":\"153877837@qq.com\",\"loginDate\":\"2026-03-31 18:45:01\",\"loginIp\":\"127.0.0.1\",\"nickName\":\"wad\",\"params\":{},\"phonenumber\":\"18984315311\",\"postIds\":[4],\"pwdUpdateDate\":\"2026-03-31 18:44:53\",\"remark\":\"测试用户\",\"roleIds\":[2],\"roles\":[],\"sex\":\"0\",\"status\":\"0\",\"updateBy\":\"admin\",\"userId\":102,\"userName\":\"awd\"} ",
            "jsonResult": "{\"msg\":\"操作成功\",\"code\":200}",
            "status": 0,
            "errorMsg": null,
            "operTime": "2026-03-31 20:49:29",
            "costTime": 42
        },
        {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "operId": 216,
            "title": "用户管理",
            "businessType": 2,
            "businessTypes": null,
            "method": "com.ruoyi.project.system.controller.SysUserController.resetPwd()",
            "requestMethod": "PUT",
            "operatorType": 1,
            "operName": "admin",
            "deptName": "研发部门",
            "operUrl": "/system/user/resetPwd",
            "operIp": "127.0.0.1",
            "operLocation": "内网IP",
            "operParam": "{\"admin\":false,\"params\":{},\"updateBy\":\"admin\",\"userId\":103} ",
            "jsonResult": "{\"msg\":\"操作成功\",\"code\":200}",
            "status": 0,
            "errorMsg": null,
            "operTime": "2026-03-31 20:38:49",
            "costTime": 88
        }
    ],
    "code": 200,
    "msg": "查询成功"
} -->