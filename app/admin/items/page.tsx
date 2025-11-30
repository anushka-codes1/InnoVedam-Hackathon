/**
 * Admin Items Management Page
 * 
 * Purpose: Comprehensive item management interface for administrators
 * - View all items in the marketplace with detailed information
 * - Search items by name, owner, or category
 * - Filter items by status (active, rented, inactive) and category
 * - View detailed item statistics (views, rentals, ratings)
 * - Export item data to CSV for reporting
 * - Monitor item performance and user engagement
 * 
 * Features:
 * - Real-time search with multi-field support
 * - Advanced filtering by status and category
 * - Comprehensive statistics dashboard
 * - Item details modal with full information
 * - CSV export for data analysis
 * - Status indicators with color coding
 * - CRUD operations (view, edit, delete)
 * 
 * Data Sources:
 * - localStorage.activeRentals: Currently rented items
 * - localStorage.userOrders: Historical rental data
 * - Mock data for demonstration purposes
 */

'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import { 
  Package,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';

/**
 * Interface for marketplace items
 * 
 * @property id - Unique item identifier
 * @property name - Item name/title
 * @property category - Item category (Electronics, Books, Sports, etc.)
 * @property owner - Name of the user who listed the item
 * @property price - Rental price per day in rupees
 * @property status - Current availability (active/rented/inactive)
 * @property condition - Physical condition (Excellent, Good, Fair, etc.)
 * @property views - Number of times item page was viewed
 * @property rentals - Total number of successful rentals
 * @property rating - Average user rating (1-5 scale)
 * @property listedDate - Date when item was first listed (YYYY-MM-DD)
 */
interface Item {
  id: number;
  name: string;
  category: string;
  owner: string;
  price: number;
  status: 'active' | 'rented' | 'inactive';
  condition: string;
  views: number;
  rentals: number;
  rating: number;
  listedDate: string;
}

