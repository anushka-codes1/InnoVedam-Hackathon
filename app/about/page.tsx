import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
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

        <h1 className="text-4xl font-bold text-gray-900 mb-6">About CampusSwap</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              CampusSwap is revolutionizing the way students interact with their campus communities. 
              We believe in the power of peer-to-peer sharing and making campus life more convenient, 
              sustainable, and connected.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Do</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              CampusSwap is the ultimate student marketplace where you can:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Borrow and lend items within your campus community</li>
              <li>Buy and sell second-hand goods</li>
              <li>Connect with fellow students</li>
              <li>Reduce waste and promote sustainability</li>
              <li>Save money and earn extra income</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-purple-600 mb-2">Community First</h3>
                <p className="text-gray-600">Building strong, trusted campus communities through peer-to-peer connections.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-purple-600 mb-2">Sustainability</h3>
                <p className="text-gray-600">Promoting the sharing economy to reduce waste and environmental impact.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-purple-600 mb-2">Safety & Trust</h3>
                <p className="text-gray-600">Ensuring secure transactions and verified user identities for peace of mind.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-purple-600 mb-2">Innovation</h3>
                <p className="text-gray-600">Continuously improving our platform with cutting-edge features and technology.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Us</h2>
            <p className="text-gray-700 leading-relaxed">
              Whether you're looking to declutter your dorm, find that textbook you need, or earn 
              extra money by lending out items you're not using, CampusSwap is here for you. 
              Join thousands of students already making their campus experience better.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
