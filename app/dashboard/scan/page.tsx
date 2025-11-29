'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  QrCode,
  Scan,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function QRScanner() {
  const [scanMode, setScanMode] = useState<'handoff' | 'return' | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | 'invalid' | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  // Mock scan function - in production would use actual QR scanner
  const handleScan = () => {
    setScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      setScanning(false);
      
      // Mock successful scan
      const mockSuccess = Math.random() > 0.2;
      
      if (mockSuccess) {
        setScanResult('success');
        setTransactionDetails({
          item: 'Chemistry Textbook',
          owner: 'Sarah Martinez',
          borrower: 'John Doe',
          amount: 45,
          date: new Date().toLocaleDateString(),
          transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        });
      } else {
        setScanResult('invalid');
      }
    }, 2000);
  };

  const resetScanner = () => {
    setScanMode(null);
    setScanning(false);
    setScanResult(null);
    setTransactionDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Code Verification</h1>
              <p className="text-sm text-gray-600">Secure handoff and return verification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!scanMode ? (
          /* Mode Selection */
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">How QR Verification Works</h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Both parties must be present during handoff/return</li>
                    <li>• Scan the QR code shown by the other party</li>
                    <li>• Payment is processed automatically after verification</li>
                    <li>• Trust scores are updated for both users</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setScanMode('handoff')}
                className="bg-white rounded-xl p-8 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all text-left"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <QrCode className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Handoff Verification</h2>
                <p className="text-gray-600 mb-4">
                  Scan QR code to confirm item handoff to borrower
                </p>
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <Scan className="w-5 h-5" />
                  Start Scanning
                </div>
              </button>

              <button
                onClick={() => setScanMode('return')}
                className="bg-white rounded-xl p-8 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all text-left"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Return Verification</h2>
                <p className="text-gray-600 mb-4">
                  Scan QR code to confirm item return from borrower
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <Scan className="w-5 h-5" />
                  Start Scanning
                </div>
              </button>
            </div>
          </div>
        ) : scanResult ? (
          /* Scan Result */
          <div className="space-y-6">
            {scanResult === 'success' ? (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {scanMode === 'handoff' ? 'Handoff Verified!' : 'Return Verified!'}
                  </h2>
                  <p className="text-gray-600">
                    Transaction has been successfully recorded
                  </p>
                </div>

                {transactionDetails && (
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Transaction Details</h3>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Item</span>
                      <span className="font-medium text-gray-900">{transactionDetails.item}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Owner</span>
                      <span className="font-medium text-gray-900">{transactionDetails.owner}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Borrower</span>
                      <span className="font-medium text-gray-900">{transactionDetails.borrower}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium text-emerald-600">₹{transactionDetails.amount}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium text-gray-900">{transactionDetails.date}</span>
                    </div>
                    
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-sm text-gray-900">{transactionDetails.transactionId}</span>
                    </div>
                  </div>
                )}

                {scanMode === 'handoff' && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Payment Authorized</p>
                        <p>₹{transactionDetails?.amount} has been pre-authorized. Amount will be captured upon return verification.</p>
                      </div>
                    </div>
                  </div>
                )}

                {scanMode === 'return' && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="text-sm text-green-700">
                        <p className="font-medium mb-1">Payment Processed</p>
                        <p>₹{transactionDetails?.amount} has been transferred to the owner's account.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  <Link
                    href="/dashboard"
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-center"
                  >
                    Back to Dashboard
                  </Link>
                  <button
                    onClick={resetScanner}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Scan Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid QR Code</h2>
                  <p className="text-gray-600">
                    The QR code could not be verified. Please try again.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium mb-2">Common Issues:</p>
                      <ul className="space-y-1">
                        <li>• QR code has expired (valid for 24 hours)</li>
                        <li>• Poor camera focus or lighting</li>
                        <li>• Wrong verification type selected</li>
                        <li>• Transaction already completed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetScanner}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setScanResult(null);
                      setScanning(false);
                    }}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Scanning State */
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {scanMode === 'handoff' ? 'Scanning for Handoff' : 'Scanning for Return'}
              </h2>
              <p className="text-gray-600 mb-8">
                Position the QR code within the frame
              </p>

              <div className="relative w-full max-w-md mx-auto mb-8">
                {/* Scanner Frame */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {scanning ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-1 bg-emerald-500 animate-pulse"></div>
                      <div className="absolute w-16 h-16">
                        <RefreshCw className="w-16 h-16 text-emerald-600 animate-spin" />
                      </div>
                    </div>
                  ) : (
                    <Camera className="w-24 h-24 text-gray-400" />
                  )}
                  
                  {/* Corner Brackets */}
                  <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
                </div>
              </div>

              {!scanning && (
                <button
                  onClick={handleScan}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 mx-auto mb-4"
                >
                  <Scan className="w-5 h-5" />
                  Start Scanning
                </button>
              )}

              {scanning && (
                <p className="text-emerald-600 font-medium animate-pulse">
                  Scanning in progress...
                </p>
              )}

              <button
                onClick={resetScanner}
                className="text-gray-600 hover:text-gray-900 font-medium mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
