'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft,
  Upload,
  Camera,
  Tag,
  IndianRupee,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Package,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: '',
    pricePerDay: '',
    description: '',
    availableFrom: '',
    availableTo: '',
    meetingPoint: '',
    requiresCollateral: false,
    collateralAmount: '',
    image: ''
  });

  const [step, setStep] = useState(1);
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const categories = [
    { name: 'Books & Textbooks', icon: '📚' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Furniture', icon: '🪑' },
    { name: 'Sports Equipment', icon: '⚽' },
    { name: 'Musical Instruments', icon: '🎸' },
    { name: 'Others', icon: '📦' }
  ];

  const conditions = ['Brand New', 'Like New', 'Good', 'Fair', 'Well-Used'];

  const campusSpots = [
    'Main Library Entrance',
    'Central Cafeteria',
    'Student Center Lobby',
    'Academic Block A Gate',
    'Sports Complex Entrance',
    'Hostel Common Room',
    'Tech Park Courtyard',
    'Admin Building Reception',
    'Auditorium Foyer',
    'Campus Bookstore'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear API error when user starts typing
    if (apiError) {
      setApiError(null);
    }

    // Auto-suggest price based on category and condition
    if ((name === 'category' || name === 'condition') && formData.category && formData.condition) {
      calculateSuggestedPrice(formData.category, formData.condition);
    }
  };

  const canProceedToStep2 = () => {
    return formData.name.trim().length >= 3 && formData.category && formData.condition && formData.description.trim().length >= 10;
  };

  const canProceedToStep3 = () => {
    return formData.pricePerDay && parseFloat(formData.pricePerDay) > 0 && formData.availableFrom && formData.availableTo && formData.meetingPoint;
  };

  const calculateSuggestedPrice = (category: string, condition: string) => {
    // Mock price suggestion logic
    const basePrices: { [key: string]: number } = {
      'Books & Textbooks': 40,
      'Electronics': 80,
      'Furniture': 60,
      'Sports Equipment': 50,
      'Musical Instruments': 70,
      'Others': 30
    };

    const conditionMultiplier: { [key: string]: number } = {
      'Brand New': 1.5,
      'Like New': 1.2,
      'Good': 1.0,
      'Fair': 0.8,
      'Well-Used': 0.6
    };

    const basePrice = basePrices[category] || 30;
    const multiplier = conditionMultiplier[condition] || 1.0;
    setSuggestedPrice(Math.round(basePrice * multiplier));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setApiError(null);
    setIsLoading(true);

    try {
      // Map form values to API expected values
      const categoryMap: { [key: string]: string } = {
        'Books & Textbooks': 'Books',
        'Electronics': 'Electronics',
        'Furniture': 'Furniture',
        'Sports Equipment': 'Sports',
        'Musical Instruments': 'Others',
        'Others': 'Others'
      };

      const conditionMap: { [key: string]: string } = {
        'Brand New': 'New',
        'Like New': 'Like New',
        'Good': 'Good',
        'Fair': 'Fair',
        'Well-Used': 'Poor'
      };

      // Prepare data for API - map form fields to API expected format
      const apiData = {
        name: formData.name,
        category: categoryMap[formData.category] || 'Others',
        condition: conditionMap[formData.condition] || 'Good',
        pricePerDay: formData.pricePerDay,
        description: formData.description,
        availableFrom: formData.availableFrom,
        availableTo: formData.availableTo,
        meetingPoint: formData.meetingPoint,
        requiresCollateral: formData.requiresCollateral,
        collateralAmount: formData.requiresCollateral ? formData.collateralAmount : '0'
      };

      console.log('📤 Sending item data to API:', apiData);

      // Call backend API
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // API returned an error
        const errorMessage = result.error || 'Failed to create item';
        const validationErrors = result.errors?.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        throw new Error(validationErrors || errorMessage);
      }

      console.log('✅ Item created successfully:', result);
      console.log('Item ID:', result.itemId);

      // Save item to localStorage for marketplace (backward compatibility)
      const existingItems = JSON.parse(localStorage.getItem('userListedItems') || '[]');
      const newItem = {
        id: result.itemId || Date.now(),
        name: formData.name,
        price: parseInt(formData.pricePerDay),
        owner: 'You',
        rating: 5.0,
        distance: '0 km',
        category: formData.category.replace(' & Textbooks', ''),
        image: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        available: true,
        trending: false,
        condition: formData.condition,
        description: formData.description,
        meetingPoint: formData.meetingPoint,
        requiresCollateral: formData.requiresCollateral,
        collateralAmount: formData.collateralAmount
      };
      
      existingItems.push(newItem);
      localStorage.setItem('userListedItems', JSON.stringify(existingItems));
      
      // Move to success screen
      setStep(4);

    } catch (error: any) {
      console.error('❌ Error creating item:', error);
      setApiError(error.message || 'Failed to create item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2] pb-20">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">List New Item</h1>
              <p className="text-sm text-gray-600">Step {step} of 3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-purple-600">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Pricing & Availability'}
              {step === 3 && 'Additional Details'}
              {step === 4 && 'Success!'}
            </span>
            <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 4 ? (
          /* Success Screen */
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-8 text-center shadow-sm border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Listed Successfully!</h2>
            <p className="text-gray-600 mb-6">Your item is now visible to other students on campus</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/dashboard/marketplace"
                className="px-6 py-3 bg-white/70 backdrop-blur-sm border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                View Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/20 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos *
                  </label>
                  {!uploadedImage ? (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </label>
                  ) : (
                    <div className="relative border-2 border-purple-500 rounded-lg overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded-lg text-sm font-medium text-gray-700">
                        {imageFile?.name}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Chemistry Textbook 12th Edition"
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.name }))}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.category === cat.name
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{cat.icon}</span>
                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    required
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select condition</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your item, mention any special features or defects... (minimum 10 characters)"
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">{formData.description.length} / 10 minimum characters</p>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Availability */}
            {step === 2 && (
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/20 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Day *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <IndianRupee className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="pricePerDay"
                      required
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {suggestedPrice && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
                      <Tag className="w-4 h-4" />
                      <span>Suggested price: ₹{suggestedPrice}/day</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, pricePerDay: suggestedPrice.toString() }))}
                        className="underline hover:text-purple-700"
                      >
                        Use this
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available From *
                    </label>
                    <input
                      type="date"
                      name="availableFrom"
                      required
                      value={formData.availableFrom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Until *
                    </label>
                    <input
                      type="date"
                      name="availableTo"
                      required
                      value={formData.availableTo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Meeting Point *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      name="meetingPoint"
                      required
                      value={formData.meetingPoint}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                    >
                      <option value="">Select a popular campus spot</option>
                      {campusSpots.map((spot) => (
                        <option key={spot} value={spot}>{spot}</option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Choose a well-known location on campus for easy meetup</p>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/20 space-y-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Trust & Safety</h3>
                    <p className="text-sm text-blue-700">
                      Enable collateral to protect your item. The amount will be held during the borrowing period.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Require Collateral</h3>
                    <p className="text-sm text-gray-600">Recommended for high-value items</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="requiresCollateral"
                      checked={formData.requiresCollateral}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
                  </label>
                </div>

                {formData.requiresCollateral && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collateral Amount
                    </label>
                    <input
                      type="number"
                      name="collateralAmount"
                      value={formData.collateralAmount}
                      onChange={handleInputChange}
                      placeholder="Enter amount in ₹"
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                )}

                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">Platform Features</h3>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      QR code verification for safe handoff
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Automated payment processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Return reminders for borrowers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Trust score tracking
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Error Display */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Error Creating Item</h4>
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {step > 1 && step < 4 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !canProceedToStep2()) {
                      alert('Please fill in all required fields: Name (min 3 chars), Category, Condition, and Description (min 10 chars)');
                      return;
                    }
                    if (step === 2 && !canProceedToStep3()) {
                      alert('Please fill in all required fields: Price, Available From, Available Until, and Meeting Point');
                      return;
                    }
                    setStep(step + 1);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Package className="w-5 h-5" />
                  {isLoading ? 'Listing...' : 'List Item'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
