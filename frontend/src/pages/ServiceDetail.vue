<template>
  <div>
    <div v-if="loading" class="spinner" style="margin-top:120px;"></div>

    <template v-else-if="svc">
      <div class="svc-banner" :style="svc.image_url ? { backgroundImage: `url(${svc.image_url})` } : {}">
        <div class="banner-overlay"></div>
        <div class="container banner-content">
          <span v-if="!svc.image_url" class="banner-icon">{{ svc.icon }}</span>
        </div>
      </div>

      <section class="svc-detail-section">
        <div class="container svc-container">
          <RouterLink to="/services" class="back-link">← {{ isZh ? '返回服务列表' : 'Back to Services' }}</RouterLink>
          <h1>{{ isZh ? (svc.name_zh || svc.name) : svc.name }}</h1>
          <div class="svc-content" v-html="isZh ? (svc.details_zh || svc.details) : svc.details"></div>
          <div v-if="!svc.details && !svc.details_zh" class="svc-description">
            {{ isZh ? (svc.description_zh || svc.description) : svc.description }}
          </div>
          <RouterLink to="/contact" class="btn btn-primary" style="margin-top:32px;display:inline-flex;">
            {{ isZh ? '申请报价' : 'Request Quote' }}
          </RouterLink>
        </div>
      </section>
    </template>

    <div v-else class="container" style="padding:100px 24px;text-align:center;color:var(--text-muted);">
      {{ isZh ? '服务不存在' : 'Service not found.' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLangStore } from '@/stores/lang'

const route = useRoute()
const { isZh } = useLangStore()
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
.svc-banner {
  height: 360px;
  background: var(--navy) center/cover;
  position: relative;
  display: flex; align-items: center;
}
.banner-overlay { position: absolute; inset: 0; background: rgba(11,31,58,0.55); }
.banner-content { position: relative; z-index: 1; }
.banner-icon { font-size: 5rem; }
.svc-detail-section { padding: 56px 0 80px; }
.svc-container { max-width: 820px; }
.svc-container h1 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700; color: var(--navy);
  margin-bottom: 28px; line-height: 1.3;
}
.svc-content {
  font-size: 1rem; line-height: 1.9; color: var(--text);
}
.svc-content :deep(p) { margin-bottom: 1.2em; }
.svc-content :deep(h2) { font-size: 1.3rem; font-weight: 700; margin: 1.5em 0 0.5em; color: var(--navy); }
.svc-content :deep(ul), .svc-content :deep(ol) { padding-left: 1.5em; margin-bottom: 1em; }
.svc-content :deep(li) { margin-bottom: 0.4em; }
.svc-description {
  font-size: 1rem; line-height: 1.8; color: var(--text-muted);
}
</style>
