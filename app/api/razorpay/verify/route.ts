import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { connectDB } from '@/lib/mongodb'
import { Donation, Campaign } from '@/lib/models'
import { rateLimit } from '@/lib/rate-limit'
import {
  sendDonationConfirmation,
  sendDonationThankYou,
  sendDonationAdminNotification,
} from '@/lib/email'

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
      let campaignTitle: string | undefined
      if (campaignSlug) {
        const campaign = await Campaign.findOneAndUpdate(
          { slug: campaignSlug },
          {
            $inc: { raised: amount / 100, donors: 1 },
          },
          { new: true }
        )
        campaignTitle = campaign?.title
      }

      const donationAmount = amount / 100
      const emailData = {
        donorName: donorName || 'Anonymous',
        donorEmail: donorEmail || '',
        donorPhone: donorPhone || '',
        amount: donationAmount,
        receipt: donation.receipt,
        campaignTitle,
      }

      if (donorEmail) {
        void sendDonationConfirmation(emailData).catch(console.error)
        void sendDonationThankYou(emailData).catch(console.error)
      }
      void sendDonationAdminNotification(emailData).catch(console.error)

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
