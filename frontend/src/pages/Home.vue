<template>
  <div class="home">
    <!-- ── Hero ── -->
    <section class="hero" :style="{ backgroundImage: heroBg }">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <transition name="fade" mode="out-in">
          <div :key="slide" class="hero-text">
            <span class="section-tag">{{ currentSlide.tag }}</span>
            <h1>{{ currentSlide.title }}</h1>
            <p>{{ currentSlide.sub }}</p>
            <RouterLink :to="slide === 0 ? '/about' : '/services'" class="btn btn-primary">
              {{ slide === 0 ? (isZh ? '了解更多' : 'Learn More') : (isZh ? '我们的服务' : 'Our Services') }}
            </RouterLink>
          </div>
        </transition>
      </div>
      <!-- Slide indicators -->
      <div class="hero-dots">
        <button v-for="i in 2" :key="i" :class="{ active: slide === i-1 }" @click="slide = i-1"></button>
      </div>
    </section>

    <!-- ── Stats bar ── -->
    <section class="stats-bar">
      <div class="container stats-grid">
        <div class="stat-item">
          <span class="stat-num">{{ s.stat_years || '10+' }}</span>
          <span class="stat-lbl">{{ isZh ? '年经验' : 'Years Experience' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ s.stat_destinations || '50+' }}</span>
          <span class="stat-lbl">{{ isZh ? '目的地' : 'Destinations' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ s.stat_partners || '1000+' }}</span>
          <span class="stat-lbl">{{ isZh ? (s.stat_partners_label_zh || '年度航班运营量') : (s.stat_partners_label || 'Annual Flights') }}</span>
        </div>
      </div>
      <div class="container intro-text">
        <p>{{ isZh ? s.intro_text_zh : s.intro_text }}</p>
      </div>
    </section>

    <!-- ── News preview ── -->
    <section class="news-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-tag">{{ isZh ? '最新动态' : 'Latest Updates' }}</span>
            <h2 class="section-title">{{ isZh ? '近期新闻' : 'Recent News' }}</h2>
          </div>
          <RouterLink to="/news" class="btn btn-outline">{{ isZh ? '全部新闻' : 'All News' }}</RouterLink>
        </div>

        <div v-if="newsLoading" class="spinner"></div>
        <div v-else class="news-grid">
          <RouterLink
            v-for="item in newsItems"
            :key="item.id"
            :to="`/news/${item.slug}`"
            class="news-card card"
          >
            <div class="news-img" :style="{ backgroundImage: item.image_url ? `url(${item.image_url})` : 'none' }">
              <span v-if="!item.image_url" class="news-img-placeholder">✈</span>
            </div>
            <div class="news-body">
              <p class="news-date">{{ item.created_at?.slice(0, 10) }}</p>
              <h3>{{ isZh ? item.title : (item.title_en || item.title) }}</h3>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── Services preview ── -->
    <section class="services-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-tag">{{ isZh ? '我们的服务' : 'What We Do' }}</span>
            <h2 class="section-title">{{ isZh ? '服务项目' : 'Our Services' }}</h2>
          </div>
          <RouterLink to="/services" class="btn btn-outline">{{ isZh ? '全部服务' : 'All Services' }}</RouterLink>
        </div>
        <div class="grid-3">
          <RouterLink
            v-for="svc in topServices"
            :key="svc.id"
            :to="`/services/${svc.slug}`"
            class="svc-card card"
          >
            <div class="svc-img" :style="{ backgroundImage: svc.image_url ? `url(${svc.image_url})` : 'none' }">
              <span v-if="!svc.image_url" class="svc-icon">{{ svc.icon }}</span>
            </div>
            <div class="svc-body">
              <h3>{{ isZh ? (svc.name_zh || svc.name) : svc.name }}</h3>
              <p>{{ isZh ? (svc.description_zh || svc.description) : svc.description }}</p>
              <span class="learn-more">{{ isZh ? '了解更多 →' : 'Learn More →' }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── Partners ── -->
    <PartnersCarousel />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useServicesStore } from '@/stores/services'
import { useLangStore } from '@/stores/lang'
import PartnersCarousel from '@/components/PartnersCarousel.vue'

const settings = useSettingsStore()
const servicesStore = useServicesStore()
const langStore = useLangStore()
const { isZh } = langStore
const s = settings.data

const slide = ref(0)
const newsItems = ref([])
const newsLoading = ref(true)
let slideTimer = null

const heroBg = ref('linear-gradient(135deg, #0b1f3a 0%, #1a3a5c 100%)')

