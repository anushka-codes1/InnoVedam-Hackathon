import Link from 'next/link';
import { ArrowLeft, Users, TrendingUp, Heart, Gift, MessageCircle, Award } from 'lucide-react';

export default function AmbassadorsPage() {
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campus Ambassador Program</h1>
          <p className="text-xl text-gray-700">
            Represent CampusSwap at your university and earn exciting rewards!
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Why Become an Ambassador?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <TrendingUp className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Earn Money</h3>
              <p className="text-gray-600">Get paid commissions for every user you bring to CampusSwap plus monthly stipends.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Award className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Build Your Resume</h3>
              <p className="text-gray-600">Gain valuable marketing, leadership, and entrepreneurship experience.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Gift className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Exclusive Perks</h3>
              <p className="text-gray-600">Access to exclusive merchandise, events, and networking opportunities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Join a Community</h3>
              <p className="text-gray-600">Connect with ambassadors from universities across the country.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Responsibilities</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-gray-800">Promote CampusSwap:</strong>
                  <span className="text-gray-600"> Share CampusSwap on social media and with your campus network</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-gray-800">Organize Events:</strong>
                  <span className="text-gray-600"> Host pop-up stalls, workshops, and awareness campaigns</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-gray-800">Support Users:</strong>
                  <span className="text-gray-600"> Help new users get started and answer questions</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-gray-800">Provide Feedback:</strong>
                  <span className="text-gray-600"> Share insights about campus trends and user needs</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Compensation & Benefits</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-600">
              <h3 className="font-semibold text-lg mb-2">💰 Monthly Stipend</h3>
              <p className="text-gray-700">₹3,000 - ₹10,000 based on performance</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-600">
              <h3 className="font-semibold text-lg mb-2">🎯 Commission</h3>
              <p className="text-gray-700">Earn ₹50 for every new user who completes their first transaction</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-600">
              <h3 className="font-semibold text-lg mb-2">🎁 Exclusive Merchandise</h3>
              <p className="text-gray-700">CampusSwap branded t-shirts, hoodies, and accessories</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-600">
              <h3 className="font-semibold text-lg mb-2">📜 Certificate & Letter of Recommendation</h3>
              <p className="text-gray-700">Official documentation of your experience for future opportunities</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Who We're Looking For</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Currently enrolled as a full-time student</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Active on social media with engaged followers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Strong communication and interpersonal skills</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Passionate about sustainability and community building</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Self-motivated and able to work independently</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Commitment of at least 6 months</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Join?</h2>
          <p className="text-gray-700 mb-6">
            Apply now and become a part of the CampusSwap revolution!
          </p>
          <a 
            href="mailto:ambassadors@campusswap.com?subject=Campus Ambassador Application"
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
          >
            Apply as Ambassador
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Or email us at ambassadors@campusswap.com with your resume and a brief introduction
          </p>
        </section>
      </div>
    </div>
  );
}
