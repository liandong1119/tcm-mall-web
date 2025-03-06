import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  // 方法
  function addItem(product, quantity = 1) {
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '',
        quantity,
        selected: true
      })
    }
    saveToStorage()
  }

  function updateQuantity(id, quantity) {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
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
    updateQuantity,
    removeItem,
    toggleSelected,
    toggleAll,
    clear
  }
}) 