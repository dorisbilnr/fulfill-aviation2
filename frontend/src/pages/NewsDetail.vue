<template>
  <div>
    <div v-if="loading" class="spinner" style="margin-top:120px;"></div>

    <template v-else-if="article">
      <!-- Cover image as banner -->
      <div class="article-banner" :style="article.image_url ? { backgroundImage: `url(${article.image_url})` } : {}">
        <div class="banner-overlay"></div>
      </div>

      <section class="article-body">
        <div class="container article-container">
          <RouterLink to="/news" class="back-link">← {{ isZh ? '返回新闻列表' : 'Back to News' }}</RouterLink>
          <p class="article-date">{{ article.created_at?.slice(0, 10) }}</p>
          <h1>{{ isZh ? article.title : (article.title_en || article.title) }}</h1>
          <div class="article-content" v-html="isZh ? article.body : (article.content_en || article.body)"></div>
        </div>
      </section>
    </template>

    <div v-else class="container" style="padding:100px 24px;text-align:center;color:var(--text-muted);">
      {{ isZh ? '文章不存在' : 'Article not found.' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLangStore } from '@/stores/lang'

const route = useRoute()
const { isZh } = useLangStore()
const article = ref(null)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const r = await fetch(`/api/news/${route.params.slug}`)
    if (!r.ok) { article.value = null; return }
    article.value = await r.json()
    const brand = isZh.value ? '赋瞻航空' : 'Fulfill Aviation'
    const title = isZh.value ? article.value.title : (article.value.title_en || article.value.title)
    document.title = `${title} — ${brand}`
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
.article-banner {
  height: 380px;
  background: var(--navy) center/cover;
  position: relative;
}
.banner-overlay {
  position: absolute; inset: 0;
  background: rgba(11,31,58,0.5);
}
.article-body { padding: 56px 0 80px; }
.article-container { max-width: 820px; }
.article-date { font-size: 0.8rem; color: var(--gold); font-weight: 600; margin-bottom: 12px; }
.article-container h1 {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700; color: var(--navy);
  margin-bottom: 32px; line-height: 1.3;
}
.article-content {
  font-size: 1rem; line-height: 1.9; color: var(--text);
}
.article-content :deep(p) { margin-bottom: 1.2em; }
.article-content :deep(h2) { font-size: 1.3rem; font-weight: 700; margin: 1.6em 0 0.6em; color: var(--navy); }
.article-content :deep(h3) { font-size: 1.1rem; font-weight: 600; margin: 1.4em 0 0.5em; color: var(--navy); }
.article-content :deep(img) { border-radius: 6px; margin: 1.5em 0; max-width: 100%; }
.article-content :deep(ul), .article-content :deep(ol) { padding-left: 1.5em; margin-bottom: 1em; }
.article-content :deep(li) { margin-bottom: 0.4em; }
.article-content :deep(a) { color: var(--sky); text-decoration: underline; }
</style>
