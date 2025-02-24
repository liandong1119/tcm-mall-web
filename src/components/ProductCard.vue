<template>
  <el-card class="product-card" shadow="hover">
    <div class="product-image">
      <img :src="product.image" :alt="product.name">
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-desc">{{ product.description }}</p>
      <div class="product-price">
        <span class="price">¥{{ product.price }}</span>
        <span class="unit">/斤</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      description: '',
      price: 0,
      image: ''
    })
  }
})
</script>

<style lang="scss" scoped>
.product-card {
  height: 100%;
  border: none;
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
  }

  .product-image {
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .product-info {
    padding: 12px;

    .product-name {
      font-size: 16px;
      color: #333;
      margin: 0 0 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-desc {
      font-size: 12px;
      color: #666;
      margin: 0 0 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
      height: 36px;
    }

    .product-price {
      display: flex;
      align-items: baseline;

      .price {
        font-size: 20px;
        font-weight: bold;
        color: #f56c6c;
      }

      .unit {
        margin-left: 4px;
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style> 