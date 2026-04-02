<script setup>
import { listUser, getUser, addUser, updateUser, changeUserStatus, resetUserPwd, delUser, deptTreeSelect } from '@/api/system/user'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { parseTime } from '@/utils/common'

const router = useRouter()
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const userRef = ref(null)
const total = ref(0)
const userList = ref([])
const postOptions = ref([])
const roleOptions = ref([])
const deptOptions = ref([])
const enabledDeptOptions = ref([])
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  userName: undefined,
  phonenumber: undefined,
  status: undefined,
  deptId: undefined
})
const form = ref({
  userId: undefined,
  deptId: undefined,
  userName: undefined,
  nickName: undefined,
  password: undefined,
  phonenumber: undefined,
  email: undefined,
  sex: undefined,
  status: "0",
  remark: undefined,
  postIds: [],
  roleIds: []
})
const rules = ref({
  userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
    nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
    password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }, { pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\\ |", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
})
const dialogForm = ref({
  visible: false,
  title: '',
  userId: undefined
})

// 处理多选变化
const handleSelectionChange = (selection) => {
  ids.value = selection.map(item => item.userId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 获取用户列表
const getUserList = async () => {
  try {
    const res = await listUser(queryParams.value)
    userList.value = res.rows
    total.value = res.total
  } catch (error) {
    console.log(error)
  }
}

// 搜索用户
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getUserList()
}

// 重置查询条件
const resetQuery = () => {
  queryParams.value.userName = undefined
  queryParams.value.phonenumber = undefined
  queryParams.value.status = undefined
  queryParams.value.deptId = undefined
  handleQuery()
}

// 重置表单
const resetForm = () => {
  form.value = {
    userId: undefined,
    deptId: undefined,
    userName: undefined,
    nickName: undefined,
    password: undefined,
    phonenumber: undefined,
    email: undefined,
    sex: undefined,
    status: "0",
    remark: undefined,
    postIds: [],
    roleIds: []
  }
}

// 处理状态变化
const handleStatusChange = async (row) => {
  try {
    await changeUserStatus( row.userId, row.status )
    ElMessage.success('修改成功')
  } catch (error) {
    row.status = row.status === '0' ? '1' : '0'
  }
}

// 查询部门下拉树结构
const getDeptTree = async () => {
  try {
    const res = await deptTreeSelect()
    deptOptions.value = res.data
    enabledDeptOptions.value = filterDisabledDept(JSON.parse(JSON.stringify(res.data)))
  } catch (error) {
    console.log(error)
  }
}

// 过滤禁用的部门
const filterDisabledDept = (deptList) => {
  return deptList.filter(dept => {
    if (dept.disabled) {
      return false
    }
    if (dept.children && dept.children.length) {
      dept.children = filterDisabledDept(dept.children)
    }
    return true
  })
}

// 新增用户
const handleAdd = async () => {
  try {
    const res = await getUser('')
    postOptions.value = res.posts
    roleOptions.value = res.roles
    dialogForm.value.visible = true
    dialogForm.value.title = '新增用户'
  } catch (error) {
    console.log(error)
  }
}

// 编辑用户
const handleEdit = async (row) => {
  try {
    const res = await getUser(row.userId || ids.value)
    form.value = res.data
    postOptions.value = res.posts
    roleOptions.value = res.roles
    dialogForm.value.visible = true
    dialogForm.value.title = '编辑用户'
  } catch (error) {
    console.log(error)
  }
}

// 重置密码
const handleResetPwd = async (row) => {
  try {
    const password = await ElMessageBox.prompt(`请输入用户“${row.userName}”的新密码：`, '重置密码', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
      inputValidator: (value) => {
        if (/<|>|"|'|\||\\/.test(value)) {
          return "不能包含非法字符：< > \" ' \\\ |"
        }
      },
    })
    
    if (!password.value.trim()) {
      return
    }

    await resetUserPwd(row.userId, password.value.trim())
    ElMessage.success('重置成功, 新密码是：' + password.value.trim())
  } catch (error) {
    if (error !== 'cancel') {
      console.log(error)
    }
  }
}

