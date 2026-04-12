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
          class="partner-logo">
          <img v-if="p.logo_url" :src="p.logo_url" :alt="p.name" />
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
.container { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
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
  display: flex; flex-wrap: wrap; gap: 24px;
  align-items: center; justify-content: center;
}
.partner-logo {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  width: 160px; min-height: 90px;
  background: white;
  border: 1px solid #e5e9f0;
  border-radius: 4px;
  padding: 14px 16px;
  transition: box-shadow 0.2s, border-color 0.2s;
  text-decoration: none;
}
.partner-logo:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-color: var(--gold); }
.partner-logo img { max-width: 100%; max-height: 52px; object-fit: contain; }
.partner-name { font-size: 0.78rem; color: #4a5568; text-align: center; font-weight: 500; line-height: 1.3; }

@media (max-width: 600px) {
  .partner-logo { width: 110px; height: 60px; }
}
</style>
