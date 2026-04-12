<template>
  <div>
    <div class="page-banner">
      <div class="container">
        <span class="section-tag">{{ isZh ? '最新动态' : 'Latest Updates' }}</span>
        <h1>{{ isZh ? '新闻与活动' : 'News & Events' }}</h1>
      </div>
    </div>

    <section class="news-list-section">
      <div class="container">
        <div v-if="loading" class="spinner"></div>
        <template v-else>
          <div class="news-grid">
            <RouterLink
              v-for="item in news"
              :key="item.id"
              :to="`/news/${item.slug}`"
              class="news-card card"
            >
              <div class="news-img" :style="{ backgroundImage: item.image_url ? `url(${item.image_url})` : 'none' }">
                <span v-if="!item.image_url" class="placeholder">✈</span>
              </div>
              <div class="news-body">
                <p class="news-date">{{ item.created_at?.slice(0, 10) }}</p>
                <h2>{{ isZh ? item.title : (item.title_en || item.title) }}</h2>
                <p class="excerpt">{{ isZh ? item.excerpt : (item.excerpt_en || item.excerpt) }}</p>
                <span class="read-more">{{ isZh ? '阅读更多 →' : 'Read More →' }}</span>
              </div>
            </RouterLink>
          </div>

          <p v-if="!news.length" class="empty">{{ isZh ? '暂无新闻' : 'No news available.' }}</p>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button
              v-for="p in totalPages" :key="p"
              :class="{ active: p === page }"
              @click="loadPage(p)"
            >{{ p }}</button>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLangStore } from '@/stores/lang'

const { isZh } = useLangStore()
const news = ref([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const LIMIT = 9

const totalPages = computed(() => Math.ceil(total.value / LIMIT))

async function loadPage(p) {
  page.value = p
  loading.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
  try {
    const r = await fetch(`/api/news?page=${p}&limit=${LIMIT}`)
    const d = await r.json()
    news.value = d.data || []
    total.value = d.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => loadPage(1))
</script>

<style scoped>
.news-list-section { padding: 64px 0 80px; }
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 40px;
}
.news-card { text-decoration: none; }
.news-img {
  height: 210px;
  background: var(--light) center/cover;
  display: flex; align-items: center; justify-content: center;
}
.placeholder { font-size: 2.5rem; opacity: 0.25; }
.news-body { padding: 22px; }
.news-date { font-size: 0.75rem; color: var(--gold); font-weight: 600; margin-bottom: 8px; }
.news-body h2 {
  font-size: 1rem; font-weight: 700; color: var(--navy);
  margin-bottom: 10px; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.excerpt {
  font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.read-more { font-size: 0.8rem; font-weight: 600; color: var(--sky); }
.empty { text-align: center; color: var(--text-muted); padding: 60px 0; }
.pagination { display: flex; gap: 8px; justify-content: center; margin-top: 40px; }
.pagination button {
  padding: 6px 14px; border: 1px solid var(--border);
  background: white; border-radius: 3px; font-size: 0.85rem; cursor: pointer;
  transition: all 0.2s;
}
.pagination button.active { background: var(--navy); color: white; border-color: var(--navy); }
.pagination button:hover:not(.active) { border-color: var(--sky); color: var(--sky); }
@media (max-width: 900px) { .news-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 600px) { .news-grid { grid-template-columns: 1fr; } }
</style>