// 删除用户
const handleDelete = async (row) => {
  try {
    // 确认删除
    await ElMessageBox.confirm('确认删除用户 ' + row.userName + ' 吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await delUser(row.userId)
    ElMessage.success('删除成功')
    getUserList()
  } catch (error) {
    if (error !== 'cancel') {
      console.log(error)
    }
  }
}

// 分配角色
const handleAuthRole = (row) => {
  router.push({ path:'/system/user-auth/role/' + row.userId })
}

// 提交表单
const submitForm = async () => {
  try {
    await userRef.value.validate()
    if (dialogForm.value.title === '新增用户') {
      // 新增用户
      await addUser(form.value)
    } else if (dialogForm.value.title === '编辑用户' && !dialogForm.value.userId) {
      // 更新用户
      await updateUser(form.value)
    }
    ElMessage.success('操作成功')
    handleDialogClose()
    getUserList()
  } catch (error) {
    console.log(error)
  }
}

// 处理弹窗关闭
const handleDialogClose = () => {
  resetForm()
  dialogForm.value.visible = false
  dialogForm.value.title = ''
  dialogForm.value.userId = undefined
}

onMounted(() => {
  getUserList()
  getDeptTree()
})
</script>

<template>
  <h1>用户管理</h1>
  <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="70px">
    <el-form-item label="用户名称">
      <el-input v-model="queryParams.userName" placeholder="请输入用户名称" />
    </el-form-item>
    <el-form-item label="手机号码">
      <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" />
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px;">
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
        plain 
        type="primary" 
        icon="Plus" 
        v-hasPerm="['system:user:add']"
        @click="handleAdd"
      >新增</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button 
        plain 
        type="success" 
        icon="Edit" 
        :disabled="single"
        v-hasPerm="['system:user:edit']"
        @click="handleEdit"
      >编辑</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button 
        plain 
        type="danger" 
        :disabled="multiple"
        icon="Delete" 
        v-hasPerm="['system:user:remove']"
        @click="handleDelete"
      >删除</el-button>
    </el-col>
  </el-row>

  <el-table :data="userList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column prop="userId" label="用户ID" />
    <el-table-column prop="userName" label="用户名称" />
    <el-table-column prop="nickName" label="用户昵称" />
    <el-table-column prop="dept.deptName" label="部门" />
    <el-table-column prop="phonenumber" label="手机号码" />
    <el-table-column prop="status" label="状态" >
      <template #default="scope">
        <el-switch 
          v-model="scope.row.status" 
          active-value="0" 
          inactive-value="1"
          @change="handleStatusChange(scope.row)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="200">
      <template #default="scope">
        {{ parseTime(scope.row.createTime) }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="260">
      <template #default="scope">
        <el-tooltip content="编辑" placement="top" v-if="scope.row.userId !== 1">
          <el-button 
            type="primary" 
            icon="Edit" 
            size="small" 
            @click="handleEdit(scope.row)" 
            v-hasPerm="['system:user:edit']"
          ></el-button>
        </el-tooltip>
        <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
          <el-button 
            type="danger" 
            icon="Delete" 
            size="small" 
            @click="handleDelete(scope.row)" 
            v-hasPerm="['system:user:remove']"
          ></el-button>
        </el-tooltip>
        <el-tooltip content="重置密码" placement="top" v-if="scope.row.userId !== 1">
          <el-button 
            type="info" 
            icon="Key" 
            size="small" 
            @click="handleResetPwd(scope.row)" 
            v-hasPerm="['system:user:resetPwd']"
          ></el-button>
        </el-tooltip>
        <el-tooltip content="分配角色" placement="top" v-if="scope.row.userId !== 1">
          <el-button 
            type="success" 
            icon="User" 
            size="small" 
            @click="handleAuthRole(scope.row)" 
            v-hasPerm="['system:user:edit']"
          ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  
  <el-pagination
    :total="total"
    :sizes="[10, 20, 30, 50]"
    v-model:page-size="queryParams.pageSize"
    v-model:current-page="queryParams.pageNum"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="getUserList"
    @current-change="getUserList"
    style="margin-top: 20px; display: flex; justify-content: flex-end;"
  />

  <!-- 添加或修改用户配置对话框 -->
  <el-dialog
    v-model="dialogForm.visible" 
    :title="dialogForm.title" 
    width="40%"
    @close="handleDialogClose"
  >
    <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="deptId">
            <el-tree-select v-model="form.deptId" :data="enabledDeptOptions" :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id" placeholder="请选择归属部门" clearable check-strictly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户性别">
            <el-select v-model="form.sex" placeholder="请选择">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
              <el-option label="未知" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select v-model="form.postIds" multiple placeholder="请选择">
              <el-option 
                v-for="item in postOptions" 
                :key="item.postId" 
                :label="item.postName" 
                :value="item.postId" 
                :disabled="item.status == 1"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select v-model="form.roleIds" multiple placeholder="请选择">
              <el-option 
                v-for="item in roleOptions" 
                :key="item.roleId" 
                :label="item.roleName" 
                :value="item.roleId" 
                :disabled="item.status == 1"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleDialogClose">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>