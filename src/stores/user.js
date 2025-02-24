import { defineStore } from 'pinia'
import { getUserInfo, login, logout } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    addresses: []
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    defaultAddress: (state) => state.addresses.find(addr => addr.isDefault)
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserInfo(info) {
      this.userInfo = info
      localStorage.setItem('userInfo', JSON.stringify(info))
    },

    setAddresses(addresses) {
      this.addresses = addresses
    },

    async login(credentials) {
      try {
        const { token, userInfo } = await login(credentials)
        this.setToken(token)
        this.setUserInfo(userInfo)
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    async fetchUserInfo() {
      try {
        const userInfo = await getUserInfo()
        this.setUserInfo(userInfo)
        return true
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        return false
      }
    },

    async logout() {
      try {
        await logout()
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        this.clearUserData()
      }
    },

    clearUserData() {
      this.token = ''
      this.userInfo = {}
      this.addresses = []
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
}) 