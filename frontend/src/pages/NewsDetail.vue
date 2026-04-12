<template>
  <div>
    <div v-if="loading" class="spinner" style="margin-top:120px;"></div>

    <template v-else-if="article">
      <!-- Hero banner with image or gradient -->
      <div class="article-hero"
        :style="article.image_url
          ? { backgroundImage: `url(${article.image_url})` }
          : {}">
        <div class="hero-overlay"></div>
        <div class="hero-inner">
          <span class="page-tag">{{ isZh ? '新闻动态' : 'News' }}</span>
          <h1 class="hero-title">{{ isZh ? article.title : (article.title_en || article.title) }}</h1>
          <p class="hero-date">{{ article.created_at?.slice(0, 10) }}</p>
        </div>
      </div>

      <div class="container">
        <RouterLink to="/news" class="back-link">← {{ isZh ? '返回新闻列表' : 'Back to News' }}</RouterLink>
        <div class="article-body"
          v-html="isZh ? (article.body || article.content_en || '') : (article.content_en || article.body || '')">
        </div>
      </div>
    </template>

    <div v-else class="container" style="padding:100px 40px;text-align:center;color:#9ba8b8;">
      {{ isZh ? '文章不存在' : 'Article not found.' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useLangStore } from '@/stores/lang'

const route = useRoute()
const { isZh } = storeToRefs(useLangStore())
const article = ref(null)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const r = await fetch(`/api/news/${route.params.slug}`)
    if (!r.ok) { article.value = null; return }
    article.value = await r.json()
    const title = isZh.value ? article.value.title : (article.value.title_en || article.value.title)
    document.title = `${title} — Fulfill Aviation`
  } catch (e) {
    article.value = null
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<style scoped>
.spinner { width: 36px; height: 36px; border: 3px solid #dde3ec; border-top-color: var(--sky); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 60px auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.article-hero {
  height: 340px;
  background: linear-gradient(135deg, #0b1f3a, #1a6ea8) center/cover;
  position: relative;
  display: flex; align-items: flex-end;
}
.hero-overlay { position: absolute; inset: 0; background: rgba(11,31,58,0.6); }
.hero-inner {
  position: relative; z-index: 1;
  max-width: 1100px; margin: 0 auto; padding: 0 40px 48px;
  width: 100%;
}
.page-tag { display: inline-block; background: var(--gold); color: var(--navy); font-size: 0.7rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; padding: 5px 14px; margin-bottom: 14px; }
.hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 300; color: white; line-height: 1.3; margin-bottom: 12px; }
.hero-date { color: rgba(255,255,255,0.65); font-size: 0.85rem; }

.container { max-width: 1100px; margin: 0 auto; padding: 56px 40px 80px; }
.back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--sky); font-size: 0.9rem; font-weight: 500; margin-bottom: 32px; text-decoration: none; transition: gap 0.2s; }
.back-link:hover { gap: 10px; }

.article-body { font-size: 1rem; line-height: 1.9; color: var(--text); max-width: 760px; }
.article-body :deep(p) { margin-bottom: 1.2em; }
.article-body :deep(h2) { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: var(--navy); margin: 1.8em 0 0.6em; }
.article-body :deep(h3) { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: var(--navy); margin: 1.4em 0 0.5em; }
.article-body :deep(ul), .article-body :deep(ol) { padding-left: 1.5em; margin-bottom: 1em; }
.article-body :deep(li) { margin-bottom: 0.4em; }
.article-body :deep(img) { max-width: 100%; border-radius: 4px; margin: 1em 0; }

@media (max-width: 900px) {
  .container { padding: 40px 24px 60px; }
  .hero-inner { padding: 0 24px 40px; }
}
</style>
