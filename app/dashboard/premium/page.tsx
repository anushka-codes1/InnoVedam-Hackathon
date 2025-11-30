"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Check, 
  Crown,
  Sparkles,
  Zap,
  Shield,
  Star,
  TrendingUp,
  Package,
  Calendar,
  MessageCircle,
  BarChart3,
  Gift,
  Scale
} from 'lucide-react';
import { 
  PREMIUM_FEATURES, 
  PREMIUM_PRICING, 
  getPremiumStatus, 
  activatePremium,
  PremiumFeature 
} from '@/lib/premium';
import PremiumPaymentModal from '@/components/PremiumPaymentModal';
import AIChatbotWrapper from '@/components/AIChatbotWrapper';

export default function PremiumPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isPremium, setIsPremium] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const subscription = getPremiumStatus();
    setIsPremium(subscription?.isPremium || false);
  }, []);

  const handleSubscribe = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    const userId = localStorage.getItem('currentUserId') || 'user-123';
    activatePremium(userId, selectedPlan);
    setIsPremium(true);
    setShowPaymentModal(false);
    setShowConfetti(true);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const getCategoryIcon = (category: PremiumFeature['category']) => {
    switch (category) {
      case 'delivery': return <Zap className="w-5 h-5" />;
      case 'listing': return <Package className="w-5 h-5" />;
      case 'trust': return <Shield className="w-5 h-5" />;
      case 'support': return <MessageCircle className="w-5 h-5" />;
      case 'analytics': return <BarChart3 className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const groupedFeatures = PREMIUM_FEATURES.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, PremiumFeature[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            {isPremium && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-semibold">
                <Crown className="w-4 h-4" />
                Active Premium
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Upgrade Your Experience</span>
          </div>
          
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
              CampusSwap Premium
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock exclusive features, save money, and get priority access to everything on campus
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div 
            onClick={() => setSelectedPlan('monthly')}
            className={`relative cursor-pointer rounded-2xl p-8 transition-all ${
              selectedPlan === 'monthly' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl scale-105' 
                : 'bg-white/70 backdrop-blur-xl border-2 border-gray-200 hover:border-purple-300'
            }`}
          >
            {selectedPlan === 'monthly' && (
              <div className="absolute top-4 right-4">
                <Check className="w-6 h-6" />
              </div>
            )}
            
            <div className="text-sm font-semibold mb-2 opacity-80">Monthly Plan</div>
            <div className="text-4xl font-black mb-4">
              ₹{PREMIUM_PRICING.MONTHLY}
              <span className="text-lg font-normal opacity-80">/month</span>
            </div>
            <div className="text-sm opacity-80 mb-6">
              Save {PREMIUM_PRICING.MONTHLY_SAVINGS}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>All premium features</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Instant activation</span>
              </div>
            </div>
          </div>

          {/* Yearly Plan */}
          <div 
            onClick={() => setSelectedPlan('yearly')}
            className={`relative cursor-pointer rounded-2xl p-8 transition-all ${
              selectedPlan === 'yearly' 
                ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500 text-white shadow-2xl scale-105' 
                : 'bg-white/70 backdrop-blur-xl border-2 border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
              SAVE ₹400
            </div>
            
            {selectedPlan === 'yearly' && (
              <div className="absolute top-4 right-4">
                <Check className="w-6 h-6" />
              </div>
            )}
            
            <div className="text-sm font-semibold mb-2 opacity-80">Yearly Plan</div>
            <div className="text-4xl font-black mb-4">
              ₹{PREMIUM_PRICING.YEARLY}
              <span className="text-lg font-normal opacity-80">/year</span>
            </div>
            <div className="text-sm opacity-80 mb-6">
              Save {PREMIUM_PRICING.YEARLY_SAVINGS} • Best value!
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>All premium features</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>2 months free</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Priority support forever</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        {!isPremium && (
          <div className="text-center mb-12">
            <button
              onClick={handleSubscribe}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
                Subscribe to {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Plan
                <Sparkles className="w-6 h-6" />
              </div>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Cancel anytime • No hidden fees • Instant activation
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            What You Get with Premium
          </h2>

          {Object.entries(groupedFeatures).map(([category, features]) => (
            <div key={category} className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                  {getCategoryIcon(category as PremiumFeature['category'])}
                </div>
                <h3 className="text-xl font-bold capitalize">{category} Features</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.id} className="flex gap-4 p-4 rounded-xl hover:bg-purple-50/50 transition-colors">
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{feature.name}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-2xl font-bold mb-1">1 Hour</div>
            <div className="text-sm opacity-90">Priority delivery guaranteed</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500 to-yellow-500 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-2xl font-bold mb-1">₹0</div>
            <div className="text-sm opacity-90">Transaction fees (save ₹3/rental)</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-purple-500 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-2xl font-bold mb-1">Advanced</div>
            <div className="text-sm opacity-90">Analytics & insights dashboard</div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PremiumPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planType={selectedPlan}
        amount={selectedPlan === 'monthly' ? PREMIUM_PRICING.MONTHLY : PREMIUM_PRICING.YEARLY}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* AI Chatbot Floating Button */}
      <AIChatbotWrapper />
    </div>
  );
}
