'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [] as { date: string; users: number }[],
    revenueData: [] as { date: string; revenue: number }[],
    categoryDistribution: [] as { category: string; count: number; percentage: number }[],
    topPerformers: [] as { name: string; rentals: number; revenue: number }[]
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    setLoading(true);

    // Mock analytics data
    const userGrowth = [
      { date: '2025-11-01', users: 45 },
      { date: '2025-11-05', users: 52 },
      { date: '2025-11-10', users: 68 },
      { date: '2025-11-15', users: 81 },
      { date: '2025-11-20', users: 95 },
      { date: '2025-11-25', users: 112 },
      { date: '2025-11-30', users: 128 }
    ];

    const revenueData = [
      { date: '2025-11-01', revenue: 2500 },
      { date: '2025-11-05', revenue: 3200 },
      { date: '2025-11-10', revenue: 4100 },
      { date: '2025-11-15', revenue: 5300 },
      { date: '2025-11-20', revenue: 6800 },
      { date: '2025-11-25', revenue: 8200 },
      { date: '2025-11-30', revenue: 9500 }
    ];

    const categoryDistribution = [
      { category: 'Electronics', count: 45, percentage: 35 },
      { category: 'Books', count: 38, percentage: 30 },
      { category: 'Furniture', count: 25, percentage: 20 },
      { category: 'Sports & Hobbies', count: 19, percentage: 15 }
    ];

    const topPerformers = [
      { name: 'MacBook Pro 14"', rentals: 24, revenue: 12000 },
      { name: 'Gaming Headset', rentals: 18, revenue: 1620 },
      { name: 'DSLR Camera', rentals: 15, revenue: 4500 },
      { name: 'Chemistry Textbook', rentals: 22, revenue: 880 },
      { name: 'Guitar', rentals: 14, revenue: 2100 }
    ];

    setAnalyticsData({
      userGrowth,
      revenueData,
      categoryDistribution,
      topPerformers
    });

    setLoading(false);
  };

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: '₹9,500',
      change: '+23.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Active Users',
      value: '128',
      change: '+15.2%',
      trend: 'up' as const,
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Total Rentals',
      value: '93',
      change: '+18.7%',
      trend: 'up' as const,
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Avg. Transaction',
      value: '₹102',
      change: '+5.3%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const exportAnalytics = () => {
    const data = {
      timeRange,
      generatedAt: new Date().toISOString(),
      kpis: kpiCards.map(kpi => ({ label: kpi.label, value: kpi.value, change: kpi.change })),
      userGrowth: analyticsData.userGrowth,
      revenue: analyticsData.revenueData,
      categories: analyticsData.categoryDistribution,
      topPerformers: analyticsData.topPerformers
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">Track platform performance and key metrics</p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
              <button
                onClick={loadAnalytics}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={exportAnalytics}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div key={index} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {kpi.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                  <p className="text-sm text-gray-600">{kpi.label}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-4">
                {analyticsData.userGrowth.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${(data.users / 150) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{data.users}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-4">
                {analyticsData.revenueData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${(data.revenue / 10000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">₹{data.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Distribution & Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Category Distribution</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.categoryDistribution.map((category, index) => {
                  const colors = [
                    'from-purple-500 to-pink-500',
                    'from-blue-500 to-cyan-500',
                    'from-green-500 to-emerald-500',
                    'from-orange-500 to-amber-500'
                  ];
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{category.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{category.count} items</span>
                          <span className="text-sm font-semibold text-gray-900">{category.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">Top Performing Items</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.topPerformers.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.rentals} rentals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{item.revenue}</p>
                      <p className="text-xs text-gray-600">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Platform Activity Summary</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <p className="text-3xl font-bold text-purple-600 mb-2">93</p>
                <p className="text-sm text-gray-600">Total Rentals</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600 mb-2">127</p>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <p className="text-3xl font-bold text-green-600 mb-2">4.7</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                <p className="text-3xl font-bold text-orange-600 mb-2">92%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
