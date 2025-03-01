export default {
  common: {
    systemName: '中药商城',
    search: '搜索商品',
    currency: '¥',
    more: '更多',
    edit: '编辑',
    delete: '删除',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    loading: '加载中...',
    success: '成功',
    failed: '失败',
    noData: '暂无数据',
    back: '返回',
    error: '错误',
    submit: '提交',
    reset: '重置',
    close: '关闭',
    view: '查看',
    add: '添加',
    update: '更新',
    status: '状态',
    action: '操作',
    date: '日期',
    price: '价格',
    amount: '金额',
    quantity: '数量',
    total: '总计',
    description: '描述',
    remark: '备注',
    optional: '选填',
    required: '必填',
    pleaseSelect: '请选择',
    pleaseInput: '请输入',
    tips: '提示',
    warning: '警告',
    all: '全部'
  },
  message: {
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    registerSuccess: '注册成功，请登录',
    logoutSuccess: '退出成功',
    sessionExpired: '会话已过期，请重新登录',
    networkError: '网络错误，请稍后重试',
    confirmDelete: '确认删除？',
    operationSuccess: '操作成功',
    operationFailed: '操作失败',
    registerFailed: '注册失败，请重试',
    emailCodeSent: '验证码已发送到您的邮箱',
    emailCodeFailed: '验证码发送失败',
    verificationCodeSent: '验证码已发送',
    resetPasswordSuccess: '密码重置成功',
    resetPasswordFailed: '密码重置失败',
    updateSuccess: '更新成功',
    updateFailed: '更新失败',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    saveSuccess: '保存成功',
    saveFailed: '保存失败',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    downloadSuccess: '下载成功',
    downloadFailed: '下载失败',
    fetchFailed: '获取数据失败',
    confirmLogout: '确认退出登录？',
    paySuccess: '支付成功',
    payFailed: '支付失败'
  },
  validate: {
    accountRequired: '请输入账号',
    accountLength: '账号长度应为3-20个字符',
    passwordRequired: '请输入密码',
    passwordLength: '密码长度应为6-20个字符',
    confirmPasswordRequired: '请确认密码',
    passwordNotMatch: '两次输入的密码不一致',
    emailRequired: '请输入邮箱',
    emailFormat: '请输入正确的邮箱格式',
    phoneRequired: '请输入手机号',
    phoneFormat: '请输入正确的手机号格式',
    captchaRequired: '请输入验证码',
    captchaLength: '验证码长度应为4位',
    nicknameRequired: '请输入昵称',
    nicknameLength: '昵称长度应为2-20个字符',
    agreementRequired: '请阅读并同意用户服务协议',
    emailCodeRequired: '请输入邮箱验证码',
    emailCodeLength: '邮箱验证码长度必须为6位',
    oldPasswordRequired: '请输入原密码',
    newPasswordRequired: '请输入新密码',
    confirmPasswordRequired: '请确认新密码',
    addressRequired: '请输入地址',
    receiverRequired: '请输入收货人',
    receiverPhoneRequired: '请输入收货人手机号',
    regionRequired: '请选择地区',
    detailAddressRequired: '请输入详细地址',
    refundReasonRequired: '请输入退款原因',
    refundReasonLength: '退款原因长度应在10-200个字符之间'
  },
  home: {
    title: '首页',
    hotProducts: '热门商品',
    newProducts: '新品上市',
    promotions: '特价促销',
    categories: '商品分类'
  },
  category: {
    title: '商品分类',
    all: '全部分类'
  },
  product: {
    title: '商品详情',
    price: '￥{price}',
    stock: '库存：{count}',
    quantity: '数量',
    description: '商品描述',
    addToCart: '加入购物车',
    buyNow: '立即购买',
    originalPrice: '原价：￥{price}',
    reviews: '商品评价',
    relatedProducts: '相关商品',
    specification: '规格参数',
    review: '商品评价',
    category: '商品分类',
    brand: '品牌',
    origin: '产地',
    weight: '重量',
    unit: '单位',
    inventory: '库存',
    sales: '销量',
    rating: '评分',
    ratingCount: '评价数',
    specifications: '规格参数',
    packageList: '包装清单',
    serviceGuarantee: '服务保障',
    shippingInfo: '配送说明',
    recommend: '推荐商品',
    viewMore: '查看更多',
    addToFavorites: '加入收藏',
    removeFromFavorites: '取消收藏',
    outOfStock: '暂时缺货',
    preOrder: '预订',
    discount: '折扣',
    priceRange: '价格区间',
    defaultBrand: '中药材商城',
    defaultOrigin: '中国',
    defaultStock: '999',
    defaultWeight: '1kg',
    selectSpec: '请选择规格',
    specWeight: '重量',
    specPackage: '包装',
    specGrade: '等级',
    specForm: '剂型',
    noSpecSelected: '请选择商品规格',
    sortBy: {
      default: '默认排序',
      sales: '销量优先',
      price: '价格排序',
      rating: '评分排序',
      newest: '最新上架'
    },
    image: '商品图片',
    name: '商品名称',
    subtotal: '小计',
    detail: {
      functionTitle: '功能与主治',
      quantity: '购买数量',
      unit: '斤',
      addToCart: '加入购物车',
      buyNow: '立即购买',
      detailTab: '商品详情',
      specsTab: '规格参数',
      reviewsTab: '买家评价',
      efficacy: '药效说明',
      precautions: '注意事项',
      merchantReply: '商家回复'
    },
    message: {
      addToCartSuccess: '已添加到购物车',
      favoriteSuccess: '收藏成功',
      unfavoriteSuccess: '已取消收藏'
    }
  },
  cart: {
    title: '购物车',
    empty: '购物车是空的',
    addToCart: '加入购物车',
    addSuccess: '已加入购物车',
    checkout: '去结算',
    selectAll: '全选',
    deleteSelected: '删除选中',
    clearCart: '清空购物车',
    product: '商品',
    price: '单价',
    quantity: '数量',
    subtotal: '小计',
    total: '合计',
    items: '件商品',
    selected: '已选',
    shipping: '运费',
    free: '免运费',
    clearConfirm: '确定要清空购物车吗？',
    deleteSuccess: '商品已删除',
    clearSuccess: '购物车已清空',
    updateSuccess: '数量已更新'
  },
  checkout: {
    title: '确认订单',
    shippingAddress: '收货地址',
    addAddress: '添加地址',
    defaultAddress: '默认地址',
    orderSummary: '订单摘要',
    orderItems: '订单商品',
    orderRemark: '订单备注',
    remarkPlaceholder: '请输入订单备注信息（选填）',
    payment: '支付方式',
    total: '合计',
    submitOrder: '提交订单',
    selectAddress: '请选择收货地址',
    createSuccess: '订单创建成功'
  },
  user: {
    login: '登录',
    register: '注册账号',
    logout: '退出登录',
    profile: '个人中心',
    orders: '我的订单',
    favorites: '我的收藏',
    addresses: '收货地址',
    accountPlaceholder: '请输入用户名/手机号/邮箱',
    passwordPlaceholder: '请输入密码',
    confirmPasswordPlaceholder: '请确认密码',
    captchaPlaceholder: '请输入验证码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    noAccount: '还没有账号？',
    hasAccount: '已有账号？',
    settings: '账号设置',
    registerTip: '欢迎加入中药商城，请填写以下信息完成注册',
    welcomeJoin: '欢迎加入中药商城',
    registerDesc: '在这里，您可以找到最优质的中药材和最专业的服务',
    usernamePlaceholder: '请输入用户名',
    phonePlaceholder: '请输入手机号',
    emailPlaceholder: '请输入邮箱',
    agreement: '我已阅读并同意',
    agreementText: '《用户服务协议》',
    login: '立即登录',
    emailCodePlaceholder: '请输入邮箱验证码',
    sendEmailCode: '发送验证码',
    resetPassword: '重置密码',
    resetPasswordDesc: '重置您的账号密码',
    resetPasswordTip: '请输入您的邮箱以重置密码',
    newPasswordPlaceholder: '请输入新密码',
    oldPasswordPlaceholder: '请输入原密码',
    verificationCodePlaceholder: '请输入验证码',
    sendCode: '发送验证码',
    backToLogin: '返回登录',
    changePassword: '修改密码',
    changeEmail: '修改邮箱',
    changePhone: '修改手机号',
    personalInfo: '个人信息',
    nickname: '昵称',
    gender: '性别',
    birthday: '生日',
    avatar: '头像',
    male: '男',
    female: '女',
    secret: '保密',
    loginTip: '欢迎回来，请登录您的账号',
    loginWith: '其他登录方式',
    registerNow: '立即注册',
    quickLogin: '快捷登录',
    accountLogin: '账号登录',
    scanLogin: '扫码登录',
    scanTip: '请使用手机扫描二维码登录',
    bindPhone: '绑定手机',
    bindEmail: '绑定邮箱',
    accountSecurity: '账号安全',
    loginRecord: '登录记录',
    lastLogin: '上次登录',
    modifyNickname: '修改昵称',
    currentPassword: '当前密码',
    newPassword: '新密码',
    confirmNewPassword: '确认新密码',
    passwordStrength: '密码强度',
    weak: '弱',
    medium: '中',
    strong: '强',
    verifyIdentity: '身份验证',
    verifyEmail: '验证邮箱',
    verifyPhone: '验证手机号',
    welcomeBack: '欢迎回来',
    loginDesc: '登录您的账号以继续',
    center: '个人中心',
    password: '修改密码',
    username: '用户名',
    email: '邮箱',
    phone: '手机号码',
    usernameRequired: '请输入用户名',
    usernameLength: '用户名长度应为3-20个字符',
    nicknameRequired: '请输入昵称',
    nicknameLength: '昵称长度应为2-20个字符',
    emailRequired: '请输入邮箱',
    emailInvalid: '请输入正确的邮箱格式',
    phoneRequired: '请输入手机号码',
    phoneInvalid: '请输入正确的手机号码格式',
    oldPassword: '原密码',
    newPassword: '新密码',
    confirmPassword: '确认密码',
    passwordRequired: '请输入密码',
    oldPasswordRequired: '请输入原密码',
    newPasswordRequired: '请输入新密码',
    confirmPasswordRequired: '请确认新密码',
    passwordLength: '密码长度应为6-20个字符',
    passwordMismatch: '两次输入的密码不一致',
    changePassword: '修改密码',
    address: '收货地址',
    addressList: '地址列表',
    addAddress: '添加地址',
    editAddress: '编辑地址',
    deleteAddress: '删除地址',
    setDefaultAddress: '设为默认地址',
    defaultAddress: '默认地址',
    name: '收货人',
    region: '所在地区',
    detailAddress: '详细地址',
    zipCode: '邮政编码',
    nameRequired: '请输入收货人姓名',
    regionRequired: '请选择所在地区',
    addressRequired: '请输入详细地址',
    phoneRequired: '请输入联系电话',
    login: '登录',
    register: '注册',
    forgotPassword: '忘记密码',
    rememberMe: '记住我',
    noAccount: '还没有账号？',
    hasAccount: '已有账号？',
    registerNow: '立即注册',
    loginNow: '立即登录',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    registerSuccess: '注册成功',
    registerFailed: '注册失败',
    logoutSuccess: '退出成功',
    updateSuccess: '更新成功',
    updateFailed: '更新失败',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败'
  },
  address: {
    addAddress: '添加地址',
    editAddress: '编辑地址',
    deleteAddress: '删除地址',
    setDefault: '设为默认',
    defaultAddress: '默认地址',
    receiver: '收货人',
    receiverPhone: '收货人电话',
    region: '所在地区',
    detailAddress: '详细地址',
    addressTag: '地址标签',
    home: '家',
    company: '公司',
    school: '学校',
    other: '其他'
  },
  order: {
    title: '我的订单',
    orderNo: '订单编号',
    totalAmount: '订单总额',
    noOrders: '暂无订单',
    pay: '付款',
    cancel: '取消订单',
    confirmReceive: '确认收货',
    viewShipping: '查看物流',
    applyRefund: '申请退款',
    detail: '订单详情',
    carrier: '快递公司',
    trackingNo: '快递单号',
    shippingInfo: '物流信息',
    refundReason: '退款原因',
    status: {
      all: '全部',
      pending: '待付款',
      paid: '已付款',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消',
      refunding: '退款中',
      refunded: '已退款'
    },
    info: '订单信息',
    number: '订单编号',
    createTime: '创建时间',
    payTime: '支付时间',
    shipTime: '发货时间',
    shipping: '收货信息',
    recipient: '收货人',
    phone: '联系电话',
    address: '收货地址',
    tracking: '物流单号',
    items: '商品信息',
    subtotal: '商品小计',
    discount: '优惠金额',
    total: '订单总额',
    confirm: '确认收货',
    refund: '申请退款',
    confirmCancel: '确认要取消该订单吗？',
    cancelSuccess: '订单已取消',
    cancelFailed: '取消订单失败',
    confirmReceipt: '确认已收到商品吗？',
    confirmSuccess: '确认收货成功',
    confirmFailed: '确认收货失败',
    refundApplication: '退款申请',
    enterRefundReason: '请输入退款原因',
    refundReasonPlaceholder: '请输入您的退款原因',
    refundSuccess: '退款申请已提交',
    refundFailed: '退款申请失败'
  },
  payment: {
    method: {
      alipay: '支付宝',
      wechat: '微信支付',
      unionpay: '银联支付'
    },
    amount: '支付金额',
    status: '支付状态',
    time: '支付时间',
    channel: '支付渠道',
    orderInfo: '订单信息',
    payNow: '立即支付',
    success: '支付成功',
    failed: '支付失败',
    processing: '处理中',
    timeout: '支付超时',
    cancel: '取消支付'
  },
  footer: {
    freeShipping: '免费配送',
    freeShippingDesc: '满99元包邮',
    quality: '品质保证',
    qualityDesc: '正品保障',
    service: '售后无忧',
    serviceDesc: '7天无理由退货',
    return: '轻松退货',
    returnDesc: '极速退款',
    aboutUs: '关于我们',
    aboutCompany: '公司简介',
    contactUs: '联系我们',
    joinUs: '加入我们',
    help: '帮助中心',
    paymentGuide: '支付指南',
    shippingGuide: '配送指南',
    returnGuide: '退货指南',
    feedback: '意见反馈',
    complaint: '投诉建议',
    cooperation: '商务合作',
    followUs: '关注我们',
    wechat: '微信',
    weibo: '微博',
    app: '下载APP',
    customerService: '客户服务',
    serviceTime: '服务时间：周一至周日 9:00-18:00',
    copyright: '© 2024 中药材商城 版权所有',
    icp: '京ICP备XXXXXXXX号'
  },
  review: {
    writeReview: '写评价',
    myReviews: '我的评价',
    productReview: '商品评价',
    reviewPlaceholder: '请分享您的使用体验',
    uploadPhotos: '上传图片',
    anonymous: '匿名评价',
    rating: {
      terrible: '非常差',
      bad: '差',
      normal: '一般',
      good: '好',
      excellent: '非常好'
    },
    tags: {
      quality: '质量好',
      authentic: '正品保障',
      packaging: '包装完好',
      delivery: '物流快',
      service: '服务好',
      price: '性价比高'
    }
  },
  search: {
    placeholder: '搜索商品名称、功效、品牌等',
    hot: '热门搜索',
    history: '搜索历史',
    clear: '清空历史',
    result: '搜索结果',
    noResult: '未找到相关商品',
    suggestion: '搜索建议',
    filter: '筛选',
    sortBy: '排序方式',
    button: '搜索'
  },
  profile: {
    myProfile: '我的主页',
    accountBalance: '账户余额',
    points: '积分',
    coupons: '优惠券',
    messages: '消息中心',
    settings: '设置',
    help: '帮助中心',
    about: '关于我们',
    logout: '退出登录',
    memberLevel: '会员等级',
    memberBenefits: '会员权益',
    pointsRule: '积分规则',
    pointsHistory: '积分明细',
    pointsExchange: '积分兑换',
    basicInfo: '基本信息',
    changePassword: '修改密码',
    addresses: '收货地址',
    oldPassword: '原密码',
    newPassword: '新密码',
    confirmPassword: '确认密码',
    addAddress: '添加地址',
    editAddress: '编辑地址',
    noAddress: '暂无收货地址',
    defaultAddress: '默认地址',
    setDefault: '设为默认',
    setAsDefault: '设为默认地址'
  },
  guide: {
    title: '新手购物指南',
    registerLogin: {
      title: '注册/登录',
      desc: '首次购物需要注册账号，已有账号可直接登录。注册时请填写真实信息，方便接收订单和物流信息。'
    },
    browseProducts: {
      title: '浏览商品',
      desc: '您可以通过以下方式浏览商品：',
      home: '首页推荐：精选热门商品和新品',
      category: '分类浏览：根据功效和类别查找商品',
      search: '搜索：输入关键词快速找到心仪商品'
    },
    shopping: {
      title: '选购商品',
      desc: '在商品详情页，您可以：',
      details: '查看商品图片、价格、功效说明',
      quantity: '选择购买数量',
      addToCart: '加入购物车或立即购买'
    },
    cart: {
      title: '购物车',
      desc: '购物车中可以：',
      modify: '修改商品数量',
      delete: '删除不需要的商品',
      select: '选择要结算的商品'
    },
    order: {
      title: '提交订单',
      desc: '结算时需要：',
      address: '选择或添加收货地址',
      confirm: '确认订单信息',
      payment: '选择支付方式',
      submit: '提交订单并完成支付'
    },
    notice: {
      title: '注意事项',
      desc: '购买中药材请注意：',
      instruction: '仔细阅读商品说明和功效',
      dosage: '按照推荐剂量使用',
      consult: '如有特殊情况请咨询专业医师'
    },
    startShopping: '开始购物',
    browseAll: '浏览商品'
  }
} 