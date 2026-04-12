<template>
  <div>
    <div v-if="loading" class="spinner" style="margin-top:120px;"></div>

    <template v-else-if="svc">
      <div class="svc-banner"
        :style="svc.image_url ? { backgroundImage: `url(${svc.image_url})` } : {}">
        <div class="banner-overlay"></div>
        <div class="banner-inner">
          <span v-if="!svc.image_url" class="banner-icon">{{ svc.icon }}</span>
        </div>
      </div>

      <div class="container">
        <RouterLink to="/services" class="back-link">← {{ isZh ? '返回服务列表' : 'Back to Services' }}</RouterLink>
        <h1>{{ isZh ? (svc.name_zh || svc.name) : svc.name }}</h1>
        <div class="svc-content" v-if="svc.details || svc.details_zh"
          v-html="isZh ? (svc.details_zh || svc.details) : svc.details">
        </div>
        <p v-else class="svc-description">
          {{ isZh ? (svc.description_zh || svc.description) : svc.description }}
        </p>
        <RouterLink to="/contact" class="inquiry-btn">
          {{ isZh ? '申请报价' : 'Request Quote' }}
        </RouterLink>
      </div>
    </template>

    <div v-else class="container" style="padding:100px 40px;text-align:center;color:#9ba8b8;">
      {{ isZh ? '服务不存在' : 'Service not found.' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useLangStore } from '@/stores/lang'

const route = useRoute()
const { isZh } = storeToRefs(useLangStore())
const svc = ref(null)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const r = await fetch(`/api/services/${route.params.slug}`)
    if (!r.ok) { svc.value = null; return }
    svc.value = await r.json()
    const brand = isZh.value ? '赋瞻航空' : 'Fulfill Aviation'
    const name = isZh.value ? (svc.value.name_zh || svc.value.name) : svc.value.name
    document.title = `${name} — ${brand}`
  } catch (e) {
    svc.value = null
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<style scoped>
.spinner { width: 36px; height: 36px; border: 3px solid #dde3ec; border-top-color: var(--sky); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 60px auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.svc-banner {
  height: 360px;
  background: linear-gradient(135deg, #0b1f3a, #1a6ea8) center/cover;
  position: relative;
  display: flex; align-items: center;
}
.banner-overlay { position: absolute; inset: 0; background: rgba(11,31,58,0.55); }
.banner-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 0 40px; width: 100%; }
.banner-icon { font-size: 5rem; }

.container { max-width: 820px; margin: 0 auto; padding: 56px 40px 80px; }
.back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--sky); font-size: 0.9rem; font-weight: 500; margin-bottom: 28px; text-decoration: none; transition: gap 0.2s; }
.back-link:hover { gap: 10px; }
.container h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 400; color: var(--navy); margin-bottom: 28px; line-height: 1.3; }

.svc-content { font-size: 1rem; line-height: 1.9; color: var(--text); }
.svc-content :deep(p) { margin-bottom: 1.2em; }
.svc-content :deep(h2) { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; margin: 1.5em 0 0.5em; color: var(--navy); }
.svc-content :deep(ul), .svc-content :deep(ol) { padding-left: 1.5em; margin-bottom: 1em; }
.svc-content :deep(li) { margin-bottom: 0.4em; }

.svc-description { font-size: 1rem; line-height: 1.8; color: #4a5568; }

.inquiry-btn {
  display: inline-block; margin-top: 32px;
  background: var(--gold); color: var(--navy);
  padding: 14px 40px; font-size: 0.82rem; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase;
  transition: opacity 0.3s; font-family: 'Barlow', sans-serif;
  text-decoration: none;
}
.inquiry-btn:hover { opacity: 0.88; }

@media (max-width: 900px) {
  .container { padding: 40px 24px 60px; }
}
</style>
