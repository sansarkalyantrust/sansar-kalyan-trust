import { NextRequest, NextResponse } from 'next/server'
import { getRazorpay } from '@/lib/razorpay'
import { rateLimit } from '@/lib/rate-limit'

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(ip, { windowMs: 60 * 1000, max: 10 })
    if (!limit.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const { amount, currency = 'INR', receipt, notes } = body

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    const razorpay = getRazorpay()
    if (!razorpay) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 })
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    })
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
