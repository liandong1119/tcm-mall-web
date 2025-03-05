<template>
  <el-card class="favorites-card">
    <template #header>
      <div class="card-header">
        <h3>{{ t('user.favorites') }}</h3>
      </div>
    </template>

    <div class="favorites-list" v-loading="loading">
      <el-empty v-if="!loading && favorites.length === 0" :description="t('common.noData')" />
      
      <el-row v-else :gutter="20">
        <el-col v-for="item in favorites" :key="item.id" :span="8">
          <el-card class="product-card" :body-style="{ padding: '0px' }">
            <div class="product-image">
              <img :src="item.image" :alt="item.name">
            </div>
            <div class="product-info">
              <h4>{{ item.name }}</h4>
              <p class="price">¥{{ item.price }}</p>
              <div class="operations">
                <el-button type="primary" link @click="viewProduct(item.productId)">
                  {{ t('common.view') }}
                </el-button>
                <el-button type="danger" link @click="handleRemoveFavorite(item.id)">
                  {{ t('common.delete') }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[12, 24, 36]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFavoriteList, removeFavorite as removeFromFavorite } from '@/api/favorite'

const router = useRouter()
const { t } = useI18n()
const loading = ref(false)
const favorites = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

const fetchFavorites = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    const { list, total: totalCount } = await getFavoriteList(params)
    favorites.value = list || []
    total.value = totalCount || 0
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
    ElMessage.error(t('message.fetchFailed'))
    favorites.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchFavorites()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchFavorites()
}

const viewProduct = (id) => {
  router.push(`/product/${id}`)
}

const handleRemoveFavorite = async (id) => {
  try {
    await ElMessageBox.confirm(
      t('message.confirmDelete'),
      t('common.tips'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    await removeFromFavorite(id)
    ElMessage.success(t('message.deleteSuccess'))
    fetchFavorites()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to remove favorite:', error)
      ElMessage.error(t('message.deleteFailed'))
    }
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style lang="scss" scoped>
.favorites-card {
  .card-header {
    h3 {
      margin: 0;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }
  }
}

.favorites-list {
  min-height: 400px;
}

.product-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  .product-image {
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .product-info {
    padding: 14px;

    h4 {
      margin: 0 0 10px;
      font-size: 14px;
      color: var(--el-text-color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .price {
      color: var(--el-color-danger);
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 10px;
    }

    .operations {
      display: flex;
      justify-content: space-between;
    }
  }
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style> 