'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  QrCode,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info,
  Lock,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

// Types
interface OrderData {
  itemId: string;
  itemName: string;
  itemPrice: number;
  duration: number;
  durationUnit: string;
  platformFee: number;
  gst: number;
  totalAmount: number;
  itemImage?: string;
  itemCategory?: string;
  lenderName?: string;
}

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

interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  securityToken?: string;
  redirectUrl?: string;
  qrCodeUrl?: string;
  error?: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  // Get order data from localStorage
  const [orderData, setOrderData] = useState<OrderData>({
    itemId: '123',
    itemName: 'MacBook Pro 2021',
    itemPrice: 150,
    duration: 24,
    durationUnit: 'hours',
    platformFee: 15,
    gst: 24.75,
    totalAmount: 189.75,
    itemImage: '💻',
    itemCategory: 'Electronics',
    lenderName: 'Sarah M.'
  });

  // Load order details from localStorage on mount
  useEffect(() => {
    const storedOrder = localStorage.getItem('orderDetails');
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder);
        setOrderData({
          itemId: parsedOrder.itemId || '123',
          itemName: parsedOrder.itemName || 'Item',
          itemPrice: parsedOrder.itemPrice || 0,
          duration: parsedOrder.duration || 1,
          durationUnit: parsedOrder.durationUnit || 'days',
          platformFee: parsedOrder.platformFee || 0,
          gst: parsedOrder.gst || 0,
          totalAmount: parsedOrder.totalAmount || 0,
          itemImage: parsedOrder.itemImage || '📦',
          itemCategory: parsedOrder.itemCategory || 'Others',
          lenderName: parsedOrder.lenderName || 'Unknown'
        });
      } catch (error) {
        console.error('Error parsing order details:', error);
      }
    }
  }, []);

  // State management
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [error, setError] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<PaymentMethod>(null);

  // Banks list for Net Banking
  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'IDBI Bank'
  ];

  // Wallet options
  const wallets = [
    'Paytm',
    'PhonePe',
    'Amazon Pay',
    'Mobikwik',
    'Freecharge'
  ];

  // Handle payment method selection
  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setExpandedSection(method);
    setError('');
    setPaymentDetails({});
  };

  // Handle input changes
  const handleInputChange = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate payment details
  const validatePaymentDetails = (): boolean => {
    setError('');

    if (!selectedMethod) {
      setError('Please select a payment method');
      return false;
    }

    switch (selectedMethod) {
      case 'upi':
        if (!paymentDetails.upiId || !/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId)) {
          setError('Please enter a valid UPI ID (e.g., username@upi)');
          return false;
        }
        break;

      case 'card':
        if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
          setError('Please enter a valid 16-digit card number');
          return false;
        }
        if (!paymentDetails.cardExpiry || !/^\d{2}\/\d{2}$/.test(paymentDetails.cardExpiry)) {
          setError('Please enter card expiry in MM/YY format');
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

  // Initiate payment
  const initiatePayment = async (method: PaymentMethod, details: PaymentDetails) => {
    try {
      setIsProcessing(true);
      setError('');

      // Call backend API to create order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderData.itemId,
          amount: orderData.totalAmount,
          paymentMethod: method,
          paymentDetails: details,
          itemDetails: {
            itemId: orderData.itemId,
            itemName: orderData.itemName,
            duration: orderData.duration
          }
        })
      });

      const data: PaymentResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      // Store payment info in localStorage
      const paymentInfo = {
        orderId: `ORD${Date.now().toString().slice(-8)}`,
        paymentMethod: method === 'upi' ? 'UPI' : 
                      method === 'card' ? 'Card' :
                      method === 'netbanking' ? 'Net Banking' :
                      method === 'wallet' ? details.walletType || 'Wallet' : 'Unknown',
        amount: orderData.totalAmount,
        timestamp: new Date().toISOString(),
        itemName: orderData.itemName,
        paymentId: data.paymentId
      };
      localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
      localStorage.setItem('paymentId', data.paymentId || '');
      localStorage.setItem('securityToken', data.securityToken || '');

      // Store order in orders list
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const newOrder = {
        ...paymentInfo,
        status: 'completed',
        itemImage: orderData.itemImage,
        lenderName: orderData.lenderName,
        duration: orderData.duration
      };
      existingOrders.push(newOrder);
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));

      // Handle different payment method redirects
      if (method === 'upi' && data.qrCodeUrl) {
        // Show QR code for UPI
        setShowQrModal(true);
      } else {
        // For all other methods, simulate payment and navigate to success
        setTimeout(() => {
          setIsProcessing(false);
          router.push('/payment/success');
        }, 1500);
      }

    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  // Handle payment submission
  const handlePayment = async () => {
    if (!validatePaymentDetails()) {
      return;
    }

    await initiatePayment(selectedMethod, paymentDetails);
  };

  // Handle QR scan click
  const handleScanQr = () => {
    setShowQrModal(true);
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/marketplace"
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-sm text-gray-600">Complete your payment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Payment Methods */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-white/50">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Select Payment Method</h2>
                <p className="text-sm text-gray-600 mt-1">Choose how you want to pay</p>
              </div>

              <div className="p-6 space-y-4">
                {/* UPI Payment */}
                <div
                  className={`border-2 rounded-xl transition-all cursor-pointer ${
                    selectedMethod === 'upi'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div
                    className="p-4 flex items-center justify-between"
                    onClick={() => handleMethodSelect('upi')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedMethod === 'upi' ? 'bg-purple-600' : 'bg-gray-100'
                      }`}>
                        <Smartphone className={`w-5 h-5 ${
                          selectedMethod === 'upi' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">UPI</h3>
                        <p className="text-xs text-gray-600">GPay, PhonePe, Paytm & more</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'upi'
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === 'upi' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  {expandedSection === 'upi' && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter UPI ID
                        </label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          value={paymentDetails.upiId || ''}
                          onChange={(e) => handleInputChange('upiId', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="text-sm text-gray-500">OR</div>
                      </div>
                      <button
                        type="button"
                        onClick={handleScanQr}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-5 h-5" />
                        Scan QR Code
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Payment */}
                <div
                  className={`border-2 rounded-xl transition-all cursor-pointer ${
                    selectedMethod === 'card'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div
                    className="p-4 flex items-center justify-between"
                    onClick={() => handleMethodSelect('card')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedMethod === 'card' ? 'bg-purple-600' : 'bg-gray-100'
                      }`}>
                        <CreditCard className={`w-5 h-5 ${
                          selectedMethod === 'card' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Debit / Credit Card</h3>
                        <p className="text-xs text-gray-600">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'card'
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === 'card' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  {expandedSection === 'card' && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          value={paymentDetails.cardNumber || ''}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            handleInputChange('cardNumber', formatted);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="JOHN DOE"
                          value={paymentDetails.cardName || ''}
                          onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            placeholder="12/25"
                            maxLength={5}
                            value={paymentDetails.cardExpiry || ''}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              handleInputChange('cardExpiry', value);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            value={paymentDetails.cardCvv || ''}
                            onChange={(e) => handleInputChange('cardCvv', e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div
                  className={`border-2 rounded-xl transition-all cursor-pointer ${
                    selectedMethod === 'netbanking'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div
                    className="p-4 flex items-center justify-between"
                    onClick={() => handleMethodSelect('netbanking')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedMethod === 'netbanking' ? 'bg-purple-600' : 'bg-gray-100'
                      }`}>
                        <Building2 className={`w-5 h-5 ${
                          selectedMethod === 'netbanking' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Net Banking</h3>
                        <p className="text-xs text-gray-600">All Indian banks</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'netbanking'
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === 'netbanking' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  {expandedSection === 'netbanking' && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Your Bank
                        </label>
                        <div className="relative">
                          <select
                            value={paymentDetails.bankName || ''}
                            onChange={(e) => handleInputChange('bankName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                          >
                            <option value="">Choose a bank</option>
                            {banks.map((bank) => (
                              <option key={bank} value={bank}>
                                {bank}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wallet */}
                <div
                  className={`border-2 rounded-xl transition-all cursor-pointer ${
                    selectedMethod === 'wallet'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div
                    className="p-4 flex items-center justify-between"
                    onClick={() => handleMethodSelect('wallet')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedMethod === 'wallet' ? 'bg-purple-600' : 'bg-gray-100'
                      }`}>
                        <Wallet className={`w-5 h-5 ${
                          selectedMethod === 'wallet' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Wallets</h3>
                        <p className="text-xs text-gray-600">Paytm, PhonePe, Amazon Pay</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'wallet'
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === 'wallet' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  {expandedSection === 'wallet' && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Wallet
                        </label>
                        <div className="relative">
                          <select
                            value={paymentDetails.walletType || ''}
                            onChange={(e) => handleInputChange('walletType', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                          >
                            <option value="">Choose a wallet</option>
                            {wallets.map((wallet) => (
                              <option key={wallet} value={wallet}>
                                {wallet}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-white/50 sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Item Details */}
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{orderData.itemImage}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{orderData.itemName}</h3>
                    <p className="text-sm text-gray-600">{orderData.itemCategory}</p>
                    <p className="text-xs text-gray-500 mt-1">by {orderData.lenderName}</p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between py-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium text-gray-900">
                    {orderData.duration} {orderData.durationUnit}
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 py-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Item Price</span>
                    <span className="text-sm font-medium text-gray-900">₹{orderData.itemPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Platform Fee</span>
                    <span className="text-sm font-medium text-gray-900">₹{orderData.platformFee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">GST (15%)</span>
                    <span className="text-sm font-medium text-gray-900">₹{orderData.gst}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-3 border-t-2 border-gray-300">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-purple-600">₹{orderData.totalAmount}</span>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={!selectedMethod || isProcessing}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    !selectedMethod || isProcessing
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay ₹{orderData.totalAmount}
                    </>
                  )}
                </button>

                {/* Info */}
                <div className="flex items-start gap-2 pt-4">
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500">
                    By proceeding, you agree to our Terms & Conditions and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code</h3>
              <p className="text-gray-600 mb-6">
                Open any UPI app on your phone and scan the QR code to complete payment
              </p>

              {/* Real QR Code */}
              <div className="bg-white rounded-xl p-8 mb-6 border-4 border-gray-200">
                <div className="mx-auto" style={{ width: '256px', height: '256px' }}>
                  <QRCodeSVG
                    value={`upi://pay?pa=${paymentDetails.upiId || 'merchant@upi'}&pn=CampusSwap&am=${orderData.totalAmount}&cu=INR&tn=Payment for ${orderData.itemName}`}
                    size={256}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-purple-900 mb-2">Amount to Pay</p>
                <p className="text-3xl font-bold text-purple-600">₹{orderData.totalAmount}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowQrModal(false);
                    // Store payment details in localStorage
                    const paymentInfo = {
                      orderId: `ORD${Date.now().toString().slice(-8)}`,
                      paymentMethod: 'UPI',
                      amount: orderData.totalAmount,
                      timestamp: new Date().toISOString(),
                      itemName: orderData.itemName
                    };
                    localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
                    
                    // Simulate payment completion
                    setIsProcessing(true);
                    setTimeout(() => {
                      router.push('/payment/success');
                    }, 2000);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  I've Completed Payment
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
