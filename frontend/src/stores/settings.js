import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const data = ref({})
  const loaded = ref(false)

  async function fetch() {
    if (loaded.value) return
    try {
      const r = await window.fetch('/api/settings/public')
      data.value = await r.json()
      loaded.value = true
    } catch (e) {
      console.error('[settings] fetch failed', e)
    }
  }

  function get(key, fallback = '') {
    return data.value[key] ?? fallback
  }

  return { data, loaded, fetch, get }
})
