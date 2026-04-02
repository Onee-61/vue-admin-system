<script setup name="SelectUser">
import { ref } from "vue"
import { authUserSelectAll, unallocatedUserList } from "@/api/system/role"
import { parseTime } from "@/utils/common"

const props = defineProps({
  roleId: {
    type: [Number, String]
  }
})

const userList = ref([])
const visible = ref(false)
const total = ref(0)
const userIds = ref([])
const refTable = ref(null)

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  roleId: undefined,
  userName: undefined,
  phonenumber: undefined
})

// 显示弹框
const show = () => {
  queryParams.value.roleId = props.roleId
  getList()
  visible.value = true
}

// 选择行
const clickRow = (row) => {
  refTable.value.toggleRowSelection(row)
}

// 多选框选中数据
const handleSelectionChange = (selection) => {
  userIds.value = selection.map(item => item.userId)
}

// 查询表数据
const getList = async () => {
  try {
    await unallocatedUserList(queryParams.value).then(res => {
      userList.value = res.rows
      total.value = res.total
    })
  } catch (error) {
    console.log(error)
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.value.userName = undefined
  queryParams.value.phonenumber = undefined
  handleQuery()
}

const emit = defineEmits(["ok"])
/** 选择授权用户操作 */
const handleSelectUser = async () => {
  const roleId = queryParams.value.roleId
  const uIds = userIds.value.join(",")
  if (uIds == "") {
    ElMessage.error("请选择要分配的用户")
    return
  }

  await authUserSelectAll({ roleId: roleId, userIds: uIds })
  ElMessage.success(res.msg)
  visible.value = false
  emit("ok")
}

defineExpose({
  show,
})
</script>

<template>
   <!-- 授权用户 -->
   <el-dialog title="选择用户" v-model="visible" width="800px" top="5vh" append-to-body>
      <el-form :model="queryParams" ref="queryRef" :inline="true">
         <el-form-item label="用户名称" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入用户名称"
               clearable
               style="width: 180px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="手机号码" prop="phonenumber">
            <el-input
               v-model="queryParams.phonenumber"
               placeholder="请输入手机号码"
               clearable
               style="width: 180px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>
      <el-row>
        <el-table @row-click="clickRow" ref="refTable" :data="userList" @selection-change="handleSelectionChange" height="260px">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
          <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
          <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <el-tag :type="scope.row.status == 0 ? 'primary' : 'danger'">{{ scope.row.status == 0 ? '正常' : '停用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div style="display: flex; justify-content: flex-end; margin-top: 10px; width: 100%;">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :background="true"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="getList"
            @size-change="getList"
          />
        </div>
      </el-row>
      <template #footer>
         <div class="dialog-footer">
            <el-button type="primary" @click="handleSelectUser">确 定</el-button>
            <el-button @click="visible = false">取 消</el-button>
         </div>
      </template>
   </el-dialog>
</template>