const currentSlide = computed(() => {
  const zh = isZh.value
  if (slide.value === 0) return {
    tag:   zh ? (s.hero1_tag_zh   || s.hero1_tag   || 'Professional Aviation Services') : (s.hero1_tag   || 'Professional Aviation Services'),
    title: zh ? (s.hero1_title_zh || s.hero1_title || 'Technology-Led Aviation') : (s.hero1_title || 'Technology-Led Aviation'),
    sub:   zh ? (s.hero1_sub_zh   || s.hero1_sub   || '') : (s.hero1_sub   || ''),
  }
  return {
    tag:   zh ? (s.hero2_tag_zh   || s.hero2_tag   || 'Expanding Horizons') : (s.hero2_tag   || 'Expanding Horizons'),
    title: zh ? (s.hero2_title_zh || s.hero2_title || 'Opening Skies') : (s.hero2_title || 'Opening Skies'),
    sub:   zh ? (s.hero2_sub_zh   || s.hero2_sub   || '') : (s.hero2_sub   || ''),
  }
})

const topServices = computed(() => servicesStore.list.slice(0, 3))

onMounted(async () => {
  // Auto-advance slides
  slideTimer = setInterval(() => { slide.value = slide.value === 0 ? 1 : 0 }, 6000)

  // Fetch news
  try {
    const r = await fetch('/api/news?page=1&limit=6')
    const d = await r.json()
    newsItems.value = d.data || []
  } catch (e) {
    console.error(e)
  } finally {
    newsLoading.value = false
  }
})

onUnmounted(() => clearInterval(slideTimer))
</script>

<style scoped>
/* ── Hero ── */
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1f3a 0%, #1a3a5c 100%);
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex; align-items: center;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right, rgba(11,31,58,0.85) 40%, rgba(11,31,58,0.4));
}
.hero-content { position: relative; z-index: 1; padding-top: 70px; }
.hero-text { max-width: 680px; }
.hero-text .section-tag { display: block; margin-bottom: 16px; }
.hero-text h1 {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 700; color: white;
  line-height: 1.15; margin-bottom: 20px;
}
.hero-text p { font-size: 1.05rem; color: rgba(255,255,255,0.75); margin-bottom: 32px; }
.hero-dots {
  position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 10px; z-index: 2;
}
.hero-dots button {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,0.35); border: none;
  transition: background 0.2s, transform 0.2s;
}
.hero-dots button.active { background: var(--gold); transform: scale(1.3); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Stats bar ── */
.stats-bar {
  background: #0f2d4f;
  padding: 48px 0 40px;
  color: white;
}
.stats-grid {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 0; text-align: center; margin-bottom: 32px;
}
.stat-item {
  padding: 24px;
  border-right: 1px solid rgba(255,255,255,0.1);
}
.stat-item:last-child { border-right: none; }
.stat-num {
  display: block;
  font-size: 2.4rem; font-weight: 700; color: var(--gold);
  margin-bottom: 6px;
}
.stat-lbl { font-size: 0.82rem; letter-spacing: 1px; color: rgba(255,255,255,0.6); }
.intro-text {
  max-width: 800px;
  text-align: center;
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.8;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── News ── */
.news-section { padding: 80px 0; background: white; }
.section-head {
  display: flex; align-items: flex-end;
  justify-content: space-between; margin-bottom: 40px;
}
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.news-card { text-decoration: none; }
.news-img {
  height: 200px;
  background: var(--light) center/cover;
  display: flex; align-items: center; justify-content: center;
}
.news-img-placeholder { font-size: 2.5rem; opacity: 0.3; }
.news-body { padding: 20px; }
.news-date { font-size: 0.75rem; color: var(--gold); margin-bottom: 8px; font-weight: 600; }
.news-body h3 {
  font-size: 0.95rem; font-weight: 600;
  color: var(--navy); line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Services ── */
.services-section { padding: 80px 0; background: var(--light); }
.svc-card { text-decoration: none; }
.svc-img {
  height: 220px;
  background: var(--navy) center/cover;
  display: flex; align-items: center; justify-content: center;
}
.svc-icon { font-size: 3rem; }
.svc-body { padding: 24px; }
.svc-body h3 { font-size: 1.05rem; font-weight: 700; color: var(--navy); margin-bottom: 10px; }
.svc-body p { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
.learn-more { font-size: 0.8rem; font-weight: 600; color: var(--sky); letter-spacing: 0.5px; }

@media (max-width: 900px) {
  .news-grid { grid-template-columns: repeat(2,1fr); }
}
@media (max-width: 600px) {
  .news-grid, .stats-grid { grid-template-columns: 1fr; }
  .section-head { flex-direction: column; align-items: flex-start; gap: 16px; }
  .stats-bar { padding: 32px 0 24px; }
  .news-section, .services-section { padding: 56px 0; }
}
</style>
