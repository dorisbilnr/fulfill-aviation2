<template>
  <footer>
    <div class="footer-grid">
      <!-- Brand -->
      <div class="footer-brand">
        <RouterLink to="/" class="gn-logo">
          <span v-if="!isZh" class="logo-en">FULFILL<span>.</span>AVIATION</span>
          <span v-else class="logo-zh">赋瞻<span>.</span>航空</span>
        </RouterLink>
        <p class="footer-desc">
          {{ isZh ? (s.intro_text_zh || s.intro_text) : (s.intro_text || '') }}
        </p>
        <div v-if="s.wechat_qr" class="footer-qr">
          <img :src="s.wechat_qr" alt="WeChat QR" />
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-col">
        <h4>{{ isZh ? '快速链接' : 'Quick Links' }}</h4>
        <ul>
          <li v-for="item in navItems" :key="item.to">
            <RouterLink :to="item.to">{{ item.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div class="footer-col footer-contact">
        <h4>{{ isZh ? '联络方式' : 'Contact Us' }}</h4>
        <p v-if="s.address || s.address_zh">
          <strong>{{ isZh ? '地址：' : 'Address:' }}</strong>
          {{ isZh ? (s.address_zh || s.address) : (s.address || s.address_zh) }}
        </p>
        <p v-if="s.phone">
          <strong>{{ isZh ? '电话：' : 'Phone:' }}</strong>
          {{ s.phone }}
        </p>
        <p v-if="s.fax">
          <strong>{{ isZh ? '传真：' : 'Fax:' }}</strong>
          {{ s.fax }}
        </p>
        <p v-if="s.email">
          <strong>{{ isZh ? '邮箱：' : 'Email:' }}</strong>
          <a :href="`mailto:${s.email}`">{{ s.email }}</a>
        </p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© {{ year }} {{ isZh ? (s.company_name_zh || '上海赋瞻航空地面服务有限公司') : (s.company_name || 'Shanghai Fulfill Aviation Ground Service Co., Ltd.') }}. {{ isZh ? '版权所有' : 'All rights reserved.' }}</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const { isZh } = storeToRefs(useLangStore())
const { data: s } = storeToRefs(settings)
const year = new Date().getFullYear()

const navItems = computed(() => [
  { to: '/',         label: isZh.value ? (s.value.nav_home_zh     || '首页')       : (s.value.nav_home     || 'Home') },
  { to: '/news',     label: isZh.value ? (s.value.nav_news_zh     || '新闻动态')   : (s.value.nav_news     || 'News') },
  { to: '/services', label: isZh.value ? (s.value.nav_services_zh || '服务')       : (s.value.nav_services || 'Services') },
  { to: '/charter',  label: isZh.value ? (s.value.nav_charter_zh  || '定班和包机') : (s.value.nav_charter  || 'Scheduled & Charter') },
  { to: '/about',    label: isZh.value ? (s.value.nav_about_zh    || '关于我们')   : (s.value.nav_about    || 'About Us') },
  { to: '/contact',  label: isZh.value ? (s.value.nav_contact_zh  || '联系我们')   : (s.value.nav_contact  || 'Contact') },
])
</script>

<style scoped>
footer {
  background: var(--navy);
  padding: 56px 10%;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.gn-logo {
  font-family: 'Barlow', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 3px;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.gn-logo span { color: #c8a96e; }
.logo-zh { font-size: 1.1rem; }
.footer-desc {
  color: rgba(255,255,255,0.55);
  font-size: 0.85rem;
  line-height: 1.8;
  margin-bottom: 20px;
}
.footer-qr {
  width: 80px; height: 80px;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.footer-qr img { width: 100%; height: 100%; object-fit: contain; }

.footer-col h4 {
  color: var(--gold);
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-family: 'Barlow', sans-serif;
}
.footer-col ul { list-style: none; }
.footer-col ul li { margin-bottom: 10px; }
.footer-col ul li a {
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  transition: color 0.2s;
  text-decoration: none;
}
.footer-col ul li a:hover { color: var(--gold); }

.footer-contact p {
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  margin-bottom: 10px;
  line-height: 1.6;
}
.footer-contact strong { color: rgba(255,255,255,0.85); }
.footer-contact a {
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-contact a:hover { color: var(--gold); }

.footer-bottom {
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-bottom p {
  color: rgba(255,255,255,0.35);
  font-size: 0.78rem;
}

@media (max-width: 900px) {
  footer { padding: 40px 6%; }
  .footer-grid { grid-template-columns: 1fr; gap: 32px; }
}
</style>
