<template>
  <div class="product-list">
    <div class="container">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-card>
          <!-- 分类筛选 -->
          <div class="filter-group">
            <div class="filter-label">{{ $t('category.title') }}:</div>
            <div class="filter-options">
              <el-radio-group v-model="filters.category">
                <el-radio-button label="">{{ $t('category.all') }}</el-radio-button>
                <el-radio-button 
                  v-for="category in categories" 
                  :key="category.id" 
                  :label="category.id"
                >
                  {{ category.name }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 价格筛选 -->
          <div class="filter-group">
            <div class="filter-label">{{ $t('product.price') }}:</div>
            <div class="filter-options">
              <el-input-number 
                v-model="filters.minPrice" 
                :min="0"
                :placeholder="$t('product.minPrice')"
                class="price-input"
              />
              <span class="separator">-</span>
              <el-input-number 
                v-model="filters.maxPrice" 
                :min="0"
                :placeholder="$t('product.maxPrice')"
                class="price-input"
              />
              <el-button type="primary" @click="applyPriceFilter">
                {{ $t('common.confirm') }}
              </el-button>
            </div>
          </div>

          <!-- 排序 -->
          <div class="filter-group">
            <div class="filter-label">{{ $t('product.sort') }}:</div>
            <div class="filter-options">
              <el-select v-model="filters.sort">
                <el-option 
                  v-for="option in sortOptions" 
                  :key="option.value" 
                  :label="option.label" 
                  :value="option.value"
                />
              </el-select>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 商品列表 -->
      <div class="product-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProductCard from '@/components/ProductCard.vue'
import { getProductList, getCategoryList } from '@/api/product'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// 分类数据
const categories = ref([])

// 筛选条件
const filters = ref({
  categoryId: route.query.category || '',
  minPrice: '',
  maxPrice: '',
  sort: 'default'
})

// 排序选项
const sortOptions = [
  { value: 'default', label: t('product.sortBy.default') },
  { value: 'price-asc', label: t('common.price') + ' ↑' },
  { value: 'price-desc', label: t('common.price') + ' ↓' },
  { value: 'sales', label: t('product.sortBy.sales') }
]

// 分页数据
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const products = ref([])

// 获取分类数据
const fetchCategories = async () => {
  try {
    categories.value = await getCategoryList()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// 获取商品数据
const fetchProducts = async () => {
  try {
    const { data, total: totalCount } = await getProductList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...filters.value
    })
    products.value = data
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

// 处理筛选条件变化
watch(filters, (newFilters) => {
  currentPage.value = 1
  router.push({
    query: {
      ...route.query,
      ...newFilters
    }
  })
  fetchProducts()
}, { deep: true })

// 处理分页变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchProducts()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchProducts()
}

// 价格筛选
const applyPriceFilter = () => {
  if (filters.value.maxPrice && filters.value.minPrice > filters.value.maxPrice) {
    const temp = filters.value.minPrice
    filters.value.minPrice = filters.value.maxPrice
    filters.value.maxPrice = temp
  }
  fetchProducts()
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style lang="scss" scoped>
.product-list {
  padding: 20px 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .filter-section {
    margin-bottom: 20px;

    .filter-group {
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .filter-label {
        width: 80px;
        color: var(--el-text-color-regular);
      }

      .filter-options {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;

        .price-input {
          width: 120px;
        }

        .separator {
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style> 