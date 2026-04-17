<template>
  <div>
    <!-- ═══ HERO ═══════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="slide slide-1" :class="{ active: slide === 0 }">
        <div class="hero-content">
          <span class="hero-tag">{{ isZh ? (s.hero1_tag_zh || s.hero1_tag || 'Trusted Since 2015') : (s.hero1_tag || 'Trusted Since 2015') }}</span>
          <h1 class="hero-title" v-html="parseTitle(isZh ? (s.hero1_title_zh || s.hero1_title) : s.hero1_title, 'Technology&#8209;Led, Talent&#8209;Driven,<br>World-Class Aviation')"></h1>
          <p class="hero-sub">{{ isZh ? (s.hero1_sub_zh || s.hero1_sub || 'Professional. Reliable. Global.') : (s.hero1_sub || 'Professional. Reliable. Global.') }}</p>
          <RouterLink to="/about" class="hero-btn">{{ isZh ? '了解更多' : 'Learn More' }}</RouterLink>
        </div>
      </div>
      <div class="slide slide-2" :class="{ active: slide === 1 }">
        <div class="hero-content">
          <span class="hero-tag">{{ isZh ? (s.hero2_tag_zh || s.hero2_tag || 'Expanding Horizons') : (s.hero2_tag || 'Expanding Horizons') }}</span>
          <h1 class="hero-title" v-html="parseTitle(isZh ? (s.hero2_title_zh || s.hero2_title) : s.hero2_title, 'Opening Skies,<br>Enabling Journeys')"></h1>
          <p class="hero-sub">{{ isZh ? (s.hero2_sub_zh || s.hero2_sub || 'Making flight better for everyone.') : (s.hero2_sub || 'Making flight better for everyone.') }}</p>
          <RouterLink to="/services" class="hero-btn">{{ isZh ? '我们的服务' : 'Our Services' }}</RouterLink>
        </div>
      </div>
      <div class="slide-dots">
        <div class="dot" :class="{ active: slide === 0 }" @click="goSlide(0)"></div>
        <div class="dot" :class="{ active: slide === 1 }" @click="goSlide(1)"></div>
      </div>
    </section>

    <!-- ═══ INTRO STRIP ═══════════════════════════════════════════ -->
    <div class="intro-strip">
      <p class="intro-text">{{ isZh ? (s.intro_text_zh || s.intro_text) : (s.intro_text || '') }}</p>
      <div class="intro-divider"></div>
      <div class="intro-stat">
        <span class="num">{{ s.stat_years || '10+' }}</span>
        <span class="label">{{ isZh ? '年经验' : 'Years Experience' }}</span>
      </div>
      <div class="intro-divider"></div>
      <div class="intro-stat">
        <span class="num">{{ s.stat_destinations || '50+' }}</span>
        <span class="label">{{ isZh ? '目的地' : 'Destinations' }}</span>
      </div>
      <div class="intro-divider"></div>
      <div class="intro-stat">
        <span class="num">{{ s.stat_partners || '2000+' }}</span>
        <span class="label">{{ isZh ? (s.stat_partners_label_zh || '年度航班运营量') : (s.stat_partners_label || 'Annual Flights') }}</span>
      </div>
    </div>

    <!-- ═══ NEWS ══════════════════════════════════════════════════ -->
    <section class="news">
      <div class="section-header">
        <span class="section-tag">{{ isZh ? '最新动态' : 'Latest Updates' }}</span>
        <h2 class="section-title">{{ isZh ? '近期新闻' : 'Recent News' }}</h2>
      </div>
      <div class="news-grid">
        <!-- 图片区 -->
        <div class="news-images">
          <RouterLink
            v-for="item in newsItems.slice(0, 6)"
            :key="item.id"
            :to="`/news/${item.slug}`"
            class="news-img-item"
          >
            <img v-if="item.image_url" :src="item.image_url" :alt="item.title" />
            <div v-else class="news-img-placeholder"></div>
          </RouterLink>
          <!-- fill empty slots -->
          <div v-for="i in Math.max(0, 6 - newsItems.length)" :key="'ph'+i" class="news-img-item">
            <div class="news-img-placeholder"></div>
          </div>
        </div>
        <!-- 列表 -->
        <div class="news-list">
          <RouterLink
            v-for="item in newsItems.slice(0, 3)"
            :key="item.id"
            :to="`/news/${item.slug}`"
            class="news-item"
          >
            <span class="news-date">{{ (item.publish_date || item.created_at)?.slice(0, 10) }}</span>
            <span class="news-item-title">{{ isZh ? item.title : (item.title_en || item.title) }}</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ═══ SERVICES ══════════════════════════════════════════════ -->
    <section class="services">
      <div class="section-header">
        <span class="section-tag">{{ isZh ? '我们的服务' : 'What We Do' }}</span>
        <h2 class="section-title">{{ isZh ? '服务项目' : 'Our Services' }}</h2>
      </div>
      <div class="services-grid">
        <RouterLink
          v-for="(svc, i) in topServices"
          :key="svc.id"
          :to="`/services/${svc.slug}`"
          class="service-card"
        >
          <div class="service-card-bg"
            :style="svc.image_url
              ? { backgroundImage: `url(${svc.image_url})` }
              : { background: BG_GRADIENTS[i % BG_GRADIENTS.length] }">
          </div>
          <div class="service-card-overlay"></div>
          <div class="service-card-content">
            <span class="service-icon">{{ svc.icon }}</span>
            <div class="service-name">{{ isZh ? (svc.name_zh || svc.name) : svc.name }}</div>
            <p class="service-desc">{{ isZh ? (svc.description_zh || svc.description) : svc.description }}</p>
            <span class="service-link">{{ isZh ? '了解更多' : 'Learn More' }}</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- ═══ PARTNERS ═══════════════════════════════════════════════ -->
    <PartnersCarousel />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useServicesStore } from '@/stores/services'
