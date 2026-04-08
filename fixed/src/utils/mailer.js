const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (!transporter && process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

async function sendContactNotification(contact) {
  const t = getTransporter();
  if (!t) { console.log('[mailer] SMTP not configured — skipping email'); return; }
  const to = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
  await t.sendMail({
    from: `"Fulfill Aviation Website" <${process.env.SMTP_USER}>`,
    to,
    subject: `New Contact: ${contact.first_name} ${contact.last_name} — ${contact.service || 'General'}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${contact.first_name} ${contact.last_name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Company</td><td style="padding:8px;border:1px solid #ddd">${contact.company || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Service</td><td style="padding:8px;border:1px solid #ddd">${contact.service || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${contact.message.replace(/\n/g,'<br>')}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Time</td><td style="padding:8px;border:1px solid #ddd">${new Date().toLocaleString()}</td></tr>
      </table>
    `,
  });
}

async function sendContactAutoReply(contact) {
  const t = getTransporter();
  if (!t) return;
  await t.sendMail({
    from: `"Shanghai Fulfill Aviation" <${process.env.SMTP_USER}>`,
    to: contact.email,
    subject: 'Thank you for contacting Shanghai Fulfill Aviation Ground Service',
    html: `
      <p>Dear ${contact.first_name},</p>
      <p>Thank you for reaching out to Shanghai Fulfill Aviation Ground Service. We have received your message and our team will get back to you within 1–2 business days.</p>
      <p>If your matter is urgent, please call us directly at ${process.env.COMPANY_PHONE || '+86 21 XXXX XXXX'}.</p>
      <br>
      <p>Best regards,<br>Shanghai Fulfill Aviation Ground Service Team</p>
    `,
  });
}

module.exports = { sendContactNotification, sendContactAutoReply };