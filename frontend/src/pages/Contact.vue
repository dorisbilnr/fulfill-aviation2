<template>
  <div>
    <!-- Page Hero -->
    <div class="page-hero">
      <div class="page-hero-content">
        <span class="page-tag">{{ isZh ? '联系我们' : 'Contact Us' }}</span>
        <h1 class="page-title">{{ isZh ? '联络方式' : 'Contact Details' }}</h1>
      </div>
    </div>

    <div class="container">
      <div class="contact-wrap">

        <!-- Left: contact info -->
        <div class="contact-info">
          <h2>{{ isZh ? '期待您的来信' : 'We would love to hear from you' }}</h2>

          <div class="info-row">
            <span class="info-icon">📍</span>
            <div>
              <p class="info-label">{{ isZh ? '地址' : 'Address' }}</p>
              <p class="info-value">{{ isZh ? (s.address_zh || s.address) : (s.address || '') }}</p>
            </div>
          </div>
          <div class="info-row">
            <span class="info-icon">📞</span>
            <div>
              <p class="info-label">{{ isZh ? '电话' : 'Phone' }}</p>
              <p class="info-value">{{ s.phone }}</p>
            </div>
          </div>
          <div v-if="s.fax" class="info-row">
            <span class="info-icon">📠</span>
            <div>
              <p class="info-label">{{ isZh ? '传真' : 'Fax' }}</p>
              <p class="info-value">{{ s.fax }}</p>
            </div>
          </div>
          <div class="info-row">
            <span class="info-icon">✉️</span>
            <div>
              <p class="info-label">{{ isZh ? '邮箱' : 'Email' }}</p>
              <a :href="`mailto:${s.email}`" class="info-value info-link">{{ s.email }}</a>
            </div>
          </div>
          <div class="info-row">
            <span class="info-icon">🕐</span>
            <div>
              <p class="info-label">{{ isZh ? '营业时间' : 'Business Hours' }}</p>
              <p class="info-value">{{ isZh ? (s.business_hours_zh || s.business_hours) : s.business_hours }}</p>
            </div>
          </div>
        </div>

        <!-- Right: contact form -->
        <div class="contact-form-wrap">
          <div class="gold-line-top"></div>
          <h2>{{ isZh ? '发送消息' : 'Send Us a Message' }}</h2>

          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label>{{ isZh ? '名' : 'First Name' }} *</label>
                <input v-model="form.first_name" type="text" required
                  :placeholder="isZh ? '请输入您的名字' : 'Your first name'" />
              </div>
              <div class="form-group">
                <label>{{ isZh ? '姓' : 'Last Name' }} *</label>
                <input v-model="form.last_name" type="text" required
                  :placeholder="isZh ? '请输入您的姓氏' : 'Your last name'" />
              </div>
            </div>
            <div class="form-group">
              <label>{{ isZh ? '电子邮箱' : 'Email Address' }} *</label>
              <input v-model="form.email" type="email" required placeholder="your@email.com" />
            </div>
            <div class="form-group">
              <label>{{ isZh ? '公司名称' : 'Company' }}</label>
              <input v-model="form.company" type="text"
                :placeholder="isZh ? '您的公司（可选）' : 'Your company (optional)'" />
            </div>
            <div class="form-group">
              <label>{{ isZh ? '感兴趣的服务' : 'Service of Interest' }}</label>
              <select v-model="form.service">
                <option value="">{{ isZh ? '请选择...' : 'Select a service...' }}</option>
                <option v-for="svc in services" :key="svc.id"
                  :value="isZh ? (svc.name_zh || svc.name) : svc.name">
                  {{ isZh ? (svc.name_zh || svc.name) : svc.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ isZh ? '留言' : 'Message' }} *</label>
              <textarea v-model="form.message" required rows="5"
                :placeholder="isZh ? '请告诉我们您的需求...' : 'Tell us how we can help...'">
              </textarea>
            </div>

            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? '...' : (isZh ? '发送消息' : 'Send Message') }}
            </button>
          </form>

          <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useServicesStore } from '@/stores/services'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const servicesStore = useServicesStore()
const { isZh } = storeToRefs(useLangStore())
const { data: s } = storeToRefs(settings)
const services = computed(() => servicesStore.list)

const form = ref({ first_name: '', last_name: '', email: '', company: '', service: '', message: '' })
const submitting = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

async function submitForm() {
  submitting.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const r = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    const d = await r.json()
    if (!r.ok) throw new Error(d.error || 'Failed')
    successMsg.value = isZh.value
      ? '消息已发送，我们将尽快与您联系！'
      : 'Message sent successfully! We will be in touch soon.'
    form.value = { first_name: '', last_name: '', email: '', company: '', service: '', message: '' }
  } catch (e) {
    errorMsg.value = isZh.value ? '发送失败，请稍后重试。' : 'Failed to send. Please try again.'
  } finally {
    submitting.value = false
  }
}
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

.container { max-width: 1100px; margin: 0 auto; padding: 72px 40px 80px; }

.contact-wrap {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 80px;
  align-items: start;
}

/* Info column */
.contact-info h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem; font-weight: 400; color: var(--navy);
  margin-bottom: 36px; line-height: 1.3;
}
.info-row { display: flex; gap: 16px; margin-bottom: 28px; align-items: flex-start; }
.info-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
.info-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--sky); margin-bottom: 4px; }
.info-value { font-size: 0.9rem; color: #4a5568; line-height: 1.6; }
.info-link { color: var(--sky); text-decoration: none; }
.info-link:hover { text-decoration: underline; }

/* Form column */
.gold-line-top { width: 48px; height: 3px; background: var(--gold); margin-bottom: 20px; }
.contact-form-wrap h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem; font-weight: 400; color: var(--navy);
  margin-bottom: 32px;
}

.contact-form { background: var(--light); padding: 40px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
.form-group label { font-size: 0.78rem; font-weight: 600; color: #4a5568; letter-spacing: 0.3px; text-transform: uppercase; }
.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid #dde3ec;
  font-size: 0.9rem;
  font-family: 'Barlow', sans-serif;
  outline: none; transition: border 0.2s;
  background: white;
  border-radius: 0;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: var(--sky); }
.form-group textarea { resize: vertical; min-height: 120px; }

.submit-btn {
  width: 100%;
  background: var(--navy);
  color: white;
  padding: 14px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  font-family: 'Barlow', sans-serif;
}
.submit-btn:hover { background: var(--sky); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.success-msg {
  margin-top: 16px; padding: 14px 18px;
  background: #dcfce7; color: #15803d;
  font-size: 0.9rem;
}
.error-msg {
  margin-top: 16px; padding: 14px 18px;
  background: #fee2e2; color: #b91c1c;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .contact-wrap { grid-template-columns: 1fr; gap: 48px; }
  .container { padding: 48px 24px 60px; }
}
@media (max-width: 500px) {
  .form-row { grid-template-columns: 1fr; }
  .contact-form { padding: 24px; }
}
</style>
