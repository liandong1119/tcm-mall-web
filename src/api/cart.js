import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = false

// 获取购物车列表
export function getCartList(queryPage) {
  if (USE_MOCK) return mockApi.getCartList()
  return request({
    url: '/cart',
    params:queryPage,
    method: 'get'
  })
}

// 添加到购物车
export function addToCart(data) {
  if (USE_MOCK) return mockApi.addToCart(data)
  return request({
    url: '/cart',
    method: 'post',
    data
  })
}

// 更新购物车商品
export function updateCartItem(id, data) {
  if (USE_MOCK) return mockApi.updateCartItem(id, data)
  return request({
    url: `/cart/${id}`,
    method: 'put',
    data
  })
}

// 删除购物车商品
export function removeCartItem(id) {
  return request({
    url: `/cart/${id}`,
    method: 'delete'
  })
} 