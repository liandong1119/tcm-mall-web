import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = true

// 获取消息通知列表
export function getNotifications(params) {
  if (USE_MOCK) return mockApi.getNotifications(params)
  return request({
    url: '/notifications',
    method: 'get',
    params
  })
}

// 标记消息为已读
export function markNotificationRead(id) {
  if (USE_MOCK) return mockApi.markNotificationRead(id)
  return request({
    url: `/notifications/${id}/read`,
    method: 'put'
  })
}

// 标记所有消息为已读
export function markAllNotificationsRead() {
  return request({
    url: '/notifications/read-all',
    method: 'put'
  })
}

// 删除消息
export function deleteNotification(id) {
  return request({
    url: `/notifications/${id}`,
    method: 'delete'
  })
} 