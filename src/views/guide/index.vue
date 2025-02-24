<template>
  <div class="guide">
    <div class="container">
      <el-card class="guide-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('guide.title') }}</h2>
          </div>
        </template>

        <div class="guide-content">
          <div class="guide-section">
            <h3>1. {{ $t('guide.registerLogin.title') }}</h3>
            <p>{{ $t('guide.registerLogin.desc') }}</p>
          </div>

          <div class="guide-section">
            <h3>2. {{ $t('guide.browseProducts.title') }}</h3>
            <p>{{ $t('guide.browseProducts.desc') }}</p>
            <ul>
              <li>{{ $t('guide.browseProducts.home') }}</li>
              <li>{{ $t('guide.browseProducts.category') }}</li>
              <li>{{ $t('guide.browseProducts.search') }}</li>
            </ul>
          </div>

          <div class="guide-section">
            <h3>3. {{ $t('guide.shopping.title') }}</h3>
            <p>{{ $t('guide.shopping.desc') }}</p>
            <ul>
              <li>{{ $t('guide.shopping.details') }}</li>
              <li>{{ $t('guide.shopping.quantity') }}</li>
              <li>{{ $t('guide.shopping.addToCart') }}</li>
            </ul>
          </div>

          <div class="guide-section">
            <h3>4. {{ $t('guide.cart.title') }}</h3>
            <p>{{ $t('guide.cart.desc') }}</p>
            <ul>
              <li>{{ $t('guide.cart.modify') }}</li>
              <li>{{ $t('guide.cart.delete') }}</li>
              <li>{{ $t('guide.cart.select') }}</li>
            </ul>
          </div>

          <div class="guide-section">
            <h3>5. {{ $t('guide.order.title') }}</h3>
            <p>{{ $t('guide.order.desc') }}</p>
            <ul>
              <li>{{ $t('guide.order.address') }}</li>
              <li>{{ $t('guide.order.confirm') }}</li>
              <li>{{ $t('guide.order.payment') }}</li>
              <li>{{ $t('guide.order.submit') }}</li>
            </ul>
          </div>

          <div class="guide-section">
            <h3>6. {{ $t('guide.notice.title') }}</h3>
            <p>{{ $t('guide.notice.desc') }}</p>
            <ul>
              <li>{{ $t('guide.notice.instruction') }}</li>
              <li>{{ $t('guide.notice.dosage') }}</li>
              <li>{{ $t('guide.notice.consult') }}</li>
            </ul>
          </div>

          <div class="guide-actions">
            <el-button type="primary" @click="$router.push('/')">
              {{ $t('guide.startShopping') }}
            </el-button>
            <el-button @click="$router.push('/category/all')">
              {{ $t('guide.browseAll') }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.guide {
  padding: 20px 0;

  .guide-card {
    max-width: 800px;
    margin: 0 auto;

    .card-header {
      h2 {
        margin: 0;
        font-size: 24px;
        color: #333;
      }
    }
  }

  .guide-content {
    .guide-section {
      margin-bottom: 30px;

      h3 {
        font-size: 18px;
        color: #333;
        margin-bottom: 15px;
      }

      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 10px;
      }

      ul {
        list-style: disc;
        padding-left: 20px;
        color: #666;

        li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
      }
    }

    .guide-actions {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 40px;
    }
  }
}
</style> 