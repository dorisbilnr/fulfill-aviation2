<template>
  <section v-if="partners.length > 0" class="partners-section">
    <div class="container partners-header">
      <span class="section-tag">{{ isZh ? '合作伙伴' : 'Trusted By' }}</span>
    </div>

    <!-- Static row (< 6 partners) -->
    <div v-if="partners.length < 6" class="container partners-static">
      <a
        v-for="p in partners" :key="p.id"
        :href="p.website_url || undefined"
        :target="p.website_url ? '_blank' : undefined"
        :rel="p.website_url ? 'noopener noreferrer' : undefined"
        class="partner-card"
        :class="{ clickable: !!p.website_url }"
      >
        <img v-if="p.logo_url" :src="p.logo_url" :alt="p.name" />
        <span v-else class="partner-name-only">{{ p.name }}</span>
        <p class="partner-name">{{ p.name }}</p>
      </a>
    </div>

    <!-- Scrolling ticker (>= 6 partners) -->
    <div v-else class="ticker-wrap" @mouseenter="paused = true" @mouseleave="paused = false">
      <div class="ticker-track" :class="{ paused }" :style="{ animationDuration: `${partners.length * 4}s` }">
        <a
          v-for="p in doubledPartners" :key="`${p.id}-${p._dup}`"
          :href="p.website_url || undefined"
          :target="p.website_url ? '_blank' : undefined"
          :rel="p.website_url ? 'noopener noreferrer' : undefined"
          class="partner-card"
          :class="{ clickable: !!p.website_url }"
        >
          <img v-if="p.logo_url" :src="p.logo_url" :alt="p.name" />
          <span v-else class="partner-name-only">{{ p.name }}</span>
          <p class="partner-name">{{ p.name }}</p>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLangStore } from '@/stores/lang'

const { isZh } = useLangStore()
const partners = ref([])
const paused = ref(false)

const doubledPartners = computed(() => [
  ...partners.value.map(p => ({ ...p, _dup: 0 })),
  ...partners.value.map(p => ({ ...p, _dup: 1 })),
])

onMounted(async () => {
  try {
    const r = await fetch('/api/partners')
    partners.value = await r.json()
  } catch (e) {
    console.error('[partners] fetch failed', e)
  }
})
</script>

<style scoped>
.partners-section {
  background: var(--light);
  padding: 56px 0;
  overflow: hidden;
}
.partners-header {
  text-align: center;
  margin-bottom: 32px;
}
.partners-static {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
.partner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px 24px;
  width: 160px;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  flex-shrink: 0;
}
.partner-card.clickable { cursor: pointer; }
.partner-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}
.partner-card img {
  max-width: 110px;
  max-height: 60px;
  object-fit: contain;
}
.partner-name-only {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--navy);
  text-align: center;
}
.partner-name {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  font-weight: 500;
}
/* ── Scrolling ticker ── */
.ticker-wrap {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.ticker-wrap::before,
.ticker-wrap::after {
  content: '';
  position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2;
  pointer-events: none;
}
.ticker-wrap::before { left: 0; background: linear-gradient(to right, var(--light), transparent); }
.ticker-wrap::after  { right: 0; background: linear-gradient(to left, var(--light), transparent); }

.ticker-track {
  display: flex;
  gap: 20px;
  padding: 0 20px;
  animation: ticker linear infinite;
  width: max-content;
}
.ticker-track.paused { animation-play-state: paused; }

@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
