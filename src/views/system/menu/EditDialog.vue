<script setup>
import { ref, toRefs, watch, computed } from 'vue'
import { getMenu, listMenu, addMenu, updateMenu, delMenu } from '@/api/system/menu'
import { handleTree } from '@/utils/common'
import IconSelector from '@/components/IconSelector/index.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dialogMode: {
    type: String,
    default: 'edit'
  },
  menuId: {
    type: Number,
    default: null
  },
  menuName: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'refresh'])

const { visible, dialogMode, menuId, menuName } = toRefs(props)

const formRef = ref(null)
const menuOptions = ref([])
const form = ref({
  menuId: null,
  parentId: 0,
  menuName: null,
  icon: null,
  menuType: 'M',
  orderNum: null,
  isFrame: '1',
  isCache: '0',
  visible: '0',
  status: '0',
  routeName: null,
  path: null,
  component: null,
  perms: null,
  query: null,
})

const formRules = {
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  menuType: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  path: [
    { required: true, message: '请输入路由地址', trigger: 'blur' }
  ],
  orderNum: [
    { required: true, message: '请输入显示排序', trigger: 'blur' }
  ]
}

// 重置表单
const resetForm = () => {
  form.value = {
    menuId: null,
    parentId: 0,
    menuName: null,
    icon: null,
    menuType: 'M',
    orderNum: null,
    isFrame: '1',
    isCache: '0',
    visible: '0',
    status: '0',
    routeName: null,
    path: null,
    component: null,
    perms: null,
    query: null,
  }
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 对话框标题
const dialogTitle = computed(() => {
  if (dialogMode.value === 'edit') {
    return '编辑菜单'
  } else if (dialogMode.value === 'add') {
    return '添加菜单'
  } else if (dialogMode.value === 'delete') {
    return '删除菜单'
  }
  return ''
})

const menuTypeOptions = [
  { label: '目录', value: 'M' },
  { label: '菜单', value: 'C' },
  { label: '按钮', value: 'F' }
]

const statusOptions = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
]

const visibleOptions = [
  { label: '显示', value: '0' },
  { label: '隐藏', value: '1' }
]

const isFrameOptions = [
  { label: '是', value: '0' },
  { label: '否', value: '1' }
]

const isCacheOptions = [
  { label: '缓存', value: '0' },
  { label: '不缓存', value: '1' }
]

// 查询菜单详情
const getMenuDetail = async (menuId) => {
  try {
    const res = await getMenu(menuId)
    form.value = {
      menuId: res.data.menuId,
      parentId: res.data.parentId,
      menuName: res.data.menuName,
      icon: res.data.icon,
      menuType: res.data.menuType,
      orderNum: res.data.orderNum,
      isFrame: res.data.isFrame,
      isCache: res.data.isCache,
      visible: res.data.visible,
      status: res.data.status,
      routeName: res.data.routeName || '',
      path: res.data.path || '',
      component: res.data.component || '',
      perms: res.data.perms || '',
      query: res.data.query || '',
    }
  } catch (error) {
    console.log(error.message)
    ElMessage.error('获取菜单详情失败')
  }
}

// 查询菜单下拉树结构
const getTreeSelect = async () => {
  menuOptions.value = []
  const menu = { menuId: 0, menuName: "主类目", children: [] }
  const res = await listMenu()
  menu.children = handleTree(res.data, "menuId")
  menuOptions.value.push(menu)
}

// 提交表单
const submitForm = async () => {
  
  if (dialogMode.value === 'edit') {
    await formRef.value.validate()
    await editMenu()
  } else if (dialogMode.value === 'add') {
    await formRef.value.validate()
    await createMenu()
  } else if (dialogMode.value === 'delete') {
    await deleteMenu()
  }

  emit('update:visible', false)
  emit('refresh')
}

// 编辑菜单
const editMenu = async () => {
  try {
    await updateMenu(form.value)
    ElMessage.success('更新成功')
  } catch (error) {
    console.log(error.message)
    ElMessage.error('更新失败')
  }
}
// 新增菜单
const createMenu = async () => {
  try {
    await addMenu(form.value)
    ElMessage.success('新增成功')
  } catch (error) {
    console.log(error.message)
    ElMessage.error('新增失败')
  }
}

