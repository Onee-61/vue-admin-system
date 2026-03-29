<script setup>
import { ref, watch, toRefs, computed } from 'vue'
import { getRole, updateRole, addRole, delRole, deptTreeSelect, dataScope } from '@/api/system/role'
import { roleMenuTreeselect, treeselect } from '@/api/system/menu'

const menuRef = ref(null)
const menuTree = ref([])
const menuExpand = ref(false)
const menuAllSelected = ref(false)
const deptRef = ref(null)
const deptTree = ref([])
const deptExpand = ref(true)
const deptAllSelected = ref(false)
const form = ref({
  roleId: undefined,
  roleName: undefined,
  roleKey: undefined,
  roleSort: 0,
  status: "0",
  menuIds: [],
  deptIds: [],
  menuCheckStrictly: true,
  deptCheckStrictly: true,
  remark: undefined
})

// 数据范围选项
const dataScopeOptions = ref([
  { value: "1", label: "全部数据权限" },
  { value: "2", label: "自定数据权限" },
  { value: "3", label: "本部门数据权限" },
  { value: "4", label: "本部门及以下数据权限" },
  { value: "5", label: "仅本人数据权限" }
])

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dialogMode: {
    type: String,
    default: 'edit'
  },
  roleId: {
    type: [Array, Number],
    default: null
  },
  roleName: {
    type: String,
    default: null
  }
})

// 重置表单
const reset = () => {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([])
  }
  menuExpand.value = false
  menuAllSelected.value = false
  deptExpand.value = true
  deptAllSelected.value = false
  form.value = {
    roleId: undefined,
    roleName: undefined,
    roleKey: undefined,
    roleSort: 0,
    status: "0",
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: undefined
  }
}

const { visible, dialogMode, roleId, roleName } = toRefs(props)
const emit = defineEmits(['update:visible','refresh'])
const title = computed(() => {
  if (dialogMode.value === 'edit') {
    return '编辑角色'
  } else if (dialogMode.value === 'add') {
    return '新增角色'
  } else if (dialogMode.value === 'delete') {
    return '删除角色'
  } else if (dialogMode.value === 'dataScope') {
    return '数据权限分配'
  }
  return ''
})

// 获取角色详情
const getRoleDetail = async () => {
  try {
    const res = await getRole(roleId.value)
    form.value = res.data
  } catch (error) {
    console.log(error)
  }
}

// 根据角色ID获取菜单树
const getRoleMenuTree = async () => {
  try {
    const res = await roleMenuTreeselect(roleId.value)
    menuTree.value = res.menus
    menuRef.value.setCheckedKeys(res.checkedKeys)
  } catch (error) {
    console.log(error.message);
  }
}

// 获取全部菜单树
const getMenuTree = async () => {
  try {
    const res = await treeselect()
    menuTree.value = res.data
  } catch (error) {
    console.log(error.message);
  }
}

// 根据角色ID获取部门树
const getRoleDeptTree = async () => {
  try {
    const res = await deptTreeSelect(roleId.value)
    deptTree.value = res.depts
    deptRef.value.setCheckedKeys(res.checkedKeys)
  } catch (error) {
    console.log(error.message);
  }
}

// 数据范围选择触发
const dataScopeSelectChange = (value) => {
  if (value !== "2") {
    deptRef.value.setCheckedKeys([])
  }
}

// 展开/折叠
const handleExpandChange = (value, type) => {
  if (type === 'menu') {
    menuTree.value.forEach(item => {
      menuRef.value.store.nodesMap[item.id].expanded = value
    })
  } else if (type === 'dept') {
    deptTree.value.forEach(item => {
      deptRef.value.store.nodesMap[item.id].expanded = value
    })
  }
}

// 全选/全不选
const handleAllSelectedChange = (value, type) => {
  if (type === 'menu') {
    menuRef.value.setCheckedNodes(value ? menuTree.value : [])
  } else {
    deptRef.value.setCheckedNodes(value ? deptTree.value : [])
  }
}

