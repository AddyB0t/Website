import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
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
          <Link href="/sign-in">
            <Button variant="ghost" className="text-blue-800 hover:bg-blue-50 uppercase text-xs tracking-wider">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" className="text-blue-800 border-blue-300 hover:bg-blue-50 uppercase text-xs tracking-wider">
              Sign Up
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
                      <div className="text-center mb-12">
              <h1 className="text-3xl font-light text-gray-800 mb-6 tracking-wide">Contact Us</h1>
              <div className="h-0.5 w-16 bg-blue-600 mx-auto mb-8"></div>
              <p className="text-lg text-gray-600">Get in touch with us for any questions or support</p>
            </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800 font-medium">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span>Get in Touch</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">shaenkei@zapup.org</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 9163131610</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      133 Acharya Prafulla Chandra Road<br />
                      Block D, Kolkata<br />
                      West Bengal 700006, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                      Saturday: 10:00 AM - 4:00 PM IST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-gray-800 font-medium">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">For Students & Parents</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Account setup and login issues</li>
                    <li>• Subscription and billing questions</li>
                    <li>• Technical support</li>
                    <li>• Content and curriculum inquiries</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">For Educators</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Partnership opportunities</li>
                    <li>• Content collaboration</li>
                    <li>• Institutional licensing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal & Compliance</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms-and-conditions" className="text-blue-600 hover:text-blue-800">
                        Terms and Conditions
                      </Link>
                    </li>
                    <li>
                      <Link href="/cancellation-refunds" className="text-blue-600 hover:text-blue-800">
                        Cancellation & Refunds
                      </Link>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Information */}
          <Card className="mt-8 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-gray-800 font-medium">About ZapUp</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                ZapUp Education Technologies is a leading educational technology company committed to 
                empowering students through innovative digital learning solutions. We provide comprehensive 
                educational resources for classes 6-12, covering all major subjects and boards.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 ZapUp Education Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 