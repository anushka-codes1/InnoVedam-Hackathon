import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: November 29, 2025</p>
        
        <div className="prose prose-lg max-w-none bg-white p-8 rounded-lg shadow-sm">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using CampusSwap ("the Service"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to these terms, please 
              do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To use CampusSwap, you must:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Be currently enrolled as a student at a participating educational institution</li>
              <li>Be at least 18 years of age or have parental consent</li>
              <li>Have a valid campus email address</li>
              <li>Provide accurate and complete registration information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and 
              for all activities that occur under your account. You agree to notify us immediately of 
              any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Listing and Transactions</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              When listing items on CampusSwap, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate descriptions and photos of items</li>
              <li>Set fair and reasonable prices</li>
              <li>Honor confirmed transactions and meeting arrangements</li>
              <li>Return borrowed items in the same condition</li>
              <li>Not list prohibited or illegal items</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Payments and Fees</h2>
            <p className="text-gray-700 leading-relaxed">
              CampusSwap charges a service fee on transactions. Payment processing is handled by Stripe. 
              All fees are clearly displayed before completing a transaction. Refunds are subject to our 
              refund policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Users are prohibited from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Posting false or misleading information</li>
              <li>Engaging in fraudulent activities</li>
              <li>Harassing or threatening other users</li>
              <li>Violating any applicable laws or regulations</li>
              <li>Using the platform for commercial purposes without authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              CampusSwap acts as a platform connecting users and is not party to transactions between 
              users. We are not responsible for the quality, safety, or legality of items listed, the 
              accuracy of listings, or the ability of users to complete transactions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms or engage 
              in activities harmful to the CampusSwap community.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these terms from time to time. Users will be notified of significant changes. 
              Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these terms, please contact us at{' '}
              <a href="mailto:legal@campusswap.com" className="text-purple-600 hover:text-purple-700">
                legal@campusswap.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
