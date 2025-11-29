'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  Plus, 
  QrCode, 
  User, 
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');

  // Mock data - would come from API in production
  const stats = {
    itemsListed: 12,
    activeBorrows: 3,
    totalEarnings: 450,
    trustScore: 92
  };

  const activeTransactions = [
    { id: 1, item: 'Chemistry Textbook', borrower: 'John Doe', dueDate: '2025-12-05', status: 'active', amount: 45 },
    { id: 2, item: 'TI-84 Calculator', borrower: 'Jane Smith', dueDate: '2025-12-03', status: 'overdue', amount: 65 },
    { id: 3, item: 'Mini Fridge', borrower: 'Mike Johnson', dueDate: '2025-12-10', status: 'pending', amount: 80 }
  ];

  const myListings = [
    { id: 1, name: 'MacBook Adapter', price: 35, status: 'available', views: 24 },
    { id: 2, name: 'Study Desk', price: 55, status: 'borrowed', views: 18 },
    { id: 3, name: 'Camera Lens', price: 120, status: 'available', views: 42 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                CampusSwap
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link href="/dashboard/profile" className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Items Listed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.itemsListed}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Borrows</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeBorrows}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalEarnings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Trust Score</p>
                <p className="text-3xl font-bold text-gray-900">{stats.trustScore}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/create-item" className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">List New Item</h3>
                <p className="text-sm text-emerald-50">Start earning now</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/marketplace" className="bg-white rounded-xl p-6 border-2 border-emerald-200 hover:border-emerald-400 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Browse Items</h3>
                <p className="text-sm text-gray-600">Find what you need</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/scan" className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Scan QR Code</h3>
                <p className="text-sm text-gray-600">Verify handoff/return</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Active Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Transactions</h2>
            <Link href="/dashboard/transactions" className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {activeTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.status === 'active' ? 'bg-blue-100' :
                    transaction.status === 'overdue' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {transaction.status === 'active' ? <CheckCircle className="w-5 h-5 text-blue-600" /> :
                     transaction.status === 'overdue' ? <AlertCircle className="w-5 h-5 text-red-600" /> :
                     <Clock className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{transaction.item}</h3>
                    <p className="text-sm text-gray-600">Borrowed by {transaction.borrower}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{transaction.amount}</p>
                  <p className={`text-sm ${
                    transaction.status === 'overdue' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    Due: {transaction.dueDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Listings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
            <Link href="/dashboard/create-item" className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
              Add New →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myListings.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.status}
                  </span>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600">₹{item.price}/day</span>
                  <span className="text-sm text-gray-600">{item.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'home' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`}>
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => setActiveTab('browse')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'browse' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`}>
            <Package className="w-5 h-5" />
            <span className="text-xs">Browse</span>
          </button>
          <button onClick={() => setActiveTab('scan')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'scan' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`}>
            <QrCode className="w-5 h-5" />
            <span className="text-xs">Scan</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`}>
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
