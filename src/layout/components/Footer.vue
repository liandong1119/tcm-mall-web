<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- 服务保障 -->
        <div class="service-guarantee">
          <div class="service-item">
            <el-icon :size="32"><Van /></el-icon>
            <div class="text">
              <h4>{{ $t('footer.freeShipping') }}</h4>
              <p>{{ $t('footer.freeShippingDesc') }}</p>
            </div>
          </div>
          <div class="service-item">
            <el-icon :size="32"><GoodsFilled /></el-icon>
            <div class="text">
              <h4>{{ $t('footer.quality') }}</h4>
              <p>{{ $t('footer.qualityDesc') }}</p>
            </div>
          </div>
          <div class="service-item">
            <el-icon :size="32"><Service /></el-icon>
            <div class="text">
              <h4>{{ $t('footer.service') }}</h4>
              <p>{{ $t('footer.serviceDesc') }}</p>
            </div>
          </div>
          <div class="service-item">
            <el-icon :size="32"><RefreshRight /></el-icon>
            <div class="text">
              <h4>{{ $t('footer.return') }}</h4>
              <p>{{ $t('footer.returnDesc') }}</p>
            </div>
          </div>
        </div>

        <!-- 页脚导航 -->
        <div class="footer-nav">
          <div class="nav-group">
            <h3>{{ $t('footer.aboutUs') }}</h3>
            <ul>
              <!-- <li><a href="#">{{ $t('footer.aboutCompany') }}</a></li> -->
              <li><router-link to="/merchant/register">{{ $t('footer.merchantSettled') }}</router-link></li>
              <li><a href="#">{{ $t('footer.contactUs') }}</a></li>
              <li><a href="#">{{ $t('footer.joinUs') }}</a></li>
            </ul>
          </div>
          <div class="nav-group">
            <h3>{{ $t('footer.help') }}</h3>
            <ul>
              <li><a href="#">{{ $t('footer.paymentGuide') }}</a></li>
              <li><a href="#">{{ $t('footer.shippingGuide') }}</a></li>
              <li><a href="#">{{ $t('footer.returnGuide') }}</a></li>
            </ul>
          </div>
          <div class="nav-group">
            <h3>{{ $t('footer.service') }}</h3>
            <ul>
              <li><a href="#">{{ $t('footer.feedback') }}</a></li>
              <li><a href="#">{{ $t('footer.complaint') }}</a></li>
              <li><a href="#">{{ $t('footer.cooperation') }}</a></li>
            </ul>
          </div>
          <div class="nav-group">
            <h3>{{ $t('footer.followUs') }}</h3>
            <ul>
              <li><a href="#">{{ $t('footer.wechat') }}</a></li>
              <li><a href="#">{{ $t('footer.weibo') }}</a></li>
              <li><a href="#">{{ $t('footer.app') }}</a></li>
            </ul>
          </div>
          <div class="contact-info">
            <h3>{{ $t('footer.customerService') }}</h3>
            <div class="phone">400-123-4567</div>
            <div class="time">{{ $t('footer.serviceTime') }}</div>
          </div>
        </div>

        <!-- 版权信息 -->
        <div class="copyright">
          <p>{{ $t('footer.copyright') }}</p>
          <p>{{ $t('footer.icp') }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Van, GoodsFilled, Service, RefreshRight } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.footer {
  background-color: #f5f5f5;
  padding: 40px 0 20px;
  margin-top: 40px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.service-guarantee {
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
  border-bottom: 1px solid #e8e8e8;

  .service-item {
    display: flex;
    align-items: center;
    gap: 15px;

    .el-icon {
      color: var(--el-color-primary);
    }

    .text {
      h4 {
        margin: 0;
        font-size: 16px;
        color: #333;
      }

      p {
        margin: 5px 0 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.footer-nav {
  display: flex;
  justify-content: space-between;
  padding: 40px 0;
  border-bottom: 1px solid #e8e8e8;

  .nav-group {
    h3 {
      margin: 0 0 20px;
      font-size: 16px;
      color: #333;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 10px;

        a {
          color: #666;
          text-decoration: none;
          font-size: 14px;

          &:hover {
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  .contact-info {
    h3 {
      margin: 0 0 20px;
      font-size: 16px;
      color: #333;
    }

    .phone {
      font-size: 24px;
      color: var(--el-color-primary);
      font-weight: bold;
      margin-bottom: 10px;
    }

    .time {
      font-size: 12px;
      color: #999;
    }
  }
}

.copyright {
  padding: 20px 0;
  text-align: center;

  p {
    margin: 5px 0;
    font-size: 12px;
    color: #999;
  }
}
</style> 