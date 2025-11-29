'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft,
  Upload,
  Camera,
  Tag,
  DollarSign,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Package
} from 'lucide-react';
import Link from 'next/link';

export default function CreateItem() {
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
    collateralAmount: ''
  });

  const [step, setStep] = useState(1);
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  const categories = [
    { name: 'Books & Textbooks', icon: '📚' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Furniture', icon: '🪑' },
    { name: 'Sports Equipment', icon: '⚽' },
    { name: 'Musical Instruments', icon: '🎸' },
    { name: 'Others', icon: '📦' }
  ];

  const conditions = ['Brand New', 'Like New', 'Good', 'Fair', 'Well-Used'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-suggest price based on category and condition
    if ((name === 'category' || name === 'condition') && formData.category && formData.condition) {
      calculateSuggestedPrice(formData.category, formData.condition);
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Would call API here
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
            <span className="text-sm font-medium text-emerald-600">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Pricing & Availability'}
              {step === 3 && 'Additional Details'}
              {step === 4 && 'Success!'}
            </span>
            <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 4 ? (
          /* Success Screen */
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Listed Successfully!</h2>
            <p className="text-gray-600 mb-6">Your item is now visible to other students on campus</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/dashboard/marketplace"
                className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
              >
                View Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select condition</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your item, mention any special features or defects..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Availability */}
            {step === 2 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Day *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="pricePerDay"
                      required
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  {suggestedPrice && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                      <Tag className="w-4 h-4" />
                      <span>Suggested price: ₹{suggestedPrice}/day</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, pricePerDay: suggestedPrice.toString() }))}
                        className="underline hover:text-emerald-700"
                      >
                        Use this
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available From
                    </label>
                    <input
                      type="date"
                      name="availableFrom"
                      value={formData.availableFrom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Until
                    </label>
                    <input
                      type="date"
                      name="availableTo"
                      value={formData.availableTo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Meeting Point
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="meetingPoint"
                      value={formData.meetingPoint}
                      onChange={handleInputChange}
                      placeholder="e.g., Library entrance, Cafeteria"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <h3 className="font-medium text-emerald-900 mb-2">Platform Features</h3>
                  <ul className="space-y-2 text-sm text-emerald-700">
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
                  onClick={() => setStep(step + 1)}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  List Item
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
