<template>
  <NavBar />
  <main class="main-content">
    <RouterView />
  </main>
  <Footer />
  <QRFloat />
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import QRFloat from '@/components/QRFloat.vue'
import { useSettingsStore } from '@/stores/settings'
import { useServicesStore } from '@/stores/services'

const settings = useSettingsStore()
const services = useServicesStore()

onMounted(async () => {
  await Promise.all([settings.fetch(), services.fetch()])
})
</script>

<style>
.main-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
