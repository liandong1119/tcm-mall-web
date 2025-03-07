<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="banner-container">
      <el-carousel height="400px" :interval="5000">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <img :src="banner.image" :alt="banner.title" class="banner-image">
          <div class="banner-content">
            <h2>{{ banner.title }}</h2>
            <p>{{ banner.description }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="main-content">
      <!-- 搜索栏 -->
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          :placeholder="$t('search.placeholder')"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">
          {{ $t('search.button') }}
        </el-button>
      </div>

      <!-- 分类导航 -->
      <div class="category-nav">
        <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
          <el-tab-pane v-for="category in categories" 
                      :key="category.id" 
                      :label="category.name" 
                      :name="category.id" 
          />
        </el-tabs>
      </div>

      <!-- 商品列表 -->
      <div class="product-list">
        <el-row :gutter="20">
          <el-col
            v-for="product in products"
            :key="product.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="6"
          >
            <div class="product-card-wrapper" @click="goToDetail(product.id)">
              <ProductCard :product="product" />
            </div>
          </el-col>
        </el-row>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { getProductList, getCategoryList } from '@/api/product'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()
const searchQuery = ref('')
const products = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const activeCategory = ref('all')
const categories = ref([])

// 轮播图数据
const banners = ref([
  {
    id: 1,
    image: '/images/banners/banner1.jpg',
    title: '道地药材 品质保证',
    description: '严选优质中药材，传承千年养生之道'
  },
  {
    id: 2,
    image: '/images/banners/banner2.jpg',
    title: '四季调养 科学搭配',
    description: '专业药师指导，合理搭配养生方案'
  },
  {
    id: 3,
    image: '/images/banners/banner3.jpg',
    title: '产地溯源 安全可靠',
    description: '源头直采，保证每一味药材的纯正'
  }
])

const fetchCategories = async () => {
  try {
    const data = await getCategoryList()
    categories.value = [{ id: 'all', name: '全部' }, ...data]
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchProducts = async () => {
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      name: searchQuery.value,
      categoryId: activeCategory.value === 'all' ? undefined : activeCategory.value
    }
    const { list, total: totalCount } = await getProductList(params)
    products.value = list
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchProducts()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchProducts()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchProducts()
}

const handleCategoryChange = () => {
  currentPage.value = 1
  fetchProducts()
}

const goToDetail = (productId) => {
  router.push(`/product/${productId}`)
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style lang="scss" scoped>
.home {
  .banner-container {
    margin-bottom: 30px;
    
    .banner-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .banner-content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      
      h2 {
        font-size: 36px;
        margin-bottom: 16px;
      }
      
      p {
        font-size: 18px;
      }
    }
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    .search-container {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;

      .search-input {
        flex: 1;
      }
    }

    .category-nav {
      margin-bottom: 30px;
    }

    .product-list {
      margin-bottom: 20px;
    }

    .product-card-wrapper {
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      margin: 40px 0;
    }
  }
}

:deep(.el-carousel__item) {
  position: relative;
  background: linear-gradient(to right, #2b9939, #1d6926);
  overflow: hidden;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e8e8e8;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--el-color-primary);
}
</style> 