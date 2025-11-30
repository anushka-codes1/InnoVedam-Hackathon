import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
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

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        
        <div className="mb-8">
          <p className="text-xl text-gray-700 leading-relaxed">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Mail className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Email Support</h3>
            <p className="text-gray-600 mb-3">Get help with your account or transactions</p>
            <a href="mailto:support@campusswap.com" className="text-purple-600 hover:text-purple-700">
              support@campusswap.com
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <MessageSquare className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">General Inquiries</h3>
            <p className="text-gray-600 mb-3">Questions about CampusSwap</p>
            <a href="mailto:hello@campusswap.com" className="text-purple-600 hover:text-purple-700">
              hello@campusswap.com
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Phone className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Partnership Inquiries</h3>
            <p className="text-gray-600 mb-3">Interested in partnering with us?</p>
            <a href="mailto:partnerships@campusswap.com" className="text-purple-600 hover:text-purple-700">
              partnerships@campusswap.com
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <MapPin className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Campus Ambassador</h3>
            <p className="text-gray-600 mb-3">Want to represent CampusSwap at your campus?</p>
            <a href="mailto:ambassadors@campusswap.com" className="text-purple-600 hover:text-purple-700">
              ambassadors@campusswap.com
            </a>
          </div>
        </div>

        <section className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="your.email@campus.edu"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Send Message
            </button>
          </form>
        </section>

        <section className="bg-purple-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Office Hours</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
            <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
            <p><strong>Sunday:</strong> Closed</p>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            *Response times may vary. We typically respond within 24 hours during business days.
          </p>
        </section>
      </div>
    </div>
  );
}