import { useLangStore } from '@/stores/lang'
import PartnersCarousel from '@/components/PartnersCarousel.vue'

const settings = useSettingsStore()
const servicesStore = useServicesStore()
const { isZh } = storeToRefs(useLangStore())
const { data: s } = storeToRefs(settings)

const BG_GRADIENTS = [
  'linear-gradient(160deg,#0b2d52,#1a6ea8)',
  'linear-gradient(160deg,#0d3a60,#0f5487)',
  'linear-gradient(160deg,#091a33,#14487a)',
  'linear-gradient(160deg,#0b2540,#1a5a8a)',
  'linear-gradient(160deg,#102030,#1a4060)',
  'linear-gradient(160deg,#0a1828,#1a3858)',
]

const slide = ref(0)
const newsItems = ref([])
let slideTimer = null

const topServices = computed(() => servicesStore.list.slice(0, 6))

function goSlide(n) {
  slide.value = n
}

onMounted(async () => {
  slideTimer = setInterval(() => {
    slide.value = slide.value === 0 ? 1 : 0
  }, 6000)

  try {
    const r = await fetch('/api/news?page=1&limit=6')
    const d = await r.json()
    newsItems.value = d.data || []
  } catch (e) {
    console.error(e)
  }
})

onUnmounted(() => clearInterval(slideTimer))

function parseTitle(txt, fallback) {
  if (!txt) return fallback
  return txt.replace(/\\n/g, '<br>').replace(/\n/g, '<br>')
}
</script>

