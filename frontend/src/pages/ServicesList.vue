<template>
  <div>
    <div class="page-banner">
      <div class="container">
        <span class="section-tag">{{ isZh ? '我们的服务' : 'What We Do' }}</span>
        <h1>{{ isZh ? '服务项目' : 'Our Services' }}</h1>
      </div>
    </div>

    <section class="services-section">
      <div class="container">
        <p v-if="intro" class="intro-text">{{ intro }}</p>
        <div v-if="!services.length" class="spinner"></div>
        <div v-else class="grid-3">
          <RouterLink
            v-for="svc in services"
            :key="svc.id"
            :to="`/services/${svc.slug}`"
            class="svc-card card"
          >
            <div class="svc-img" :style="{ backgroundImage: svc.image_url ? `url(${svc.image_url})` : 'none' }">
              <span v-if="!svc.image_url" class="svc-icon">{{ svc.icon }}</span>
            </div>
            <div class="svc-body">
              <h2>{{ isZh ? (svc.name_zh || svc.name) : svc.name }}</h2>
              <p>{{ isZh ? (svc.description_zh || svc.description) : svc.description }}</p>
              <span class="learn-more">{{ isZh ? '了解更多 →' : 'Learn More →' }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useServicesStore } from '@/stores/services'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const servicesStore = useServicesStore()
const settings = useSettingsStore()
const { isZh } = useLangStore()

const services = computed(() => servicesStore.list)
const intro = computed(() => isZh.value ? settings.get('intro_text_zh') : settings.get('intro_text'))
</script>

<style scoped>
.services-section { padding: 64px 0 80px; }
.intro-text {
  font-size: 1rem; color: var(--text-muted); line-height: 1.8;
  max-width: 760px; margin: 0 auto 48px; text-align: center;
}
.svc-card { text-decoration: none; }
.svc-img {
  height: 220px;
  background: var(--navy) center/cover;
  display: flex; align-items: center; justify-content: center;
}
.svc-icon { font-size: 3rem; }
.svc-body { padding: 24px; }
.svc-body h2 { font-size: 1.05rem; font-weight: 700; color: var(--navy); margin-bottom: 10px; }
.svc-body p { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
.learn-more { font-size: 0.8rem; font-weight: 600; color: var(--sky); }
</style>
