import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/i18n'
import Home from '@/views/home/index.vue'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { title: 'common.home' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: { title: 'category.title' }
      },
      {
        path: 'category/:id',
        name: 'CategoryDetail',
        component: () => import('@/views/category/index.vue'),
        meta: { title: 'category.detail' }
      },
      {
        path: 'product',
        name: 'ProductList',
        component: () => import('@/views/product/ProductList.vue'),
        meta: { title: 'product.list' }
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/detail.vue'),
        meta: { title: 'product.detail' }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/cart/index.vue'),
        meta: { title: 'cart.title' }
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/checkout/index.vue'),
        meta: { title: 'checkout.title', requiresAuth: true }
      },
      {
        path: 'user',
        name: 'UserCenter',
        component: () => import('@/views/user/center.vue'),
        meta: { title: 'user.center', requiresAuth: true },
        children: [
          {
            path: 'profile',
            name: 'UserProfile',
            component: () => import('@/views/user/profile.vue'),
            meta: { title: 'user.profile' }
          },
          {
            path: 'orders',
            name: 'UserOrders',
            component: () => import('@/views/user/orders.vue'),
            meta: { title: 'user.orders' }
          },
          {
            path: 'refunds',
            component: () => import('@/views/user/refunds.vue'),
            meta: { title: 'user.refunds' }
          },
          {
            path: 'favorites',
            name: 'UserFavorites',
            component: () => import('@/views/user/favorites.vue'),
            meta: { title: 'user.favorites' }
          }
        ]
      },
      {
        path: 'order',
        // component: () => import('@/layout/index.vue'),
        children: [
          {
            path: '',
            name: 'OrderList',
            component: () => import('@/views/order/index.vue'),
            meta: { title: 'order.list', requiresAuth: true }
          },
          {
            path: ':id',
            name: 'OrderDetail',
            component: () => import('@/views/order/detail.vue'),
            meta: { title: 'order.detail', requiresAuth: true }
          }
        ]
      },
      {
        path: 'payment',
        name: 'Payment',
        component: () => import('@/views/payment/index.vue'),
        meta: { title: 'payment.title', requiresAuth: true }
      },
      {
        path: 'guide',
        name: 'Guide',
        component: () => import('@/views/guide/index.vue'),
        meta: { title: 'guide.title' }
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        path: 'user/login',
        name: 'Login',
        component: () => import('@/views/user/login.vue'),
        meta: { title: 'user.login' }
      },
      {
        path: 'user/register',
        name: 'Register',
        component: () => import('@/views/user/register.vue'),
        meta: { title: 'user.register' }
      },
      {
        path: 'user/password',
        name: 'Password',
        component: () => import('@/views/user/forgot-password.vue'),
        meta: { title: 'user.password' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 更新页面标题
const updateTitle = (to) => {
  const title = to.meta.title ? i18n.global.t(to.meta.title) : ''
  const appTitle = i18n.global.locale.value === 'zh' ? '中药商城' : 'TCM Mall'
  document.title = title ? `${title} - ${appTitle}` : appTitle
}

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  updateTitle(to)

  // 检查是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({
        path: '/user/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 