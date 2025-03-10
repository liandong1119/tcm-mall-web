import request from '@/utils/request'

/**
 * 商家注册
 * @param {Object} data - 注册信息
 * @param {string} data.email - 邮箱
 * @param {string} data.phone - 手机号
 * @param {string} data.verifyCode - 验证码
 * @param {string} data.shopName - 店铺名称
 * @returns {Promise}
 */
export function registerMerchant(data) {
  return request({
    url: '/merchant/register',
    method: 'post',
    data
  })
}

/**
 * 获取商家注册状态
 * @returns {Promise}
 */
export function getMerchantRegisterStatus() {
  return request({
    url: '/merchant/register/status',
    method: 'get'
  })
}

/**
 * 获取商家入驻协议
 * @returns {Promise}
 */
export function getMerchantAgreement() {
  return request({
    url: '/merchant/agreement',
    method: 'get'
  })
}

/**
 * 上传商家资质证明
 * @param {FormData} data - 包含文件的FormData对象
 * @returns {Promise}
 */
export function uploadMerchantQualification(data) {
  return request({
    url: '/merchant/qualification/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 提交商家补充信息
 * @param {Object} data - 补充信息
 * @returns {Promise}
 */
export function submitMerchantInfo(data) {
  return request({
    url: '/merchant/info',
    method: 'post',
    data
  })
} 