'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Package,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  suggested_price: number;
  is_available: boolean;
  category: string;
  condition: string;
  created_at: string;
  images?: string[];
}

const getCategoryEmoji = (category: string) => {
  const emojiMap: { [key: string]: string } = {
    'Books & Textbooks': '📚',
    'Electronics': '💻',
    'Furniture': '🪑',
    'Sports Equipment': '⚽',
    'Musical Instruments': '🎸',
    'Others': '📦'
  };
  return emojiMap[category] || '📦';
};

export default function MyListings() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Listing | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserListings();
  }, []);

  const fetchUserListings = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        // Use mock data if Supabase is not configured
        console.log('Supabase not configured, using mock data');
        
        // Get from localStorage or use default mock data
        const storedListings = localStorage.getItem('mockListings');
        if (storedListings) {
          setListings(JSON.parse(storedListings));
        } else {
          // Initialize with empty array - no default Diya items
          const initialListings: any[] = [];
          setListings(initialListings);
          localStorage.setItem('mockListings', JSON.stringify(initialListings));
        }
        
        setUserId('mock-user-id');
        setLoading(false);
        return;
      }

      // Import and use Supabase only if configured
      const { supabase } = await import('@/lib/supabase');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      setUserId(user.id);

      // Fetch user's items
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item: Listing) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);

      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        // Delete from Supabase if configured
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('items')
          .delete()
          .eq('id', itemToDelete.id)
          .eq('owner_id', userId);

        if (error) throw error;
      }

      // Remove from state
      const updatedListings = listings.filter(item => item.id !== itemToDelete.id);
      setListings(updatedListings);
      
      // Persist to localStorage for mock data
      if (!supabaseUrl || !supabaseAnonKey) {
        localStorage.setItem('mockListings', JSON.stringify(updatedListings));
      }
      
      setSuccessMessage(`${itemToDelete.title} has been deleted successfully`);
      setShowDeleteModal(false);
      setItemToDelete(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        // Update in Supabase if configured
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('items')
          .update({ is_available: !currentStatus })
          .eq('id', itemId)
          .eq('owner_id', userId);

        if (error) throw error;
      }

      // Update state
      const updatedListings = listings.map(item => 
        item.id === itemId 
          ? { ...item, is_available: !currentStatus }
          : item
      );
      setListings(updatedListings);
      
      // Persist to localStorage for mock data
      if (!supabaseUrl || !supabaseAnonKey) {
        localStorage.setItem('mockListings', JSON.stringify(updatedListings));
      }

      setSuccessMessage(`Availability updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                <p className="text-sm text-gray-600">Manage your items</p>
              </div>
            </div>
            <Link
              href="/dashboard/create-item"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              + Add New Item
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 text-center border border-white/50">
            <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading your listings...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/50 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/50 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {listings.filter(l => l.is_available).length}
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/50 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Unavailable</p>
                <p className="text-2xl font-bold text-gray-600">
                  {listings.filter(l => !l.is_available).length}
                </p>
              </div>
            </div>

            {/* Listings Grid */}
            {listings.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 text-center border border-white/50">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-600 mb-6">Start earning by listing your first item</p>
                <Link
                  href="/dashboard/create-item"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Create Your First Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/70 backdrop-blur-xl rounded-xl overflow-hidden shadow-sm border border-white/50 hover:shadow-lg transition-all"
                  >
                    {/* Item Image */}
                    <div className="relative h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="text-6xl">{getCategoryEmoji(item.category)}</span>
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.is_available
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-500 text-white'
                        }`}>
                          {item.is_available ? '● Available' : '● Unavailable'}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 capitalize">
                            Condition: {item.condition}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Price/day</p>
                          <p className="font-bold text-purple-600 text-xl mt-1">₹{item.suggested_price}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => toggleAvailability(item.id, item.is_available)}
                          className={`w-full py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                            item.is_available
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {item.is_available ? (
                            <>
                              <ToggleRight className="w-4 h-4" />
                              Mark Unavailable
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4" />
                              Mark Available
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="w-full py-2 bg-red-50 text-red-700 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Listing?</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCategoryEmoji(itemToDelete.category)}</span>
                <div>
                  <p className="font-semibold text-gray-900">{itemToDelete.title}</p>
                  <p className="text-sm text-gray-600">₹{itemToDelete.suggested_price}/day</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this listing? This will permanently remove it from 
              the marketplace and all associated data will be lost.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Listing'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
