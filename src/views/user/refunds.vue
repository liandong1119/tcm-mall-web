<template>
  <div class="refunds-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ $t('user.refundManagement') }}</span>
        </div>
      </template>

      <!-- 搜索筛选区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm">
          <el-form-item :label="$t('order.orderNo')">
            <el-input v-model="searchForm.orderCode" :placeholder="$t('common.pleaseInput')" />
          </el-form-item>
          <el-form-item :label="$t('refund.status')">
            <el-select v-model="searchForm.status" :placeholder="$t('common.pleaseSelect')">
              <el-option :label="$t('common.all')" value="" />
              <el-option
                v-for="(text, status) in refundStatusOptions"
                :key="status"
                :label="text"
                :value="status"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              {{ $t('common.search') }}
            </el-button>
            <el-button @click="resetSearch">
              {{ $t('common.reset') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 退款列表 -->
      <el-table :data="refundList" style="width: 100%" v-loading="loading">
        <el-table-column prop="orderCode" :label="$t('order.orderNo')" width="180" />
        <el-table-column prop="productName" :label="$t('product.name')" width="200">
          <template #default="{ row }">
            <div class="product-info">
              <el-image
                :src="row.productImage"
                :preview-src-list="[row.productImage]"
                fit="cover"
                class="product-image"
              />
              <span>{{ row.productName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('refund.amount')" width="120">
          <template #default="{ row }">
            <span class="amount">¥{{ row.amount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" :label="$t('refund.reason')" show-overflow-tooltip />
        <el-table-column prop="status" :label="$t('refund.status')" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ $t(`refund.statusText.${row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('refund.applyTime')" width="180" />
        <el-table-column :label="$t('common.operation')" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="showDetail(row)">
              {{ $t('common.detail') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 退款详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="$t('refund.detail')"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('order.orderNo')">
          {{ currentRefund.orderCode }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('product.name')">
          {{ currentRefund.productName }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('refund.amount')">
          ¥{{ currentRefund.amount?.toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('refund.reason')">
          {{ currentRefund.reason }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('refund.status')">
          <el-tag :type="getStatusType(currentRefund.status)">
            {{ $t(`refund.statusText.${currentRefund.status}`) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('refund.applyTime')">
          {{ currentRefund.createTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 搜索表单
const searchForm = reactive({
  orderCode: '',
  status: ''
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const loading = ref(false)

// 退款状态选项
const refundStatusOptions = {
  pending: t('refund.statusText.pending'),
  approved: t('refund.statusText.approved'),
  rejected: t('refund.statusText.rejected')
}

// 日期快捷选项
const dateShortcuts = [
  {
    text: t('common.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: t('common.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]

// 详情对话框
const detailDialogVisible = ref(false)
const currentRefund = ref({})

// 模拟退款数据
const refundList = ref([
  {
    id: '1',
    orderCode: 'DD20240306001',
    productName: '西洋参（优质）',
    productImage: 'https://img.alicdn.com/imgextra/i4/2200724907121/O1CN01LNnUzA22KCPpjQove_!!2200724907121.jpg',
    amount: 299.00,
    reason: '商品质量问题',
    status: 'pending',
    createTime: '2024-03-06 10:30:00'
  },
  {
    id: '2',
    orderCode: 'DD20240305002',
    productName: '灵芝片（特级）',
    productImage: 'https://img.alicdn.com/imgextra/i2/2200724907121/O1CN01q1qx5122KCPrKLyQC_!!2200724907121.jpg',
    amount: 300.00,
    reason: '商品包装破损',
    status: 'approved',
    createTime: '2024-03-05 15:20:00'
  },
  {
    id: '3',
    orderCode: 'DD20240304003',
    productName: '人参（精选）',
    productImage: 'https://img.alicdn.com/imgextra/i3/2200724907121/O1CN01Z6Zd8q22KCPpjPq6C_!!2200724907121.jpg',
    amount: 399.00,
    reason: '收到商品与描述不符',
    status: 'rejected',
    createTime: '2024-03-04 09:15:00'
  }
])

// 获取状态对应的类型
const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

// 搜索处理
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('Search form:', searchForm)
}

// 重置搜索
const resetSearch = () => {
  searchForm.orderCode = ''
  searchForm.status = ''
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

// 显示详情
const showDetail = (row) => {
  currentRefund.value = row
  detailDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.refunds-page {
  .card-header {
    font-size: 16px;
    font-weight: bold;
  }

  .search-area {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 10px;

    .product-image {
      width: 50px;
      height: 50px;
      border-radius: 4px;
    }
  }

  .amount {
    color: var(--el-color-danger);
    font-weight: bold;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 