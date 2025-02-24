# 中药商城前端项目 (TCM Mall Web)

基于 Vue 3 + Vite 开发的中药商城前端项目。

## 技术栈

- Vue 3
- Vite
- Vue Router
- Pinia
- Element Plus
- Vue I18n
- Axios

## 项目设置

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 生产环境构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 环境变量配置

在项目根目录创建 `.env` 文件：

```env
VITE_APP_TITLE=中药商城
VITE_APP_TITLE_EN=TCM Mall
VITE_APP_API_BASE_URL=http://localhost:3000/api
VITE_APP_UPLOAD_URL=http://localhost:3000/api/upload
```

## API 接口文档

### 用户相关接口

#### 1. 用户登录
- 请求方式：POST
- 接口路径：`/user/login`
- 请求参数：
```json
{
  "username": "string",
  "password": "string",
  "remember": "boolean"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "token": "string",
    "userInfo": {
      "id": "string",
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "phone": "string",
      "email": "string",
      "points": "number",
      "level": "number",
      "status": "number",
      "createTime": "string",
      "lastLoginTime": "string"
    }
  },
  "message": "success"
}
```

#### 2. 用户注册
- 请求方式：POST
- 接口路径：`/user/register`
- 请求参数：
```json
{
  "username": "string",
  "password": "string",
  "confirmPassword": "string",
  "phone": "string",
  "email": "string",
  "verifyCode": "string"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "id": "string",
    "username": "string",
    "token": "string"
  },
  "message": "success"
}
```

#### 3. 获取用户信息
- 请求方式：GET
- 接口路径：`/user/info`
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "id": "string",
    "username": "string",
    "nickname": "string",
    "avatar": "string",
    "phone": "string",
    "email": "string",
    "points": "number",
    "level": "number",
    "status": "number",
    "addresses": [
      {
        "id": "string",
        "name": "string",
        "phone": "string",
        "province": "string",
        "city": "string",
        "district": "string",
        "address": "string",
        "isDefault": "boolean"
      }
    ],
    "statistics": {
      "orderCount": "number",
      "favoriteCount": "number",
      "couponCount": "number",
      "points": "number"
    }
  },
  "message": "success"
}
```

#### 4. 更新用户信息
- 请求方式：PUT
- 接口路径：`/user/info`
- 请求参数：
```json
{
  "nickname": "string",
  "avatar": "string",
  "phone": "string",
  "email": "string"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": true,
  "message": "success"
}
```

### 商品相关接口

#### 1. 获取商品列表
- 请求方式：GET
- 接口路径：`/products`
- 请求参数：
```json
{
  "page": "number",
  "pageSize": "number",
  "categoryId": "string?",
  "keyword": "string?",
  "sort": "string?",
  "order": "string?",
  "minPrice": "number?",
  "maxPrice": "number?",
  "tags": "array?",
  "origin": "string?",
  "season": "string?"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "total": "number",
    "list": [
      {
        "id": "string",
        "name": "string",
        "price": "number",
        "originalPrice": "number",
        "image": "string",
        "images": ["string"],
        "description": "string",
        "stock": "number",
        "unit": "string",
        "minPurchase": "number",
        "maxPurchase": "number",
        "sales": "number",
        "rating": "number",
        "category": {
          "id": "string",
          "name": "string",
          "parentId": "string"
        },
        "tags": ["string"],
        "origin": "string",
        "season": "string",
        "specifications": [
          {
            "id": "string",
            "name": "string",
            "value": "string"
          }
        ],
        "status": "number",
        "createTime": "string",
        "updateTime": "string"
      }
    ]
  },
  "message": "success"
}
```

#### 2. 获取商品详情
- 请求方式：GET
- 接口路径：`/products/:id`
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "id": "string",
    "name": "string",
    "price": "number",
    "originalPrice": "number",
    "images": ["string"],
    "description": "string",
    "details": "string",
    "stock": "number",
    "unit": "string",
    "minPurchase": "number",
    "maxPurchase": "number",
    "sales": "number",
    "rating": "number",
    "category": {
      "id": "string",
      "name": "string",
      "parentId": "string"
    },
    "tags": ["string"],
    "origin": "string",
    "season": "string",
    "specifications": [
      {
        "id": "string",
        "name": "string",
        "value": "string"
      }
    ],
    "usage": {
      "dosage": "string",
      "method": "string",
      "precautions": "string",
      "storage": "string"
    },
    "reviews": {
      "total": "number",
      "rating": "number",
      "list": [
        {
          "id": "string",
          "userId": "string",
          "username": "string",
          "avatar": "string",
          "rating": "number",
          "content": "string",
          "images": ["string"],
          "createTime": "string",
          "reply": {
            "content": "string",
            "createTime": "string"
          }
        }
      ]
    },
    "relatedProducts": [
      {
        "id": "string",
        "name": "string",
        "price": "number",
        "image": "string"
      }
    ],
    "status": "number",
    "createTime": "string",
    "updateTime": "string"
  },
  "message": "success"
}
```

