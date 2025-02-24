// 生成随机ID
export function generateId() {
  return Math.floor(Math.random() * 10000)
}

// 生成随机图片URL
export function generateImage(type = 'product') {
  const productImages = [
    '/images/products/goji.svg',
    '/images/products/angelica.svg', 
    '/images/products/astragalus.svg',
    '/images/products/ginseng.svg',
    '/images/products/lingzhi.svg',
    '/images/products/rehmannia.svg'
  ]

  return productImages[Math.floor(Math.random() * productImages.length)]
}

// 生成随机价格
export function generatePrice(isOriginal = false) {
  const basePrice = isOriginal ? 100 : 200
  return +(Math.random() * (basePrice * 0.2) + basePrice).toFixed(2)
}

// 生成随机日期
export function generateDate() {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]
}

// 生成轮播图数据
export function generateBanners() {
  return [
    {
      id: 1,
      title: '精选道地药材',
      description: '严选优质产地，传承千年品质',
      image: '/images/products/ginseng.svg',
      link: '/category/1'
    },
    {
      id: 2,
      title: '养生滋补精品',
      description: '调理养生，强身健体',
      image: '/images/products/lingzhi.svg', 
      link: '/category/2'
    },
    {
      id: 3,
      title: '道地药材特惠',
      description: '品质保证，优惠促销',
      image: '/images/products/astragalus.svg',
      link: '/category/3'
    }
  ]
}

// 生成商品数据
export function generateProducts(count = 10) {
  const categories = [
    { name: '补气类', icon: 'Sunny', products: ['人参', '黄芪', '西洋参'] },
    { name: '补血类', icon: 'Sunrise', products: ['当归', '地黄', '白芍'] },
    { name: '清热类', icon: 'Ice', products: ['金银花', '板蓝根', '栀子'] },
    { name: '止咳类', icon: 'Umbrella', products: ['枇杷叶', '桔梗', '紫菀'] },
    { name: '活血类', icon: 'CircleCheck', products: ['丹参', '三七', '川芎'] }
  ]

  const origins = [
    { name: '吉林', en: 'Jilin' },
    { name: '云南', en: 'Yunnan' },
    { name: '四川', en: 'Sichuan' },
    { name: '甘肃', en: 'Gansu' },
    { name: '安徽', en: 'Anhui' }
  ]

  const products = [
    {
      name: '吉林人参',
      nameEn: 'Jilin Ginseng',
      category: categories[0],
      description: '吉林人参，品质上乘，具有补气养血、提升免疫力的功效。',
      descriptionEn: 'Premium Jilin Ginseng, effective in boosting energy and immunity.',
      origin: origins[0]
    },
    {
      name: '云南虫草',
      nameEn: 'Yunnan Cordyceps',
      category: categories[2],
      description: '云南高原冬虫夏草，补肺益肾，增强体质。',
      descriptionEn: 'Yunnan Plateau Cordyceps, strengthens lungs and kidneys.',
      origin: origins[1]
    },
    {
      name: '灵芝',
      nameEn: 'Lingzhi Mushroom',
      category: categories[2],
      description: '灵芝，具有提高免疫力、抗衰老的功效。',
      descriptionEn: 'Lingzhi Mushroom, enhances immunity and anti-aging.',
      origin: origins[2]
    }
    // ... more products
  ]

  return Array(count).fill(0).map(() => {
    const product = products[Math.floor(Math.random() * products.length)]
    return {
      id: generateId(),
      name: product.name,
      nameEn: product.nameEn,
      category: product.category,
      price: generatePrice(),
      originalPrice: generatePrice(true),
      sales: Math.floor(Math.random() * 1000),
      stock: Math.floor(Math.random() * 100) + 50,
      unit: '克',
      unitEn: 'gram',
      origin: product.origin,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3-5星
      image: generateImage('product'),
      images: Array(4).fill(0).map(() => generateImage('product')),
      description: product.description,
      descriptionEn: product.descriptionEn,
      specifications: generateProductSpecs(),
      createTime: generateDate()
    }
  })
}

