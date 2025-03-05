import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = false

// 获取优惠券列表
export function getCouponList(params) {
  if (USE_MOCK) return mockApi.getCouponList(params)
  return request({
    url: '/coupons',
    method: 'get',
    params
  })
}

// 领取优惠券
export function receiveCoupon(id) {
  if (USE_MOCK) return mockApi.receiveCoupon(id)
  return request({
    url: `/coupons/${id}/receive`,
    method: 'post'
  })
}

// 获取可用优惠券
export function getAvailableCoupons(amount) {
  return request({
    url: '/coupons/available',
    method: 'get',
    params: { amount }
  })
}

// 使用优惠券
export function useCoupon(id) {
  return request({
    url: `/coupons/${id}/use`,
    method: 'post'
  })
} 