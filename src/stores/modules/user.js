import { reactive } from "vue"
import { defineStore } from 'pinia'

import { login, getInfo } from "@/api/login"
import { getToken, setToken, removeToken } from "@/utils/auth"

export const useUserStore = defineStore('user', () => {
  const userInfo = reactive({
    token: getToken(),
    id: '',
    username: '',
    nickname: '',
    avatar: '',
    roles: [],
    permissions: [],
  })

  const userLogin = async ({ username, password }) => {
    const res = await login({ username, password })
    userInfo.token = res.token
    setToken(res.token)
    await setUserInfo()
  }

  const userLogout = () => {
    removeUserInfo()
  }

  const setUserInfo = async () => {
    const res = await getInfo()
    const user = res.user

    userInfo.id = user.userId
    userInfo.username = user.userName
    userInfo.nickname = user.nickName
    userInfo.avatar = user.avatar || ''

    userInfo.roles = res.roles
    userInfo.permissions = res.permissions
  }

  const removeUserInfo = () => {
    removeToken()
    userInfo.token = ''
    userInfo.id = ''
    userInfo.username = ''
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