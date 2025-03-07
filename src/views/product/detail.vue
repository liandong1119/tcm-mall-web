<template>
    <div class="product-detail">
        <div class="container">
            <!-- 商品基本信息 -->
            <el-card class="product-info">
                <el-row :gutter="40">
                    <!-- 左侧主图 -->
                    <el-col :span="12">
                        <div class="product-image">
                            <el-image
                                :src="getImageUrl(product.image)"
                                :preview-src-list="product.images?.map(img => getImageUrl(img))"
                                fit="cover"
                                class="product-image"
                            />
                        </div>
                    </el-col>

                    <!-- 右侧信息 -->
                    <el-col :span="12">
                        <div class="product-summary">
                            <h1 class="product-name">{{ product.name }}</h1>

                            <!-- 评分展示 -->
                            <div class="product-rating">
                                <el-rate
                                        v-model="product.rating"
                                        disabled
                                        show-score
                                        text-color="#ff9900"
                                        score-template="{value}"
                                />
                                <span class="rating-count">{{ product.ratingCount || 0 }} {{
                                    $t('product.ratingCount')
                                    }}</span>
                            </div>

                            <!-- 商品规格 -->
                            <div class="product-specs-brief">
                                <div class="spec-item">
                                    <span class="label">{{ $t('product.brand') }}:</span>
                                    <span class="value">{{ product.brand || $t('product.defaultBrand') }}</span>
                                </div>
                                <div class="spec-item">
                                    <span class="label">{{ $t('product.origin') }}:</span>
                                    <span class="value">{{ product.productionLocation || $t('product.defaultOrigin') }}</span>
                                </div>
                                <div class="spec-item">
                                    <span class="label">{{ $t('product.stock') }}:</span>
                                    <span class="value">{{ product.stock || $t('product.defaultStock') }}</span>
                                </div>
                            </div>

                            <!-- 规格选择 -->
                            <div class="product-sku" v-if="product.specifications && product.specifications.length > 0">
                                <div v-for="(spec, specIndex) in product.specifications" :key="specIndex"
                                     class="sku-item">
                                    <div class="sku-title">{{ spec.name }}:</div>
                                    <div class="sku-options">
                                        <el-radio-group v-model="selectedSpecs[spec.name]" @change="handleSpecChange">
                                            <el-radio
                                                    v-for="(option, optionIndex) in spec.options"
                                                    :key="optionIndex"
                                                    :label="option.value"
                                                    :disabled="!option.available"
                                                    class="sku-option"
                                            >
                                                {{ option.text }}
                                                <span v-if="option.price_increment > 0" class="price-increment">+{{
                                                    $t('common.currency')
                                                    }}{{ option.price_increment }}</span>
                                            </el-radio>
                                        </el-radio-group>
                                    </div>
                                </div>
                            </div>

                            <!-- 功能描述 -->
                            <div class="product-function">
                                <h3>{{ $t('product.detail.functionTitle') }}</h3>
                                <div class="function-list">
                                    <p v-for="(func, index) in product.functions" :key="index">
                                        <el-icon>
                                            <Check/>
                                        </el-icon>
                                        {{ func }}
                                    </p>
                                </div>
                            </div>

                            <div class="product-price">
                                <span class="price">{{ $t('common.currency') }}{{ product.price }}</span>
                                <span class="unit">/{{ $t('product.detail.unit') }}</span>
                                <span v-if="product.originalPrice" class="original-price">
                  {{ $t('product.originalPrice', {price: product.originalPrice}) }}
                </span>
                            </div>

                            <div class="product-actions">
                                <div class="quantity-wrapper">
                                    <span class="label">{{ $t('product.detail.quantity') }}：</span>
                                    <el-input-number
                                            v-model="quantity"
                                            :min="1"
                                            :max="99"
                                            :step="1"
                                            :precision="1"
                                            size="large"
                                            controls-position="right"
                                    />
                                    <span class="unit">{{ $t('product.detail.unit') }}</span>
                                </div>

                                <div class="buttons">
                                    <el-button type="primary" size="large" @click="addToCard">
                                        <el-icon>
                                            <ShoppingCart/>
                                        </el-icon>
                                        {{ $t('product.detail.addToCart') }}
                                    </el-button>

                                    <el-button type="danger" size="large" @click="buyNow">
                                        {{ $t('product.detail.buyNow') }}
                                    </el-button>

                                    <el-button
                                            :type="isFavorite ? 'danger' : 'default'"
                                            size="large"
                                            plain
                                            @click="toggleFavorite"
                                    >
                                        <el-icon>
                                            <Star/>
                                        </el-icon>
                                        {{
                                        isFavorite ? $t('product.removeFromFavorites') : $t('product.addToFavorites')
                                        }}
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 商品详情标签页 -->
            <el-card class="product-tabs">
                <el-tabs v-model="activeTab">
                    <!-- 商品详情 -->
                    <el-tab-pane :label="$t('product.detail.detailTab')" name="detail">
                        <div class="product-description" v-html="product.description"></div>
                    </el-tab-pane>

                    <!-- 规格参数 -->
                    <el-tab-pane :label="$t('product.detail.specsTab')" name="specs">
                        <div class="product-specs">
                            <el-descriptions :column="1" border>
                                <el-descriptions-item :label="$t('product.category')">
                                    {{ product.category || $t('common.noData') }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('product.brand')">
                                    {{ product.brand || $t('product.defaultBrand') }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('product.origin')">
                                    {{ product.origin || $t('product.defaultOrigin') }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('product.weight')">
                                    {{ product.weight || $t('product.defaultWeight') }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('product.detail.efficacy')">
                                    {{ product.efficacy || $t('common.noData') }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('product.detail.precautions')">
                                    {{ product.precautions || $t('common.noData') }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </el-tab-pane>

                    <!-- 买家评价 -->
                    <el-tab-pane :label="$t('product.detail.reviewsTab')" name="reviews">
                        <div class="product-reviews">
                            <!-- 评价统计 -->
                            <div class="review-summary">
                                <div class="rating-average">
                                    <span class="rating-value">{{ product.rating || 5 }}</span>
                                    <el-rate v-model="product.rating" disabled/>
                                    <span class="rating-count">{{
                                        product.ratingCount || 0
                                        }} {{ $t('product.ratingCount') }}</span>
                                </div>
                            </div>

                            <!-- 评价列表 -->
                            <div class="review-list">
                                <div v-if="reviews.length === 0" class="no-reviews">
                                    {{ $t('common.noData') }}
                                </div>
                                <div v-else v-for="(review, index) in reviews" :key="index" class="review-item">
                                    <div class="review-header">
                                        <span class="reviewer">{{ review.username }}</span>
                                        <el-rate v-model="review.level" disabled/>
                                        <span class="review-date">{{ review.createTime }}</span>
                                    </div>
                                    <div class="review-content">{{ review.content }}</div>
                                    <div v-if="review.reply" class="review-reply">
                                        <div class="reply-header">{{ $t('product.detail.merchantReply') }}:</div>
                                        <div class="reply-content">{{ review.reply }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- 评价分页 -->
                            <div class="reviews-pagination" v-if="reviewTotal > reviewPageSize">
                                <el-pagination
                                        v-model:current-page="reviewPage"
                                        v-model:page-size="reviewPageSize"
                                        :total="reviewTotal"
                                        layout="prev, pager, next"
                                        @current-change="handleReviewPageChange"
                                />
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted, reactive, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useCartStore} from '@/stores/cart'
import {useI18n} from 'vue-i18n'
import {ElMessage} from 'element-plus'
import {ShoppingCart, Star, Check} from '@element-plus/icons-vue'
import {getProductDetail, getProductReviews} from '@/api/product'
import {getProductStats, getProductSpecs} from '@/api/mock'
import {addToFavorite, removeFavorite} from '@/api/favorite'
import {addCard} from "@/api/cart";

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const {t} = useI18n()

const product = ref({})
const quantity = ref(1)
const isFavorite = ref(false)
const reviews = ref([])
const reviewPage = ref(1)
const reviewPageSize = ref(10)
const reviewTotal = ref(0)
const activeTab = ref('detail')
const productStats = ref({})
const productSpecs = ref([])

const selectedSpecs = reactive({})
const currentSku = ref(null)

// 计算所有规格是否已选择
const isAllSpecsSelected = computed(() => {
    if (!product.value?.specifications || product.value.specifications.length === 0) {
        return true
    }
    return product.value.specifications.every(spec => selectedSpecs[spec.name])
})

// 获取商品详情
const fetchProductDetail = async () => {
    try {
        // 模拟数据，实际项目中应该从API获取
        const data = await getProductDetail(route.params.id)
        data.specifications = JSON.parse(data.specifications)
        data.skus.forEach(sku => {
            sku.specs = JSON.parse(sku.specs)
        })
        product.value = data

        // // 使用模拟数据
        // product.value = {
        //   id: 1,
        //   name: '高品质人参',
        //   image: 'https://img.alicdn.com/imgextra/i4/2200724907121/O1CN01LNnUzA22KCPpjQove_!!2200724907121.jpg',
        //   price: 128.00,
        //   originalPrice: 168.00,
        //   stock: 200,
        //   rating: 4.8,
        //   ratingCount: 126,
        //   brand: '长白山',
        //   origin: '吉林',
        //   category: '补气类',
        //   weight: '500g',
        //   description: '<p>人参，别名人衔、鬼盖、神草、土精、地精、海腴、皱面还丹，为五加科人参属多年生草本植物。人参在我国已有两千多年的栽培历史，为名贵中药材。</p><p>人参性平、微温，归脾、肺、心、肾经，具有大补元气、复脉固脱、补脾益肺、生津止渴、安神益智的功效。</p><p><img src="https://img.alicdn.com/imgextra/i1/2200724907121/O1CN01LkJnIP22KCPrKMDpP_!!2200724907121.jpg" /></p>',
        //   functions: [
        //     '补气养血，增强免疫力',
        //     '改善疲劳，提高精力',
        //     '调节血糖，辅助降血压',
        //     '促进新陈代谢，延缓衰老'
        //   ],
        //   efficacy: '补气养血，增强免疫力，改善疲劳，提高精力',
        //   precautions: '孕妇、感冒发热者慎用，阴虚火旺者忌服',
        //   // 规格信息
        //   specifications: [
        //     {
        //       name: '规格',
        //       options: [
        //         { text: '特级', value: 'premium', available: true, price_increment: 50 },
        //         { text: '一级', value: 'first', available: true, price_increment: 0 },
        //         { text: '二级', value: 'second', available: true, price_increment: -20 }
        //       ]
        //     },
        //     {
        //       name: '包装',
        //       options: [
        //         { text: '礼盒装', value: 'gift', available: true, price_increment: 30 },
        //         { text: '简装', value: 'simple', available: true, price_increment: 0 }
        //       ]
        //     },
        //     {
        //       name: '重量',
        //       options: [
        //         { text: '50g', value: '50g', available: true, price_increment: -50 },
        //         { text: '100g', value: '100g', available: true, price_increment: 0 },
        //         { text: '250g', value: '250g', available: true, price_increment: 100 },
        //         { text: '500g', value: '500g', available: true, price_increment: 220 }
        //       ]
        //     }
        //   ],
        //   // SKU信息
        //   skus: [
        //     {
        //       id: 'sku001',
        //       specs: { '规格': 'premium', '包装': 'gift', '重量': '100g' },
        //       price: 208.00,
        //       stock: 50,
        //       image: 'https://img.alicdn.com/imgextra/i4/2200724907121/O1CN01LNnUzA22KCPpjQove_!!2200724907121.jpg'
        //     },
        //     {
        //       id: 'sku002',
        //       specs: { '规格': 'first', '包装': 'simple', '重量': '100g' },
        //       price: 128.00,
        //       stock: 100,
        //       image: 'https://img.alicdn.com/imgextra/i4/2200724907121/O1CN01LNnUzA22KCPpjQove_!!2200724907121.jpg'
        //     },
        //     {
        //       id: 'sku003',
        //       specs: { '规格': 'second', '包装': 'simple', '重量': '100g' },
        //       price: 108.00,
        //       stock: 150,
        //       image: 'https://img.alicdn.com/imgextra/i4/2200724907121/O1CN01LNnUzA22KCPpjQove_!!2200724907121.jpg'
        //     },
        //     {
        //       id: 'sku004',
        //       specs: { '规格': 'premium', '包装': 'gift', '重量': '500g' },
        //       price: 398.00,
        //       stock: 20,
        //       image: 'https://img.alicdn.com/imgextra/i4/2200724907121/O1CN01LNnUzA22KCPpjQove_!!2200724907121.jpg'
        //     }
        //   ]
        // }

        // 获取商品评价统计
        productStats.value = await getProductStats(product.value.id)

        // 获取商品规格信息
        const specsData = await getProductSpecs(product.value.id)
        if (specsData) {
            productSpecs.value = specsData
        }

        // 模拟评论数据
        /*reviews.value = [
            {
                id: 1,
                username: '张先生',
                rating: 5,
                content: '品质非常好，包装精美，服用后感觉精力充沛，很满意这次购买！',
                createTime: '2023-12-15',
                reply: '感谢您的支持，我们将继续提供优质的产品和服务！'
            },
            {
                id: 2,
                username: '李女士',
                rating: 4,
                content: '人参品质不错，但是包装有点简单，希望可以改进一下。',
                createTime: '2023-12-10'
            },
            {
                id: 3,
                username: '王先生',
                rating: 5,
                content: '第二次购买了，效果很好，全家人都在用，会继续支持！',
                createTime: '2023-12-05'
            }
        ]
        reviewTotal.value = 3*/

    } catch (error) {
        console.error('Failed to fetch product detail:', error)
        ElMessage.error(error.message)
    }
}

// 获取商品评价
const fetchReviews = async () => {
    try {
        const pageRequestParam = {
            pageNum: reviewPage.value,
            pageSize: reviewPageSize.value,
            productId: route.params.id
        }
        // 使用模拟数据，实际项目中应该从API获取
        const { list, total } = await getProductReviews(pageRequestParam)
        reviews.value = list
        reviewTotal.value = total
        console.log("返回的评论数据：",total)
        // 已在fetchProductDetail中设置了模拟评论数据
    } catch (error) {
        console.error('Failed to fetch reviews:', error)
    }
}

// 处理图片URL
const getImageUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return import.meta.env.VITE_API_BASE_URL + url
}

// 添加到购物车
const addToCard = () => {
    // 检查是否选择了所有必要的规格
    if (product.value.specifications && product.value.specifications.length > 0) {
        const allSpecsSelected = product.value.specifications.every(spec => selectedSpecs[spec.name])
        if (!allSpecsSelected) {
            ElMessage.warning(t('product.message.selectAllSpecs'))
            return
        }
    }

    // 检查是否找到对应的 SKU
    if (!currentSku.value) {
        ElMessage.warning(t('product.message.skuNotFound'))
        return
    }

    // 创建包含规格信息的商品对象
    const productToAdd = {
        ...product.value,
        preBuyNum: quantity.value,
        selectedSpecs: {...selectedSpecs},
        productId: product.value.id,
        skuId: currentSku.value.id,
        price: currentSku.value.price,
        stock: currentSku.value.stock,
        image: getImageUrl(currentSku.value.image || product.value.image)
    }
    console.log("添加到购物车",productToAdd)
    cartStore.addItem(productToAdd, quantity.value)
    // TODO 添加到购物车
    addCard(productToAdd)
    ElMessage.success(t('product.message.addToCartSuccess'))
}

// 立即购买
const buyNow = () => {
    // 检查是否选择了所有必要的规格
    if (!isAllSpecsSelected.value) {
        ElMessage.warning(t('product.message.selectAllSpecs'))
        return
    }

    // 检查是否找到对应的 SKU
    if (!currentSku.value) {
        ElMessage.warning(t('product.message.skuNotFound'))
        return
    }

    // 创建包含规格信息的商品对象
    const productToAdd = {
        ...product.value,
        selectedSpecs: {...selectedSpecs},
        sku: currentSku.value.id,
        price: currentSku.value.price,
        stock: currentSku.value.stock,
        image: getImageUrl(currentSku.value.image || product.value.image)
    }

    cartStore.buyNow(productToAdd, quantity.value)
    router.push('/checkout')
}

// 收藏/取消收藏
const toggleFavorite = async () => {
    try {
        if (isFavorite.value) {
            await removeFavorite(product.value.id)
            isFavorite.value = false
            ElMessage.success(t('product.message.unfavoriteSuccess'))
        } else {
            await addToFavorite(product.value.id)
            isFavorite.value = true
            ElMessage.success(t('product.message.favoriteSuccess'))
        }
    } catch (error) {
        console.error('Failed to toggle favorite:', error)
        ElMessage.error(error.message)
    }
}

// 评价分页
const handleReviewPageChange = (page) => {
    reviewPage.value = page
    fetchReviews()
}

// 处理规格选择变化
const handleSpecChange = () => {
    // 根据选择的规格找到对应的SKU
    if (product.value.skus && product.value.skus.length > 0) {
        const matchingSku = product.value.skus.find(sku => {
            return Object.keys(selectedSpecs).every(specName => {
                return sku.specs[specName] === selectedSpecs[specName]
            })
        })

        if (matchingSku) {
            currentSku.value = matchingSku
            // 更新价格、库存等信息
            if (matchingSku.price) product.value.price = matchingSku.price
            if (matchingSku.stock !== undefined) product.value.stock = matchingSku.stock
            if (matchingSku.image) product.value.image = matchingSku.image
        }
    }
}

// 初始化默认规格选择
const initDefaultSpecs = () => {
    if (product.value.specifications && product.value.specifications.length > 0) {
        product.value.specifications.forEach(spec => {
            if (spec.options && spec.options.length > 0) {
                // 默认选择第一个可用选项
                const defaultOption = spec.options.find(opt => opt.available !== false) || spec.options[0]
                selectedSpecs[spec.name] = defaultOption.value
            }
        })
        handleSpecChange()
    }
}

onMounted(() => {
    fetchProductDetail().then(() => {
        initDefaultSpecs()
    })
    fetchReviews()
})
</script>

<style lang="scss" scoped>
.product-detail {
  padding: 20px 0;
  background: #f5f5f5;
  min-height: 100vh;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .product-info {
    margin-bottom: 20px;

    .product-image {
      width: 100%;
      height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-radius: 4px;
      overflow: hidden;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .product-summary {
      padding: 0 20px;

      .product-name {
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
        line-height: 1.4;
      }

      .product-rating {
        margin-bottom: 20px;
        display: flex;
        align-items: center;

        .rating-count {
          margin-left: 10px;
          font-size: 14px;
          color: #999;
        }
      }

      .product-specs-brief {
        margin-bottom: 20px;

        .spec-item {
          display: flex;
          margin-bottom: 10px;

          .label {
            width: 80px;
            font-size: 14px;
            color: #999;
          }

          .value {
            font-size: 14px;
            color: #333;
          }
        }
      }

      .product-sku {
        margin-bottom: 20px;

        .sku-item {
          margin-bottom: 15px;

          .sku-title {
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
            font-weight: 500;
          }

          .sku-options {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;

            .sku-option {
              margin-right: 0;

              .price-increment {
                font-size: 12px;
                color: #f56c6c;
                margin-left: 5px;
              }
            }

            :deep(.el-radio__input.is-checked + .el-radio__label) {
              color: #f56c6c;
            }

            :deep(.el-radio__input.is-checked .el-radio__inner) {
              border-color: #f56c6c;
              background: #f56c6c;
            }
          }
        }
      }

      .product-function {
        margin-bottom: 20px;
        padding: 15px;
        background: #f8f8f8;
        border-radius: 4px;

        h3 {
          font-size: 16px;
          color: #333;
          margin-bottom: 12px;
        }

        .function-list {
          p {
            display: flex;
            align-items: center;
            color: #666;
            font-size: 14px;
            line-height: 1.8;
            margin-bottom: 8px;

            .el-icon {
              color: #67c23a;
              margin-right: 8px;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      .product-price {
        margin-bottom: 20px;

        .price {
          font-size: 28px;
          color: #f56c6c;
          font-weight: bold;
        }

        .unit {
          margin-left: 5px;
          font-size: 14px;
          color: #999;
        }

        .original-price {
          margin-left: 10px;
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }
      }

      .product-actions {
        .quantity-wrapper {
          margin-bottom: 20px;
          display: flex;
          align-items: center;

          .label {
            margin-right: 10px;
            color: #666;
          }

          .unit {
            margin-left: 10px;
            color: #666;
          }
        }

        .buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          .el-button {
            margin-right: 0;
          }
        }
      }
    }
  }

  .product-tabs {
    margin-bottom: 20px;

    .product-description {
      padding: 20px;
    }

    .product-specs {
      padding: 20px;

      .el-descriptions {
        :deep(.el-descriptions-item__label) {
          font-size: 14px;
          color: #999;
        }

        :deep(.el-descriptions-item__content) {
          font-size: 14px;
          color: #333;
        }
      }
    }

    .product-reviews {
      padding: 20px;

      .review-summary {
        margin-bottom: 20px;
        padding: 15px;
        background: #f8f8f8;
        border-radius: 4px;

        .rating-average {
          display: flex;
          align-items: center;

          .rating-value {
            font-size: 24px;
            color: #f56c6c;
            font-weight: bold;
            margin-right: 10px;
          }

          .rating-count {
            margin-left: 10px;
            font-size: 14px;
            color: #999;
          }
        }
      }

      .review-list {
        .no-reviews {
          text-align: center;
          padding: 20px;
          color: #999;
        }

        .review-item {
          padding: 20px 0;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }

          .review-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .reviewer {
              font-size: 14px;
              color: #333;
              margin-right: 10px;
            }

            .review-date {
              color: #999;
              font-size: 12px;
              margin-left: auto;
            }
          }

          .review-content {
            color: #666;
            line-height: 1.6;
            margin-bottom: 10px;
          }

          .review-reply {
            margin-top: 10px;
            background: #f8f8f8;
            padding: 12px;
            border-radius: 4px;

            .reply-header {
              font-size: 14px;
              color: #333;
              margin-bottom: 8px;
            }

            .reply-content {
              color: #666;
              line-height: 1.6;
              font-size: 14px;
            }
          }
        }
      }

      .reviews-pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    }
  }

  // 响应式调整
  @media (max-width: 768px) {
    .product-info {
      .product-image {
        height: 300px;
      }
    }
  }
}
</style> 