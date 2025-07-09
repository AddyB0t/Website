import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface RazorpayOptions {
  amount: number
  planId: string
  planName: string
  billingCycle: 'monthly' | 'annual'
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const loadRazorpayScript = useCallback(() => {
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
  }, [])

  const createOrder = useCallback(async (options: RazorpayOptions) => {
    try {
      console.log('Creating order with options:', options)
      
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API error response:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create order`)
      }

      const result = await response.json()
      console.log('Order created successfully:', result)
      return result
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }, [])

  const verifyPayment = useCallback(async (
    paymentData: RazorpayResponse,
    planId: string,
    billingCycle: string
  ) => {
    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          planId,
          billingCycle,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Payment verification failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }, [])

  const initiatePayment = useCallback(async (options: RazorpayOptions) => {
    if (!isSignedIn) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to proceed with payment.',
        variant: 'destructive',
      })
      router.push('/sign-in')
      return
    }

    setIsLoading(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script')
      }

      // Create order
      const orderData = await createOrder(options)

      // Configure Razorpay options
      const razorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'ZapUp',
        description: `${options.planName} - ${options.billingCycle} subscription`,
        image: '/favicon.ico',
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verificationResult = await verifyPayment(
              response,
              options.planId,
              options.billingCycle
            )

            toast({
              title: 'Payment Successful!',
              description: `Your ${options.planName} subscription has been activated.`,
            })

            // Redirect to dashboard or success page
            router.push('/dashboard/pricing?success=true')
          } catch (error) {
            toast({
              title: 'Payment Verification Failed',
              description: 'Please contact support if the amount was debited.',
              variant: 'destructive',
            })
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        notes: {
          planId: options.planId,
          billingCycle: options.billingCycle,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            toast({
              title: 'Payment Cancelled',
              description: 'You can try again anytime.',
            })
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(razorpayOptions)
      razorpay.open()
    } catch (error) {
      console.error('Payment initiation error:', error)
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [isSignedIn, router, toast, loadRazorpayScript, createOrder, verifyPayment])

  return {
    initiatePayment,
    isLoading,
  }
} 