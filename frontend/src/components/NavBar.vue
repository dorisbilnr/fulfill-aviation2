<template>
  <nav class="gn">
    <RouterLink to="/" class="gn-logo">
      <span v-if="!isZh" class="logo-en">FULFILL<span>.</span>AVIATION</span>
      <span v-else class="logo-zh">赋瞻<span>.</span>航空</span>
    </RouterLink>

    <ul class="gn-links">
      <li v-for="item in navItems" :key="item.to">
        <RouterLink :to="item.to" :class="{ active: isActive(item.to) }">{{ item.label }}</RouterLink>
      </li>
    </ul>

    <div class="gn-right">
      <div class="gn-lang">
        <button :class="{ active: isZh }" @click="setLang('zh')">中文</button>
        <button :class="{ active: !isZh }" @click="setLang('en')">EN</button>
      </div>
      <button class="gn-burger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <div class="gn-mobile" :class="{ open: menuOpen }">
    <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
      :class="{ active: isActive(item.to) }"
      @click="menuOpen = false">
      {{ item.label }}
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const langStore = useLangStore()
const { isZh } = storeToRefs(langStore)
const { setLang } = langStore
const { data: sd } = storeToRefs(settings)
const route = useRoute()
const menuOpen = ref(false)

const navItems = computed(() => {
  const s = sd.value
  const zh = isZh.value
  return [
    { to: '/',         label: zh ? (s.nav_home_zh     || '首页')       : (s.nav_home     || 'Home') },
    { to: '/news',     label: zh ? (s.nav_news_zh     || '新闻动态')   : (s.nav_news     || 'News') },
    { to: '/services', label: zh ? (s.nav_services_zh || '服务')       : (s.nav_services || 'Services') },
    { to: '/charter',  label: zh ? (s.nav_charter_zh  || '定班和包机') : (s.nav_charter  || 'Scheduled & Charter') },
    { to: '/about',    label: zh ? (s.nav_about_zh    || '关于我们')   : (s.nav_about    || 'About Us') },
    { to: '/contact',  label: zh ? (s.nav_contact_zh  || '联系我们')   : (s.nav_contact  || 'Contact') },
  ]
})

function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<style scoped>
/* ── Main bar ── */
nav.gn {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  background: rgba(11, 31, 58, 0.97);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-family: 'Barlow', sans-serif;
}

/* ── Logo ── */
nav.gn .gn-logo {
  font-family: 'Barlow', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 3px;
  text-decoration: none;
  flex-shrink: 0;
  text-transform: uppercase;
}
nav.gn .gn-logo span { color: #c8a96e; }
.logo-zh { font-size: 1.1rem; }

/* ── Desktop links ── */
nav.gn .gn-links {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  flex: 1;
  justify-content: center;
}
nav.gn .gn-links a {
  font-family: 'Barlow', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  display: block;
}
nav.gn .gn-links a:hover,
nav.gn .gn-links a.active,
nav.gn .gn-links a.router-link-active {
  color: #c8a96e;
  border-bottom-color: #c8a96e;
}

/* ── Right side ── */
nav.gn .gn-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
nav.gn .gn-lang {
  display: flex;
  gap: 6px;
}
nav.gn .gn-lang button {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  padding: 4px 10px;
  font-size: 0.72rem;
  font-family: 'Barlow', sans-serif;
  letter-spacing: 1px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
nav.gn .gn-lang button:hover { border-color: #c8a96e; color: #c8a96e; }
nav.gn .gn-lang button.active { border-color: #c8a96e; color: #c8a96e; }

/* ── Burger ── */
nav.gn .gn-burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 4px;
  background: none;
  border: none;
}
nav.gn .gn-burger span {
  display: block;
  width: 24px;
  height: 2px;
  background: rgba(255, 255, 255, 0.85);
  transition: transform 0.3s, opacity 0.3s;
}
nav.gn .gn-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
nav.gn .gn-burger.open span:nth-child(2) { opacity: 0; }
nav.gn .gn-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Mobile dropdown ── */
.gn-mobile {
  display: none;
  position: fixed;
  top: 68px; left: 0; right: 0;
  background: rgba(11, 31, 58, 0.99);
  padding: 12px 0;
  z-index: 999;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.gn-mobile.open { display: block; }
.gn-mobile a {
  display: block;
  padding: 13px 32px;
  font-family: 'Barlow', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.gn-mobile a:hover,
.gn-mobile a.active,
.gn-mobile a.router-link-active {
  color: #c8a96e;
  border-left-color: #c8a96e;
  background: rgba(255, 255, 255, 0.04);
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  nav.gn { padding: 0 28px; }
  nav.gn .gn-links { gap: 14px; }
  nav.gn .gn-links a { font-size: 0.78rem; letter-spacing: 0.5px; }
}
@media (max-width: 860px) {
  nav.gn .gn-links { display: none; }
  nav.gn .gn-burger { display: flex; }
  .gn-mobile { display: none; } /* shown via .open class */
  .gn-mobile.open { display: block; }
}
@media (max-width: 480px) {
  nav.gn { padding: 0 16px; }
}
</style>
