import { 
  generateProducts, 
  generateBanners, 
  generateCategories,
  generateReviews,
  generateUser,
  generateAddress,
  generateOrders,
  generateCartItems,
  generateFavorites,
  generateSearchHistory,
  generateNotifications,
  generateCoupons,
  generatePointsHistory,
  generateBrowsingHistory,
  generateProductStats,
  generateProductSpecs
} from '@/utils/mockData'

// 模拟网络延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 获取首页数据
export async function getHomeData() {
  await delay()
  return {
    banners: generateBanners(),
    hotProducts: generateProducts(8),
    newProducts: generateProducts(8)
  }
}

// 获取热门商品
export async function getHotProducts(params = {}) {
  await delay()
  const { limit = 10 } = params
  return generateProducts(limit)
}

// 获取新品
export async function getNewProducts(params = {}) {
  await delay()
  const { limit = 10 } = params
  return generateProducts(limit)
}

// 商品相关接口
export async function getProductList(params = {}) {
  await delay()
  const { page = 1, pageSize = 10, category, keyword } = params
  return {
    total: 100,
    page,
    pageSize,
    list: generateProducts(pageSize)
  }
}

export async function getProductDetail(id) {
  await delay()
  return {
    ...generateProducts(1)[0],
    id,
    reviews: generateReviews(3),
    relatedProducts: generateProducts(4)
  }
}

// 分类相关接口
export async function getCategoryList() {
  await delay()
  return generateCategories()
}

export async function getCategoryDetail(id) {
  await delay()
  const category = generateCategories().find(cat => cat.id === id) || generateCategories()[0]
  return {
    ...category,
    products: generateProducts(8)
  }
}

// 评价相关接口
export async function getProductReviews(productId, params = {}) {
  await delay()
  const { page = 1, pageSize = 10 } = params
  return {
    total: 100,
    page,
    pageSize,
    list: generateReviews(pageSize)
  }
}

// 用户相关接口
export async function login(data) {
  await delay()
  const user = generateUser()
  return {
    token: `mock_token_${Date.now()}`,
    userInfo: user
  }
}

export async function register(data) {
  await delay()
  const user = generateUser()
  return {
    token: `mock_token_${Date.now()}`,
    userInfo: user
  }
}

export async function getUserInfo() {
  await delay()
  return generateUser()
}

export async function updateUserInfo(data) {
  await delay()
  return {
    ...generateUser(),
    ...data
  }
}

// 地址相关接口
export async function getAddressList() {
  await delay()
  return generateAddress(3)
}

export async function addAddress(data) {
  await delay()
  return {
    id: generateId(),
    ...data,
    createTime: generateDate()
  }
}

export async function updateAddress(id, data) {
  await delay()
  return {
    id,
    ...data,
    updateTime: generateDate()
  }
}

// 订单相关接口
export async function getOrderList(params = {}) {
  await delay()
  const { page = 1, pageSize = 10, status } = params
  return {
    total: 100,
    page,
    pageSize,
    list: generateOrders(pageSize)
  }
}

export async function getOrderDetail(id) {
  await delay()
  return generateOrders(1)[0]
}

export async function createOrder(data) {
  await delay()
  return {
    ...generateOrders(1)[0],
    ...data
  }
}

// 购物车相关接口
export async function getCartList() {
  await delay()
  return generateCartItems()
}

export async function addToCart(data) {
  await delay()
  return {
    id: generateId(),
    ...data,
    createTime: generateDate()
  }
}

export async function updateCartItem(id, data) {
  await delay()
  return {
    id,
    ...data,
    updateTime: generateDate()
  }
}

// 收藏相关接口
export async function getFavoriteList(params = {}) {
  await delay()
  const { page = 1, pageSize = 10 } = params
  return {
    total: 100,
    page,
    pageSize,
    list: generateFavorites(pageSize)
  }
}

export async function addToFavorite(productId) {
  await delay()
  return {
    id: generateId(),
    productId,
    createTime: generateDate()
  }
}

// 搜索历史相关接口
export async function getSearchHistory() {
  await delay()
  return generateSearchHistory()
}

export async function clearSearchHistory() {
  await delay()
  return { success: true }
}

// 消息通知相关接口
export async function getNotifications(params = {}) {
  await delay()
  const { page = 1, pageSize = 10, type } = params
  const notifications = generateNotifications(pageSize)
  return {
    total: 100,
    page,
    pageSize,
    list: type ? notifications.filter(n => n.type === type) : notifications
  }
}

export async function markNotificationRead(id) {
  await delay()
  return { success: true }
}

// 优惠券相关接口
export async function getCouponList(params = {}) {
  await delay()
  const { page = 1, pageSize = 10, status } = params
  const coupons = generateCoupons(pageSize)
  return {
    total: 100,
    page,
    pageSize,
    list: status ? coupons.filter(c => {
      if (status === 'used') return c.used
      if (status === 'expired') return c.expired
      return !c.used && !c.expired
    }) : coupons
  }
}

export async function receiveCoupon(id) {
  await delay()
  return {
    success: true,
    coupon: generateCoupons(1)[0]
  }
}

// 积分相关接口
export async function getPointsHistory(params = {}) {
  await delay()
  const { page = 1, pageSize = 10, type } = params
  const history = generatePointsHistory(pageSize)
  return {
    total: 100,
    page,
    pageSize,
    list: type ? history.filter(h => h.type === type) : history
  }
}

// 浏览历史相关接口
export async function getBrowsingHistory(params = {}) {
  await delay()
  const { page = 1, pageSize = 10 } = params
  return {
    total: 100,
    page,
    pageSize,
    list: generateBrowsingHistory(pageSize)
  }
}

// 商品评价统计接口
export async function getProductStats(productId) {
  await delay()
  return generateProductStats()
}

// 商品规格相关接口
export async function getProductSpecs(productId) {
  await delay()
  return generateProductSpecs()
} 