"use client";

import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, Wallet, Lock, CheckCircle, Loader2 } from 'lucide-react';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | null;

interface PaymentDetails {
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
  bankName?: string;
  walletType?: string;
}

interface PremiumPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'monthly' | 'yearly';
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
}

export default function PremiumPaymentModal({
  isOpen,
  onClose,
  planType,
  amount,
  onPaymentSuccess
}: PremiumPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState<PaymentMethod>(null);

  if (!isOpen) return null;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setExpandedSection(method);
    setPaymentDetails({});
    setError('');
  };

  const handleInputChange = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePaymentDetails = (): boolean => {
    setError('');

    if (!selectedMethod) {
      setError('Please select a payment method');
      return false;
    }

    switch (selectedMethod) {
      case 'upi':
        if (!paymentDetails.upiId || !/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId)) {
          setError('Please enter a valid UPI ID');
          return false;
        }
        break;

      case 'card':
        if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
          setError('Please enter a valid 16-digit card number');
          return false;
        }
        if (!paymentDetails.cardExpiry || !/^\d{2}\/\d{2}$/.test(paymentDetails.cardExpiry)) {
          setError('Please enter expiry in MM/YY format');
          return false;
        }
        if (!paymentDetails.cardCvv || paymentDetails.cardCvv.length < 3) {
          setError('Please enter a valid CVV');
          return false;
        }
        if (!paymentDetails.cardName || paymentDetails.cardName.trim().length < 3) {
          setError('Please enter cardholder name');
          return false;
        }
        break;

      case 'netbanking':
        if (!paymentDetails.bankName) {
          setError('Please select a bank');
          return false;
        }
        break;

      case 'wallet':
        if (!paymentDetails.walletType) {
          setError('Please select a wallet');
          return false;
        }
        break;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validatePaymentDetails()) return;

    setIsProcessing(true);
    setError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentId = `PMT${Date.now().toString().slice(-10)}`;
      
      // Store payment info
      const paymentInfo = {
        paymentId,
        type: 'premium_subscription',
        planType,
        amount,
        paymentMethod: selectedMethod,
        timestamp: new Date().toISOString(),
        status: 'success'
      };
      
      const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
      existingPayments.push(paymentInfo);
      localStorage.setItem('payments', JSON.stringify(existingPayments));

      onPaymentSuccess(paymentId);
    } catch (err) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-sm text-gray-600 mt-1">
              {planType === 'monthly' ? 'Monthly' : 'Yearly'} Premium Subscription
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Amount Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Subscription Amount</span>
              <span className="text-3xl font-bold text-purple-600">₹{amount}</span>
            </div>
            <div className="text-sm text-gray-600">
              {planType === 'yearly' && (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  You're saving ₹400 with yearly plan!
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Select Payment Method</h3>

            {/* UPI */}
            <div className={`border-2 rounded-xl overflow-hidden transition-all ${
              selectedMethod === 'upi' ? 'border-purple-500 shadow-lg' : 'border-gray-200'
            }`}>
              <button
                onClick={() => handleMethodSelect('upi')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">UPI</div>
                    <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</div>
                  </div>
                </div>
                {selectedMethod === 'upi' && (
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                )}
              </button>

              {expandedSection === 'upi' && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g., user@upi)"
                    value={paymentDetails.upiId || ''}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Card */}
            <div className={`border-2 rounded-xl overflow-hidden transition-all ${
              selectedMethod === 'card' ? 'border-purple-500 shadow-lg' : 'border-gray-200'
            }`}>
              <button
                onClick={() => handleMethodSelect('card')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, RuPay</div>
                  </div>
                </div>
                {selectedMethod === 'card' && (
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                )}
              </button>

              {expandedSection === 'card' && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={paymentDetails.cardNumber || ''}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={paymentDetails.cardName || ''}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.cardExpiry || ''}
                      onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                      maxLength={5}
                      className="px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={paymentDetails.cardCvv || ''}
                      onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                      maxLength={3}
                      className="px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Net Banking */}
            <div className={`border-2 rounded-xl overflow-hidden transition-all ${
              selectedMethod === 'netbanking' ? 'border-purple-500 shadow-lg' : 'border-gray-200'
            }`}>
              <button
                onClick={() => handleMethodSelect('netbanking')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Net Banking</div>
                    <div className="text-sm text-gray-600">All major banks</div>
                  </div>
                </div>
                {selectedMethod === 'netbanking' && (
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                )}
              </button>

              {expandedSection === 'netbanking' && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <select
                    value={paymentDetails.bankName || ''}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Your Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Wallet */}
            <div className={`border-2 rounded-xl overflow-hidden transition-all ${
              selectedMethod === 'wallet' ? 'border-purple-500 shadow-lg' : 'border-gray-200'
            }`}>
              <button
                onClick={() => handleMethodSelect('wallet')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Wallets</div>
                    <div className="text-sm text-gray-600">Paytm, PhonePe, Amazon Pay</div>
                  </div>
                </div>
                {selectedMethod === 'wallet' && (
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                )}
              </button>

              {expandedSection === 'wallet' && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <select
                    value={paymentDetails.walletType || ''}
                    onChange={(e) => handleInputChange('walletType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Wallet</option>
                    <option value="Paytm">Paytm</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                    <option value="Mobikwik">Mobikwik</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Security Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Lock className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || !selectedMethod}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              isProcessing || !selectedMethod
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl hover:scale-[1.02]'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </div>
            ) : (
              `Pay ₹${amount}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