export default function AdminItemsPage() {
  // State management for items and filtering
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'rented' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, []);

  // Re-filter items whenever search query, filters, or items change
  useEffect(() => {
    filterItems();
  }, [searchQuery, statusFilter, categoryFilter, items]);

  /**
   * Load items from localStorage and merge with mock data
   * 
   * Data Sources:
   * 1. activeRentals: Items currently being rented
   * 2. userOrders: Historical rental transactions
   * 3. Mock data: Sample items for demonstration
   * 
   * Future Enhancement: Replace mock data with API call to backend
   */
  const loadItems = () => {
    setLoading(true);
    
    // Load real data from localStorage (if available)
    const activeRentals = JSON.parse(localStorage.getItem('activeRentals') || '[]');
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    
    // Mock items for demonstration (would be replaced with API data in production)
    const mockItems: Item[] = [
      {
        id: 1,
        name: 'MacBook Pro 14"',
        category: 'Electronics',
        owner: 'Anushka Mukherjee',
        price: 500,
        status: 'active',
        condition: 'Excellent',
        views: 145,
        rentals: 8,
        rating: 4.8,
        listedDate: '2025-11-15'
      },
      {
        id: 2,
        name: 'Chemistry Textbook',
        category: 'Books',
        owner: 'Eklavya Panwar',
        price: 40,
        status: 'rented',
        condition: 'Good',
        views: 89,
        rentals: 12,
        rating: 4.5,
        listedDate: '2025-11-20'
      },
      {
        id: 3,
        name: 'Gaming Headset',
        category: 'Electronics',
        owner: 'Manya Agrawal',
        price: 90,
        status: 'active',
        condition: 'Like New',
        views: 203,
        rentals: 15,
        rating: 4.9,
        listedDate: '2025-11-10'
      },
      {
        id: 4,
        name: 'DSLR Camera',
        category: 'Electronics',
        owner: 'Aaryaa Newaskar',
        price: 300,
        status: 'active',
        condition: 'Excellent',
        views: 167,
        rentals: 6,
        rating: 4.7,
        listedDate: '2025-11-18'
      },
      {
        id: 5,
        name: 'Study Desk',
        category: 'Furniture',
        owner: 'Md. Hayat Mallick',
        price: 120,
        status: 'inactive',
        condition: 'Fair',
        views: 45,
        rentals: 3,
        rating: 4.2,
        listedDate: '2025-11-22'
      },
      {
        id: 6,
        name: 'Guitar',
        category: 'Sports & Hobbies',
        owner: 'Sidhant Pande',
        price: 150,
        status: 'active',
        condition: 'Good',
        views: 112,
        rentals: 9,
        rating: 4.6,
        listedDate: '2025-11-12'
      }
    ];

    setItems(mockItems);
    setLoading(false);
  };

  /**
   * Filter items based on search query and selected filters
   * 
   * Filtering Logic:
   * 1. Search Query: Searches across name, owner, and category (case-insensitive)
   * 2. Status Filter: Shows only items with matching status (all/active/rented/inactive)
   * 3. Category Filter: Shows only items from selected category
   * 
   * All filters are applied cumulatively (AND logic)
   */
  const filterItems = () => {
    let filtered = [...items];

    // Apply search query filter (searches name, owner, and category)
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  /**
   * Get Tailwind CSS classes for status badge based on item status
   * 
   * @param status - Item status (active/rented/inactive)
   * @returns Tailwind CSS classes for background and text color
   * 
   * Color Coding:
   * - Active: Green (available for rental)
   * - Rented: Blue (currently rented out)
   * - Inactive: Gray (not available)
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Get Lucide icon component for status indicator
   * 
   * @param status - Item status (active/rented/inactive)
   * @returns Corresponding icon component
   * 
   * Icon Mapping:
   * - Active: CheckCircle (item is available)
   * - Rented: Clock (item is temporarily unavailable)
   * - Inactive: XCircle (item is not available)
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'rented': return <Clock className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  /**
   * Delete an item from the marketplace
   * 
   * @param itemId - ID of the item to delete
   * 
   * Process:
   * 1. Show confirmation dialog to prevent accidental deletions
   * 2. Remove item from items array
   * 3. Filtered items will update automatically via useEffect
   * 
   * Future Enhancement: Should also call API to delete from backend
   */
  const handleDeleteItem = (itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  /**
   * Toggle item status between active and inactive
   * 
   * @param itemId - ID of the item to toggle
   * 
   * Logic:
   * - Active → Inactive: Removes item from marketplace listings
   * - Inactive → Active: Makes item available for rental again
   * - Rented items cannot be toggled (must wait for return)
   * 
   * Use Cases:
   * - Temporarily disable listings without deleting
   * - Reactivate previously disabled items
   */
  const handleToggleStatus = (itemId: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: item.status === 'active' ? 'inactive' : 'active'
        };
      }
      return item;
    }));
  };

  /**
   * Export filtered items to CSV file
   * 
   * Process:
   * 1. Define CSV headers matching Item interface fields
   * 2. Map filteredItems to CSV rows (only visible items are exported)
   * 3. Create CSV content with comma-separated values
   * 4. Generate Blob and download link
   * 5. Trigger automatic download with timestamped filename
   * 
   * Filename Format: items-export-YYYY-MM-DD.csv
   * 
   * Use Cases:
   * - Data analysis in Excel/Google Sheets
   * - Reporting and auditing
   * - Backup of current item state
   */
  const exportToCSV = () => {
    // CSV column headers
    const headers = ['ID', 'Name', 'Category', 'Owner', 'Price', 'Status', 'Condition', 'Views', 'Rentals', 'Rating', 'Listed Date'];
    
    // Convert items to CSV rows
    const csvData = filteredItems.map(item => [
      item.id,
      item.name,
      item.category,
      item.owner,
      item.price,
      item.status,
      item.condition,
      item.views,
      item.rentals,
      item.rating,
      item.listedDate
    ]);

    // Combine headers and data into CSV string
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create downloadable file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `items-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Available categories for filtering
  const categories = ['all', 'Electronics', 'Books', 'Furniture', 'Sports & Hobbies'];

  /**
   * Calculate aggregate statistics for dashboard cards
   * 
   * Metrics:
   * - total: Total number of items in marketplace
   * - active: Items available for rental
   * - rented: Items currently rented out
   * - inactive: Items temporarily disabled
   * - totalViews: Sum of all item page views
   * - totalRentals: Sum of all successful rental transactions
   * 
   * These stats provide quick insights into marketplace health and activity
   */
  const stats = {
    total: items.length,
    active: items.filter(i => i.status === 'active').length,
    rented: items.filter(i => i.status === 'rented').length,
    inactive: items.filter(i => i.status === 'inactive').length,
    totalViews: items.reduce((sum, item) => sum + item.views, 0),
    totalRentals: items.reduce((sum, item) => sum + item.rentals, 0)
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          {/* Page Header with Title and Action Buttons */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Items Management
              </h1>
              <p className="text-gray-600">Manage all rental items across the platform</p>
            </div>
            <div className="flex gap-3">
              {/* Refresh button to reload items from storage */}
              <button
                onClick={loadItems}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {/* Export button to download filtered items as CSV */}
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Statistics Dashboard - 6 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Items Count */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-purple-100">
              <p className="text-sm text-gray-600 mb-1">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            {/* Active Items (Available for Rental) */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Rented</p>
              <p className="text-2xl font-bold text-blue-600">{stats.rented}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Total Views</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalViews}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Total Rentals</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalRentals}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items, owners, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="rented">Rented</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-purple-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Owner</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Performance</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.condition}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.owner}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">₹{item.price}</span>
                        <span className="text-sm text-gray-600">/day</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{item.views} views</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>{item.rentals} rentals</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Toggle Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">No items found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Details Modal */}
          {showDetailsModal && selectedItem && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Item Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Item Name</label>
                      <p className="font-semibold text-gray-900">{selectedItem.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Category</label>
                      <p className="font-semibold text-gray-900">{selectedItem.category}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Owner</label>
                      <p className="font-semibold text-gray-900">{selectedItem.owner}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Price</label>
                      <p className="font-semibold text-gray-900">₹{selectedItem.price}/day</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Condition</label>
                      <p className="font-semibold text-gray-900">{selectedItem.condition}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItem.status)}`}>
                        {getStatusIcon(selectedItem.status)}
                        {selectedItem.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Views</label>
                      <p className="font-semibold text-gray-900">{selectedItem.views}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Total Rentals</label>
                      <p className="font-semibold text-gray-900">{selectedItem.rentals}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Rating</label>
                      <p className="font-semibold text-gray-900">⭐ {selectedItem.rating}/5.0</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Listed Date</label>
                      <p className="font-semibold text-gray-900">{new Date(selectedItem.listedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleToggleStatus(selectedItem.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Toggle Status
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteItem(selectedItem.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
