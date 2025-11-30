'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import CampusHeatmap from '@/components/CampusHeatmap';
import Link from 'next/link';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Activity,
  RefreshCw,
  AlertTriangle,
  Eye
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeListings: 0,
    totalRevenue: 0,
    transactions: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    
    const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    const totalUsers = Object.keys(userPasswords).length;
    
    const activeRentals = JSON.parse(localStorage.getItem('activeRentals') || '[]');
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const allTransactions = [...activeRentals, ...userOrders];
    
    const totalRevenue = allTransactions.reduce((sum: number, order: any) => {
      return sum + (parseFloat(order.totalAmount) || parseFloat(order.price) || 0);
    }, 0);
    
    setStats({
      totalUsers,
      activeListings: activeRentals.length,
      totalRevenue: Math.round(totalRevenue),
      transactions: allTransactions.length
    });
    
    const recentActivities = allTransactions.slice(-10).reverse().map((item: any, index: number) => ({
      id: index,
      user: item.lenderName || item.borrowerName || 'Unknown User',
      action: item.status === 'active' ? 'Active Rental' : 'Completed',
      item: item.itemName || item.title || 'Item',
      time: getTimeAgo(item.orderDate || item.startDate || new Date().toISOString()),
      amount: item.totalAmount || item.price || 0
    }));
    
    setActivities(recentActivities);
    setLoading(false);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      change: '+12.5%',
      trend: 'up' as const,
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Active Listings',
      value: stats.activeListings,
      change: '+8.2%',
      trend: 'up' as const,
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: '+23.1%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500'
    },
    {
      label: 'Transactions',
      value: stats.transactions,
      change: '+15.3%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with CampusSwap today.</p>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {activity.user.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{activity.user}</p>
                        <p className="text-sm text-gray-600">
                          {activity.action} • <span className="text-purple-600">{activity.item}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">₹{activity.amount}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity to display</p>
                  <p className="text-sm mt-2">Transactions will appear here as users interact with the platform</p>
                </div>
              )}
            </div>
          </div>

          {/* Campus Heatmap */}
          <CampusHeatmap />

          {/* Price Abuse Reports Quick View */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Recent Price Abuse Reports</h2>
              </div>
              <Link
                href="/admin/reports"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
              >
                <Eye className="w-4 h-4" />
                View All Reports
              </Link>
            </div>
            <div className="space-y-4">
              <PriceAbuseQuickView />
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

function PriceAbuseQuickView() {
  const mockReports = [
    {
      id: 1,
      item_name: 'MacBook Pro 14"',
      reporter_name: 'Eklavya Panwar',
      reported_price: 800,
      fair_price_estimate: 500,
      abuse_percentage: 60,
      status: 'pending'
    },
    {
      id: 2,
      item_name: 'Chemistry Textbook',
      reporter_name: 'Manya Agrawal',
      reported_price: 100,
      fair_price_estimate: 40,
      abuse_percentage: 150,
      status: 'pending'
    },
    {
      id: 3,
      item_name: 'Gaming Headset',
      reporter_name: 'Aayush Bhatt',
      reported_price: 150,
      fair_price_estimate: 90,
      abuse_percentage: 67,
      status: 'resolved'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAbuseColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <>
      {mockReports.map((report) => (
        <div key={report.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:shadow-md transition-all">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">{report.item_name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Reported by <span className="font-medium">{report.reporter_name}</span>
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-gray-600">
                Listed: <span className="font-semibold">₹{report.reported_price}</span>
              </span>
              <span className="text-gray-600">
                Fair: <span className="font-semibold">₹{report.fair_price_estimate}</span>
              </span>
              <span className={`font-bold ${getAbuseColor(report.abuse_percentage)}`}>
                +{report.abuse_percentage}% markup
              </span>
            </div>
          </div>
        </div>
      ))}
      {mockReports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No price abuse reports</p>
          <p className="text-sm mt-2">Reports will appear here when users flag unfair pricing</p>
        </div>
      )}
    </>
  );
}
