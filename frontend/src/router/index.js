import { createRouter, createWebHistory } from 'vue-router'
import { useLangStore } from '@/stores/lang'
import { useSettingsStore } from '@/stores/settings'

const routes = [
  { path: '/',           component: () => import('@/pages/Home.vue'),          name: 'home' },
  { path: '/news',       component: () => import('@/pages/NewsList.vue'),       name: 'news' },
  { path: '/news/:slug', component: () => import('@/pages/NewsDetail.vue'),     name: 'news-detail' },
  { path: '/services',   component: () => import('@/pages/ServicesList.vue'),   name: 'services' },
  { path: '/services/:slug', component: () => import('@/pages/ServiceDetail.vue'), name: 'service-detail' },
  { path: '/charter',    component: () => import('@/pages/Charter.vue'),        name: 'charter' },
  { path: '/about',      component: () => import('@/pages/About.vue'),          name: 'about' },
  { path: '/contact',    component: () => import('@/pages/Contact.vue'),        name: 'contact' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

// Update document title on route change
router.afterEach((to) => {
  const lang = useLangStore()
  const settings = useSettingsStore()
  const zh = lang.isZh
  const brand = zh ? '赋瞻航空' : 'Fulfill Aviation'
  const titles = {
    home:           zh ? '上海赋瞻航空地面服务' : 'Shanghai Fulfill Aviation Ground Service',
    news:           zh ? `新闻 — ${brand}` : `News — ${brand}`,
    services:       zh ? `服务 — ${brand}` : `Services — ${brand}`,
    charter:        zh ? `定班和包机 — ${brand}` : `Scheduled & Charter — ${brand}`,
    about:          zh ? `关于我们 — ${brand}` : `About Us — ${brand}`,
    contact:        zh ? `联系我们 — ${brand}` : `Contact — ${brand}`,
    'news-detail':  null, // set dynamically in page
    'service-detail': null,
  }
  const t = titles[to.name]
  if (t) document.title = t
})

export default router
