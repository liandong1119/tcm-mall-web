import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = false

// 获取积分历史
export function getPointsHistory(params) {
  if (USE_MOCK) return mockApi.getPointsHistory(params)
  return request({
    url: '/points/history',
    method: 'get',
    params
  })
}

// 获取积分余额
export function getPointsBalance() {
  return request({
    url: '/points/balance',
    method: 'get'
  })
}

// 积分兑换
export function exchangePoints(data) {
  return request({
    url: '/points/exchange',
    method: 'post',
    data
  })
}

// 获取积分商品
export function getPointsProducts(params) {
  return request({
    url: '/points/products',
    method: 'get',
    params
  })
} 