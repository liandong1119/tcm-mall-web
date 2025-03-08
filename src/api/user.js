import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = false // 控制是否使用Mock数据

// 发送邮箱验证码
export function sendEmailCode(email) {
  if (USE_MOCK) {
    // 模拟发送邮箱验证码
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  }
  return request({
    url: '/user/email/code',
    method: 'post',
    data: { email }
  })
}

// 用户登录
export function login(data) {
  if (USE_MOCK) return mockApi.login(data)
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 用户注册
export function register(data) {
  if (USE_MOCK) return mockApi.register(data)
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  if (USE_MOCK) return mockApi.getUserInfo()
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  if (USE_MOCK) return mockApi.updateUserInfo(data)
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取地址列表
export function getAddressList(data) {
  if (USE_MOCK) return mockApi.getAddressList()
  return request({
    url: '/address',
    params:data,
    method: 'get'
  })
}

// 添加地址
export function addAddress(data) {
  if (USE_MOCK) return mockApi.addAddress(data)
  return request({
    url: '/address',
    method: 'post',
    data
  })
}

// 更新地址
export function updateAddress(id, data) {
  if (USE_MOCK) return mockApi.updateAddress(id, data)
  return request({
    url: `/address/${id}`,
    method: 'put',
    data
  })
}

// 删除收货地址
export function deleteAddress(id) {
  return request({
    url: `/user/address/${id}`,
    method: 'delete'
  })
}

// 设置默认收货地址
export function setDefaultAddress(id) {
  return request({
    url: `/address/${id}/default`,
    method: 'put'
  })
}

// 获取收藏列表
export function getFavoriteList(params) {
  return request({
    url: '/user/favorite',
    method: 'get',
    params
  })
}

// 添加收藏
export function addFavorite(productId) {
  return request({
    url: '/user/favorite',
    method: 'post',
    data: { productId }
  })
}

// 取消收藏
export function removeFavorite(productId) {
  return request({
    url: `/user/favorite/${productId}`,
    method: 'delete'
  })
}



/**
 * 获取一个图片验证码的信息
 * @returns {*}
 */
export function getPictureVerifyCode(){
  return request({
    url: '/verifyCode/photo',
    method: 'get'
  })
}