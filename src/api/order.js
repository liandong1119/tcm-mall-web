import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = true

// 创建订单
export function createOrder(data) {
  if (USE_MOCK) return mockApi.createOrder(data)
  return request({
    url: '/orders',
    method: 'post',
    data
  })
}

// 获取订单列表
export function getOrderList(params) {
  if (USE_MOCK) return mockApi.getOrderList(params)
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetail(id) {
  if (USE_MOCK) return mockApi.getOrderDetail(id)
  return request({
    url: `/orders/${id}`,
    method: 'get'
  })
}

// 取消订单
export function cancelOrder(id) {
  return request({
    url: `/orders/${id}/cancel`,
    method: 'post'
  })
}

// 确认收货
export function confirmReceive(id) {
  return request({
    url: `/orders/${id}/receive`,
    method: 'post'
  })
}

// 申请退款
export function applyRefund(id, data) {
  return request({
    url: `/orders/${id}/refund`,
    method: 'post',
    data
  })
}

// 获取退款详情
export function getRefundDetail(id) {
  return request({
    url: `/orders/${id}/refund`,
    method: 'get'
  })
}

// 取消退款申请
export function cancelRefund(id) {
  return request({
    url: `/orders/${id}/refund/cancel`,
    method: 'post'
  })
}

// 获取物流信息
export function getShippingInfo(id) {
  return request({
    url: `/orders/${id}/shipping`,
    method: 'get'
  })
}

// 获取支付信息
export function getPaymentInfo(id) {
  return request({
    url: `/orders/${id}/payment`,
    method: 'get'
  })
}

// 支付订单
export function payOrder(id, data) {
  return request({
    url: `/orders/${id}/pay`,
    method: 'post',
    data
  })
} 