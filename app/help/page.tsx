import Link from 'next/link';
import { ArrowLeft, MessageCircle, BookOpen, Shield, Mail } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Help Center</h1>
        
        <div className="mb-8">
          <p className="text-xl text-gray-700 leading-relaxed">
            Find answers to common questions and get support when you need it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/help#getting-started" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <BookOpen className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
            <p className="text-gray-600">Learn how to create your account and list your first item.</p>
          </Link>
          <Link href="/help#safety" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Shield className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Safety Center</h3>
            <p className="text-gray-600">Tips for staying safe and secure on CampusSwap.</p>
          </Link>
          <Link href="/help#contact" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Mail className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Contact Support</h3>
            <p className="text-gray-600">Get in touch with our support team for personalized help.</p>
          </Link>
          <Link href="/help#community" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <MessageCircle className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Community Guidelines</h3>
            <p className="text-gray-600">Learn about our community standards and expectations.</p>
          </Link>
        </div>

        <section id="getting-started" className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">How do I list an item?</h3>
              <p className="text-gray-700">
                Navigate to your dashboard and click "List Item". Fill in the details including title, 
                description, price, and upload photos. Your listing will be visible to other students 
                on your campus immediately.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">How does borrowing work?</h3>
              <p className="text-gray-700">
                Browse available items, select what you need, and request to borrow. The owner will 
                receive a notification and can approve or decline. Once approved, arrange a meeting 
                point on campus to exchange the item.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">What payment methods are accepted?</h3>
              <p className="text-gray-700">
                We integrate with Stripe for secure payments. You can use credit cards, debit cards, 
                or digital wallets. All transactions are protected and encrypted.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">What if an item is damaged?</h3>
              <p className="text-gray-700">
                Report any damage immediately through the app. Our team will review the case and 
                help resolve disputes fairly. We recommend taking photos before and after each borrowing 
                transaction.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">How do I verify my student status?</h3>
              <p className="text-gray-700">
                Use your campus email address to sign up. You'll receive a verification email to 
                confirm your student status. This ensures CampusSwap remains a trusted campus-only 
                community.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Still Need Help?</h2>
          <p className="text-gray-700 mb-6">
            Our support team is here to help you with any questions or issues.
          </p>
          <div className="space-y-3">
            <div>
              <strong className="text-gray-800">Email:</strong>{' '}
              <a href="mailto:support@campusswap.com" className="text-purple-600 hover:text-purple-700">
                support@campusswap.com
              </a>
            </div>
            <div>
              <strong className="text-gray-800">Response Time:</strong> Usually within 24 hours
            </div>
            <div>
              <strong className="text-gray-800">Hours:</strong> Monday - Friday, 9 AM - 6 PM
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
