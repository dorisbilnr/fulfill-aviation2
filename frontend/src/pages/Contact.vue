<template>
  <div>
    <div class="page-banner">
      <div class="container">
        <span class="section-tag">{{ isZh ? '联系我们' : 'Contact Us' }}</span>
        <h1>{{ isZh ? '联络方式' : 'Contact Details' }}</h1>
      </div>
    </div>

    <section class="contact-section">
      <div class="container contact-grid">

        <!-- Left: contact info -->
        <div class="contact-info">
          <h2>{{ isZh ? '期待您的来信' : 'We would love to hear from you' }}</h2>

          <div class="info-row">
            <span class="info-icon">📍</span>
            <div>
              <p class="info-label">{{ isZh ? '地址' : 'Address' }}</p>
              <p class="info-value">{{ isZh ? s.address_zh : s.address }}</p>
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
              <p class="info-value">{{ isZh ? s.business_hours_zh : s.business_hours }}</p>
            </div>
          </div>
        </div>

        <!-- Right: contact form -->
        <div class="contact-form-wrap">
          <h2>{{ isZh ? '发送消息' : 'Send Us a Message' }}</h2>

          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label>{{ isZh ? '名' : 'First Name' }} *</label>
                <input v-model="form.first_name" type="text" required :placeholder="isZh ? '请输入您的名字' : 'Your first name'"/>
              </div>
              <div class="form-group">
                <label>{{ isZh ? '姓' : 'Last Name' }} *</label>
                <input v-model="form.last_name" type="text" required :placeholder="isZh ? '请输入您的姓氏' : 'Your last name'"/>
              </div>
            </div>
            <div class="form-group">
              <label>{{ isZh ? '电子邮箱' : 'Email Address' }} *</label>
              <input v-model="form.email" type="email" required :placeholder="isZh ? 'your@email.com' : 'your@email.com'"/>
            </div>
            <div class="form-group">
              <label>{{ isZh ? '公司名称' : 'Company' }}</label>
              <input v-model="form.company" type="text" :placeholder="isZh ? '您的公司（可选）' : 'Your company (optional)'"/>
            </div>
            <div class="form-group">
              <label>{{ isZh ? '感兴趣的服务' : 'Service of Interest' }}</label>
              <select v-model="form.service">
                <option value="">{{ isZh ? '请选择...' : 'Select a service...' }}</option>
                <option v-for="svc in services" :key="svc.id" :value="isZh ? (svc.name_zh || svc.name) : svc.name">
                  {{ isZh ? (svc.name_zh || svc.name) : svc.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ isZh ? '留言' : 'Message' }} *</label>
              <textarea v-model="form.message" required rows="5"
                :placeholder="isZh ? '请告诉我们您的需求...' : 'Tell us how we can help...'"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? '...' : (isZh ? '发送消息' : 'Send Message') }}
            </button>
          </form>

          <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useServicesStore } from '@/stores/services'
import { useLangStore } from '@/stores/lang'

const settings = useSettingsStore()
const servicesStore = useServicesStore()
const { isZh } = useLangStore()
const s = settings.data
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
    successMsg.value = isZh.value ? '消息已发送，我们将尽快与您联系！' : 'Message sent successfully! We will be in touch soon.'
    form.value = { first_name: '', last_name: '', email: '', company: '', service: '', message: '' }
  } catch (e) {
    errorMsg.value = isZh.value ? '发送失败，请稍后重试。' : 'Failed to send. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.contact-section { padding: 72px 0 80px; }
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 72px;
  align-items: start;
}
.contact-info h2,
.contact-form-wrap h2 {
  font-size: 1.4rem; font-weight: 700; color: var(--navy);
  margin-bottom: 32px;
}
.info-row {
  display: flex; gap: 16px; margin-bottom: 24px; align-items: flex-start;
}
.info-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
.info-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
.info-value { font-size: 0.92rem; color: var(--text); line-height: 1.5; }
.info-link { color: var(--sky); text-decoration: underline; }

.contact-form { display: flex; flex-direction: column; gap: 0; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
.form-group label { font-size: 0.78rem; font-weight: 600; color: #4a5568; letter-spacing: 0.3px; }
.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 4px; font-size: 0.9rem;
  font-family: inherit;
  outline: none; transition: border 0.2s;
  background: white;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: var(--sky); }
.form-group textarea { resize: vertical; min-height: 120px; }
button[type="submit"]:disabled { opacity: 0.6; cursor: not-allowed; }
.success-msg {
  margin-top: 16px; padding: 14px 18px;
  background: #dcfce7; color: #15803d;
  border-radius: 4px; font-size: 0.9rem;
}
.error-msg {
  margin-top: 16px; padding: 14px 18px;
  background: #fee2e2; color: #b91c1c;
  border-radius: 4px; font-size: 0.9rem;
}
@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; gap: 48px; }
}
@media (max-width: 500px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
