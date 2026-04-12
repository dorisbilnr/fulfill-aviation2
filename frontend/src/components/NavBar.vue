<template>
  <header class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container nav-inner">
      <!-- Logo -->
      <RouterLink to="/" class="nav-logo">
        <span v-if="!isZh" class="logo-en">FULFILL<span class="dot">.</span>AVIATION</span>
        <span v-else class="logo-zh">赋瞻航空</span>
      </RouterLink>

      <!-- Nav links -->
      <nav class="nav-links">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link">
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- Language switcher -->
      <div class="lang-switcher">
        <button :class="{ active: !isZh }" @click="setLang('en')">EN</button>
        <button :class="{ active: isZh }" @click="setLang('zh')">中文</button>
      </div>

      <!-- Mobile hamburger -->
      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <div class="mobile-menu" :class="{ open: menuOpen }">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="mobile-link" @click="menuOpen = false">
        {{ item.label }}
      </RouterLink>
      <div class="mobile-lang">
        <button :class="{ active: !isZh }" @click="setLang('en'); menuOpen=false">EN</button>
        <button :class="{ active: isZh }" @click="setLang('zh'); menuOpen=false">中文</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const langStore = useLangStore()
const { isZh, setLang } = langStore

const isScrolled = ref(false)
const menuOpen = ref(false)

const navItems = computed(() => {
  const s = settings.data
  const zh = isZh.value
  return [
    { to: '/',        label: zh ? (s.nav_home_zh     || '首页')        : (s.nav_home     || 'Home') },
    { to: '/news',    label: zh ? (s.nav_news_zh     || '新闻')        : (s.nav_news     || 'News') },
    { to: '/services',label: zh ? (s.nav_services_zh || '服务')        : (s.nav_services || 'Services') },
    { to: '/charter', label: zh ? (s.nav_charter_zh  || '定班和包机')  : (s.nav_charter  || 'Scheduled & Charter') },
    { to: '/about',   label: zh ? (s.nav_about_zh    || '关于我们')    : (s.nav_about    || 'About Us') },
    { to: '/contact', label: zh ? (s.nav_contact_zh  || '联系我们')    : (s.nav_contact  || 'Contact') },
  ]
})

function onScroll() { isScrolled.value = window.scrollY > 40 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: transparent;
  transition: background 0.3s, box-shadow 0.3s;
}
.navbar.scrolled {
  background: var(--navy);
  box-shadow: 0 2px 20px rgba(0,0,0,0.3);
}
.nav-inner {
  display: flex; align-items: center; gap: 32px;
  height: 70px;
}
.nav-logo { flex-shrink: 0; }
.logo-en {
  font-size: 1.1rem; font-weight: 700; letter-spacing: 3px;
  color: white; text-transform: uppercase;
}
.logo-en .dot { color: var(--gold); }
.logo-zh {
  font-size: 1.2rem; font-weight: 700;
  color: white; letter-spacing: 2px;
}
.nav-links {
  display: flex; gap: 4px; flex: 1; justify-content: center;
}
.nav-link {
  padding: 6px 14px;
  color: rgba(255,255,255,0.8);
  font-size: 0.82rem; font-weight: 500; letter-spacing: 0.5px;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  white-space: nowrap;
}
.nav-link:hover,
.nav-link.router-link-active { color: white; border-bottom-color: var(--gold); }

.lang-switcher { display: flex; gap: 6px; flex-shrink: 0; }
.lang-switcher button {
  background: none;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.65);
  padding: 4px 10px;
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.5px;
  transition: all 0.2s;
}
.lang-switcher button.active {
  border-color: var(--gold); color: var(--gold);
}
.lang-switcher button:hover { border-color: white; color: white; }

.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; padding: 4px;
}
.hamburger span {
  display: block; width: 22px; height: 2px;
  background: white; transition: all 0.2s;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background: var(--navy);
  padding: 0;
  max-height: 0; overflow: hidden;
  transition: max-height 0.3s ease;
}
.mobile-menu.open { max-height: 500px; padding: 12px 0; }
.mobile-link {
  padding: 12px 24px;
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.mobile-link:hover,
.mobile-link.router-link-active { color: var(--gold); }
.mobile-lang {
  display: flex; gap: 10px; padding: 12px 24px;
}
.mobile-lang button {
  background: none; border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.65);
  padding: 5px 14px; font-size: 0.8rem; font-weight: 600;
}
.mobile-lang button.active { border-color: var(--gold); color: var(--gold); }

@media (max-width: 900px) {
  .nav-links { display: none; }
  .lang-switcher { display: none; }
  .hamburger { display: flex; margin-left: auto; }
  .mobile-menu { display: flex; }
}
</style>
