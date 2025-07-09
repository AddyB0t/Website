import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Clock, AlertCircle, CheckCircle } from 'lucide-react'

export default function CancellationRefundsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-gray-800 font-light tracking-widest uppercase text-lg">ZapUp</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
            Home
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
            Pricing
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
            Contact
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" className="text-blue-800 hover:bg-blue-50 uppercase text-xs tracking-wider">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light text-gray-800 mb-6 tracking-wide">Cancellation & Refunds Policy</h1>
            <div className="h-0.5 w-16 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              Learn about our subscription cancellation and refund policies
            </p>
          </div>

          <div className="space-y-8">
            {/* Overview */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800 font-medium">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <span>Policy Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  At ZapUp, we strive to provide the best educational experience. We understand that 
                  circumstances may change, and we've designed our cancellation and refund policy to be 
                  fair and transparent.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-semibold">Last Updated: January 1, 2024</p>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Cancellation */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-gray-800 font-medium">Subscription Cancellation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How to Cancel</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Log into your ZapUp account</li>
                    <li>• Go to Account Settings → Subscription</li>
                    <li>• Click "Cancel Subscription"</li>
                    <li>• Follow the confirmation steps</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What Happens After Cancellation</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Your subscription remains active until the end of the current billing period</li>
                    <li>• You'll continue to have access to all premium features until expiration</li>
                    <li>• No further charges will be made to your payment method</li>
                    <li>• You can reactivate your subscription at any time</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-gray-800 font-medium">Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Eligible for Refund</h3>
                    </div>
                    <ul className="space-y-1 text-green-800 text-sm">
                      <li>• Requests within 7 days of subscription</li>
                      <li>• Technical issues preventing access</li>
                      <li>• Duplicate payments</li>
                      <li>• Unauthorized transactions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">Not Eligible for Refund</h3>
                    </div>
                    <ul className="space-y-1 text-red-800 text-sm">
                      <li>• Requests after 7 days</li>
                      <li>• Change of mind</li>
                      <li>• Partial usage of subscription</li>
                      <li>• Violation of terms of service</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Refund Process</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Submit Request</h4>
                        <p className="text-gray-600 text-sm">Contact our support team at support@zapup.org with your refund request</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Review Process</h4>
                        <p className="text-gray-600 text-sm">We'll review your request within 2-3 business days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Refund Processing</h4>
                        <p className="text-gray-600 text-sm">If approved, refunds are processed within 5-7 business days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Times */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800 font-medium">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Processing Times</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Refund Methods & Timelines</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Credit/Debit Card</span>
                        <span className="font-medium">5-7 business days</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">UPI</span>
                        <span className="font-medium">1-3 business days</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Net Banking</span>
                        <span className="font-medium">3-5 business days</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Wallet</span>
                        <span className="font-medium">1-2 business days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Important Notes</h3>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• Refunds are processed to the original payment method</li>
                      <li>• Bank processing times may vary</li>
                      <li>• You'll receive email confirmation once refund is initiated</li>
                      <li>• Contact support if refund is delayed beyond mentioned timeline</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Circumstances */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-gray-800 font-medium">Special Circumstances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Issues</h3>
                  <p className="text-gray-600">
                    If you experience technical difficulties that prevent you from accessing our services, 
                    please contact support immediately. We may provide account credits or full refunds 
                    depending on the severity and duration of the issue.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Annual Subscriptions</h3>
                  <p className="text-gray-600">
                    Annual subscriptions are eligible for pro-rated refunds within the first 30 days. 
                    After 30 days, refunds are subject to review and may be provided as account credits 
                    for future use.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Educational Institution Discounts</h3>
                  <p className="text-gray-600">
                    Bulk subscriptions and institutional accounts have separate refund policies. 
                    Please contact our business team for specific terms and conditions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-gray-800 font-medium">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have questions about our cancellation and refund policy, or need to request 
                  a refund, please contact our support team:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> support@zapup.org</p>
                  <p><strong>Phone:</strong> +91 9876543210</p>
                  <p><strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM IST</p>
                </div>
                <div className="mt-4">
                  <Link href="/contact">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="/privacy-policy" className="text-gray-600 hover:text-blue-800 text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-gray-600 hover:text-blue-800 text-sm">
              Terms & Conditions
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-800 text-sm">
              Contact Us
            </Link>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 ZapUp Education Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 