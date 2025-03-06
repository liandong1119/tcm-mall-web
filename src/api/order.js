import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = false

// 创建订单
export function createOrder(data) {
  if (USE_MOCK) return mockApi.createOrder(data)
  return request({
    url: '/order/create',
    method: 'post',
    data
  })
}

// 获取订单列表
export function getOrderList(params) {
  if (USE_MOCK) return mockApi.getOrderList(params)
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetail(params) {
  if (USE_MOCK) return mockApi.getOrderDetail(id)
  return request({
    url: `/order`,
    method: 'get',
    params
  })
}

// 取消订单
export function cancelOrder(id) {
  return request({
    url: `/order/${id}/cancel`,
    method: 'post'
  })
}

// 确认收货
export function confirmReceive(id) {
  return request({
    url: `/order/${id}/confirm`,
    method: 'post'
  })
}

// 申请退款
export function applyRefund(id, data) {
  return request({
    url: `/order/${id}/refund`,
    method: 'post',
    data
  })
}

// 获取退款详情
export function getRefundDetail(id) {
  return request({
    url: `/order/${id}/refund`,
    method: 'get'
  })
}

// 取消退款申请
export function cancelRefund(id) {
  return request({
    url: `/order/${id}/refund/cancel`,
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
    url: `/order/${id}/payment`,
    method: 'get'
  })
}

// 支付订单
export function payOrder(id, data) {
  return request({
    url: `/order/${id}/pay`,
    method: 'post',
    data
  })
}

// 提交订单评价
export function submitOrderReview(data) {
  return request({
    url: '/order/review',
    method: 'post',
    data
  })
}

// 获取订单评价状态
export function getOrderReviewStatus(orderId) {
  return request({
    url: `/order/${orderId}/review/status`,
    method: 'get'
  })
}

// 上传评价图片
export function uploadReviewImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/upload/review',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}