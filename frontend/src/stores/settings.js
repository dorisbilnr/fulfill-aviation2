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
      if (data.value.favicon) {
        let link = document.querySelector("link[rel~='icon']")
        if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link) }
        link.href = data.value.favicon
      }
    } catch (e) {
      console.error('[settings] fetch failed', e)
    }
  }

  function get(key, fallback = '') {
    return data.value[key] ?? fallback
  }

  return { data, loaded, fetch, get }
})
