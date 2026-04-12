<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <!-- Left: Brand + description -->
      <div class="footer-col">
        <div class="footer-logo">
          <span v-if="!isZh" class="logo-en">FULFILL<span class="dot">.</span>AVIATION</span>
          <span v-else class="logo-zh">赋瞻航空</span>
        </div>
        <p class="footer-desc">{{ isZh ? s.intro_text_zh : s.intro_text }}</p>
      </div>

      <!-- Middle: Quick links -->
      <div class="footer-col">
        <h4 class="footer-heading">{{ isZh ? '快速链接' : 'Quick Links' }}</h4>
        <nav class="footer-links">
          <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
        </nav>
      </div>

      <!-- Right: Contact (email only) -->
      <div class="footer-col">
        <h4 class="footer-heading">{{ isZh ? '联络方式' : 'Contact Us' }}</h4>
        <a v-if="s.email" :href="`mailto:${s.email}`" class="footer-email">{{ s.email }}</a>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <span v-if="!isZh">© {{ year }} {{ s.company_name || 'Shanghai Fulfill Aviation Ground Service Co., Ltd.' }} All rights reserved.</span>
        <span v-else>© {{ year }} {{ s.company_name_zh || '上海赋瞻航空地面服务有限公司' }} 版权所有</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const langStore = useLangStore()
const { isZh } = langStore
const s = settings.data
const year = new Date().getFullYear()

const navItems = computed(() => [
  { to: '/',         label: isZh.value ? (s.nav_home_zh     || '首页')        : (s.nav_home     || 'Home') },
  { to: '/news',     label: isZh.value ? (s.nav_news_zh     || '新闻')        : (s.nav_news     || 'News') },
  { to: '/services', label: isZh.value ? (s.nav_services_zh || '服务')        : (s.nav_services || 'Services') },
  { to: '/charter',  label: isZh.value ? (s.nav_charter_zh  || '定班和包机')  : (s.nav_charter  || 'Scheduled & Charter') },
  { to: '/about',    label: isZh.value ? (s.nav_about_zh    || '关于我们')    : (s.nav_about    || 'About Us') },
  { to: '/contact',  label: isZh.value ? (s.nav_contact_zh  || '联系我们')    : (s.nav_contact  || 'Contact') },
])
</script>

<style scoped>
.site-footer {
  background: var(--navy);
  color: rgba(255,255,255,0.7);
  margin-top: auto;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  padding: 60px 24px 48px;
}
.footer-col {}
.footer-logo { margin-bottom: 16px; }
.logo-en {
  font-size: 1rem; font-weight: 700;
  letter-spacing: 3px; color: white;
}
.logo-en .dot { color: var(--gold); }
.logo-zh { font-size: 1.1rem; font-weight: 700; color: white; }
.footer-desc {
  font-size: 0.85rem; line-height: 1.7;
  color: rgba(255,255,255,0.55);
  max-width: 320px;
}
.footer-heading {
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--gold); margin-bottom: 16px;
}
.footer-links {
  display: flex; flex-direction: column; gap: 10px;
}
.footer-links a {
  font-size: 0.85rem; color: rgba(255,255,255,0.65);
  transition: color 0.2s;
}
.footer-links a:hover { color: var(--gold); }
.footer-email {
  font-size: 0.85rem; color: rgba(255,255,255,0.65);
  word-break: break-all;
  transition: color 0.2s;
}
.footer-email:hover { color: var(--gold); }
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 18px 0;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.4);
  text-align: center;
}
@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr; gap: 32px; padding: 40px 24px 32px; }
}
</style>
