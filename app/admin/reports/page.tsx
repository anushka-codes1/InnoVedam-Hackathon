'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  IndianRupee,
  User,
  Package,
  Calendar,
  Filter,
  Search,
  Download,
  TrendingUp,
  AlertCircle,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

interface PriceReport {
  id: number;
  item_id: number;
  item_name: string;
  reporter_id: number;
  reporter_name: string;
  reported_price: number;
  fair_price_estimate: number;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reviewed_by: string | null;
  created_at: string;
  price_difference: number;
  abuse_percentage: number;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<PriceReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PriceReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<PriceReport | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data - In production, this would come from your database
  const mockReports: PriceReport[] = [
    {
      id: 1,
      item_id: 101,
      item_name: 'MacBook Pro 14"',
      reporter_id: 2001,
      reporter_name: 'Eklavya Panwar',
      reported_price: 800,
      fair_price_estimate: 500,
      reason: 'Price is significantly higher than market rate. Same model available elsewhere for ₹500/day.',
      status: 'pending',
      reviewed_by: null,
      created_at: '2025-11-29T10:30:00Z',
      price_difference: 300,
      abuse_percentage: 60
    },
    {
      id: 2,
      item_id: 102,
      item_name: 'Chemistry Textbook',
      reporter_id: 2002,
      reporter_name: 'Manya Agrawal',
      reported_price: 100,
      fair_price_estimate: 40,
      reason: 'Book rental should not exceed ₹50/day. This is price gouging.',
      status: 'pending',
      reviewed_by: null,
      created_at: '2025-11-29T09:15:00Z',
      price_difference: 60,
      abuse_percentage: 150
    },
    {
      id: 3,
      item_id: 103,
      item_name: 'Gaming Headset',
      reporter_id: 2003,
      reporter_name: 'Aayush Bhatt',
      reported_price: 150,
      fair_price_estimate: 90,
      reason: 'Overpriced compared to similar items in marketplace.',
      status: 'resolved',
      reviewed_by: 'Admin Team',
      created_at: '2025-11-28T14:20:00Z',
      price_difference: 60,
      abuse_percentage: 67
    },
    {
      id: 4,
      item_id: 104,
      item_name: 'DSLR Camera',
      reporter_id: 2004,
      reporter_name: 'Sidhant Pande',
      reported_price: 600,
      fair_price_estimate: 400,
      reason: 'Market rate for similar camera is ₹400/day. This is 50% markup.',
      status: 'pending',
      reviewed_by: null,
      created_at: '2025-11-29T11:45:00Z',
      price_difference: 200,
      abuse_percentage: 50
    },
    {
      id: 5,
      item_id: 105,
      item_name: 'Study Desk',
      reporter_id: 2005,
      reporter_name: 'Saksham Palial',
      reported_price: 80,
      fair_price_estimate: 55,
      reason: 'Price seems fair for furniture rental.',
      status: 'dismissed',
      reviewed_by: 'Admin Team',
      created_at: '2025-11-27T16:30:00Z',
      price_difference: 25,
      abuse_percentage: 45
    },
    {
      id: 6,
      item_id: 106,
      item_name: 'TI-84 Calculator',
      reporter_id: 2006,
      reporter_name: 'Urvashi Pali',
      reported_price: 120,
      fair_price_estimate: 65,
      reason: 'Calculator rental grossly overpriced. Should be around ₹60-70/day.',
      status: 'pending',
      reviewed_by: null,
      created_at: '2025-11-29T08:00:00Z',
      price_difference: 55,
      abuse_percentage: 85
    },
    {
      id: 7,
      item_id: 107,
      item_name: 'Bicycle',
      reporter_id: 2007,
      reporter_name: 'Navneet Singh',
      reported_price: 200,
      fair_price_estimate: 150,
      reason: 'Slightly overpriced but within acceptable range.',
      status: 'resolved',
      reviewed_by: 'Admin Team',
      created_at: '2025-11-28T12:10:00Z',
      price_difference: 50,
      abuse_percentage: 33
    },
    {
      id: 8,
      item_id: 108,
      item_name: 'Physics Notes',
      reporter_id: 2008,
      reporter_name: 'Amogh Vikram Pandey',
      reported_price: 60,
      fair_price_estimate: 30,
      reason: 'Notes should be affordable for students. This is exploitative pricing.',
      status: 'pending',
      reviewed_by: null,
      created_at: '2025-11-29T13:20:00Z',
      price_difference: 30,
      abuse_percentage: 100
    }
  ];

  useEffect(() => {
    // Load reports from localStorage or use mock data
    const storedReports = localStorage.getItem('priceReports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    } else {
      setReports(mockReports);
      localStorage.setItem('priceReports', JSON.stringify(mockReports));
    }
  }, []);

