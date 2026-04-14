<template>
  <section v-if="partners.length" class="partners-section">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">{{ isZh ? '合作伙伴' : 'Trusted By' }}</span>
        <h2 class="section-title">{{ isZh ? '我们的合作伙伴' : 'Our Partners' }}</h2>
      </div>
      <div class="partners-track">
        <a v-for="p in partners" :key="p.id"
          :href="p.website_url || '#'"
          :target="p.website_url ? '_blank' : ''"
          rel="noopener"
          class="partner-item">
          <div class="partner-circle">
            <img v-if="p.logo_url" :src="p.logo_url" :alt="p.name" />
          </div>
          <span v-if="p.name" class="partner-name">{{ p.name }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLangStore } from '@/stores/lang'

const { isZh } = storeToRefs(useLangStore())
const partners = ref([])

onMounted(async () => {
  try {
    const r = await fetch('/api/partners')
    partners.value = await r.json()
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.partners-section { background: var(--light); padding: 64px 0; }
.container { max-width: 1260px; margin: 0 auto; padding: 0 40px; }
.section-header { text-align: center; margin-bottom: 40px; }
.section-tag {
  display: inline-block; color: var(--sky);
  font-size: 0.72rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
  border-bottom: 2px solid var(--gold); padding-bottom: 4px; margin-bottom: 12px;
}
.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 400; color: var(--navy);
}
.partners-track {
  display: flex; flex-wrap: wrap; gap: 20px;
  justify-content: center;
  padding: 8px 4px 24px;
}
.partner-item {
  flex: 0 0 calc(20% - 16px);
  min-width: 140px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  text-decoration: none;
}
.partner-circle {
  width: 140px; height: 140px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e9f0;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
  flex-shrink: 0;
}
.partner-item:hover .partner-circle { box-shadow: 0 6px 24px rgba(0,0,0,0.1); border-color: var(--gold); }
.partner-circle img { max-width: 78%; max-height: 100px; object-fit: contain; }
.partner-name {
  font-family: 'Noto Sans SC', 'Barlow', sans-serif;
  font-size: 1rem; font-weight: 400;
  color: #1e2535; text-align: center; line-height: 1.4;
}
</style>
