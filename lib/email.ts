import nodemailer from 'nodemailer'
import {
  baseEmailTemplate,
  detailRow,
  escapeHtml,
  formatCurrency,
  formatDate,
  infoBox,
} from '@/lib/email-templates/base'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn('SMTP credentials not configured. Emails will not be sent.')
    return null
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  return transporter
}

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || process.env.SMTP_FROM || 'admin@sansarkalyan.org'
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  const transport = getTransporter()
  if (!transport) {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`)
    return { success: true, mock: true }
  }

  try {
    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

// ─── Donation emails ─────────────────────────────────────────────────────────

export async function sendDonationConfirmation(data: {
  donorName: string
  donorEmail: string
  amount: number
  receipt?: string
  campaignTitle?: string
}) {
  const content = `
    <p>Dear ${escapeHtml(data.donorName)},</p>
    <p>Your donation to Sansar Kalyan Trust has been confirmed. Here are your payment details:</p>
    ${infoBox(`
      ${detailRow('Amount', formatCurrency(data.amount))}
      ${data.campaignTitle ? detailRow('Campaign', data.campaignTitle) : ''}
      ${data.receipt ? detailRow('Receipt No.', data.receipt) : ''}
      ${detailRow('Date', formatDate())}
    `)}
    <p>Please keep this email for your records.</p>
  `

  return sendEmail({
    to: data.donorEmail,
    subject: 'Donation Confirmation – Sansar Kalyan Trust',
    html: baseEmailTemplate({
      title: 'Donation Confirmed',
      previewText: `Your donation of ${formatCurrency(data.amount)} has been confirmed.`,
      content,
    }),
  })
}

export async function sendDonationThankYou(data: {
  donorName: string
  donorEmail: string
  amount: number
  campaignTitle?: string
}) {
  const content = `
    <p>Dear ${escapeHtml(data.donorName)},</p>
    <p>Thank you for your generous donation of <strong>${formatCurrency(data.amount)}</strong>${data.campaignTitle ? ` to <strong>${escapeHtml(data.campaignTitle)}</strong>` : ''}.</p>
    <p>Your contribution helps us serve communities through healthcare, education, and environmental initiatives. Together, we are making a real difference in people's lives.</p>
    <p>With heartfelt gratitude,<br/>Sansar Kalyan Trust Team</p>
  `

  return sendEmail({
    to: data.donorEmail,
    subject: 'Thank You for Your Donation – Sansar Kalyan Trust',
    html: baseEmailTemplate({
      title: 'Thank You!',
      previewText: 'Your generosity makes a difference.',
      content,
    }),
  })
}

export async function sendDonationAdminNotification(data: {
  donorName: string
  donorEmail: string
  donorPhone?: string
  amount: number
  receipt?: string
  campaignTitle?: string
}) {
  const content = `
    <p>A new donation has been received:</p>
    ${infoBox(`
      ${detailRow('Donor', data.donorName)}
      ${detailRow('Email', data.donorEmail)}
      ${data.donorPhone ? detailRow('Phone', data.donorPhone) : ''}
      ${detailRow('Amount', formatCurrency(data.amount))}
      ${data.campaignTitle ? detailRow('Campaign', data.campaignTitle) : ''}
      ${data.receipt ? detailRow('Receipt', data.receipt) : ''}
      ${detailRow('Date', formatDate())}
    `)}
  `

  return sendEmail({
    to: getAdminEmail(),
    subject: `New Donation: ${formatCurrency(data.amount)} from ${data.donorName}`,
    html: baseEmailTemplate({
      title: 'New Donation Received',
      previewText: `${data.donorName} donated ${formatCurrency(data.amount)}`,
      content,
    }),
  })
}

// ─── Volunteer emails ────────────────────────────────────────────────────────

export async function sendVolunteerConfirmation(data: { name: string; email: string }) {
  const content = `
    <p>Dear ${escapeHtml(data.name)},</p>
    <p>Thank you for your interest in volunteering with Sansar Kalyan Trust.</p>
    <p>We have received your application and our team will review it shortly. You will hear back from us within 5–7 business days.</p>
    <p>Thank you for wanting to make a difference!</p>
    <p>Best regards,<br/>Sansar Kalyan Trust Team</p>
  `

  return sendEmail({
    to: data.email,
    subject: 'Volunteer Application Received – Sansar Kalyan Trust',
    html: baseEmailTemplate({
      title: 'Application Received',
      previewText: 'We received your volunteer application.',
      content,
    }),
  })
}

export async function sendVolunteerAdminNotification(data: {
  name: string
  email: string
  phone: string
  city: string
  skills: string[]
  motivation: string
}) {
  const content = `
    <p>A new volunteer application has been submitted:</p>
    ${infoBox(`
      ${detailRow('Name', data.name)}
      ${detailRow('Email', data.email)}
      ${detailRow('Phone', data.phone)}
      ${detailRow('City', data.city)}
      ${detailRow('Skills', data.skills.join(', '))}
      <p style="margin: 12px 0 0;"><strong>Motivation:</strong></p>
      <p style="margin: 4px 0 0; background: white; padding: 12px; border-radius: 4px;">${escapeHtml(data.motivation)}</p>
    `)}
  `

  return sendEmail({
    to: getAdminEmail(),
    subject: `New Volunteer Application: ${data.name}`,
    html: baseEmailTemplate({
      title: 'New Volunteer Application',
      previewText: `${data.name} applied to volunteer`,
      content,
    }),
  })
}

// ─── Contact emails ──────────────────────────────────────────────────────────

export async function sendContactAcknowledgement(data: { name: string; email: string }) {
  const content = `
    <p>Dear ${escapeHtml(data.name)},</p>
    <p>Thank you for reaching out to Sansar Kalyan Trust.</p>
    <p>We have received your message and a member of our team will get back to you within 2–3 business days.</p>
    <p>Best regards,<br/>Sansar Kalyan Trust Team</p>
  `

  return sendEmail({
    to: data.email,
    subject: 'We Received Your Message – Sansar Kalyan Trust',
    html: baseEmailTemplate({
      title: 'Message Received',
      previewText: 'We received your inquiry and will respond soon.',
      content,
    }),
  })
}

export async function sendContactAdminNotification(data: {
  name: string
  email: string
  phone?: string
  message: string
}) {
  const content = `
    <p>A new contact inquiry has been submitted:</p>
    ${infoBox(`
      ${detailRow('Name', data.name)}
      ${detailRow('Email', data.email)}
      ${data.phone ? detailRow('Phone', data.phone) : detailRow('Phone', 'Not provided')}
      <p style="margin: 12px 0 0;"><strong>Message:</strong></p>
      <p style="margin: 4px 0 0; background: white; padding: 12px; border-radius: 4px;">${escapeHtml(data.message)}</p>
    `)}
  `

  return sendEmail({
    to: getAdminEmail(),
    subject: `New Contact Inquiry from ${data.name}`,
    html: baseEmailTemplate({
      title: 'New Contact Inquiry',
      previewText: `${data.name} sent a message via the contact form`,
      content,
    }),
  })
}

// Legacy aliases (kept for backward compatibility)
export const sendContactNotification = sendContactAdminNotification
export const sendDonationReceipt = sendDonationConfirmation