<style scoped>
/* ── HERO ── */
.hero { position: relative; height: calc(100vh - 168px); overflow: hidden; }
.slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1.2s ease; }
.slide.active { opacity: 1; }
.slide-1 { background: linear-gradient(135deg, #0b1f3a 0%, #1a6ea8 50%, #0b2d52 100%); }
.slide-2 { background: linear-gradient(135deg, #0d2640 0%, #0f4c75 60%, #1a6ea8 100%); }
.slide::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 100%); }
.hero-content { position: absolute; z-index: 2; bottom: 22%; left: 10%; right: 10%; }
.hero-tag { display: inline-block; background: var(--gold); color: var(--navy); font-size: 0.7rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; padding: 5px 14px; margin-bottom: 20px; }
.hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4.5vw, 3.8rem); font-weight: 300; color: var(--white); line-height: 1.25; margin-bottom: 20px; }
.hero-sub { color: rgba(255,255,255,0.75); font-size: 1rem; font-weight: 300; line-height: 1.7; margin-bottom: 32px; }
.hero-btn { display: inline-block; border: 1px solid var(--gold); color: var(--gold); padding: 12px 32px; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s; font-family: 'Barlow', sans-serif; }
.hero-btn:hover { background: var(--gold); color: var(--navy); }
.slide-dots { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 3; }
.dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.5); background: transparent; cursor: pointer; transition: all 0.3s; }
.dot.active { background: var(--gold); border-color: var(--gold); }

/* ── INTRO STRIP ── */
.intro-strip { background: var(--navy); padding: 48px 10%; display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.intro-text { color: rgba(255,255,255,0.85); font-size: 1rem; font-weight: 300; line-height: 1.8; max-width: 700px; }
.intro-divider { width: 1px; height: 80px; background: var(--gold); flex-shrink: 0; }
.intro-stat { text-align: center; flex-shrink: 0; }
.intro-stat .num { font-family: 'Barlow', sans-serif; font-weight: 300; font-size: 2.8rem; color: var(--gold); display: block; }
.intro-stat .label { color: rgba(255,255,255,0.6); font-size: 0.78rem; letter-spacing: 1px; }

/* ── SECTION HEADER ── */
.section-header { text-align: center; padding: 72px 10% 48px; }
.section-tag { display: inline-block; color: var(--sky); font-size: 0.72rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; border-bottom: 2px solid var(--gold); padding-bottom: 4px; margin-bottom: 16px; }
.section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 400; color: var(--navy); }

/* ── NEWS ── */
.news { background: var(--light); }
.news-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; padding: 0 10% 72px; }
.news-images { display: flex; gap: 10px; flex-wrap: wrap; align-content: flex-start; }
.news-img-item { flex: 1 1 calc(33% - 10px); min-width: 120px; height: 110px; background: #c9d6e3; border-radius: 2px; overflow: hidden; cursor: pointer; display: block; }
.news-img-item img { width: 100%; height: 100%; object-fit: cover; }
.news-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #c9d6e3, #a8bfd4); }
.news-item { display: flex; align-items: flex-start; gap: 16px; padding: 18px 0; border-bottom: 1px solid #dde3ec; cursor: pointer; transition: all 0.2s; text-decoration: none; }
.news-item:hover .news-item-title { color: var(--sky); }
.news-date { flex-shrink: 0; color: var(--gold); font-size: 0.8rem; font-weight: 500; min-width: 90px; padding-top: 2px; }
.news-item-title { font-size: 0.9rem; line-height: 1.55; color: var(--text); transition: color 0.2s; }

/* ── SERVICES ── */
.services { background: var(--white); }
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; padding: 0 0 72px; }
.service-card { position: relative; overflow: hidden; height: 380px; display: block; text-decoration: none; }
.service-card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.6s ease; }
.service-card:hover .service-card-bg { transform: scale(1.06); }
.service-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%); }
.service-card-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 32px; z-index: 2; }
.service-icon { font-size: 2rem; margin-bottom: 12px; display: block; }
.service-name { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--white); font-weight: 400; margin-bottom: 8px; }
.service-desc { color: rgba(255,255,255,0.7); font-size: 0.82rem; line-height: 1.6; margin-bottom: 16px; }
.service-link { display: inline-block; color: var(--gold); font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid var(--gold); padding-bottom: 2px; }

@media (max-width: 900px) {
  .intro-strip { flex-direction: column; padding: 40px 6%; }
  .intro-divider { width: 80px; height: 1px; }
  .news-grid { grid-template-columns: 1fr; padding: 0 6% 56px; }
  .services-grid { grid-template-columns: 1fr; }
  .hero-content { left: 6%; bottom: 18%; }
}
</style>
