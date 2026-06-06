import { NextRequest, NextResponse } from 'next/server'
import { getRazorpay } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
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
