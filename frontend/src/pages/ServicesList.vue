<template>
  <div>
    <!-- Page Hero -->
    <div class="page-hero">
      <div class="page-hero-content">
        <span class="page-tag">{{ isZh ? '我们的服务' : 'What We Do' }}</span>
        <h1 class="page-title">{{ isZh ? '服务项目' : 'Our Services' }}</h1>
      </div>
    </div>

    <div class="container">
      <p class="services-intro">
        {{ isZh
          ? (s.services_intro_zh || s.services_intro || '上海赋瞻航空地面服务提供全面的航空支援，覆盖商务航空、公务航空和通用航空领域。')
          : (s.services_intro || 'Shanghai Fulfill Aviation Ground Service provides comprehensive aviation support across commercial, business, and general aviation sectors.') }}
      </p>

      <div class="spinner" v-if="loading"></div>

      <div v-if="!loading" class="svc-grid">
        <RouterLink
          v-for="(svc, i) in services"
          :key="svc.id"
          :to="`/services/${svc.slug}`"
          class="svc-card"
        >
          <div class="svc-bg"
            :style="svc.image_url
              ? { backgroundImage: `url(${svc.image_url})` }
              : { background: BG_GRADIENTS[i % BG_GRADIENTS.length] }">
          </div>
          <div class="svc-overlay"></div>
          <div class="svc-content">
            <span class="svc-icon">{{ svc.icon }}</span>
            <div class="svc-name">{{ isZh ? (svc.name_zh || svc.name) : svc.name }}</div>
            <p class="svc-desc">{{ isZh ? (svc.description_zh || svc.description) : svc.description }}</p>
            <span class="svc-link">{{ isZh ? '了解更多' : 'Learn More' }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useServicesStore } from '@/stores/services'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const servicesStore = useServicesStore()
const settings = useSettingsStore()
const { isZh } = storeToRefs(useLangStore())
const { data: s } = storeToRefs(settings)
const loading = ref(true)

const BG_GRADIENTS = [
  'linear-gradient(160deg,#0b2d52,#1a6ea8)',
  'linear-gradient(160deg,#0d3a60,#0f5487)',
  'linear-gradient(160deg,#091a33,#14487a)',
  'linear-gradient(160deg,#0b2540,#1a5a8a)',
  'linear-gradient(160deg,#102030,#1a4060)',
  'linear-gradient(160deg,#0a1828,#1a3858)',
]

const services = computed(() => servicesStore.list)

onMounted(async () => {
  if (!servicesStore.list.length) {
    await servicesStore.fetch()
  }
  loading.value = false
})
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

.services-intro {
  text-align: center; max-width: 680px; margin: 0 auto 56px;
  color: #4a5568; line-height: 1.8; font-size: 0.95rem;
}

.spinner { width: 36px; height: 36px; border: 3px solid #dde3ec; border-top-color: var(--sky); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 60px auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-bottom: 72px; }
.svc-card { position: relative; overflow: hidden; height: 360px; cursor: pointer; display: block; text-decoration: none; }
.svc-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.6s; }
.svc-card:hover .svc-bg { transform: scale(1.06); }
.svc-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%); }
.svc-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px; z-index: 2; }
.svc-icon { font-size: 1.8rem; margin-bottom: 10px; display: block; }
.svc-name { font-family: 'Cormorant Garamond', serif; font-size: 1.45rem; color: var(--white); font-weight: 400; margin-bottom: 8px; }
.svc-desc { color: rgba(255,255,255,0.7); font-size: 0.82rem; line-height: 1.6; margin-bottom: 14px; }
.svc-link { display: inline-block; color: var(--gold); font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid var(--gold); padding-bottom: 2px; }

@media (max-width: 900px) {
  .svc-grid { grid-template-columns: 1fr; }
  .container { padding: 48px 24px; }
}
</style>