// 生成商品规格
export function generateProductSpecs() {
  return {
    产地: {
      label: 'Origin',
      value: '吉林/云南/四川/甘肃/安徽'
    },
    规格: {
      label: 'Specification',
      value: '50g/100g/150g/200g'
    },
    保质期: {
      label: 'Shelf Life',
      value: '24个月'
    },
    储存方法: {
      label: 'Storage',
      value: '请置于阴凉干燥处，避免阳光直射'
    },
    使用方法: {
      label: 'Usage',
      value: '请遵医嘱使用，或请教专业中医师'
    },
    注意事项: {
      label: 'Precautions',
      value: '请勿与性质相冲突的药材同服'
    }
  }
}

// 生成分类数据
export function generateCategories() {
  const categories = [
    { name: '补气类', icon: 'Sunny', products: ['人参', '黄芪', '西洋参'] },
    { name: '补血类', icon: 'Sunrise', products: ['当归', '地黄', '白芍'] },
    { name: '清热类', icon: 'Ice', products: ['金银花', '板蓝根', '栀子'] },
    { name: '止咳类', icon: 'Umbrella', products: ['枇杷叶', '桔梗', '紫菀'] },
    { name: '活血类', icon: 'CircleCheck', products: ['丹参', '三七', '川芎'] }
  ]
  
  return categories.map((cat, index) => ({
    id: generateId(),
    name: cat.name,
    icon: cat.icon,
    image: generateImage('category'),
    sort: index,
    productCount: Math.floor(Math.random() * 100)
  }))
}

// 生成评价数据
export function generateReviews(count = 5) {
  const contents = [
    '效果很好，包装也很精致',
    '质量不错，发货速度快',
    '正品保证，值得购买',
    '服务态度很好，会继续关注',
    '物流很快，商品完好无损'
  ]
  
  return Array(count).fill(0).map(() => ({
    id: generateId(),
    userId: generateId(),
    username: `用户${generateId()}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`,
    rating: Math.floor(Math.random() * 2 + 4),
    content: contents[Math.floor(Math.random() * contents.length)],
    images: Array(Math.floor(Math.random() * 3)).fill(0).map(() => generateImage('product')),
    createTime: generateDate()
  }))
}

// 添加用户相关的数据生成函数
export function generateUser() {
  return {
    id: generateId(),
    username: `user${generateId()}`,
    nickname: `用户${generateId()}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`,
    email: `user${generateId()}@example.com`,
    phone: `1${Math.floor(Math.random() * 9 + 1)}${Array(9).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`,
    gender: Math.random() > 0.5 ? 1 : 2,
    birthday: '1990-01-01',
    createTime: generateDate(),
    lastLoginTime: generateDate()
  }
}

