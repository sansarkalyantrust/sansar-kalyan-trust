import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { connectDB } from '@/lib/mongodb'
import { Donation, Campaign } from '@/lib/models'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donorName,
      donorEmail,
      donorPhone,
      amount,
      campaignSlug,
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification data is missing' }, { status: 400 })
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Save donation to database
    const db = await connectDB()
    if (db) {
      const donation = await Donation.create({
        amount: amount / 100, // Convert from paise
        donorName: donorName || 'Anonymous',
        donorEmail: donorEmail || '',
        donorPhone: donorPhone || '',
        campaignSlug: campaignSlug || null,
        method: 'razorpay',
        status: 'completed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        receipt: `RCP-${Date.now()}`,
      })

      // Update campaign raised amount if campaign donation
      if (campaignSlug) {
        await Campaign.findOneAndUpdate(
          { slug: campaignSlug },
          {
            $inc: { raised: amount / 100, donors: 1 },
          }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified and donation recorded successfully',
        donation: {
          id: donation._id,
          amount: donation.amount,
          receipt: donation.receipt,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}
