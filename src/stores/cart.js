import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {getCartList} from "@/api/cart";

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cartItems') || '[]'))

  // 计算属性
  const totalCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalAmount = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const selectedItems = computed(() => {
    return items.value.filter(item => item.selected)
  })

  const selectedCount = computed(() => {
    return selectedItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const selectedAmount = computed(() => {
    return selectedItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  /**
   * 从服务端加载数据
   */
  async function loadCart() {
    try {
      const res = await getCartList({pageNum: 2, pageSize: 7})
      if (res && res.list) {
        // 确保每个商品项都有必要的字段
        const cartItems = res.list.map(item => ({
          id: item.id,
          name: item.medicinalName || item.name,
          price: Number(item.price || 0),
          image: item.image || '',
          quantity: Number(item.quantity || 1),
          selected: true,
          // 保留其他可能的字段
          ...item
        }))
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        items.value = cartItems
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
      // 如果加载失败，使用本地存储的数据
      items.value = JSON.parse(localStorage.getItem('cartItems') || '[]')
    }
  }

  // 方法
  function addItem(product, quantity = 1) {
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        image: product.images?.[0] || product.image || '',
        quantity,
        selected: true,
        skuId: product.sku,
        selectedSpecs: product.selectedSpecs || {}
      })
    }
    saveToStorage()
  }

  function buyNow(product, quantity = 1) {
    clear()
    addItem(product, quantity)
    saveToStorage()
  }

  function updateQuantity(id, quantity) {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.quantity = Number(quantity)
      saveToStorage()
    }
  }

  function removeItem(id) {
    const index = items.value.findIndex(item => item.id === id)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  function toggleSelected(id) {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.selected = !item.selected
      saveToStorage()
    }
  }

  function toggleAll(selected) {
    items.value.forEach(item => {
      item.selected = selected
    })
    saveToStorage()
  }

  function clear() {
    items.value = []
    saveToStorage()
  }

  // 持久化存储
  function saveToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(items.value))
  }

  return {
    items,
    totalCount,
    totalAmount,
    selectedItems,
    selectedCount,
    selectedAmount,
    addItem,
    buyNow,
    updateQuantity,
    removeItem,
    toggleSelected,
    toggleAll,
    clear,
    loadCart,
    saveToStorage
  }
}) 