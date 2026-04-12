import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLangStore = defineStore('lang', () => {
  const STORAGE_KEY = 'fulfill_lang'
  const lang = ref(localStorage.getItem(STORAGE_KEY) || 'en')

  const isZh = computed(() => lang.value === 'zh')

  function setLang(l) {
    lang.value = l
    localStorage.setItem(STORAGE_KEY, l)
    document.body.classList.toggle('lang-zh', l === 'zh')
  }

  function t(enVal, zhVal) {
    if (isZh.value) return zhVal || enVal || ''
    return enVal || zhVal || ''
  }

  // Initialize body class
  document.body.classList.toggle('lang-zh', lang.value === 'zh')

  return { lang, isZh, setLang, t }
})
