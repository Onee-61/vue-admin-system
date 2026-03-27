<script setup>
import { ref, toRefs, watch, computed } from 'vue'
import { getMenu } from '@/api/system/menu'

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

const submitForm = async () => {
  await formRef.value.validate()
  emit('update:visible', false)
  emit('refresh')
}

const handleClose = () => {
  resetForm()
  emit('update:visible', false)
}

watch(visible, (newVal) => {
  if (newVal === true) { // 打开模态框
    if (dialogMode.value === 'edit' && menuId.value) { // 编辑菜单
      // 获取菜单详情
      getMenuDetail(menuId.value)
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
    v-model="visible"
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
        <el-form-item label="上级菜单">
          <el-input v-model="form.parentId" placeholder="上级菜单">
            {{ form.parentId }}
          </el-input>
          <!-- <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option v-for="item in menuList" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
          </el-select> -->
        </el-form-item>
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
            <el-input v-model="form.icon" placeholder="请输入图标" clearable>
              <template #prefix>
                <SvgIcon v-if="form.icon" :icon-class="form.icon" />
              </template>
            </el-input>
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

<style scoped>
:deep(.el-dialog__header) {
  border-bottom: 1px solid #3b3c3d;
  /* padding-bottom: 20px; */
}

:deep(.el-dialog__body) {
  border: 1px solid #000;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #3b3c3d;
  /* padding-top: 20px; */
}
</style>
