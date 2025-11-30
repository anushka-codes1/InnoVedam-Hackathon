'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Package,
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Zap,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function Marketplace() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userListedItems, setUserListedItems] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    showOnlyAvailable: false,
    showOnlyTrending: false,
    minRating: 0,
    maxPrice: Infinity,
    maxDistance: Infinity
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const userEmail = localStorage.getItem('userEmail');
      const authUser = localStorage.getItem('authUser');
      
      if (!userEmail && !authUser) {
        // User is not logged in, redirect to login
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    // Load user-listed items from localStorage
    const savedItems = localStorage.getItem('userListedItems');
    if (savedItems) {
      setUserListedItems(JSON.parse(savedItems));
    }
  }, []);

  const categories = ['All', 'Books', 'Electronics', 'Furniture', 'Sports', 'Others'];

  const handleDeleteClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      // Remove from localStorage
      const updatedItems = userListedItems.filter(item => item.id !== itemToDelete.id);
      localStorage.setItem('userListedItems', JSON.stringify(updatedItems));
      setUserListedItems(updatedItems);
      
      // Close modal
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const items = [
    { 
      id: 1, 
      name: 'Chemistry Textbook', 
      price: 45, 
      owner: 'Manya A.', 
      rating: 4.8, 
      distance: '0.3 km',
      category: 'Books',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop',
      available: true,
      trending: true
    },
    { 
      id: 2, 
      name: 'Wireless Headphones', 
      price: 65, 
      owner: 'Eklavya P.', 
      rating: 5.0, 
      distance: '0.5 km',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      available: true,
      trending: false
    },
    { 
      id: 3, 
      name: 'Physics Textbook Set', 
      price: 50, 
      owner: 'Aayush B.', 
      rating: 4.6, 
      distance: '1.2 km',
      category: 'Books',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
      available: true,
      trending: true
    },
    { 
      id: 4, 
      name: 'Chemistry 1st Year B. Tech Notes', 
      price: 30, 
      owner: 'Sidhant P.', 
      rating: 4.9, 
      distance: '0.8 km',
      category: 'Books',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
      available: true,
      trending: false
    },
    { 
      id: 5, 
      name: 'Gaming Headset', 
      price: 90, 
      owner: 'Saksham P.', 
      rating: 4.7, 
      distance: '0.6 km',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop',
      available: true,
      trending: false
    },
    { 
      id: 6, 
      name: 'Bicycle', 
      price: 150, 
      owner: 'Urvashi P.', 
      rating: 5.0, 
      distance: '1.0 km',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
      available: true,
      trending: false
    },
    { 
      id: 7, 
      name: 'Lab Coat', 
      price: 25, 
      owner: 'Anushka M.', 
      rating: 4.8, 
      distance: '0.4 km',
      category: 'Others',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop',
      available: true,
      trending: true
    },
    { 
      id: 8, 
      name: 'Engineering Drawing Tools', 
      price: 35, 
      owner: 'Md. Hayat M.', 
      rating: 4.9, 
      distance: '0.7 km',
      category: 'Others',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      available: true,
      trending: false
    },
    { 
      id: 9, 
      name: 'Soldering Kit', 
      price: 55, 
      owner: 'Aaryaa N.', 
      rating: 4.7, 
      distance: '0.9 km',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
      available: true,
      trending: true
    },
    { 
      id: 10, 
      name: 'Bluetooth Speakers', 
      price: 75, 
      owner: 'Eklavya P.', 
      rating: 5.0, 
      distance: '0.5 km',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
      available: true,
      trending: false
    }
  ];

  // Combine default items with user-listed items
  const allItems = [...items, ...userListedItems];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesAvailable = !filters.showOnlyAvailable || item.available;
    const matchesTrending = !filters.showOnlyTrending || item.trending;
    const matchesRating = item.rating >= filters.minRating;
    const matchesPrice = item.price <= filters.maxPrice;
    
    // Parse distance (e.g., "0.5 km" -> 0.5)
    const distanceValue = parseFloat(item.distance);
    const matchesDistance = isNaN(distanceValue) || distanceValue <= filters.maxDistance;
    
    return matchesSearch && matchesCategory && matchesAvailable && matchesTrending && matchesRating && matchesPrice && matchesDistance;
  });

  const resetFilters = () => {
    setFilters({
      showOnlyAvailable: false,
      showOnlyTrending: false,
      minRating: 0,
      maxPrice: Infinity,
      maxDistance: Infinity
    });
  };

  const hasActiveFilters = 
    filters.showOnlyAvailable || 
    filters.showOnlyTrending || 
    filters.minRating > 0 || 
    filters.maxPrice !== Infinity || 
    filters.maxDistance !== Infinity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2] pb-20">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.toLowerCase()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {filteredItems.length} items available
          </p>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 text-sm transition-colors ${
              hasActiveFilters 
                ? 'text-purple-600 font-semibold' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 mb-6 shadow-sm border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filter Options</h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Toggle Filters */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showOnlyAvailable}
                    onChange={(e) => setFilters({ ...filters, showOnlyAvailable: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Available only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showOnlyTrending}
                    onChange={(e) => setFilters({ ...filters, showOnlyTrending: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Trending only</span>
                </label>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating: {filters.minRating.toFixed(1)} ⭐
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price: {filters.maxPrice === Infinity ? 'Any' : `₹${filters.maxPrice}`}
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={filters.maxPrice === Infinity ? 200 : filters.maxPrice}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFilters({ ...filters, maxPrice: value === 200 ? Infinity : value });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Distance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Distance: {filters.maxDistance === Infinity ? 'Any' : `${filters.maxDistance} km`}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.maxDistance === Infinity ? 5 : filters.maxDistance}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setFilters({ ...filters, maxDistance: value === 5 ? Infinity : value });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/item/${item.id}`}
              className="bg-white/70 backdrop-blur-xl rounded-xl overflow-hidden shadow-sm border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col"
            >
              {/* Item Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop';
                  }}
                />
                {item.trending && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                )}
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                      Not Available
                    </span>
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {item.distance}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Price per day</p>
                    <p className="text-xl font-bold text-purple-600">₹{item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="text-sm font-medium text-gray-700">{item.owner}</p>
                  </div>
                </div>

                <div className="mt-auto">
                  {item.owner === 'You' ? (
                    <button
                      onClick={(e) => handleDeleteClick(item, e)}
                      className="w-full bg-red-50 border border-red-200 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Item
                    </button>
                  ) : item.available ? (
                    <button className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-white py-2.5 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      Borrow Now
                    </button>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Item?</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete <span className="font-semibold">{itemToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
