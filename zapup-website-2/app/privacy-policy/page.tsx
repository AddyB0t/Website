import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, Lock, Users, Database, Settings } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              How we collect, use, and protect your personal information
            </p>
          </div>

          <div className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Privacy Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  At ZapUp Education Technologies, we are committed to protecting your privacy and 
                  maintaining the security of your personal information. This Privacy Policy explains 
                  how we collect, use, disclose, and safeguard your information when you use our 
                  educational platform and services.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-semibold">Last Updated: January 1, 2024</p>
                  <p className="text-blue-700 text-sm mt-1">
                    This policy applies to all users of ZapUp services
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span>Information We Collect</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• <strong>Account Information:</strong> Name, email address, phone number, date of birth</li>
                    <li>• <strong>Educational Details:</strong> Class, school, academic preferences, learning progress</li>
                    <li>• <strong>Payment Information:</strong> Billing address, payment method details (processed securely by Razorpay)</li>
                    <li>• <strong>Profile Information:</strong> Profile picture, bio, learning goals</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Usage Information</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• <strong>Learning Activity:</strong> Questions attempted, time spent, performance metrics</li>
                    <li>• <strong>Device Information:</strong> Device type, operating system, browser type</li>
                    <li>• <strong>Log Data:</strong> IP address, access times, pages viewed, referral URLs</li>
                    <li>• <strong>Cookies:</strong> Preferences, session information, analytics data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Communications</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Messages sent through our platform</li>
                    <li>• Support inquiries and feedback</li>
                    <li>• Survey responses and reviews</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span>How We Use Your Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Service Provision</h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Provide educational content and services</li>
                      <li>• Personalize learning experience</li>
                      <li>• Track learning progress and performance</li>
                      <li>• Process payments and subscriptions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Communication</h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Send service-related notifications</li>
                      <li>• Provide customer support</li>
                      <li>• Send educational updates and tips</li>
                      <li>• Marketing communications (with consent)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Improvement</h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Analyze usage patterns and trends</li>
                      <li>• Improve platform functionality</li>
                      <li>• Develop new features and content</li>
                      <li>• Conduct research and analytics</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Legal & Security</h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Comply with legal obligations</li>
                      <li>• Protect against fraud and abuse</li>
                      <li>• Enforce terms of service</li>
                      <li>• Maintain platform security</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Information Sharing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">We Do NOT Sell Your Data</h3>
                  <p className="text-green-800 text-sm">
                    We never sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Limited Sharing Scenarios</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Service Providers</h4>
                      <p className="text-gray-600 text-sm">
                        We share information with trusted service providers who help us operate our platform 
                        (e.g., Razorpay for payments, cloud hosting providers, analytics services).
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Legal Requirements</h4>
                      <p className="text-gray-600 text-sm">
                        We may disclose information when required by law, court order, or to protect our 
                        rights and the safety of our users.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Business Transfers</h4>
                      <p className="text-gray-600 text-sm">
                        In case of merger, acquisition, or sale of assets, user information may be 
                        transferred as part of the transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span>Data Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Technical Measures</h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• Encrypted data storage</li>
                      <li>• Regular security audits and updates</li>
                      <li>• Secure payment processing via Razorpay</li>
                      <li>• Multi-factor authentication options</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Administrative Measures</h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Limited access to personal data</li>
                      <li>• Employee training on data protection</li>
                      <li>• Regular backup procedures</li>
                      <li>• Incident response procedures</li>
                      <li>• Data retention policies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>Your Privacy Rights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Access & Portability</h4>
                      <p className="text-gray-600 text-sm">
                        Request a copy of your personal data and export your information.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Correction</h4>
                      <p className="text-gray-600 text-sm">
                        Update or correct inaccurate personal information.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Deletion</h4>
                      <p className="text-gray-600 text-sm">
                        Request deletion of your account and personal data.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Opt-out</h4>
                      <p className="text-gray-600 text-sm">
                        Unsubscribe from marketing communications at any time.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Restriction</h4>
                      <p className="text-gray-600 text-sm">
                        Limit how we process your personal information.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Objection</h4>
                      <p className="text-gray-600 text-sm">
                        Object to certain types of data processing.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 text-sm">
                    To exercise these rights, contact us at privacy@zapup.org or through your account settings.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies & Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Cookies & Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Essential Cookies</h4>
                    <p className="text-gray-600 text-sm">
                      Required for basic platform functionality, authentication, and security.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Performance Cookies</h4>
                    <p className="text-gray-600 text-sm">
                      Help us understand how users interact with our platform to improve performance.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Functional Cookies</h4>
                    <p className="text-gray-600 text-sm">
                      Remember your preferences and settings for a personalized experience.
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  You can manage cookie preferences through your browser settings or our cookie consent banner.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  ZapUp serves students of various ages, including minors. We take special care to protect 
                  children's privacy in accordance with applicable laws.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Parental Consent</h4>
                    <p className="text-gray-600 text-sm">
                      For users under 13, we require verifiable parental consent before collecting personal information.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Limited Data Collection</h4>
                    <p className="text-gray-600 text-sm">
                      We collect only information necessary for educational purposes and platform functionality.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Parental Rights</h4>
                    <p className="text-gray-600 text-sm">
                      Parents can review, modify, or delete their child's information by contacting us.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We retain your personal information only as long as necessary for the purposes outlined in this policy:
                </p>
                
                <div className="space-y-2 text-gray-600">
                  <p>• <strong>Active Accounts:</strong> Data retained while your account is active</p>
                  <p>• <strong>Inactive Accounts:</strong> Data may be retained for up to 3 years after last activity</p>
                  <p>• <strong>Legal Requirements:</strong> Some data may be retained longer to comply with legal obligations</p>
                  <p>• <strong>Deletion Requests:</strong> Data deleted within 30 days of verified deletion request</p>
                </div>
              </CardContent>
            </Card>

            {/* Updates to Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Policy Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We may update this Privacy Policy from time to time. When we make changes:
                </p>
                
                <ul className="space-y-2 text-gray-600">
                  <li>• We'll notify you via email or platform notification</li>
                  <li>• Updated policy will be posted on our website</li>
                  <li>• Changes take effect 30 days after notification</li>
                  <li>• Continued use constitutes acceptance of changes</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="space-y-2 mb-4">
                  <p><strong>Privacy Officer:</strong> privacy@zapup.org</p>
                  <p><strong>General Support:</strong> support@zapup.org</p>
                  <p><strong>Phone:</strong> +91 9876543210</p>
                  <p><strong>Address:</strong> ZapUp Education Technologies, 123 Innovation Hub, Sector 18, Gurugram, Haryana 122015</p>
                </div>
                
                <div className="flex space-x-4">
                  <Link href="/contact">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/terms-and-conditions">
                    <Button variant="outline">
                      Terms & Conditions
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
            <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white">
              Terms & Conditions
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