  useEffect(() => {
    // Filter reports based on status and search query
    let filtered = reports;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(report => 
        report.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reporter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [reports, statusFilter, searchQuery]);

  const handleApprove = (reportId: number) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          status: 'resolved' as const,
          reviewed_by: 'Admin Team'
        };
      }
      return report;
    });
    setReports(updatedReports);
    localStorage.setItem('priceReports', JSON.stringify(updatedReports));
    setShowDetailsModal(false);
  };

  const handleReject = (reportId: number) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          status: 'dismissed' as const,
          reviewed_by: 'Admin Team'
        };
      }
      return report;
    });
    setReports(updatedReports);
    localStorage.setItem('priceReports', JSON.stringify(updatedReports));
    setShowDetailsModal(false);
  };

  const viewDetails = (report: PriceReport) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const exportReports = () => {
    const csv = [
      ['ID', 'Item', 'Reporter', 'Reported Price', 'Fair Price', 'Difference', 'Status', 'Date'].join(','),
      ...filteredReports.map(r => [
        r.id,
        r.item_name,
        r.reporter_name,
        r.reported_price,
        r.fair_price_estimate,
        r.price_difference,
        r.status,
        new Date(r.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      case 'dismissed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAbuseColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2] pb-20">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">💰 Price Abuse Reports</h1>
                <p className="text-sm text-gray-600">Review and manage reported pricing issues</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/meeting-points"
                className="flex items-center gap-2 px-4 py-2 bg-white/70 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-all"
              >
                <MapPin className="w-4 h-4" />
                Meeting Points
              </Link>
              <button
                onClick={exportReports}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dismissed</p>
                <p className="text-3xl font-bold text-gray-600">{stats.dismissed}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/50 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by item name, reporter, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/70 text-gray-700 hover:bg-white/90'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/70 text-gray-700 hover:bg-white/90'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setStatusFilter('resolved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'resolved'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/70 text-gray-700 hover:bg-white/90'
                }`}
              >
                Resolved ({stats.resolved})
              </button>
              <button
                onClick={() => setStatusFilter('dismissed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'dismissed'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/70 text-gray-700 hover:bg-white/90'
                }`}
              >
                Dismissed ({stats.dismissed})
              </button>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Report ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Reported Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Fair Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Markup
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No reports found</p>
                      <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-semibold text-purple-600">
                          #{report.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-semibold text-gray-900">{report.item_name}</p>
                            <p className="text-xs text-gray-500">ID: {report.item_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{report.reporter_name}</p>
                            <p className="text-xs text-gray-500">ID: {report.reporter_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold text-red-600">
                          <IndianRupee className="w-4 h-4" />
                          {report.reported_price}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold text-green-600">
                          <IndianRupee className="w-4 h-4" />
                          {report.fair_price_estimate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className={`w-4 h-4 ${getAbuseColor(report.abuse_percentage)}`} />
                          <span className={`font-bold ${getAbuseColor(report.abuse_percentage)}`}>
                            +{report.abuse_percentage}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          ₹{report.price_difference} over
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(report.status)}`}>
                          {report.status.toUpperCase()}
                        </span>
                        {report.reviewed_by && (
                          <p className="text-xs text-gray-500 mt-1">by {report.reviewed_by}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewDetails(report)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {report.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(report.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(report.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Report Details</h2>
                  <p className="text-purple-100 text-sm">Review price abuse report #{selectedReport.id}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Item Details */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Item Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Item Name</p>
                    <p className="font-semibold text-gray-900">{selectedReport.item_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Item ID</p>
                    <p className="font-mono text-sm font-semibold text-purple-600">#{selectedReport.item_id}</p>
                  </div>
                </div>
              </div>

              {/* Reporter Details */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Reporter Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{selectedReport.reporter_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Reporter ID</p>
                    <p className="font-mono text-sm font-semibold text-blue-600">#{selectedReport.reporter_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Reported On</p>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedReport.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Analysis */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-red-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  Price Analysis
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <p className="text-xs text-gray-600 mb-1">Reported Price</p>
                    <p className="text-xl font-bold text-red-600 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {selectedReport.reported_price}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Fair Estimate</p>
                    <p className="text-xl font-bold text-green-600 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {selectedReport.fair_price_estimate}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Overcharge</p>
                    <p className="text-xl font-bold text-orange-600 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {selectedReport.price_difference}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Abuse Percentage</span>
                    <span className={`text-xl font-bold ${getAbuseColor(selectedReport.abuse_percentage)}`}>
                      +{selectedReport.abuse_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        selectedReport.abuse_percentage >= 100 ? 'bg-red-600' :
                        selectedReport.abuse_percentage >= 50 ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(selectedReport.abuse_percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Report Reason</h3>
                <p className="text-gray-700 leading-relaxed">{selectedReport.reason}</p>
              </div>

              {/* Status */}
              <div className={`rounded-xl p-4 border-2 ${getStatusColor(selectedReport.status)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold mb-1">Current Status</h3>
                    <p className="text-sm">
                      {selectedReport.status === 'pending' && 'Awaiting admin review'}
                      {selectedReport.status === 'resolved' && `Resolved by ${selectedReport.reviewed_by}`}
                      {selectedReport.status === 'dismissed' && `Dismissed by ${selectedReport.reviewed_by}`}
                    </p>
                  </div>
                  <span className="text-2xl">
                    {selectedReport.status === 'pending' && '⏳'}
                    {selectedReport.status === 'resolved' && '✅'}
                    {selectedReport.status === 'dismissed' && '❌'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {selectedReport.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedReport.id)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve & Resolve
                  </button>
                  <button
                    onClick={() => handleReject(selectedReport.id)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject & Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