### 订单相关接口

#### 1. 创建订单
- 请求方式：POST
- 接口路径：`/orders`
- 请求参数：
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "specifications": [
        {
          "id": "string",
          "value": "string"
        }
      ]
    }
  ],
  "addressId": "string",
  "couponId": "string?",
  "points": "number?",
  "remark": "string?",
  "paymentMethod": "string",
  "deliveryMethod": "string"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "id": "string",
    "orderNo": "string",
    "amount": "number",
    "actualAmount": "number",
    "status": "string",
    "paymentInfo": {
      "method": "string",
      "qrCode": "string?",
      "expireTime": "string"
    }
  },
  "message": "success"
}
```

#### 2. 获取订单列表
- 请求方式：GET
- 接口路径：`/orders`
- 请求参数：
```json
{
  "page": "number",
  "pageSize": "number",
  "status": "string?",
  "startTime": "string?",
  "endTime": "string?",
  "keyword": "string?"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "total": "number",
    "list": [
      {
        "id": "string",
        "orderNo": "string",
        "amount": "number",
        "actualAmount": "number",
        "status": "string",
        "paymentMethod": "string",
        "paymentStatus": "string",
        "paymentTime": "string",
        "deliveryMethod": "string",
        "deliveryStatus": "string",
        "deliveryTime": "string",
        "completedTime": "string",
        "createTime": "string",
        "address": {
          "name": "string",
          "phone": "string",
          "province": "string",
          "city": "string",
          "district": "string",
          "address": "string"
        },
        "items": [
          {
            "id": "string",
            "productId": "string",
            "name": "string",
            "image": "string",
            "price": "number",
            "quantity": "number",
            "unit": "string",
            "specifications": [
              {
                "name": "string",
                "value": "string"
              }
            ],
            "subtotal": "number"
          }
        ],
        "coupon": {
          "id": "string",
          "name": "string",
          "amount": "number"
        },
        "pointsUsed": "number",
        "pointsGained": "number",
        "remark": "string",
        "refund": {
          "id": "string",
          "status": "string",
          "reason": "string",
          "amount": "number",
          "createTime": "string",
          "handleTime": "string"
        }
      }
    ]
  },
  "message": "success"
}
```

#### 3. 取消订单
- 请求方式：POST
- 接口路径：`/orders/:id/cancel`
- 请求参数：
```json
{
  "reason": "string"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": true,
  "message": "success"
}
```

#### 4. 申请退款
- 请求方式：POST
- 接口路径：`/orders/:id/refund`
- 请求参数：
```json
{
  "reason": "string",
  "description": "string",
  "images": ["string"],
  "amount": "number"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "id": "string",
    "status": "string",
    "createTime": "string"
  },
  "message": "success"
}
```

### 购物车相关接口

#### 1. 添加到购物车
- 请求方式：POST
- 接口路径：`/cart`
- 请求参数：
```json
{
  "productId": "string",
  "quantity": "number",
  "specifications": [
    {
      "id": "string",
      "value": "string"
    }
  ]
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "id": "string",
    "quantity": "number",
    "subtotal": "number"
  },
  "message": "success"
}
```

#### 2. 获取购物车列表
- 请求方式：GET
- 接口路径：`/cart`
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "total": "number",
    "totalAmount": "number",
    "selectedAmount": "number",
    "items": [
      {
        "id": "string",
        "productId": "string",
        "name": "string",
        "image": "string",
        "price": "number",
        "originalPrice": "number",
        "quantity": "number",
        "unit": "string",
        "stock": "number",
        "specifications": [
          {
            "id": "string",
            "name": "string",
            "value": "string"
          }
        ],
        "selected": "boolean",
        "subtotal": "number",
        "status": "number"
      }
    ],
    "availableCoupons": [
      {
        "id": "string",
        "name": "string",
        "type": "string",
        "amount": "number",
        "minAmount": "number",
        "startTime": "string",
        "endTime": "string"
      }
    ]
  },
  "message": "success"
}
```

