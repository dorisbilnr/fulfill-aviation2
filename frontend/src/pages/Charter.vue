<template>
  <div>
    <div class="page-banner">
      <div class="container">
        <span class="section-tag">Charter Services</span>
        <h1>{{ isZh ? '定班和包机' : 'Scheduled & Charter' }}</h1>
      </div>
    </div>

    <section class="charter-intro-section">
      <div class="container charter-intro-wrap">
        <p class="charter-intro">{{ isZh ? (s.charter_intro_zh || s.charter_intro) : (s.charter_intro || s.charter_intro_zh) }}</p>
      </div>
    </section>

    <section class="charter-types-section">
      <div class="container">
        <span class="section-tag">{{ isZh ? '包机类型' : 'Charter Types' }}</span>

        <div v-for="(type, idx) in charterTypes" :key="idx" class="charter-type-row" :class="{ reverse: idx % 2 === 1 }">
          <!-- Image / Emoji side -->
          <div class="type-visual">
            <img v-if="type.image" :src="type.image" :alt="type.title" class="type-img" />
            <div v-else class="type-emoji-box">
              <span>{{ type.emoji }}</span>
            </div>
          </div>
          <!-- Text side -->
          <div class="type-text">
            <h2>{{ type.title }}</h2>
            <p>{{ type.desc }}</p>
            <div class="type-btns">
              <RouterLink to="/contact" class="btn btn-primary">{{ isZh ? '申请报价' : 'Request Quote' }}</RouterLink>
              <RouterLink to="/contact" class="btn btn-outline">{{ isZh ? '立即预订' : 'Book Now' }}</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const { isZh } = useLangStore()
const s = settings.data

const EMOJIS = ['👥', '🤝', '📦', '🎫']

const charterTypes = computed(() => [1, 2, 3, 4].map((n, i) => ({
  title: isZh.value
    ? (s[`charter_type${n}_title_zh`] || s[`charter_type${n}_title`] || '')
    : (s[`charter_type${n}_title`] || ''),
  desc: isZh.value
    ? (s[`charter_type${n}_desc_zh`] || s[`charter_type${n}_desc`] || '')
    : (s[`charter_type${n}_desc`] || ''),
  image: s[`charter_type${n}_image`] || '',
  emoji: EMOJIS[i],
})))
</script>

<style scoped>
.charter-intro-section {
  background: var(--light);
  padding: 48px 0;
}
.charter-intro-wrap { max-width: 800px; margin: 0 auto; text-align: center; }
.charter-intro {
  font-size: 1.05rem; color: var(--text-muted); line-height: 1.8;
}
.charter-types-section { padding: 64px 0 80px; }
.charter-types-section > .container > .section-tag { margin-bottom: 48px; display: block; }

.charter-type-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  margin-bottom: 2px;
  min-height: 340px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  margin-bottom: 32px;
}
.charter-type-row.reverse .type-visual { order: 2; }
.charter-type-row.reverse .type-text   { order: 1; }

.type-visual {
  position: relative;
  background: var(--navy);
  overflow: hidden;
}
.type-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
.type-emoji-box {
  display: flex; align-items: center; justify-content: center;
  height: 100%; font-size: 5rem;
  background: linear-gradient(135deg, #0b1f3a 0%, #1a6ea8 100%);
}

.type-text {
  background: white;
  padding: 48px 44px;
  display: flex; flex-direction: column; justify-content: center;
}
.type-text h2 {
  font-size: 1.5rem; font-weight: 700; color: var(--navy);
  margin-bottom: 16px;
}
.type-text p {
  font-size: 0.95rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 28px;
}
.type-btns { display: flex; gap: 12px; flex-wrap: wrap; }

@media (max-width: 768px) {
  .charter-type-row { grid-template-columns: 1fr; }
  .charter-type-row.reverse .type-visual { order: 0; }
  .charter-type-row.reverse .type-text   { order: 1; }
  .type-visual { height: 220px; }
  .type-text { padding: 32px 24px; }
}
</style>
