<template>
  <div>
    <!-- Page Hero -->
    <div class="page-hero" :style="s.about_hero_image ? { backgroundImage: `url(${s.about_hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
      <div class="page-hero-content">
        <span class="page-tag">{{ isZh ? '我们的故事' : 'Our Story' }}</span>
        <h1 class="page-title">{{ isZh ? '关于我们' : 'About Us' }}</h1>
      </div>
    </div>

    <div class="container">
      <!-- About story grid -->
      <div class="about-grid">
        <div class="about-img">
          <img v-if="s.about_section_image" :src="s.about_section_image" alt="Company" style="width:100%;height:100%;object-fit:cover;" />
          <div v-else class="img-ph">{{ isZh ? '公司照片' : 'Company photo' }}</div>
        </div>
        <div class="about-body">
          <div class="gold-line"></div>
          <h2>{{ isZh ? (s.about_title_zh || s.about_title || '专业航空地面服务') : (s.about_title || 'Leading Aviation Ground Services') }}</h2>
          <div v-if="s.about_body || s.about_body_zh"
            v-html="isZh ? (s.about_body_zh || s.about_body) : (s.about_body || s.about_body_zh)">
          </div>
          <template v-else>
            <p>Shanghai Fulfill Aviation Ground Service is a professional aviation services company dedicated to providing world-class operational support and travel solutions.</p>
            <p>We specialize in commercial aviation, business aviation, and general aviation sectors, serving governments, enterprises, aircraft manufacturers, airlines, and aircraft owners.</p>
          </template>
        </div>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-box">
          <span class="stat-num">{{ s.stat_years || '10+' }}</span>
          <div class="stat-lbl">{{ isZh ? '年经验' : 'Years Experience' }}</div>
        </div>
        <div class="stat-box">
          <span class="stat-num">{{ s.stat_destinations || '50+' }}</span>
          <div class="stat-lbl">{{ isZh ? '目的地' : 'Destinations' }}</div>
        </div>
        <div class="stat-box">
          <span class="stat-num">{{ s.stat_partners || '1000+' }}</span>
          <div class="stat-lbl">{{ isZh ? (s.stat_partners_label_zh || '年度航班运营量') : (s.stat_partners_label || 'Annual Flights') }}</div>
        </div>
      </div>

      <!-- Office carousel -->
      <div class="section-label" style="margin-top:72px;">{{ isZh ? '我们的办公室' : 'Our Office' }}</div>
      <div class="carousel-wrap" v-if="gallery.length">
        <div class="carousel-track" :style="{ transform: `translateX(-${current * 100}%)` }">
          <img v-for="img in gallery" :key="img.id"
            class="carousel-slide" :src="img.url" :alt="img.caption || 'Office photo'" />
        </div>
        <button class="carousel-btn carousel-prev" @click="goTo(current - 1)">&#8249;</button>
        <button class="carousel-btn carousel-next" @click="goTo(current + 1)">&#8250;</button>
        <div class="carousel-dots">
          <button v-for="(_, i) in gallery" :key="i"
            class="carousel-dot" :class="{ active: i === current }"
            @click="goTo(i)">
          </button>
        </div>
        <div v-if="gallery[current]?.caption" class="carousel-caption">
          {{ gallery[current].caption }}
        </div>
      </div>
      <div v-else class="carousel-empty">
        <span class="c-icon">🏢</span>
        <span>{{ isZh ? '请从后台上传办公室照片' : 'Upload office photos from Admin → Company Photo Carousel' }}</span>
      </div>

      <!-- Get In Touch -->
      <div class="section-label" style="margin-top:72px;">{{ isZh ? '联系我们' : 'Get In Touch' }}</div>
      <div class="contact-grid">
        <div>
          <div class="contact-row">
            <span class="c-icon2">📍</span>
            <div>
              <div class="c-label">{{ isZh ? '地址' : 'Address' }}</div>
              <div class="c-value">{{ isZh ? (s.address_zh || s.address) : (s.address || '') }}</div>
            </div>
          </div>
          <div class="contact-row">
            <span class="c-icon2">📞</span>
            <div>
              <div class="c-label">{{ isZh ? '电话' : 'Phone' }}</div>
              <div class="c-value">{{ s.phone }}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="contact-row">
            <span class="c-icon2">✉️</span>
            <div>
              <div class="c-label">{{ isZh ? '邮箱' : 'Email' }}</div>
              <div class="c-value"><a :href="`mailto:${s.email}`">{{ s.email }}</a></div>
            </div>
          </div>
          <div class="contact-row">
            <span class="c-icon2">🕐</span>
            <div>
              <div class="c-label">{{ isZh ? '营业时间' : 'Business Hours' }}</div>
              <div class="c-value">{{ isZh ? (s.business_hours_zh || s.business_hours) : s.business_hours }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const { isZh } = storeToRefs(useLangStore())
const { data: s } = storeToRefs(settings)
const gallery = ref([])
const current = ref(0)
let timer = null

function goTo(n) {
  if (!gallery.value.length) return
  current.value = ((n % gallery.value.length) + gallery.value.length) % gallery.value.length
}

onMounted(async () => {
  try {
    const r = await fetch('/api/gallery')
    gallery.value = await r.json()
    if (gallery.value.length > 1) {
      timer = setInterval(() => goTo(current.value + 1), 5000)
    }
  } catch (e) {
    console.error(e)
  }
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.page-hero {
  padding-top: 70px; height: 260px;
  background: linear-gradient(135deg, #0b1f3a, #1a6ea8);
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; text-align: center; position: relative;
}
.page-hero::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.3); }
.page-hero-content { position: relative; z-index: 1; }
.page-tag { display: inline-block; background: var(--gold); color: var(--navy); font-size: 0.7rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; padding: 5px 14px; margin-bottom: 14px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; color: var(--white); font-weight: 300; }

.container { max-width: 1100px; margin: 0 auto; padding: 72px 40px; }
.section-label { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: var(--navy); border-bottom: 2px solid var(--gold); padding-bottom: 12px; margin-bottom: 32px; display: inline-block; }

/* About grid */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; margin-bottom: 72px; }
.about-img { height: 420px; background: linear-gradient(135deg, #c9d6e3, #a8bfd4); border-radius: 4px; overflow: hidden; }
.img-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #5a7a99; font-size: 0.85rem; }
.gold-line { width: 48px; height: 3px; background: var(--gold); margin-bottom: 20px; }
.about-body h2 { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; color: var(--navy); font-weight: 300; margin-bottom: 20px; line-height: 1.3; }
.about-body :deep(p), .about-body p { color: #4a5568; font-size: 0.92rem; line-height: 1.85; margin-bottom: 16px; }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: var(--navy); margin-bottom: 72px; }
.stat-box { padding: 40px 24px; text-align: center; background: var(--navy); }
.stat-num { font-family: 'Barlow', sans-serif; font-size: 3rem; font-weight: 300; color: var(--gold); display: block; }
.stat-lbl { color: rgba(255,255,255,0.6); font-size: 0.78rem; letter-spacing: 1px; margin-top: 6px; }

/* Carousel */
.carousel-wrap { position: relative; width: 100%; overflow: hidden; background: var(--navy); border-radius: 4px; margin-bottom: 72px; }
.carousel-track { display: flex; transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
.carousel-slide { flex-shrink: 0; width: 100%; height: 480px; object-fit: cover; display: block; }
.carousel-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(11,31,58,0.7); border: 1px solid rgba(200,169,110,0.4);
  color: var(--gold); width: 44px; height: 44px; border-radius: 50%;
  cursor: pointer; font-size: 1.4rem; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; z-index: 10;
}
.carousel-btn:hover { background: rgba(200,169,110,0.2); border-color: var(--gold); }
.carousel-prev { left: 16px; }
.carousel-next { right: 16px; }
.carousel-dots { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
.carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.35); cursor: pointer; transition: all 0.2s; border: none; padding: 0; }
.carousel-dot.active { background: var(--gold); width: 22px; border-radius: 4px; }
.carousel-caption { position: absolute; bottom: 36px; left: 0; right: 0; text-align: center; color: rgba(255,255,255,0.7); font-size: 0.8rem; letter-spacing: 1px; pointer-events: none; }
.carousel-empty {
  display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px;
  height: 240px; background: linear-gradient(135deg, #0b2d52, #1a6ea8); border-radius: 4px;
  color: rgba(255,255,255,0.4); font-size: 0.88rem; letter-spacing: 1px;
  margin-bottom: 72px;
}
.c-icon { font-size: 2.5rem; opacity: 0.3; }

/* Contact grid */
.contact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-bottom: 72px; }
.contact-row { display: flex; gap: 14px; margin-bottom: 20px; align-items: flex-start; }
.c-icon2 { font-size: 1.3rem; flex-shrink: 0; }
.c-label { font-size: 0.72rem; color: var(--sky); font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
.c-value { color: #4a5568; font-size: 0.9rem; line-height: 1.6; }
.c-value a { color: #4a5568; text-decoration: none; transition: color 0.2s; }
.c-value a:hover { color: var(--sky); }

@media (max-width: 900px) {
  .about-grid { grid-template-columns: 1fr; gap: 40px; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .contact-grid { grid-template-columns: 1fr; }
  .container { padding: 48px 24px; }
  .carousel-slide { height: 280px; }
}
</style>
