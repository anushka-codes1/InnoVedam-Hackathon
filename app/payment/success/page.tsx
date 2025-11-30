'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, Home, Package } from 'lucide-react';
import Link from 'next/link';

interface PaymentInfo {
  orderId: string;
  paymentMethod: string;
  amount: number;
  timestamp: string;
  itemName?: string;
}

export default function PaymentSuccess() {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    // Retrieve payment info from localStorage
    const storedPaymentInfo = localStorage.getItem('paymentInfo');
    if (storedPaymentInfo) {
      try {
        const parsedInfo = JSON.parse(storedPaymentInfo);
        setPaymentInfo(parsedInfo);
      } catch (error) {
        console.error('Error parsing payment info:', error);
        // Set default values if parsing fails
        setPaymentInfo({
          orderId: `ORD${Date.now().toString().slice(-8)}`,
          paymentMethod: 'UPI',
          amount: 189.75,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // Set default values if no stored info
      setPaymentInfo({
        orderId: `ORD${Date.now().toString().slice(-8)}`,
        paymentMethod: 'UPI',
        amount: 189.75,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  // Show loading state while payment info is being loaded
  if (!paymentInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been confirmed. You'll receive a confirmation email shortly.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Order ID</span>
            <span className="font-mono text-sm font-semibold text-gray-900">
              #{paymentInfo.orderId}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Payment Method</span>
            <span className="text-sm font-medium text-gray-900">{paymentInfo.paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount Paid</span>
            <span className="text-lg font-bold text-green-600">₹{paymentInfo.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <Link
            href="/dashboard/orders"
            className="w-full py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
