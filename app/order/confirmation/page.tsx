'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, MapPin, Calendar, User, ArrowRight, Home } from 'lucide-react';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get order details from localStorage
    const details = localStorage.getItem('codOrderDetails');
    if (details) {
      setOrderDetails(JSON.parse(details));
    } else {
      // If no order details, redirect to marketplace
      router.push('/dashboard/marketplace');
    }
  }, [router]);

  const handleViewOrders = () => {
    router.push('/dashboard/orders');
  };

  const handleBackToMarketplace = () => {
    router.push('/dashboard/marketplace');
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Your Cash on Delivery order has been placed successfully
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-lg font-bold text-gray-900">{orderDetails.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(orderDetails.orderDate).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-3xl">
                {orderDetails.itemImage}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{orderDetails.itemName}</h3>
                <p className="text-sm text-gray-600">{orderDetails.itemCategory}</p>
                <p className="text-sm font-semibold text-purple-600 mt-1">
                  {orderDetails.transactionType === 'borrow' ? `₹${orderDetails.itemPrice}/day for ${orderDetails.duration} days` : `₹${orderDetails.itemPrice}`}
                </p>
              </div>
            </div>
          </div>

          {/* Lender & Delivery Info */}
          <div className="space-y-3 bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500">Lender</p>
                <p className="font-semibold text-gray-900">{orderDetails.lenderName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500">Delivery Method</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {orderDetails.deliveryMethod === 'self-pickup' && 'Self Pickup'}
                  {orderDetails.deliveryMethod === 'campus-courier' && `Campus Courier (${orderDetails.courierName})`}
                  {orderDetails.deliveryMethod === 'priority-delivery' && 'Priority Delivery by Lender'}
                </p>
              </div>
            </div>

            {orderDetails.transactionType === 'borrow' && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Rental Period</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(orderDetails.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(orderDetails.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Cash on Delivery</span>
              </div>
              <span className="text-2xl font-bold text-green-600">₹{orderDetails.totalAmount}</span>
            </div>
            <p className="text-sm text-green-700">
              💵 Please keep exact change ready. Pay when you receive the item.
            </p>
            {orderDetails.transactionType === 'borrow' && (
              <p className="text-xs text-gray-600 mt-2">
                Includes ₹50 refundable security deposit
              </p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span className="text-xl">📋</span>
            What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>The lender has been notified and will contact you shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Coordinate pickup/delivery details through the chat</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Inspect the item before making payment</span>
            </li>
            {orderDetails.transactionType === 'borrow' && (
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Return the item by {new Date(orderDetails.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} to get your security deposit back</span>
              </li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleViewOrders}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Package className="w-5 h-5" />
            View Orders
          </button>
          <button
            onClick={handleBackToMarketplace}
            className="flex items-center justify-center gap-2 bg-white border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all"
          >
            <Home className="w-5 h-5" />
            Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}
