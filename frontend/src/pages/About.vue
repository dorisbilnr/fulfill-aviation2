<template>
  <div>
    <div class="page-banner">
      <div class="container">
        <span class="section-tag">{{ isZh ? '我们的故事' : 'Our Story' }}</span>
        <h1>{{ isZh ? '关于我们' : 'About Us' }}</h1>
      </div>
    </div>

    <!-- About body -->
    <section class="about-section">
      <div class="container about-wrap">
        <div class="about-text">
          <h2>{{ isZh ? (s.about_title_zh || s.about_title) : (s.about_title || s.about_title_zh) }}</h2>
          <div class="about-body" v-html="isZh ? (s.about_body_zh || s.about_body) : (s.about_body || s.about_body_zh)"></div>
        </div>

        <!-- Stats column -->
        <div class="about-stats">
          <div class="about-stat">
            <span class="num">{{ s.stat_years || '10+' }}</span>
            <span class="lbl">{{ isZh ? '年经验' : 'Years Experience' }}</span>
          </div>
          <div class="about-stat">
            <span class="num">{{ s.stat_destinations || '50+' }}</span>
            <span class="lbl">{{ isZh ? '目的地' : 'Destinations' }}</span>
          </div>
          <div class="about-stat">
            <span class="num">{{ s.stat_partners || '1000+' }}</span>
            <span class="lbl">{{ isZh ? (s.stat_partners_label_zh || '年度航班运营量') : (s.stat_partners_label || 'Annual Flights') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Office gallery carousel -->
    <section v-if="gallery.length" class="gallery-section">
      <div class="container">
        <span class="section-tag">{{ isZh ? '我们的办公室' : 'Our Office' }}</span>
      </div>
      <div class="gallery-track" ref="trackEl">
        <div
          v-for="img in gallery" :key="img.id"
          class="gallery-slide"
          :style="{ backgroundImage: `url(${img.url})` }"
        >
          <p v-if="img.caption" class="gallery-caption">{{ img.caption }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const { isZh } = useLangStore()
const s = settings.data
const gallery = ref([])

onMounted(async () => {
  try {
    const r = await fetch('/api/gallery')
    gallery.value = await r.json()
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.about-section { padding: 72px 0; }
.about-wrap {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 64px;
  align-items: start;
}
.about-text h2 {
  font-size: 1.8rem; font-weight: 700; color: var(--navy);
  margin-bottom: 24px; line-height: 1.3;
}
.about-body {
  font-size: 1rem; line-height: 1.9; color: var(--text);
}
.about-body :deep(p) { margin-bottom: 1.2em; }

.about-stats {
  background: var(--navy);
  border-radius: 8px;
  padding: 36px 28px;
  display: flex; flex-direction: column; gap: 28px;
  position: sticky; top: 100px;
}
.about-stat { text-align: center; }
.about-stat .num {
  display: block; font-size: 2.6rem; font-weight: 700;
  color: var(--gold); margin-bottom: 6px;
}
.about-stat .lbl {
  font-size: 0.78rem; letter-spacing: 1px;
  color: rgba(255,255,255,0.6); text-transform: uppercase;
}

/* Gallery */
.gallery-section { padding-bottom: 80px; }
.gallery-section > .container { margin-bottom: 24px; }
.gallery-track {
  display: flex; gap: 4px; overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 0 24px;
}
.gallery-track::-webkit-scrollbar { height: 4px; }
.gallery-track::-webkit-scrollbar-track { background: var(--light); }
.gallery-track::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.gallery-slide {
  flex-shrink: 0;
  width: 380px; height: 260px;
  background: var(--light) center/cover;
  border-radius: 6px;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
}
.gallery-caption {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(0,0,0,0.5);
  color: white; font-size: 0.78rem; padding: 8px 12px;
}

@media (max-width: 900px) {
  .about-wrap { grid-template-columns: 1fr; }
  .about-stats { position: static; flex-direction: row; justify-content: space-around; }
}
@media (max-width: 600px) {
  .about-stats { flex-direction: column; }
  .gallery-slide { width: 280px; height: 200px; }
}
</style>
