import nodemailer from 'nodemailer'

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

export async function sendContactNotification(data: {
  name: string
  email: string
  phone?: string
  message: string
}) {
  const adminEmail = process.env.SMTP_FROM || 'admin@sansarkalyan.org'

  return sendEmail({
    to: adminEmail,
    subject: `New Contact Inquiry from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">New Contact Inquiry</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p style="background: white; padding: 15px; border-radius: 4px;">${data.message}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This notification was sent from Sansar Kalyan Trust website.
        </p>
      </div>
    `,
  })
}

export async function sendDonationReceipt(data: {
  donorName: string
  donorEmail: string
  amount: number
  receipt?: string
  campaignTitle?: string
}) {
  return sendEmail({
    to: data.donorEmail,
    subject: `Thank you for your donation - Sansar Kalyan Trust`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Thank You!</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 8px 8px;">
          <p>Dear ${data.donorName},</p>
          <p>Thank you for your generous donation to Sansar Kalyan Trust.</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount:</strong> ₹${data.amount.toLocaleString('en-IN')}</p>
            ${data.campaignTitle ? `<p><strong>Campaign:</strong> ${data.campaignTitle}</p>` : ''}
            ${data.receipt ? `<p><strong>Receipt:</strong> ${data.receipt}</p>` : ''}
            <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
          <p>Your contribution helps us serve communities through healthcare, education, and environmental initiatives.</p>
          <p>With gratitude,<br/>Sansar Kalyan Trust Team</p>
        </div>
      </div>
    `,
  })
}

export async function sendVolunteerConfirmation(data: {
  name: string
  email: string
}) {
  return sendEmail({
    to: data.email,
    subject: `Volunteer Application Received - Sansar Kalyan Trust`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Application Received</h2>
        <p>Dear ${data.name},</p>
        <p>Thank you for your interest in volunteering with Sansar Kalyan Trust.</p>
        <p>We have received your application and our team will review it shortly. You will hear back from us within 5-7 business days.</p>
        <p>Thank you for wanting to make a difference!</p>
        <p>Best regards,<br/>Sansar Kalyan Trust Team</p>
      </div>
    `,
  })
}
