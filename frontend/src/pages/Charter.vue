<template>
  <div>
    <!-- Page Hero -->
    <div class="page-hero">
      <div class="page-hero-content">
        <span class="page-tag">Charter Services</span>
        <h1 class="page-title">{{ isZh ? (s.nav_charter_zh || '定班和包机') : (s.nav_charter || 'Scheduled & Charter') }}</h1>
      </div>
    </div>

    <div class="container">
      <!-- Intro -->
      <div class="charter-intro">
        <h2>{{ isZh ? '专业包机解决方案' : 'Professional Charter Solutions' }}</h2>
        <p>{{ isZh
          ? (s.charter_intro_zh || s.charter_intro || '上海赋瞻航空地面服务为企业、政府机构、航空公司和货运运营商提供专业航空包机解决方案。')
          : (s.charter_intro || 'Shanghai Fulfill Aviation Ground Service provides professional aviation charter solutions for corporations, government agencies, airlines, and cargo operators. Our team delivers end-to-end charter coordination with global reach and uncompromising standards.') }}</p>
      </div>

      <!-- Charter Types -->
      <div class="section-label">{{ isZh ? '包机类型' : 'Charter Types' }}</div>
      <div class="charter-types">
        <div v-for="(type, i) in charterTypes" :key="i" class="ct-card" v-show="type.title">
          <div class="ct-img">
            <img v-if="type.image" :src="type.image" :alt="type.title" class="ct-img-photo" />
            <span v-else>{{ EMOJIS[i] }}</span>
          </div>
          <div class="ct-body">
            <div class="ct-title">{{ type.title }}</div>
            <p class="ct-desc">{{ type.desc }}</p>
            <RouterLink to="/contact" class="ct-link">{{ isZh ? '申请报价' : 'Request Quote' }}</RouterLink>
          </div>
        </div>
      </div>

      <!-- CTA box -->
      <div class="inquiry-box">
        <h3>{{ isZh ? '准备好预订您的航班了吗？' : 'Ready to Charter Your Flight?' }}</h3>
        <p>{{ isZh ? '联系我们的团队获取定制包机方案和专属协调服务。' : 'Contact our team for a customized charter proposal and dedicated coordination support.' }}</p>
        <RouterLink to="/contact" class="inquiry-btn">{{ isZh ? '获取报价' : 'Get a Quote' }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const { isZh } = useLangStore()
const s = settings.data

const EMOJIS = ['👥', '🤝', '📦', '🎫']

const charterTypes = computed(() => [1, 2, 3, 4].map((n, i) => ({
  title: isZh.value
    ? (s[`charter_type${n}_title_zh`] || s[`charter_type${n}_title`] || '')
    : (s[`charter_type${n}_title`] || ''),
  desc: isZh.value
    ? (s[`charter_type${n}_desc_zh`] || s[`charter_type${n}_desc`] || '')
    : (s[`charter_type${n}_desc`] || ''),
  image: s[`charter_type${n}_image`] || '',
  emoji: EMOJIS[i],
})))
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

.charter-intro { text-align: center; max-width: 720px; margin: 0 auto 64px; }
.charter-intro h2 { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; color: var(--navy); font-weight: 300; margin-bottom: 16px; }
.charter-intro p { color: #4a5568; font-size: 0.95rem; line-height: 1.85; }

.section-label { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: var(--navy); border-bottom: 2px solid var(--gold); padding-bottom: 12px; margin-bottom: 32px; display: inline-block; }

.charter-types { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; margin-bottom: 64px; }
.ct-card {
  display: grid; grid-template-columns: 200px 1fr; gap: 0;
  border: 1px solid #e5e9f0; border-radius: 4px; overflow: hidden;
  transition: box-shadow 0.3s;
}
.ct-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.1); }

.ct-img {
  background: linear-gradient(135deg, #0b2d52, #1a6ea8);
  min-height: 180px;
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; overflow: hidden; position: relative;
}
.ct-img-photo { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }

.ct-body { padding: 28px; }
.ct-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--navy); margin-bottom: 10px; }
.ct-desc { color: #4a5568; font-size: 0.88rem; line-height: 1.75; margin-bottom: 16px; }
.ct-link {
  display: inline-block; color: var(--sky); font-size: 0.78rem; font-weight: 600;
  letter-spacing: 1px; text-transform: uppercase;
  border-bottom: 1px solid var(--sky); padding-bottom: 2px;
  text-decoration: none; transition: color 0.2s, border-color 0.2s;
}
.ct-link:hover { color: var(--gold); border-color: var(--gold); }

.inquiry-box {
  background: var(--navy); padding: 56px 48px;
  text-align: center; border-radius: 4px;
}
.inquiry-box h3 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: var(--white); font-weight: 300; margin-bottom: 12px; }
.inquiry-box p { color: rgba(255,255,255,0.65); margin-bottom: 28px; font-size: 0.92rem; }
.inquiry-btn {
  display: inline-block; background: var(--gold); color: var(--navy);
  padding: 14px 40px; font-size: 0.82rem; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase; transition: opacity 0.3s;
  text-decoration: none; font-family: 'Barlow', sans-serif;
}
.inquiry-btn:hover { opacity: 0.88; }

@media (max-width: 900px) {
  .charter-types { grid-template-columns: 1fr; }
  .ct-card { grid-template-columns: 1fr; }
  .ct-img { min-height: 140px; }
  .container { padding: 48px 24px; }
  .inquiry-box { padding: 40px 24px; }
}
</style>
