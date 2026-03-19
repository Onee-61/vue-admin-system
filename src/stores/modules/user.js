import { reactive } from "vue"
import { defineStore } from 'pinia'

import { login } from "@/api/login"
import { getToken } from "@/utils/auth"

export const useUserStore = defineStore('user', () => {
  const userInfo = reactive({
    token: getToken(),
    id: '',
    name: '',
    roles: [],
    permissions: [],
  })

  const userLogin = async ({ username, password }) => {
    try {
      const res = await login({ username, password })
      const info = {
        token: res.token,
        id: res.id,
        name: res.name,
        roles: res.roles,
        permissions: res.permissions,
      }
      setUserInfo(info)
    } catch (error) {
      console.error("Store处登录失败:", error)
      ElMessage.error(error.message || '登录失败')
    }
  }

  const userLogout = () => {
    removeUserInfo()
  }

  const setUserInfo = (info) => {
    userInfo.token = info.token
    userInfo.id = info.id
    userInfo.name = info.name
    userInfo.roles = info.roles
    userInfo.permissions = info.permissions
  }

  const removeUserInfo = () => {
    userInfo.token = ''
    userInfo.id = ''
    userInfo.name = ''
    userInfo.roles = []
    userInfo.permissions = []
  }

  return {
    userInfo,
    userLogin,
    userLogout,
    setUserInfo,
    removeUserInfo
  }
}) 