import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = false

// 获取浏览历史
export function getBrowsingHistory(params) {
  if (USE_MOCK) return mockApi.getBrowsingHistory(params)
  return request({
    url: '/history',
    method: 'get',
    params
  })
}

// 添加浏览记录
export function addBrowsingHistory(productId) {
  return request({
    url: '/history',
    method: 'post',
    data: { productId }
  })
}

// 清空浏览历史
export function clearBrowsingHistory() {
  return request({
    url: '/history',
    method: 'delete'
  })
}

// 删除单条浏览记录
export function deleteBrowsingHistory(id) {
  return request({
    url: `/history/${id}`,
    method: 'delete'
  })
} 