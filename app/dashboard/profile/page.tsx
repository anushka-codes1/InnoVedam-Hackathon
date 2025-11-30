'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Award,
  Shield,
  Edit,
  Camera,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import AIChatbotWrapper from '@/components/AIChatbotWrapper';

export default function Profile() {
  const router = useRouter();
  const { userData: contextUserData, setUserData } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    collegeName: ''
  });
  
  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const email = contextUserData?.email || '';
      const allUserProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      return allUserProfiles[email]?.profilePhoto || null;
    }
    return null;
  });

  // Settings modals state
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Notification settings
  const [pushNotifications, setPushNotifications] = useState(
    localStorage.getItem('pushNotifications') === 'true'
  );
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    localStorage.getItem('twoFactorEnabled') === 'true'
  );

  const userData = {
    name: contextUserData?.fullName || 'Anushka Mukherjee',
    email: contextUserData?.email || 'anushka.mukherjee@vedam.edu',
    phone: contextUserData?.phone || '7439943666',
    location: contextUserData?.address || 'Campus Housing, Block A',
    collegeName: contextUserData?.collegeName || 'Your University',
    trustScore: 92,
    totalEarnings: 1250,
    itemsListed: 12,
    successfulTransactions: 28,
    rating: 4.8,
    memberSince: contextUserData?.memberSince || 'January 2024'
  };

  const handleEditClick = () => {
    setEditedData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      collegeName: userData.collegeName
    });
    setIsEditing(true);
  };

  /**
   * Handle profile photo upload with validation
   * 
   * Process:
   * 1. Validate file size (max 5MB to prevent storage issues)
   * 2. Validate file type (images only)
   * 3. Convert image to Base64 for localStorage storage
   * 4. Save immediately to user's profile in localStorage
   * 5. Update UI with success message
   * 
   * @param event - File input change event
   * 
   * Storage Structure:
   * localStorage.userProfiles = {
   *   "user@email.com": {
   *     fullName: "...",
   *     profilePhoto: "data:image/jpeg;base64,..."
   *   }
   * }
   * 
   * Why Base64?
   * - Works with localStorage (string-based storage)
   * - No need for separate file storage
   * - Instant load without network requests
   * - Simple implementation for small images
   */
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size - 5MB limit to prevent localStorage bloat
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      // Validate file type - only accept images
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Convert image to Base64 string for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        
        // Persist photo to localStorage immediately (auto-save)
        const userEmail = userData.email;
        const allUserProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        const existingProfile = allUserProfiles[userEmail] || {};
        
        // Merge photo with existing profile data
        allUserProfiles[userEmail] = {
          ...existingProfile,
          profilePhoto: base64String
        };
        localStorage.setItem('userProfiles', JSON.stringify(allUserProfiles));
        
        // Show success notification
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      };
      
      // Start reading file as Data URL (Base64)
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUserData = {
      fullName: editedData.name,
      email: editedData.email,
      phone: editedData.phone,
      address: editedData.location,
      collegeName: editedData.collegeName,
      memberSince: userData.memberSince,
      profilePhoto: profilePhoto
    };
    
    // Save to context
    setUserData(updatedUserData);
    
    // Save to localStorage with user email as key
    const userEmail = editedData.email || userData.email;
    const allUserProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    allUserProfiles[userEmail] = updatedUserData;
    localStorage.setItem('userProfiles', JSON.stringify(allUserProfiles));
    
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleNotificationToggle = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    localStorage.setItem('pushNotifications', String(newValue));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handlePasswordChange = () => {
    setPasswordError('');
    
    // Validate
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (passwordData.new.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Check current password
    const storedPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    const userEmail = userData.email;
    
    if (storedPasswords[userEmail] !== passwordData.current) {
      setPasswordError('Current password is incorrect');
      return;
    }
    
    // Update password
    storedPasswords[userEmail] = passwordData.new;
    localStorage.setItem('userPasswords', JSON.stringify(storedPasswords));
    
    setShowPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggle2FA = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    localStorage.setItem('twoFactorEnabled', String(newValue));
    setShow2FAModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const badges = [
    { name: 'Top Lender', icon: '🏆', description: '50+ successful rentals' },
    { name: 'Trusted User', icon: '✅', description: 'Trust score above 90' },
    { name: 'Early Adopter', icon: '🌟', description: 'Joined in first month' },
    { name: 'Quick Responder', icon: '⚡', description: 'Responds within 1 hour' }
  ];

  const recentActivity = [
    { type: 'rental', item: 'Chemistry Textbook', date: '2 days ago', amount: 45 },
    { type: 'returned', item: 'TI-84 Calculator', date: '5 days ago', amount: 65 },
    { type: 'listed', item: 'Study Desk', date: '1 week ago', amount: 55 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2] pb-20">
      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Profile updated successfully!</span>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-white/20 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {activeTab === 'profile' ? (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/20">
              <div className="flex items-start gap-6">
                <div className="relative">
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="photo-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoUpload}
                  />
                  <label 
                    htmlFor="photo-upload" 
                    className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                      <p className="text-gray-600">Member since {userData.memberSince}</p>
                    </div>
                    {!isEditing ? (
                      <button 
                        onClick={handleEditClick}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={handleSave}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Save
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditing ? (
                    <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{userData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{userData.location}</span>
                    </div>
                    {userData.collegeName && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span>{userData.collegeName}</span>
                      </div>
                    )}
                  </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={editedData.name}
                          onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                          className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={editedData.email}
                          onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                          className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editedData.phone}
                          onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                          className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={editedData.location}
                          onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                          className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                        <input
                          type="text"
                          value={editedData.collegeName}
                          onChange={(e) => setEditedData({ ...editedData, collegeName: e.target.value })}
                          className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-white/20 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userData.trustScore}</p>
                <p className="text-sm text-gray-600">Trust Score</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-white/20 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{userData.totalEarnings}</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-white/20 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userData.successfulTransactions}</p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-white/20 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userData.rating}</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'rental' ? 'bg-blue-100' :
                        activity.type === 'returned' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {activity.type === 'rental' && '📤'}
                        {activity.type === 'returned' && '✅'}
                        {activity.type === 'listed' && '➕'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.type === 'rental' && 'Rented out '}
                          {activity.type === 'returned' && 'Returned '}
                          {activity.type === 'listed' && 'Listed '}
                          {activity.item}
                        </p>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-purple-600">+₹{activity.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Settings Tab */
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-white/20 overflow-hidden">
              <div className="p-4 border-b border-white/20">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="divide-y divide-white/20">
                <button 
                  onClick={() => setShowNotificationsModal(true)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">
                        {pushNotifications ? 'Enabled' : 'Get notified about new messages'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-white/20 overflow-hidden">
              <div className="p-4 border-b border-white/20">
                <h3 className="font-semibold text-gray-900">Security</h3>
              </div>
              <div className="divide-y divide-white/20">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-600">Update your password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button 
                  onClick={() => setShow2FAModal(true)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">
                        {twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-white/20 overflow-hidden">
              <div className="p-4 border-b border-white/20">
                <h3 className="font-semibold text-gray-900">Support</h3>
              </div>
              <div className="divide-y divide-white/20">
                <button 
                  onClick={() => setShowHelpModal(true)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Help Center</p>
                      <p className="text-sm text-gray-600">Browse FAQs and guides</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
              <div className="p-4 border-b border-red-200 bg-red-50">
                <h3 className="font-semibold text-red-900">Danger Zone</h3>
              </div>
              <button 
                onClick={() => router.push('/login')}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <p className="font-medium text-red-900">Logout</p>
                    <p className="text-sm text-red-600">Sign out of your account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Notification Settings</h3>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Get notified about messages and updates</p>
                  </div>
                </div>
                <button
                  onClick={handleNotificationToggle}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    pushNotifications ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      pushNotifications ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <p className="text-sm text-gray-500 px-4">
                {pushNotifications
                  ? '✓ You will receive notifications for new messages, rental updates, and reminders.'
                  : 'Turn on notifications to stay updated on your rentals and messages.'}
              </p>
            </div>

            <button
              onClick={() => setShowNotificationsModal(false)}
              className="w-full mt-6 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ current: '', new: '', confirm: '' });
                  setPasswordError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {passwordError}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ current: '', new: '', confirm: '' });
                  setPasswordError('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h3>
              <button
                onClick={() => setShow2FAModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">2FA Status</p>
                    <p className="text-sm text-gray-600">
                      {twoFactorEnabled ? 'Currently Enabled' : 'Currently Disabled'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      twoFactorEnabled ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">What is 2FA?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Two-factor authentication adds an extra layer of security by requiring a second
                  verification method when logging in.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Protects your account from unauthorized access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Verification via SMS or email
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Required for high-value transactions
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShow2FAModal(false)}
              className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Help Center</h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                  How do I rent an item?
                </h4>
                <p className="text-sm text-gray-600 pl-7">
                  Browse the marketplace, select an item, choose your rental duration, and proceed to checkout.
                  You'll receive a confirmation with pickup details.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  What payment methods are accepted?
                </h4>
                <p className="text-sm text-gray-600 pl-7">
                  We accept UPI, Credit/Debit Cards, Net Banking, and digital wallets (Paytm, PhonePe, Amazon Pay).
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-green-600" />
                  How does delivery work?
                </h4>
                <p className="text-sm text-gray-600 pl-7">
                  Choose from Self-Delivery (meet at campus location), Buddy Delivery (student courier), or
                  Priority Delivery (lender brings to you within 1 hour for premium users).
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="p-4 bg-orange-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                  What if an item is damaged?
                </h4>
                <p className="text-sm text-gray-600 pl-7">
                  Contact support immediately. We have a dispute resolution system and may charge the damage
                  from your security deposit based on the assessment.
                </p>
              </div>

              {/* FAQ Item 5 */}
              <div className="p-4 bg-pink-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-pink-600" />
                  How do I list my items?
                </h4>
                <p className="text-sm text-gray-600 pl-7">
                  Click "Create Listing" from the dashboard, add photos and details, set your price (we suggest
                  a fair price), and publish. Your item will appear in the marketplace instantly.
                </p>
              </div>

              {/* FAQ Item 6 */}
              <div className="p-4 bg-indigo-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  What is Premium membership?
                </h4>
                <p className="text-sm text-gray-600 pl-7">
                  Premium members get 1-hour priority delivery, zero transaction fees, featured listings,
                  advanced analytics, and 24/7 priority support. Plans start at ₹199/month.
                </p>
              </div>

              {/* Contact Support */}
              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Still need help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Our support team is available 24/7 to assist you.
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-md transition-all">
                    Email Support
                  </button>
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Live Chat
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full mt-6 px-4 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* AI Chatbot Floating Button */}
      <AIChatbotWrapper />
    </div>
  );
}
