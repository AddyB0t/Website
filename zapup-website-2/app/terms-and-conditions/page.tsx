import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Scale, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsAndConditionsPage() {
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
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
            <p className="text-lg text-gray-600">
              Legal terms governing your use of ZapUp services
            </p>
          </div>

          <div className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Agreement Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Welcome to ZapUp Education Technologies. These Terms and Conditions ("Terms") govern 
                  your use of our educational platform and services. By accessing or using ZapUp, you 
                  agree to be bound by these Terms.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-semibold">Last Updated: January 1, 2024</p>
                  <p className="text-blue-700 text-sm mt-1">
                    These terms apply to all users of ZapUp services
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>Acceptance of Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  By using ZapUp, you confirm that you:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Are at least 13 years old or have parental consent</li>
                  <li>• Have the legal capacity to enter into these Terms</li>
                  <li>• Will comply with all applicable laws and regulations</li>
                  <li>• Accept full responsibility for your use of the platform</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Important:</strong> If you are under 18, a parent or guardian must agree to these Terms on your behalf.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services Description */}
            <Card>
              <CardHeader>
                <CardTitle>Our Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  ZapUp provides educational services including:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Educational Content</h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Interactive questions and exercises</li>
                      <li>• Video lessons and tutorials</li>
                      <li>• Study materials and resources</li>
                      <li>• Progress tracking and analytics</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Platform Features</h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Personalized learning paths</li>
                      <li>• AI-powered assistance</li>
                      <li>• Community features</li>
                      <li>• Performance reports</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>User Accounts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Account Creation</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• You must provide accurate and complete information</li>
                    <li>• You are responsible for maintaining account security</li>
                    <li>• You must notify us immediately of any unauthorized access</li>
                    <li>• One person may not maintain multiple accounts</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Account Termination</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    We may suspend or terminate your account if you:
                  </p>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Violate these Terms or our policies</li>
                    <li>• Engage in fraudulent or harmful activities</li>
                    <li>• Fail to pay subscription fees</li>
                    <li>• Remain inactive for an extended period</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Subscription and Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription and Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Subscription Plans</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Free plans have limited features and content</li>
                    <li>• Premium plans provide full access to all features</li>
                    <li>• Subscription fees are billed in advance</li>
                    <li>• Prices are subject to change with notice</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Terms</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Payments are processed securely through Razorpay</li>
                    <li>• All fees are non-refundable except as stated in our refund policy</li>
                    <li>• You authorize automatic renewal unless cancelled</li>
                    <li>• Failed payments may result in service suspension</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>Refund Policy:</strong> Please refer to our <Link href="/cancellation-refunds" className="text-blue-600 hover:text-blue-800">Cancellation & Refunds Policy</Link> for detailed information about refunds and cancellations.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Conduct */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  <span>User Conduct</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Acceptable Use</h3>
                  <p className="text-gray-600 mb-2">You agree to use ZapUp only for lawful educational purposes. You will not:</p>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Share your account credentials with others</li>
                    <li>• Upload harmful, offensive, or inappropriate content</li>
                    <li>• Attempt to hack, reverse engineer, or disrupt our services</li>
                    <li>• Use automated tools to access or scrape our content</li>
                    <li>• Violate any applicable laws or regulations</li>
                    <li>• Infringe on intellectual property rights</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Community Guidelines</h3>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Be respectful to other users and staff</li>
                    <li>• Keep discussions relevant and constructive</li>
                    <li>• Report inappropriate behavior or content</li>
                    <li>• Respect privacy and confidentiality</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Our Content</h3>
                  <p className="text-gray-600 mb-2">
                    All content on ZapUp, including but not limited to:
                  </p>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Educational materials, questions, and solutions</li>
                    <li>• Videos, images, and multimedia content</li>
                    <li>• Software, algorithms, and user interfaces</li>
                    <li>• Trademarks, logos, and brand elements</li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-2">
                    This content is owned by ZapUp or licensed to us and is protected by copyright and other intellectual property laws.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Your License</h3>
                  <p className="text-gray-600 text-sm">
                    We grant you a limited, non-exclusive, non-transferable license to access and use our content for personal educational purposes only. You may not reproduce, distribute, modify, or create derivative works without our written permission.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">User-Generated Content</h3>
                  <p className="text-gray-600 text-sm">
                    By submitting content to ZapUp, you grant us a worldwide, non-exclusive, royalty-free license to use, modify, and distribute your content in connection with our services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Privacy and Data Protection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Your privacy is important to us. Our collection, use, and protection of your personal 
                  information is governed by our Privacy Policy.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    Please review our <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 font-semibold">Privacy Policy</Link> to understand how we handle your personal information.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Disclaimers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Educational Content</h3>
                  <p className="text-gray-600 text-sm">
                    While we strive to provide accurate and up-to-date educational content, we make no 
                    warranties about the completeness, accuracy, or reliability of our materials. Our 
                    content is for educational purposes only and should not be considered as professional advice.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Service Availability</h3>
                  <p className="text-gray-600 text-sm">
                    We provide our services on an "as is" and "as available" basis. We do not guarantee 
                    uninterrupted access to our platform and may experience downtime for maintenance or 
                    technical issues.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Third-Party Services</h3>
                  <p className="text-gray-600 text-sm">
                    Our platform may integrate with third-party services (such as payment processors). 
                    We are not responsible for the availability, accuracy, or content of these external services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  To the fullest extent permitted by law, ZapUp Education Technologies shall not be liable for:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Any indirect, incidental, special, or consequential damages</li>
                  <li>• Loss of profits, data, or business opportunities</li>
                  <li>• Damages arising from your use or inability to use our services</li>
                  <li>• Actions of other users or third parties</li>
                </ul>
                <p className="text-gray-600 text-sm mt-4">
                  Our total liability to you for all claims shall not exceed the amount you paid for our services in the 12 months preceding the claim.
                </p>
              </CardContent>
            </Card>

            {/* Indemnification */}
            <Card>
              <CardHeader>
                <CardTitle>Indemnification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You agree to indemnify and hold ZapUp harmless from any claims, damages, losses, or 
                  expenses arising from your use of our services, violation of these Terms, or infringement 
                  of any third-party rights.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>Governing Law and Jurisdiction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  These Terms are governed by the laws of India. Any disputes arising from these Terms or 
                  your use of ZapUp shall be subject to the exclusive jurisdiction of the courts in Gurugram, Haryana.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm">
                    <strong>Dispute Resolution:</strong> We encourage users to contact us directly to resolve any issues before pursuing legal action.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We may update these Terms from time to time. When we make changes:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• We'll notify you via email or platform notification</li>
                  <li>• Updated Terms will be posted on our website</li>
                  <li>• Changes take effect 30 days after notification</li>
                  <li>• Continued use constitutes acceptance of changes</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="space-y-2 mb-4">
                  <p><strong>Legal Department:</strong> legal@zapup.org</p>
                  <p><strong>General Support:</strong> support@zapup.org</p>
                  <p><strong>Phone:</strong> +91 9876543210</p>
                  <p><strong>Address:</strong> ZapUp Education Technologies Pvt. Ltd., 123 Innovation Hub, Sector 18, Gurugram, Haryana 122015</p>
                </div>
                <div className="flex space-x-4">
                  <Link href="/contact">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Contact Us
                    </Button>
                  </Link>
                  <Link href="/privacy-policy">
                    <Button variant="outline">
                      Privacy Policy
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/cancellation-refunds" className="text-gray-400 hover:text-white">
              Cancellation & Refunds
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white">
              Contact Us
            </Link>
          </div>
          <p className="text-gray-400">
            © 2024 ZapUp Education Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 