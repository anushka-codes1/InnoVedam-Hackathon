'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Package,
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Books', 'Electronics', 'Furniture', 'Sports', 'Others'];

  const items = [
    { 
      id: 1, 
      name: 'Chemistry Textbook', 
      price: 45, 
      owner: 'Sarah M.', 
      rating: 4.8, 
      distance: '0.3 km',
      category: 'Books',
      image: '📚',
      available: true,
      trending: true
    },
    { 
      id: 2, 
      name: 'TI-84 Calculator', 
      price: 65, 
      owner: 'John D.', 
      rating: 5.0, 
      distance: '0.5 km',
      category: 'Electronics',
      image: '🧮',
      available: true,
      trending: false
    },
    { 
      id: 3, 
      name: 'Mini Fridge', 
      price: 80, 
      owner: 'Mike J.', 
      rating: 4.6, 
      distance: '1.2 km',
      category: 'Furniture',
      image: '🧊',
      available: false,
      trending: true
    },
    { 
      id: 4, 
      name: 'MacBook Adapter', 
      price: 35, 
      owner: 'Emily R.', 
      rating: 4.9, 
      distance: '0.8 km',
      category: 'Electronics',
      image: '🔌',
      available: true,
      trending: false
    },
    { 
      id: 5, 
      name: 'Study Desk', 
      price: 55, 
      owner: 'Alex K.', 
      rating: 4.7, 
      distance: '0.6 km',
      category: 'Furniture',
      image: '🪑',
      available: true,
      trending: false
    },
    { 
      id: 6, 
      name: 'Camera Lens', 
      price: 120, 
      owner: 'Lisa P.', 
      rating: 5.0, 
      distance: '1.0 km',
      category: 'Electronics',
      image: '📷',
      available: true,
      trending: true
    },
    { 
      id: 7, 
      name: 'Tennis Racket', 
      price: 40, 
      owner: 'David L.', 
      rating: 4.5, 
      distance: '0.4 km',
      category: 'Sports',
      image: '🎾',
      available: true,
      trending: false
    },
    { 
      id: 8, 
      name: 'Physics Textbook', 
      price: 50, 
      owner: 'Nina S.', 
      rating: 4.8, 
      distance: '0.7 km',
      category: 'Books',
      image: '📖',
      available: true,
      trending: false
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/item/${item.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {/* Item Image */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <span className="text-6xl">{item.image}</span>
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
              <div className="p-4">
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

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Price per day</p>
                    <p className="text-xl font-bold text-emerald-600">₹{item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="text-sm font-medium text-gray-700">{item.owner}</p>
                  </div>
                </div>

                {item.available && (
                  <button className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Borrow Now
                  </button>
                )}
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
    </div>
  );
}
