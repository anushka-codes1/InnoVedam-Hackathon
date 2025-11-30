import Link from 'next/link';
import { ArrowLeft, Newspaper, Download } from 'lucide-react';

export default function PressPage() {
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

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Press & Media</h1>
        
        <div className="mb-12">
          <p className="text-xl text-gray-700 leading-relaxed">
            Get the latest news, press releases, and media resources about CampusSwap.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Press Releases</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
              <div className="flex items-start gap-4">
                <Newspaper className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    CampusSwap Expands to 50 Universities Across India
                  </h3>
                  <p className="text-gray-600 mb-3">
                    CampusSwap announces major expansion, now serving over 100,000 students 
                    across 50 partner universities, revolutionizing campus marketplaces.
                  </p>
                  <span className="text-sm text-gray-500">November 15, 2025</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
              <div className="flex items-start gap-4">
                <Newspaper className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    CampusSwap Raises $5M in Series A Funding
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Leading investors back CampusSwap's mission to transform student commerce 
                    and promote sustainable consumption on campuses.
                  </p>
                  <span className="text-sm text-gray-500">October 1, 2025</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
              <div className="flex items-start gap-4">
                <Newspaper className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    CampusSwap Wins Best Student Innovation Award
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Recognized for outstanding contribution to campus sustainability and 
                    student welfare at the National Education Technology Summit.
                  </p>
                  <span className="text-sm text-gray-500">September 10, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Media Kit</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-700 mb-6">
              Download our media kit for logos, brand guidelines, and high-resolution images.
            </p>
            <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              <Download className="w-5 h-5" />
              Download Media Kit
            </button>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Fast Facts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">100,000+</div>
              <div className="text-gray-700">Active Students</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-700">Partner Universities</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">500,000+</div>
              <div className="text-gray-700">Transactions Completed</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">₹2 Cr+</div>
              <div className="text-gray-700">Saved by Students</div>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Media Inquiries</h2>
          <p className="text-gray-700 mb-4">
            For press inquiries, interviews, or more information, please contact:
          </p>
          <div className="space-y-2">
            <div>
              <strong className="text-gray-800">Email:</strong>{' '}
              <a href="mailto:press@campusswap.com" className="text-purple-600 hover:text-purple-700">
                press@campusswap.com
              </a>
            </div>
            <div>
              <strong className="text-gray-800">Phone:</strong>{' '}
              <a href="tel:+911234567890" className="text-purple-600 hover:text-purple-700">
                +91 123-456-7890
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
