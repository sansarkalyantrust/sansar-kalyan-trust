'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayButtonProps {
  amount: number
  donorName: string
  donorEmail: string
  donorPhone?: string
  campaignSlug?: string
  onSuccess?: (data: any) => void
  onFailure?: (error: any) => void
  className?: string
  children?: React.ReactNode
  disabled?: boolean
}

export function RazorpayButton({
  amount,
  donorName,
  donorEmail,
  donorPhone,
  campaignSlug,
  onSuccess,
  onFailure,
  className,
  children,
  disabled,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false)

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!amount || amount < 1) return

    setLoading(true)

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        throw new Error('Failed to load payment gateway')
      }

      // Create order
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          receipt: `donation_${Date.now()}`,
          notes: { campaignSlug, donorName, donorEmail },
        }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Sansar Kalyan Trust',
        description: campaignSlug
          ? `Donation for campaign: ${campaignSlug}`
          : 'General Donation',
        order_id: orderData.order.id,
        prefill: {
          name: donorName,
          email: donorEmail,
          contact: donorPhone || '',
        },
        theme: {
          color: '#16a34a',
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donorName,
                donorEmail,
                donorPhone,
                amount: orderData.order.amount,
                campaignSlug,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyRes.ok && verifyData.success) {
              onSuccess?.(verifyData)
            } else {
              onFailure?.(verifyData)
            }
          } catch (err) {
            onFailure?.(err)
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        onFailure?.(response.error)
        setLoading(false)
      })
      rzp.open()
    } catch (error: any) {
      onFailure?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading || !amount || amount < 1}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children || (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Donate ₹{amount?.toLocaleString('en-IN')}
          </>
        )
      )}
    </Button>
  )
}
