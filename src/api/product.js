import request from '@/utils/request'
import * as mockApi from './mock'

const USE_MOCK = false // 控制是否使用Mock数据

// 获取首页数据
export function getHomeData() {
  if (USE_MOCK) return mockApi.getHomeData()
  return request({
    url: '/home',
    method: 'get'
  })
}

// 获取商品列表
export function getProductList(params) {
  if (USE_MOCK) return mockApi.getProductList(params)
  return request({
    url: '/products',
    method: 'get',
    params
  })
}

// 获取商品详情
export function getProductDetail(id) {
  if (USE_MOCK) return mockApi.getProductDetail(id)
  return request({
    url: `/products/${id}`,
    method: 'get'
  })
}

// 获取分类列表
export function getCategoryList() {
  if (USE_MOCK) return mockApi.getCategoryList()
  return request({
    url: '/categories',
    method: 'get'
  })
}

// 获取分类详情
export function getCategoryDetail(id) {
  if (USE_MOCK) return mockApi.getCategoryDetail(id)
  return request({
    url: `/categories/${id}`,
    method: 'get'
  })
}

// 获取分类商品列表
export function getCategoryProducts(params) {
  return request({
    url: `/products`,
    method: 'get',
    params
  })
}

// 搜索商品
export function searchProducts(params) {
  return request({
    url: '/products/search',
    method: 'get',
    params
  })
}

// 获取热门商品
export function getHotProducts(params) {
  return request({
    url: '/products/hot',
    method: 'get',
    params
  })
}

// 获取新品
export function getNewProducts(params) {
  return request({
    url: '/products/new',
    method: 'get',
    params
  })
}

// 获取促销商品
export function getPromotionProducts(params) {
  return request({
    url: '/products/promotion',
    method: 'get',
    params
  })
}

// 获取商品评价
export function getProductReviews( params) {
  if (USE_MOCK) return mockApi.getProductReviews(productId, params)
  return request({
    url: `/comment/list`,
    method: 'get',
    params
  })
}

// 提交商品评价
export function submitReview(productId, data) {
  return request({
    url: `/products/${productId}/reviews`,
    method: 'post',
    data
  })
} 