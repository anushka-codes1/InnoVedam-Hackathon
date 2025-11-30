'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserLayout from '@/components/layouts/UserLayout';
import { 
  TrendingUp, 
  Package, 
  Users, 
  Star,
  ArrowRight,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function UserHomePage() {
  const featuredItems = [
    {
      id: '1',
      name: 'MacBook Pro 14"',
      price: 500,
      image: '💻',
      category: 'Electronics',
      lender: 'Rahul S.',
      rating: 4.9,
      available: true
    },
    {
      id: '3',
      name: 'Physics Textbook',
      price: 50,
      image: '📚',
      category: 'Books',
      lender: 'Priya P.',
      rating: 4.8,
      available: true
    },
    {
      id: '5',
      name: 'Gaming Headset',
      price: 90,
      image: '🎧',
      category: 'Electronics',
      lender: 'Arjun S.',
      rating: 4.7,
      available: true
    },
  ];

  const quickStats = [
    { label: 'Items Available', value: '1,234', icon: Package, color: 'from-purple-500 to-pink-500' },
    { label: 'Active Users', value: '2,847', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Avg Rating', value: '4.8', icon: Star, color: 'from-emerald-500 to-green-500' },
  ];

  return (
    <ProtectedRoute requiredRole="user">
      <UserLayout>
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to CampusSwap! 🎓
              </h1>
              <p className="text-lg text-white/90 mb-6">
                Your Campus. Your Needs. Instantly Met.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/dashboard/marketplace"
                  className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Browse Marketplace
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard/my-listings"
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
                >
                  <Package className="w-5 h-5" />
                  My Listings
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-all"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Transactions</h3>
              <p className="text-gray-600">Buy, borrow, or swap items in minutes with our streamlined process.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Trusted</h3>
              <p className="text-gray-600">All transactions protected with security deposits and verified users.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Campus Delivery</h3>
              <p className="text-gray-600">Get items delivered right to your dorm by student couriers.</p>
            </div>
          </div>

          {/* Featured Items */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Featured Items
              </h2>
              <Link
                href="/dashboard/marketplace"
                className="text-purple-600 font-semibold hover:text-pink-600 transition-colors flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-100 hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-6xl">
                    {item.image}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2 mb-1">{item.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>by {item.lender}</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {item.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-purple-600">₹{item.price}/day</span>
                      {item.available && (
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
