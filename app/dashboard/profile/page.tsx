'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Award,
  Shield,
  Edit,
  Camera,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  const userData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    location: 'Campus Housing, Block A',
    trustScore: 92,
    totalEarnings: 1250,
    itemsListed: 12,
    successfulTransactions: 28,
    rating: 4.8,
    memberSince: 'January 2024'
  };

  const badges = [
    { name: 'Top Lender', icon: '🏆', description: '50+ successful rentals' },
    { name: 'Trusted User', icon: '✅', description: 'Trust score above 90' },
    { name: 'Early Adopter', icon: '🌟', description: 'Joined in first month' },
    { name: 'Quick Responder', icon: '⚡', description: 'Responds within 1 hour' }
  ];

  const recentActivity = [
    { type: 'rental', item: 'Chemistry Textbook', date: '2 days ago', amount: 45 },
    { type: 'returned', item: 'TI-84 Calculator', date: '5 days ago', amount: 65 },
    { type: 'listed', item: 'Study Desk', date: '1 week ago', amount: 55 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {activeTab === 'profile' ? (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                      <p className="text-gray-600">Member since {userData.memberSince}</p>
                    </div>
                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{userData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{userData.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userData.trustScore}</p>
                <p className="text-sm text-gray-600">Trust Score</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{userData.totalEarnings}</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userData.successfulTransactions}</p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userData.rating}</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'rental' ? 'bg-blue-100' :
                        activity.type === 'returned' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {activity.type === 'rental' && '📤'}
                        {activity.type === 'returned' && '✅'}
                        {activity.type === 'listed' && '➕'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.type === 'rental' && 'Rented out '}
                          {activity.type === 'returned' && 'Returned '}
                          {activity.type === 'listed' && 'Listed '}
                          {activity.item}
                        </p>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-600">+₹{activity.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Settings Tab */
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Get notified about new messages</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Security</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-600">Update your password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Support</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Help Center</p>
                      <p className="text-sm text-gray-600">Browse FAQs and guides</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
              <div className="p-4 border-b border-red-200 bg-red-50">
                <h3 className="font-semibold text-red-900">Danger Zone</h3>
              </div>
              <button 
                onClick={() => router.push('/login')}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <p className="font-medium text-red-900">Logout</p>
                    <p className="text-sm text-red-600">Sign out of your account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
