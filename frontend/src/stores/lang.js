import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLangStore = defineStore('lang', () => {
  const STORAGE_KEY = 'fa_lang'
  const lang = ref(localStorage.getItem(STORAGE_KEY) || 'en')
  const isZh = ref(lang.value === 'zh')

  function setLang(l) {
    lang.value = l
    isZh.value = l === 'zh'
    localStorage.setItem(STORAGE_KEY, l)
    document.documentElement.classList.toggle('lang-zh', l === 'zh')
  }

  // Initialize class
  document.documentElement.classList.toggle('lang-zh', lang.value === 'zh')

  return { lang, isZh, setLang }
})
