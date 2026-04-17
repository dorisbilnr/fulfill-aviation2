<template>
  <div class="qr-float" v-if="activeQRs.length > 0">
    <div class="qr-panel">
      <div v-for="(qr, i) in activeQRs" :key="i" class="qr-item">
        <img :src="qr.image" :alt="qr.desc || 'QR'" />
        <p v-if="qr.desc" class="qr-desc">{{ qr.desc }}</p>
      </div>
    </div>
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
  gap: 16px;
  background: white;
  border: 1px solid #e5e9f0;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
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
</style>
