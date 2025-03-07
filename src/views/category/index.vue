<template>
    <div class="category">
        <div class="container">
            <!-- 分类标题 -->
            <div class="category-header">
                <h1>{{ $t('category.title') }}</h1>
            </div>

            <!-- 分类筛选 -->
            <div class="filter-section">
                <el-card>
                    <div class="filter-row">
                        <span class="label">{{ $t('category.all') }}:</span>
                        <div class="options">
                            <el-tag
                                    v-for="category in categories"
                                    :key="category.id"
                                    :type="currentCategory === category.id?'':'info'"
                                    class="category-tag"
                                    @click="handleCategoryClick(category.id)"
                            >
                                {{ category.name }}
                            </el-tag>
                        </div>
                    </div>
                </el-card>
            </div>

            <!-- 商品列表 -->
            <div class="product-section">
                <el-row :gutter="20">
                    <el-col
                            v-for="product in products"
                            :key="product.id"
                            :xs="12"
                            :sm="8"
                            :md="6"
                            :lg="6"
                    >
                        <el-card class="product-card" shadow="hover">
                            <router-link :to="`/product/${product.id}`">
                                <img :src="product.img" :alt="product.name" class="product-image">
                                <h3 class="product-name">{{ product.name }}</h3>
                                <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
                            </router-link>
                        </el-card>
                    </el-col>
                </el-row>

                <!-- 分页 -->
                <div class="pagination">
                    <el-pagination
                            v-model:current-page="currentPage"
                            v-model:page-size="pageSize"
                            :total="total"
                            :page-sizes="[12, 24, 36, 48]"
                            layout="total, sizes, prev, pager, next, jumper"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRoute} from 'vue-router'
import {getCategoryList, getCategoryProducts} from '@/api/product'

const route = useRoute()

// 数据
const categories = ref([])
const products = ref([])
const currentCategory = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const loading = ref(false)

// 获取分类列表
const fetchCategories = async () => {
    try {
        const data = await getCategoryList()
        categories.value = data
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

// 获取商品列表
const fetchProducts = async () => {
    loading.value = true
    try {
        const params = {
            categoryId: currentCategory.value,
            pageNum: currentPage.value,
            pageSize: pageSize.value
        }
        const {list, total: totalCount} = await getCategoryProducts(params)
        products.value = list
        total.value = totalCount
    } catch (error) {
        console.error('Failed to fetch products:', error)
    } finally {
        loading.value = false
    }
}

// 处理分类点击
const handleCategoryClick = (categoryId) => {
    currentCategory.value = categoryId
    currentPage.value = 1
    console.log('Current Category:', currentCategory.value)
    fetchProducts()
}

// 处理分页
const handleSizeChange = (val) => {
    pageSize.value = val
    fetchProducts()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    fetchProducts()
}

// 监听路由参数变化
watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            currentCategory.value = 0
            fetchProducts()
        }
    },
    {immediate: true}
)

onMounted(() => {
    fetchCategories()
})
</script>

<style lang="scss" scoped>
.category {
  padding: 20px 0;

  .category-header {
    margin-bottom: 20px;

    h1 {
      font-size: 24px;
      color: #333;
    }
  }

  .filter-section {
    margin-bottom: 20px;

    .filter-row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .label {
        width: 80px;
        color: #666;
      }

      .options {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .category-tag {
        cursor: pointer;
        margin: 0;
      }
    }
  }

  .product-section {
    .product-card {
      margin-bottom: 20px;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      a {
        text-decoration: none;
        color: inherit;
      }

      .product-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 4px;
      }

      .product-name {
        margin: 10px 0;
        font-size: 14px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-price {
        color: var(--el-color-danger);
        font-size: 16px;
        font-weight: bold;
        margin: 0;
      }
    }
  }

  .pagination {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
}
</style> 