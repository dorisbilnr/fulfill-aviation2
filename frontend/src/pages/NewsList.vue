<template>
  <div>
    <!-- Page Hero -->
    <div class="page-hero">
      <div class="page-hero-content">
        <span class="page-tag">{{ isZh ? '最新动态' : 'Latest Updates' }}</span>
        <h1 class="page-title">{{ isZh ? '新闻动态' : 'News & Events' }}</h1>
      </div>
    </div>

    <div class="container">
      <div class="spinner" v-if="loading"></div>

      <!-- Featured article -->
      <template v-if="!loading && featured">
        <div class="news-featured">
          <div class="nf-img">
            <img v-if="featured.image_url" :src="featured.image_url" :alt="featuredTitle" />
            <div v-else class="img-ph">Photo</div>
          </div>
          <div class="nf-body">
            <span class="news-cat">{{ isZh ? '最新' : 'Latest' }}</span>
            <div class="nf-date">{{ (featured.publish_date || featured.created_at)?.slice(0, 10) }}</div>
            <div class="nf-title">{{ featuredTitle }}</div>
            <p class="nf-exc">{{ featuredExcerpt }}</p>
            <RouterLink :to="`/news/${featured.slug}`" class="read-btn">{{ isZh ? '阅读全文' : 'Read More' }}</RouterLink>
          </div>
        </div>
      </template>

      <template v-if="!loading && rest.length">
        <div class="section-label">{{ isZh ? '全部新闻' : 'All News' }}</div>
        <div class="news-grid">
          <RouterLink
            v-for="item in rest"
            :key="item.id"
            :to="`/news/${item.slug}`"
            class="nc"
          >
            <div class="nc-img">
              <img v-if="item.image_url" :src="item.image_url" :alt="isZh ? item.title : (item.title_en || item.title)" />
              <div v-else class="img-ph">Photo</div>
            </div>
            <div class="nc-body">
              <div class="nc-date">{{ (item.publish_date || item.created_at)?.slice(0, 10) }}</div>
              <div class="nc-title">{{ isZh ? item.title : (item.title_en || item.title) }}</div>
              <p class="nc-exc">{{ (isZh ? (item.excerpt || '') : (item.excerpt_en || item.excerpt || '')).slice(0, 120) }}</p>
            </div>
          </RouterLink>
        </div>
      </template>

      <div v-if="!loading && !articles.length" style="text-align:center;color:#9ba8b8;padding:80px 0;">
        {{ isZh ? '暂无新闻' : 'No news yet.' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLangStore } from '@/stores/lang'

const { isZh } = storeToRefs(useLangStore())
const articles = ref([])
const loading = ref(true)

const featured = computed(() => articles.value[0] || null)
const rest = computed(() => articles.value.slice(1))

const featuredTitle = computed(() => {
  if (!featured.value) return ''
  return isZh.value ? featured.value.title : (featured.value.title_en || featured.value.title)
})
const featuredExcerpt = computed(() => {
  if (!featured.value) return ''
  return isZh.value ? (featured.value.excerpt || '') : (featured.value.excerpt_en || featured.value.excerpt || '')
})

onMounted(async () => {
  try {
    const r = await fetch('/api/news?page=1&limit=10')
    const d = await r.json()
    articles.value = d.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-hero {
  padding-top: 70px; height: 260px;
  background: linear-gradient(135deg, #0b1f3a, #1a6ea8);
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; text-align: center; position: relative;
}
.page-hero::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.3); }
.page-hero-content { position: relative; z-index: 1; }
.page-tag { display: inline-block; background: var(--gold); color: var(--navy); font-size: 0.7rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; padding: 5px 14px; margin-bottom: 14px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; color: var(--white); font-weight: 300; }

.container { max-width: 1100px; margin: 0 auto; padding: 72px 40px; }
.spinner { width: 36px; height: 36px; border: 3px solid #dde3ec; border-top-color: var(--sky); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 60px auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.section-label { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: var(--navy); border-bottom: 2px solid var(--gold); padding-bottom: 12px; margin-bottom: 32px; display: inline-block; }

/* Featured */
.news-featured { display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px; margin-bottom: 56px; }
.nf-img { height: 320px; border-radius: 4px; overflow: hidden; }
.nf-img img { width: 100%; height: 100%; object-fit: cover; }
.img-ph { width: 100%; height: 100%; min-height: 180px; display: flex; align-items: center; justify-content: center; color: #5a7a99; font-size: 0.85rem; background: linear-gradient(135deg, #c9d6e3, #a8bfd4); }
.nf-body { display: flex; flex-direction: column; justify-content: center; }
.news-cat { display: inline-block; color: var(--sky); font-size: 0.72rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border-bottom: 2px solid var(--gold); padding-bottom: 3px; margin-bottom: 14px; }
.nf-date { color: var(--gold); font-size: 0.82rem; margin-bottom: 10px; }
.nf-title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 400; color: var(--navy); line-height: 1.3; margin-bottom: 14px; }
.nf-exc { color: #4a5568; font-size: 0.9rem; line-height: 1.75; margin-bottom: 24px; }
.read-btn { display: inline-block; background: var(--navy); color: white; padding: 12px 32px; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; transition: background 0.3s; font-family: 'Barlow', sans-serif; text-decoration: none; }
.read-btn:hover { background: var(--sky); }

/* Grid */
.news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 16px; }
.nc { cursor: pointer; border: 1px solid #e5e9f0; border-radius: 4px; overflow: hidden; transition: box-shadow 0.2s; text-decoration: none; display: block; color: inherit; }
.nc:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.09); }
.nc-img { height: 180px; overflow: hidden; }
.nc-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.nc-body { padding: 16px; }
.nc-date { font-size: 0.78rem; color: var(--gold); margin-bottom: 6px; }
.nc-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--navy); margin-bottom: 8px; line-height: 1.4; }
.nc-exc { font-size: 0.85rem; color: #4a5568; line-height: 1.6; }

@media (max-width: 900px) {
  .news-featured { grid-template-columns: 1fr; }
  .news-grid { grid-template-columns: 1fr; }
  .container { padding: 48px 24px; }
}
</style>
