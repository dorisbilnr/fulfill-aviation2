<template>
  <div class="qr-float" v-if="activeQRs.length > 0">
    <div class="qr-panel">
      <div v-for="(qr, i) in activeQRs" :key="i" class="qr-item">
        <img :src="qr.image" :alt="qr.desc || 'QR'" />
        <p v-if="qr.desc" class="qr-desc">{{ qr.desc }}</p>
      </div>
    </div>
    <button class="qr-trigger" aria-label="Contact QR Codes">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
        <rect x="19" y="14" width="2" height="2"/><rect x="14" y="19" width="2" height="2"/>
        <rect x="18" y="19" width="3" height="2"/><rect x="19" y="17" width="2" height="2"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'

const { data: s } = storeToRefs(useSettingsStore())

const activeQRs = computed(() => [
  { image: s.value.qr1_image, desc: s.value.qr1_desc },
  { image: s.value.qr2_image, desc: s.value.qr2_desc },
  { image: s.value.qr3_image, desc: s.value.qr3_desc },
].filter(q => q.image))
</script>

<style scoped>
.qr-float {
  position: fixed;
  bottom: 32px;
  right: 28px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.qr-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  border: 1px solid #e5e9f0;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  opacity: 0;
  pointer-events: none;
  transform: translateY(10px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.qr-float:hover .qr-panel {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.qr-item img {
  width: 110px;
  height: 110px;
  object-fit: contain;
  border-radius: 4px;
}
.qr-desc {
  font-size: 0.75rem;
  color: #4a5568;
  text-align: center;
  max-width: 110px;
  line-height: 1.4;
}
.qr-trigger {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--navy, #0b1f3a);
  color: #c8a96e;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  transition: background 0.2s, transform 0.2s;
  flex-shrink: 0;
}
.qr-trigger:hover {
  background: #1a6ea8;
  transform: scale(1.08);
}
</style>
