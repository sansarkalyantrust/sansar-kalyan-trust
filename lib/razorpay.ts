import Razorpay from 'razorpay'

let razorpayInstance: Razorpay | null = null

export function getRazorpay(): Razorpay | null {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('Razorpay credentials not configured')
    return null
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }

  return razorpayInstance
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto')
  const secret = process.env.RAZORPAY_KEY_SECRET

  if (!secret) return false

  const body = orderId + '|' + paymentId
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return expectedSignature === signature
}