#### 3. 更新购物车商品
- 请求方式：PUT
- 接口路径：`/cart/:id`
- 请求参数：
```json
{
  "quantity": "number",
  "specifications": [
    {
      "id": "string",
      "value": "string"
    }
  ],
  "selected": "boolean"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "quantity": "number",
    "subtotal": "number"
  },
  "message": "success"
}
```

### 收藏相关接口

#### 1. 添加收藏
- 请求方式：POST
- 接口路径：`/favorites`
- 请求参数：
```json
{
  "productId": "string"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "id": "string",
    "createTime": "string"
  },
  "message": "success"
}
```

#### 2. 获取收藏列表
- 请求方式：GET
- 接口路径：`/favorites`
- 请求参数：
```json
{
  "page": "number",
  "pageSize": "number"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "total": "number",
    "list": [
      {
        "id": "string",
        "productId": "string",
        "name": "string",
        "image": "string",
        "price": "number",
        "originalPrice": "number",
        "stock": "number",
        "unit": "string",
        "createTime": "string"
      }
    ]
  },
  "message": "success"
}
```

### 地址相关接口

#### 1. 添加地址
- 请求方式：POST
- 接口路径：`/addresses`
- 请求参数：
```json
{
  "name": "string",
  "phone": "string",
  "province": "string",
  "city": "string",
  "district": "string",
  "address": "string",
  "isDefault": "boolean"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "id": "string",
    "createTime": "string"
  },
  "message": "success"
}
```

#### 2. 获取地址列表
- 请求方式：GET
- 接口路径：`/addresses`
- 响应示例：
```json
{
  "code": 0,
  "data": [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "province": "string",
      "city": "string",
      "district": "string",
      "address": "string",
      "isDefault": "boolean",
      "createTime": "string"
    }
  ],
  "message": "success"
}
```

### 评价相关接口

#### 1. 提交评价
- 请求方式：POST
- 接口路径：`/reviews`
- 请求参数：
```json
{
  "orderId": "string",
  "productId": "string",
  "rating": "number",
  "content": "string",
  "images": ["string"],
  "anonymous": "boolean"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "id": "string",
    "createTime": "string"
  },
  "message": "success"
}
```

#### 2. 获取评价列表
- 请求方式：GET
- 接口路径：`/products/:id/reviews`
- 请求参数：
```json
{
  "page": "number",
  "pageSize": "number",
  "rating": "number?",
  "hasImage": "boolean?"
}
```
- 响应示例：
```json
{
  "code": 0,
  "data": {
    "total": "number",
    "statistics": {
      "averageRating": "number",
      "totalCount": "number",
      "imageCount": "number",
      "ratingDistribution": {
        "5": "number",
        "4": "number",
        "3": "number",
        "2": "number",
        "1": "number"
      }
    },
    "list": [
      {
        "id": "string",
        "userId": "string",
        "username": "string",
        "avatar": "string",
        "rating": "number",
        "content": "string",
        "images": ["string"],
        "specifications": [
          {
            "name": "string",
            "value": "string"
          }
        ],
        "createTime": "string",
        "reply": {
          "content": "string",
          "createTime": "string"
        }
      }
    ]
  },
  "message": "success"
}
```

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或登录过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |

## 数据字典

### 订单状态
- pending: 待付款
- paid: 已付款
- shipped: 已发货
- completed: 已完成
- cancelled: 已取消
- refunding: 退款中
- refunded: 已退款

### 商品状态
- 1: 上架
- 0: 下架
- -1: 删除

### 用户状态
- 1: 正常
- 0: 禁用
- -1: 删除

## 开发规范

### 目录结构
```
src/
  ├── api/          # API 接口
  ├── assets/       # 静态资源
  ├── components/   # 公共组件
  ├── i18n/         # 国际化配置
  ├── layout/       # 布局组件
  ├── router/       # 路由配置
  ├── stores/       # 状态管理
  ├── styles/       # 全局样式
  ├── utils/        # 工具函数
  └── views/        # 页面组件
```

### 命名规范

- 文件名：kebab-case (如：product-list.vue)
- 组件名：PascalCase (如：ProductList)
- 变量名：camelCase (如：productList)
- 常量名：SNAKE_CASE (如：API_BASE_URL)

### Git 提交规范

提交信息格式：`type(scope): subject`

type 类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建

示例：`feat(order): add order list page`