// 生成地址数据
export function generateAddress(count = 3) {
  const provinces = ['北京市', '上海市', '广东省', '江苏省', '浙江省']
  const cities = ['北京市', '上海市', '广州市', '深圳市', '南京市', '杭州市']
  
  return Array(count).fill(0).map((_, index) => ({
    id: generateId(),
    receiver: `收货人${generateId()}`,
    phone: `1${Math.floor(Math.random() * 9 + 1)}${Array(9).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`,
    province: provinces[Math.floor(Math.random() * provinces.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    district: '某某区',
    address: '某某街道某某号',
    isDefault: index === 0,
    createTime: generateDate()
  }))
}

// 生成订单数据
export function generateOrders(count = 5) {
  return Array(count).fill(null).map(() => ({
    id: generateId(),
    orderNo: `DD${Date.now()}${Math.floor(Math.random() * 1000)}`,
    status: ['pending', 'paid', 'shipped', 'completed', 'cancelled'][Math.floor(Math.random() * 5)],
    amount: generatePrice(),
    createTime: generateDate(),
    items: Array(Math.floor(Math.random() * 3) + 1).fill(null).map(() => ({
      id: generateId(),
      name: ['吉林红参', '云南灵芝', '宁夏枸杞', '甘肃当归'][Math.floor(Math.random() * 4)],
      image: generateImage('product'),
      price: generatePrice(),
      quantity: Number((Math.random() * 5 + 0.1).toFixed(1)), // 生成0.1-5.0斤的随机数量
      unit: '斤'
    })),
    address: generateAddress(1)[0],
    shipping: Math.random() > 0.5 ? {
      company: ['顺丰', '中通', '圆通'][Math.floor(Math.random() * 3)],
      trackingNo: `SF${Date.now()}${Math.floor(Math.random() * 1000)}`,
      status: ['待揽收', '运输中', '已送达'][Math.floor(Math.random() * 3)]
    } : null
  }))
}

// 生成购物车数据
export function generateCartItems(count = 3) {
  return generateProducts(count).map(product => ({
    id: generateId(),
    productId: product.id,
    ...product,
    quantity: Math.floor(Math.random() * 3 + 1),
    selected: true
  }))
}

// 生成收藏数据
export function generateFavorites(count = 5) {
  return generateProducts(count).map(product => ({
    id: generateId(),
    productId: product.id,
    ...product,
    createTime: generateDate()
  }))
}

// 生成搜索历史
export function generateSearchHistory(count = 10) {
  const keywords = ['人参', '灵芝', '枸杞', '当归', '西洋参', '冬虫夏草', 
    '阿胶', '三七', '红参', '石斛']
  
  return Array(count).fill(0).map((_, index) => ({
    id: generateId(),
    keyword: keywords[index],
    createTime: generateDate()
  }))
}

// 生成消息通知
export function generateNotifications(count = 5) {
  const types = ['order', 'system', 'promotion']
  const titles = {
    order: ['订单发货提醒', '订单签收提醒', '订单支付提醒'],
    system: ['系统维护通知', '账户安全提醒', '新功能上线通知'],
    promotion: ['限时特惠活动', '新品上市通知', '会员专享优惠']
  }
  
  return Array(count).fill(0).map(() => {
    const type = types[Math.floor(Math.random() * types.length)]
    return {
      id: generateId(),
      type,
      title: titles[type][Math.floor(Math.random() * titles[type].length)],
      content: '这是一条通知消息的详细内容...',
      isRead: Math.random() > 0.5,
      createTime: generateDate()
    }
  })
}

// 生成优惠券数据
export function generateCoupons(count = 5) {
  const types = ['discount', 'amount']  // discount: 折扣券, amount: 满减券
  
  return Array(count).fill(0).map(() => {
    const type = types[Math.floor(Math.random() * types.length)]
    const value = type === 'discount' ? 
      (Math.floor(Math.random() * 5) + 5) / 10 :  // 5~9折
      Math.floor(Math.random() * 5 + 1) * 10      // 10~50元
    
    return {
      id: generateId(),
      name: type === 'discount' ? `${value * 10}折优惠券` : `${value}元优惠券`,
      type,
      value,
      minAmount: Math.floor(Math.random() * 5 + 1) * 100,
      startTime: generateDate(),
      endTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      used: false,
      expired: false
    }
  })
}

// 生成用户积分记录
export function generatePointsHistory(count = 10) {
  const types = ['earn', 'spend']
  const descriptions = {
    earn: ['购物奖励', '签到奖励', '评价奖励', '活动奖励'],
    spend: ['积分兑换', '积分抵扣']
  }
  
  return Array(count).fill(0).map(() => {
    const type = types[Math.floor(Math.random() * types.length)]
    return {
      id: generateId(),
      type,
      points: type === 'earn' ? 
        Math.floor(Math.random() * 90 + 10) : 
        -Math.floor(Math.random() * 900 + 100),
      description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
      createTime: generateDate()
    }
  })
}

// 生成浏览历史
export function generateBrowsingHistory(count = 10) {
  return generateProducts(count).map(product => ({
    id: generateId(),
    productId: product.id,
    ...product,
    viewTime: generateDate()
  }))
}

// 生成商品评价统计
export function generateProductStats() {
  return {
    totalCount: Math.floor(Math.random() * 1000),
    averageRating: (Math.random() * 2 + 3).toFixed(1),
    ratingDistribution: {
      5: Math.floor(Math.random() * 100),
      4: Math.floor(Math.random() * 100),
      3: Math.floor(Math.random() * 50),
      2: Math.floor(Math.random() * 20),
      1: Math.floor(Math.random() * 10)
    },
    tags: [
      { name: '效果好', count: Math.floor(Math.random() * 100) },
      { name: '正品保证', count: Math.floor(Math.random() * 100) },
      { name: '包装精美', count: Math.floor(Math.random() * 100) },
      { name: '物流快', count: Math.floor(Math.random() * 100) },
      { name: '价格合理', count: Math.floor(Math.random() * 100) }
    ]
  }
} 