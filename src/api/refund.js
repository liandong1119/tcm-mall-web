import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = false


/**
 * 用户获取自己的退款列表
 * @param params
 * @returns
 */
export function getUserRefunds(params) {
    if (USE_MOCK) return mockApi.getOrderList(params)
    return request({
        url: '/order/refund/list',
        method: 'get',
        params
    })
}

/**
 * 用户申请退款操作
 * @param refundRequest 退款的参数：orderId，orderCode、reason、images
 * @returns {*}
 */
// 申请退款
export function userApplyRefund(refundRequest) {
    return request({
        url: `/order/refund`,
        method: 'post',
        data: refundRequest
    })
}


/**
 * 获取获取一个退款详情
 * @param id 退款的id
 * @returns {*}
 */
export function getRefundDetail(id) {
    return request({
        url: `/order/refund/detail/${id}`,
        method: 'get'
    })
}

/**
 * 用户取消一个退款申请
 * @param id 退款的id
 * @returns {*}
 */
export function cancelRefund(id) {
    return request({
        url: `/order/${id}/refund/cancel`,
        method: 'put'
    })
}