// 父子联动
const handleStrictlyChange = (value, type) => {
  if (type === 'menu') {
    form.value.menuCheckStrictly = value ? true : false
  } else if (type === 'dept') {
    form.value.deptCheckStrictly = value ? true : false
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

// 编辑角色
const editRole = async () => {
  try {
    getAllMenuCheckedKeys()
    await updateRole(form.value)
    ElMessage.success('编辑成功')
  } catch (error) {
    console.log(error)
  }
}

// 新增角色
const createRole = async () => {
  try {
    getAllMenuCheckedKeys()
    await addRole(form.value)
    ElMessage.success('新增成功')
  } catch (error) {
    console.log(error)
  }
}

// 删除角色
const deleteRole = async () => {
  try {
    console.log('删除角色ID:',roleId.value)
    await delRole(roleId.value)
    ElMessage.success('删除成功')
  } catch (error) {
    console.log(error)
  }
}

// 数据权限分配
const handleDataScope = async () => {
  try {
    getAllDeptCheckedKeys()
    await dataScope(form.value)
    ElMessage.success('数据权限分配成功')
  } catch (error) {
    console.log(error)
  }
}

// 获取所有选中的菜单ID
const getAllMenuCheckedKeys = async () => {
  if (menuRef.value) {
    const checkedKeys = menuRef.value.getCheckedKeys()
    const halfCheckedKeys = menuRef.value.getHalfCheckedKeys()
    form.value.menuIds = [...checkedKeys, ...halfCheckedKeys]
  }
}

// 获取所有选中的部门ID
const getAllDeptCheckedKeys = async () => {
  if (deptRef.value) {
    const checkedKeys = deptRef.value.getCheckedKeys()
    const halfCheckedKeys = deptRef.value.getHalfCheckedKeys()
    form.value.deptIds = [...checkedKeys, ...halfCheckedKeys]
  }
}

// 提交表单
const handleSubmit = async () => {
  if (dialogMode.value === 'edit') {
    await editRole()
  } else if (dialogMode.value === 'add') {
    await createRole()
  } else if (dialogMode.value === 'delete') {
    await deleteRole()
  } else if (dialogMode.value === 'dataScope') {
    await handleDataScope()
  }
  emit('refresh')
  handleClose()
}

// 监听visible变化
watch(visible, (newVal) => {
  if (newVal === true) {
    if (dialogMode.value === 'edit' && roleId.value) {
      form.value.roleId = roleId.value
      getRoleDetail()
      getRoleMenuTree()
    } else if (dialogMode.value === 'add') {
      getMenuTree()
    } else if (dialogMode.value === 'dataScope') {
      form.value.roleId = roleId.value
      getRoleDetail()
      getRoleDeptTree()
    } else {
      reset()
    }
  } else {
    reset()
  }
})
</script>

<template>
  <el-dialog
   :model-value="visible"
   :title="title"
   width="500px"
   @close="handleClose"
  >
    <el-divider style="margin: 0 0 20px 0;" />
    <el-form :data="form" v-if="dialogMode !== 'delete'">
      <el-form-item props="roleName" label="角色名称">
        <el-input v-model="form.roleName" placeholder="请输入角色名称" :disabled="dialogMode === 'dataScope'" />
      </el-form-item>
      <el-form-item props="roleKey" label="权限字符">
        <el-input v-model="form.roleKey" placeholder="请输入权限字符" :disabled="dialogMode === 'dataScope'" />
      </el-form-item>

      <!-- 编辑、添加角色表单 -->
      <template v-if="dialogMode === 'edit' || dialogMode === 'add'">
        <el-form-item props="roleSort" label="角色顺序">
          <el-input v-model="form.roleSort" placeholder="请输入角色顺序" />
        </el-form-item>
        <el-form-item props="status" label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="0">正常</el-radio>
            <el-radio value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item props="menuIds" label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleExpandChange($event,'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuAllSelected" @change="handleAllSelectedChange($event,'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleStrictlyChange($event,'menu')">父子联动</el-checkbox>
          <el-tree
            :data="menuTree"
            class="tree-border"
            show-checkbox
            ref="menuRef"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
        <el-form-item props="remark" label="备注">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </template>

      <!-- 数据权限分配表单 -->
      <template v-if="dialogMode === 'dataScope'">
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope === '2'">
          <el-checkbox v-model="deptExpand" @change="handleExpandChange($event,'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptAllSelected" @change="handleAllSelectedChange($event,'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleStrictlyChange($event,'dept')">父子联动</el-checkbox>
          <el-tree
            :data="deptTree"
            class="tree-border"
            show-checkbox
            default-expand-all
            ref="deptRef"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </template>
    </el-form>
    
    <!-- 删除角色表单 -->
    <el-form v-if="dialogMode === 'delete'">
      <span>确认要删除角色ID为 </span>
      <strong>{{ roleId }}</strong>
      <span> 的角色吗？</span>
    </el-form>

    <el-divider style="margin: 20px 0 0 0;" />

    <template #footer>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.tree-border {
  width: 100%;
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
}
</style>
