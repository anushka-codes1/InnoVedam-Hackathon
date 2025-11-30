'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  IndianRupee,
  Star,
  ArrowRightLeft,
  Calendar,
  AlertTriangle,
  Shield,
  MessageCircle,
  Send,
  X,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { getPremiumStatus } from '@/lib/premium';
import { migratePremiumData } from '@/lib/premiumMigration';
import AIChatbotWrapper from '@/components/AIChatbotWrapper';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeRentals, setActiveRentals] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'lender' }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Migrate old premium data on mount
  useEffect(() => {
    migratePremiumData();
  }, []);

  // Check premium status
  useEffect(() => {
    const subscription = getPremiumStatus();
    setIsPremium(subscription?.isPremium || false);
  }, []);

  // Load active rentals from localStorage
  useEffect(() => {
    const rentals = JSON.parse(localStorage.getItem('activeRentals') || '[]');
    const today = new Date();
    
    // Calculate days remaining and update status
    const updatedRentals = rentals.map((rental: any) => {
      const returnDate = new Date(rental.endDate);
      const daysRemaining = Math.ceil((returnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...rental,
        daysRemaining,
        isOverdue: daysRemaining < 0,
        isDueSoon: daysRemaining >= 0 && daysRemaining <= 2
      };
    }).filter((rental: any) => rental.status === 'active');
    
    setActiveRentals(updatedRentals);
    
    // Generate reminders
    const newReminders = updatedRentals.filter((rental: any) => 
      rental.isDueSoon || rental.isOverdue
    ).map((rental: any) => ({
      id: rental.id,
      type: rental.isOverdue ? 'overdue' : 'due_soon',
      message: rental.isOverdue 
        ? `${rental.itemName} is ${Math.abs(rental.daysRemaining)} day${Math.abs(rental.daysRemaining) > 1 ? 's' : ''} overdue!`
        : `${rental.itemName} is due in ${rental.daysRemaining} day${rental.daysRemaining > 1 ? 's' : ''}`,
      itemName: rental.itemName,
      lenderName: rental.lenderName,
      endDate: rental.endDate
    }));
    
    setReminders(newReminders);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleContactLender = (reminder: any) => {
    setSelectedReminder(reminder);
    setShowChat(true);
    setMessages([
      {
        text: `Hi, regarding the ${reminder.itemName} that's ${reminder.type === 'overdue' ? 'overdue' : 'due soon'}. Can we discuss the return?`,
        sender: 'user'
      },
      {
        text: `Hello! Thanks for reaching out. I understand the ${reminder.itemName} needs to be returned. How can I help?`,
        sender: 'lender'
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = { text: inputMessage, sender: 'user' as const };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    setIsTyping(true);
    
    setTimeout(() => {
      const lenderResponse = {
        text: `Thanks for your message about "${inputMessage}". I'll respond shortly.`,
        sender: 'lender' as const
      };
      setMessages(prev => [...prev, lenderResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mock data - would come from API in production
  const stats = {
    itemsListed: 12,
    activeBorrows: 3,
    totalEarnings: 450,
    trustScore: 92
  };

  const activeTransactions = [
    { id: 1, item: 'Chemistry Textbook', borrower: 'Eklavya Panwar', dueDate: '2025-12-05', status: 'active', amount: 45 },
    { id: 2, item: 'TI-84 Calculator', borrower: 'Md. Hayat Mallick', dueDate: '2025-12-03', status: 'overdue', amount: 65 },
    { id: 3, item: 'Mini Fridge', borrower: 'Manya Agrawal', dueDate: '2025-12-10', status: 'pending', amount: 80 },
    { id: 4, item: 'MacBook Pro 14"', borrower: 'Aaryaa Newaskar', dueDate: '2025-12-08', status: 'active', amount: 500 },
    { id: 5, item: 'Physics Textbook', borrower: 'Navneet Singh', dueDate: '2025-12-02', status: 'overdue', amount: 50 },
    { id: 6, item: 'Gaming Headset', borrower: 'Aayush Bhatt', dueDate: '2025-12-12', status: 'active', amount: 90 },
    { id: 7, item: 'Bicycle', borrower: 'Sidhant Pande', dueDate: '2025-12-15', status: 'pending', amount: 150 },
    { id: 8, item: 'DSLR Camera', borrower: 'Saksham Palial', dueDate: '2025-12-07', status: 'active', amount: 400 },
    { id: 9, item: 'Chemistry Notes', borrower: 'Amogh Vikram Pandey', dueDate: '2025-12-04', status: 'active', amount: 30 },
    { id: 10, item: 'Study Lamp', borrower: 'Urvashi Pali', dueDate: '2025-12-09', status: 'pending', amount: 25 }
  ];

  const myListings = [
    { id: 1, name: 'MacBook Adapter', price: 35, status: 'available', views: 24 },
    { id: 2, name: 'Study Desk', price: 55, status: 'borrowed', views: 18 },
    { id: 3, name: 'Camera Lens', price: 120, status: 'available', views: 42 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2]">
      {/* Top Navigation Bar */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CampusSwap
                </span>
                {isPremium && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full">
                    <Crown className="w-3 h-3 text-yellow-900" />
                    <span className="text-[10px] font-black text-yellow-900">PREMIUM</span>
                  </div>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/admin/verify" className="p-2 text-gray-600 hover:text-purple-600 transition-colors" title="Admin Access">
                <Shield className="w-5 h-5" />
              </Link>
              {!isPremium && (
                <Link 
                  href="/dashboard/premium" 
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all text-sm font-semibold"
                  title="Upgrade to Premium"
                >
                  <Crown className="w-4 h-4" />
                  <span className="hidden sm:inline">Upgrade</span>
                </Link>
              )}
              <Link href="/dashboard/notifications" className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Bell className="w-5 h-5" />
                {reminders.length > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {reminders.length}
                  </span>
                )}
              </Link>
              <Link href="/dashboard/profile" className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Items Listed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.itemsListed}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-shadow">
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

          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalEarnings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-shadow">
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
          <Link href="/dashboard/create-item" className="bg-gradient-to-br from-orange-400 via-pink-500 to-pink-600 rounded-xl p-6 text-white hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">List New Item</h3>
                <p className="text-sm text-orange-50">Start earning now</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/marketplace" className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Browse Items</h3>
                <p className="text-sm text-gray-600">Find what you need</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/scan" className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-md">
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

        {/* Reminders & Alerts Section */}
        {(reminders.length > 0 || activeRentals.length > 0) && (
          <div className="mb-8 space-y-4">
            {/* Urgent Reminders */}
            {reminders.length > 0 && (
              <div className="bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 border-2 border-red-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center animate-pulse">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">⚠️ Urgent Reminders</h2>
                    <p className="text-sm text-gray-700">You have {reminders.length} item{reminders.length > 1 ? 's' : ''} requiring attention</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className={`p-4 rounded-lg border-2 ${
                      reminder.type === 'overdue' 
                        ? 'bg-red-50 border-red-300' 
                        : 'bg-yellow-50 border-yellow-300'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {reminder.type === 'overdue' ? (
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                          )}
                          <div>
                            <p className={`font-bold ${
                              reminder.type === 'overdue' ? 'text-red-900' : 'text-yellow-900'
                            }`}>
                              {reminder.message}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              Lender: {reminder.lenderName} • Return by: {new Date(reminder.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            {reminder.type === 'overdue' && (
                              <p className="text-xs text-red-600 mt-2 font-semibold">
                                💰 Late fees are accumulating! Return immediately to avoid additional charges.
                              </p>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleContactLender(reminder)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${
                          reminder.type === 'overdue'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        } transition-colors`}>
                          <MessageCircle className="w-4 h-4" />
                          Contact Lender
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Rentals Overview */}
            {activeRentals.length > 0 && (
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">📦 My Active Rentals</h2>
                      <p className="text-sm text-gray-600">Items you're currently borrowing</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                    {activeRentals.length} Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeRentals.map((rental) => (
                    <div key={rental.id} className={`p-4 rounded-xl border-2 ${
                      rental.isOverdue 
                        ? 'bg-red-50 border-red-300' 
                        : rental.isDueSoon 
                        ? 'bg-yellow-50 border-yellow-300' 
                        : 'bg-blue-50 border-blue-300'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-sm">{rental.itemName}</h3>
                        {rental.isOverdue && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
                            OVERDUE
                          </span>
                        )}
                        {rental.isDueSoon && !rental.isOverdue && (
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-bold">
                            DUE SOON
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">From: {rental.lenderName}</p>
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-700">
                          Return: {new Date(rental.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 p-2 rounded-lg ${
                        rental.isOverdue 
                          ? 'bg-red-100' 
                          : rental.isDueSoon 
                          ? 'bg-yellow-100' 
                          : 'bg-blue-100'
                      }`}>
                        <Clock className={`w-4 h-4 ${
                          rental.isOverdue 
                            ? 'text-red-600' 
                            : rental.isDueSoon 
                            ? 'text-yellow-600' 
                            : 'text-blue-600'
                        }`} />
                        <span className={`text-xs font-bold ${
                          rental.isOverdue 
                            ? 'text-red-700' 
                            : rental.isDueSoon 
                            ? 'text-yellow-700' 
                            : 'text-blue-700'
                        }`}>
                          {rental.isOverdue 
                            ? `${Math.abs(rental.daysRemaining)} day${Math.abs(rental.daysRemaining) > 1 ? 's' : ''} overdue` 
                            : `${rental.daysRemaining} day${rental.daysRemaining > 1 ? 's' : ''} left`}
                        </span>
                      </div>
                      {rental.remindersEnabled && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                          <Bell className="w-3 h-3" />
                          <span>Reminders enabled</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Transactions */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Transactions</h2>
            <Link href="/dashboard/transactions" className="text-purple-600 text-sm font-medium hover:text-pink-600">
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
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
            <div className="flex gap-3">
              <Link href="/dashboard/my-listings" className="text-purple-600 text-sm font-medium hover:text-pink-600">
                Manage All →
              </Link>
              <Link href="/dashboard/create-item" className="text-purple-600 text-sm font-medium hover:text-pink-600">
                Add New →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myListings.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white/50 backdrop-blur-sm hover:border-purple-300 hover:shadow-md transition-all">
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
                  <span className="text-lg font-bold text-purple-600">₹{item.price}/day</span>
                  <span className="text-sm text-gray-600">{item.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/50 md:hidden shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'home' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}>
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => setActiveTab('browse')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'browse' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}>
            <Package className="w-5 h-5" />
            <span className="text-xs">Browse</span>
          </button>
          <button onClick={() => setActiveTab('scan')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'scan' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}>
            <QrCode className="w-5 h-5" />
            <span className="text-xs">Scan</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'profile' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}>
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && selectedReminder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {selectedReminder.lenderName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {selectedReminder.lenderName}
                  </h3>
                  <p className="text-xs text-white/80">Regarding: {selectedReminder.itemName}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChat(false);
                  setMessages([]);
                  setSelectedReminder(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item Context Bar */}
            <div className={`p-3 border-b ${
              selectedReminder.type === 'overdue' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{selectedReminder.itemName}</p>
                  <p className="text-xs text-gray-600">
                    {selectedReminder.type === 'overdue' ? '⚠️ Overdue' : '⏰ Due Soon'} • Return by: {new Date(selectedReminder.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedReminder.type === 'overdue'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedReminder.type === 'overdue' ? 'Overdue' : 'Due Soon'}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {message.sender === 'lender' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        {selectedReminder.lenderName.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      {selectedReminder.lenderName.charAt(0)}
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white shadow-sm border border-gray-200">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to the lender..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💬 Chat directly with {selectedReminder.lenderName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot Floating Button */}
      <AIChatbotWrapper />
    </div>
  );
}
