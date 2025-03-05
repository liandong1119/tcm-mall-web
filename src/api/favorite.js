import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = false

// 获取收藏列表
export function getFavoriteList(params) {
  if (USE_MOCK) return mockApi.getFavoriteList(params)
  return request({
    url: '/favorite',
    method: 'get',
    params
  })
}

// 添加收藏
export function addToFavorite(productId) {
  if (USE_MOCK) return mockApi.addToFavorite(productId)
  return request({
    url: '/favorite',
    method: 'post',
    data: { productId }
  })
}

// 取消收藏
export function removeFavorite(productId) {
  return request({
    url: `/favorite/${productId}`,
    method: 'delete'
  })
} 