// 删除菜单
const deleteMenu = async () => {
  try {
    await delMenu(menuId.value)
    ElMessage.success('删除成功')
  } catch (error) {
    console.log(error.message)
    ElMessage.error('删除失败')
  }
}

// 选择图标
const selected = (icon) => {
  form.value.icon = icon
}

// 关闭模态框
const handleClose = () => {
  resetForm()
  emit('update:visible', false)
}

// 监听visible变化
watch(visible, (newVal) => {
  if (newVal === true) { // 打开模态框
    if (dialogMode.value === 'edit' && menuId.value) { // 编辑菜单
      // 获取菜单详情
      getMenuDetail(menuId.value)
      // 获取菜单下拉树结构
      getTreeSelect()
    } else if (dialogMode.value === 'add') { // 新增菜单
      // 清空表单数据
      resetForm()
    } else if (dialogMode.value === 'delete') { // 删除菜单
      // 清空表单数据
      resetForm()
    }
  }
})
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="700px"
    @close="handleClose"
    align-center
  >
    <el-divider style="margin: 0 0 20px 0;" />
    <el-form 
      v-if="dialogMode === 'edit' || dialogMode === 'add'"
      :model="form"
      :rules="formRules"
      ref="formRef"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单">
            <el-tree-select
              v-model="form.parentId"
              :data="menuOptions"
              :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
              value-key="menuId"
              placeholder="选择上级菜单"
              check-strictly
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="form.menuType">
            <el-radio v-for="item in menuTypeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover
              placement="bottom-start"
              :width="540"
              trigger="click"
            >
              <template #reference>
                  <el-input v-model="form.icon" placeholder="点击选择图标" readonly>
                    <template #prefix>
                        <svg-icon
                          v-if="form.icon"
                          :icon-class="form.icon"
                          class="el-input__icon"
                          style="height: 32px;width: 16px;"
                        />
                        <el-icon v-else style="height: 32px;width: 16px;"><search /></el-icon>
                    </template>
                  </el-input>
              </template>
              <icon-selector ref="iconSelectorRef" @selected="selected" :active-icon="form.icon" />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" :min="0" controls-position="right" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否外链">
            <el-radio-group v-model="form.isFrame">
              <el-radio v-for="item in isFrameOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="form.menuType === 'M' || form.menuType === 'C'">
        <el-col :span="12">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="form.path" placeholder="请输入路由地址" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示状态">
            <el-radio-group v-model="form.visible">
              <el-radio v-for="item in visibleOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="form.menuType === 'C'">
        <el-col :span="12">
          <el-form-item label="组件路径">
            <el-input v-model="form.component" placeholder="请输入组件路径" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限标识">
            <el-input v-model="form.perms" placeholder="请输入权限标识" clearable />
          </el-form-item>
        </el-col>
      </el-row>
        <el-row v-if="form.menuType === 'C'">
          <el-col :span="12">
            <el-form-item label="路由名称">
              <el-input v-model="form.routeName" placeholder="请输入路由名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否缓存">
              <el-radio-group v-model="form.isCache">
                <el-radio v-for="item in isCacheOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.menuType === 'C'">
          <el-col :span="12">
            <el-form-item label="路由参数">
              <el-input v-model="form.query" placeholder="请输入路由参数" clearable />
            </el-form-item>
          </el-col>
        </el-row>

      <el-row v-if="form.menuType === 'F'">
        <el-col :span="24">
          <el-form-item label="权限标识">
            <el-input v-model="form.perms" placeholder="请输入权限标识" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="菜单状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 删除菜单表单 -->
    <el-form v-if="dialogMode === 'delete'">
      <span>确认要删除菜单"{{ menuName }}"吗？</span>
    </el-form>

    <el-divider style="margin: 20px 0 0 0;" />

    <template #footer>
      <el-button type="primary" @click="submitForm">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>
