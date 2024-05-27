
import { defineStore } from 'pinia'
import { CookiesManager } from '@/utils/cookie'

const UserInfoKey = 'User-Info'

export function SetUserInfo(userInfo: any) {
  return CookiesManager.setObj(UserInfoKey, userInfo)
}

export function GetUserInfo() {
  return CookiesManager.getObj(UserInfoKey)
}

export function RemoveUserInfo() {
  return CookiesManager.remove(UserInfoKey)
}

// 定义用户信息的类型
export interface UserInfo {
  username: string
  nickname: string
  roles: string[] // 假设角色是一个字符串数组
  avatar: string
  introduction: string
  menu: any[] // 假设菜单是一个数组
}

// 创建 Pinia 存储
export const useInfoStore = defineStore('userInfo', {
  state: (): UserInfo => ({
    username: '',
    nickname: '',
    roles: [],
    avatar: '',
    introduction: '',
    menu: [],
  }),
  getters: {
      // 获取用户角色列表
      getUserRoles(state) {
        return state.roles;
      },
      //获取用户菜单
      getUserMenu(state) {
        return state.menu;
      },
          // 获取用户信息
    getUserInfo(state) {
      var userInfo: UserInfo = {
        username: state.username,
        nickname: state.nickname,
        roles: state.roles,
        avatar: state.avatar,
        introduction: state.introduction,
        menu: state.menu
      }
      return userInfo;
    }
  },
  actions: {
    // 清空用户信息
    clearUserInfo() {
      this.username = ''
      this.nickname = ''
      this.roles = []
      this.avatar = ''
      this.introduction = ''
      this.menu = []
    },
    // 存储用户信息
    saveUserInfo(userInfo: UserInfo) {
      this.username = userInfo.username;
      this.nickname = userInfo.nickname;
      this.roles = userInfo.roles;
      this.avatar = userInfo.avatar;
      this.introduction = userInfo.introduction;
      this.menu = userInfo.menu;
    },
  }
})
