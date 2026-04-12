import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServicesStore = defineStore('services', () => {
  const list = ref([])
  const loaded = ref(false)

  async function fetch() {
    if (loaded.value) return
    try {
      const r = await window.fetch('/api/services')
      list.value = await r.json()
      loaded.value = true
    } catch (e) {
      console.error('[services] fetch failed', e)
    }
  }

  return { list, loaded, fetch }
})
