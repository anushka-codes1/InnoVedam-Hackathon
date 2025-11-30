import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Camera, Lock, UserCheck } from 'lucide-react';

export default function SafetyPage() {
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
          <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Safety Center</h1>
          <p className="text-xl text-gray-700">
            Your safety is our top priority. Learn how to stay secure on CampusSwap.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Safety Guidelines</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <UserCheck className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Verify User Identity</h3>
                  <p className="text-gray-700">
                    Always check user profiles before transactions. Look for verified badges, ratings, 
                    and transaction history. Users with verified campus emails are more trustworthy.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <Camera className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Document Everything</h3>
                  <p className="text-gray-700">
                    Take clear photos of items before and after borrowing or renting. This protects 
                    both parties in case of disputes. Keep screenshots of all communications.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Use Secure Payments</h3>
                  <p className="text-gray-700">
                    Always complete transactions through CampusSwap's payment system. Never share 
                    banking details or make payments outside the platform. We offer buyer protection.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Meet in Public Places</h3>
                  <p className="text-gray-700">
                    Always meet in well-lit, public campus locations like libraries, cafeterias, or 
                    main gates. Consider bringing a friend. Avoid isolated areas or off-campus meetings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Red Flags to Watch Out For</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-red-900 mb-3">Be cautious if:</h3>
                <ul className="space-y-2 text-red-800">
                  <li>• User asks to complete payment outside CampusSwap</li>
                  <li>• Deal seems too good to be true (unusually low prices)</li>
                  <li>• User refuses to meet in public campus locations</li>
                  <li>• Profile has no ratings or transaction history</li>
                  <li>• User pressures you to decide quickly without time to think</li>
                  <li>• Communication happens only outside the platform</li>
                  <li>• User avoids video verification or detailed photos</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">For Borrowers</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">1.</span>
                <span>Inspect items carefully before accepting them. Report any damage immediately.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">2.</span>
                <span>Return items on time and in the same condition you received them.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">3.</span>
                <span>Keep all communication within the CampusSwap platform for your protection.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">4.</span>
                <span>Read the item description and rental terms carefully before confirming.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">For Lenders</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">1.</span>
                <span>Be honest and accurate in item descriptions. Include any defects or issues.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">2.</span>
                <span>Set clear terms for borrowing including duration, condition expectations, and penalties.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">3.</span>
                <span>Check borrower ratings and history before accepting requests.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">4.</span>
                <span>Document item condition with photos before handing it over.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-purple-900 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Report Suspicious Activity</h2>
          <p className="mb-6">
            If you encounter suspicious behavior, scams, or feel unsafe, report it immediately. 
            Our team investigates all reports and takes appropriate action within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:safety@campusswap.com"
              className="inline-block bg-white text-purple-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-center"
            >
              Report an Issue
            </a>
            <Link
              href="/help"
              className="inline-block bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold text-center"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
