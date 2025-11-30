import Link from 'next/link';
import { ArrowLeft, Briefcase, Heart, Rocket, Users } from 'lucide-react';

export default function CareersPage() {
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

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Careers at CampusSwap</h1>
        
        <div className="mb-8">
          <p className="text-xl text-gray-700 leading-relaxed">
            Join our mission to transform campus communities and make student life better for everyone.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Why Work With Us?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Rocket className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Fast Growth</h3>
              <p className="text-gray-600">Be part of a rapidly growing startup that's making a real impact on campuses nationwide.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Great Team</h3>
              <p className="text-gray-600">Work with passionate, talented people who care about building something meaningful.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Heart className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Impact</h3>
              <p className="text-gray-600">Your work directly helps students save money, reduce waste, and build community.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Briefcase className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Benefits</h3>
              <p className="text-gray-600">Competitive salary, flexible work arrangements, and opportunities for growth.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Open Positions</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
              <h3 className="font-semibold text-lg mb-2">Full Stack Developer</h3>
              <p className="text-gray-600 mb-3">Help build and scale our platform using Next.js, React, and Supabase.</p>
              <div className="flex gap-2 text-sm text-gray-500">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Full-time</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Remote</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
              <h3 className="font-semibold text-lg mb-2">Product Designer</h3>
              <p className="text-gray-600 mb-3">Design intuitive experiences that students love to use every day.</p>
              <div className="flex gap-2 text-sm text-gray-500">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Full-time</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Hybrid</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
              <h3 className="font-semibold text-lg mb-2">Campus Growth Manager</h3>
              <p className="text-gray-600 mb-3">Lead our expansion into new universities and build campus communities.</p>
              <div className="flex gap-2 text-sm text-gray-500">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Full-time</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">On-site</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Apply</h2>
          <p className="text-gray-700 mb-4">
            Send your resume and a brief note about why you want to join CampusSwap to:
          </p>
          <a 
            href="mailto:careers@campusswap.com" 
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            careers@campusswap.com
          </a>
        </section>
      </div>
    </div>
  );
}
