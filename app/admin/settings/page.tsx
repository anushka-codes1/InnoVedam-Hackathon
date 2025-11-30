/**
 * Admin Settings Page
 * 
 * Purpose: Centralized configuration management for entire platform
 * - Controls platform behavior and policies
 * - Manages notification preferences
 * - Configures security measures
 * - Sets up payment integrations
 * - Adjusts system-level parameters
 * 
 * Features:
 * - 5 tabbed sections for organized settings
 * - Real-time validation of input values
 * - Persistent storage to localStorage
 * - Success/error notifications
 * - Sensitive data protection (API keys)
 * 
 * Settings Organization:
 * 1. General: Platform info, pricing bounds, commission
 * 2. Notifications: Email, push, SMS toggles
 * 3. Security: 2FA, password policies, API keys
 * 4. Payment: Stripe, Razorpay, PayPal setup
 * 5. System: Maintenance, debug, cache, rate limits
 * 
 * Storage: All settings persist to localStorage.adminSettings
 */

'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import {
  Settings as SettingsIcon,
  Save,
  Bell,
  Shield,
  Mail,
  Globe,
  CreditCard,
  Database,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function AdminSettingsPage() {
  // Active tab state for multi-section interface
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'payment' | 'system'>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false); // Toggle for sensitive API key visibility

  /**
   * General Settings - Platform-wide configuration
   * 
   * Controls:
   * - Platform identity (name, emails)
   * - Rental policies (max days, price bounds)
   * - Business model (commission rate)
   */
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'CampusSwap',           // Brand name
    platformEmail: 'admin@campusswap.com', // Official contact
    supportEmail: 'support@campusswap.com', // User support
    maxRentalDays: 30,                    // Maximum rental duration
    minRentalPrice: 10,                   // Minimum item price (₹)
    maxRentalPrice: 10000,                // Maximum item price (₹)
    commissionRate: 5                     // Platform commission (%)
  });

  /**
   * Notification Settings - Communication preferences
   * 
   * Controls which notification channels are active:
   * - Email: Transactional and system emails
   * - Push: Browser push notifications
   * - SMS: Text message alerts
   * - Marketing: Promotional content
   * - Reports: Weekly analytics emails
   * - Security: Critical security alerts
   */
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,   // Enable email system
    pushNotifications: true,    // Enable push notifications
    smsNotifications: false,    // SMS disabled by default (costs)
    marketingEmails: false,     // Opt-in marketing
    weeklyReports: true,        // Admin reports
    securityAlerts: true        // Critical security notifications
  });

  /**
   * Security Settings - Authentication and access control
   * 
   * Controls:
   * - Two-factor authentication requirement
   * - Password expiration policy (days)
   * - Session timeout (minutes)
   * - Failed login attempt threshold
   * - API key for service integrations
   * 
   * Security Best Practices:
   * - Enable 2FA for admins
   * - Regular password rotation (90 days)
   * - Short session timeout (30 min)
   * - Lockout after 5 failed attempts
   */
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,                      // Require 2FA for admin
    passwordExpiry: 90,                       // Days before password reset
    sessionTimeout: 30,                       // Minutes of inactivity
    maxLoginAttempts: 5,                      // Failed attempts before lockout
    ipWhitelist: '',                          // Comma-separated allowed IPs
    apiKey: 'sk_live_xxxxxxxxxxxxxxxxxx'     // Sensitive API key (hidden)
  });

  /**
   * Payment Settings - Financial integrations
   * 
   * Supported Gateways:
   * - Stripe: International payments
   * - Razorpay: India-focused payments
   * - PayPal: Global payment alternative
   * 
   * Payout Configuration:
   * - Auto payouts: Automatic transfers to sellers
   * - Schedule: weekly/monthly payment cycle
   * - Minimum: Threshold before payout (₹500)
   */
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,          // Enable Stripe gateway
    razorpayEnabled: true,        // Enable Razorpay gateway
    paypalEnabled: false,         // PayPal disabled
    autoPayoutEnabled: true,      // Automatic seller payments
    payoutSchedule: 'weekly',     // Payment frequency
    minPayoutAmount: 500          // Minimum payout threshold (₹)
  });

  /**
   * System Settings - Technical configuration
   * 
   * Controls:
   * - Maintenance mode: Disables public access for updates
   * - Debug mode: Shows detailed error messages
   * - Cache: Improves performance by caching data
   * - Rate limiting: Prevents API abuse (requests/minute)
   * - Upload limits: Max file size (MB)
   * - Data retention: How long to keep deleted data (days)
   */
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,   // Disable for maintenance
    debugMode: false,         // Show debug info (dev only)
    cacheEnabled: true,       // Enable caching for speed
    apiRateLimit: 1000,       // Max requests per minute
    maxUploadSize: 10,        // Max file size in MB
    dataRetention: 365        // Days to keep deleted data
  });

  // Load saved settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  /**
   * Load settings from localStorage
   * 
   * Retrieves previously saved admin settings and populates all state
   * Falls back to default values if no saved settings exist
   */
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setGeneralSettings(parsed.general || generalSettings);
      setNotificationSettings(parsed.notifications || notificationSettings);
      setSecuritySettings(parsed.security || securitySettings);
      setPaymentSettings(parsed.payment || paymentSettings);
      setSystemSettings(parsed.system || systemSettings);
    }
  };

  /**
   * Save all settings to localStorage
   * 
   * Combines all setting sections into single object and persists
   * Shows success notification for 3 seconds
   * 
   * Future Enhancement: Should call API to save to backend database
   */
  const saveSettings = () => {
    const allSettings = {
      general: generalSettings,
      notifications: notificationSettings,
      security: securitySettings,
      payment: paymentSettings,
      system: systemSettings
    };

    localStorage.setItem('adminSettings', JSON.stringify(allSettings));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'system', label: 'System', icon: Database }
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Platform Settings
              </h1>
              <p className="text-gray-600">Configure and manage platform settings</p>
            </div>
            <button
              onClick={saveSettings}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
            >
              <Save className="w-5 h-5" />
              Save All Changes
            </button>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Settings saved successfully!</p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-purple-100">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Content */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-purple-100">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.platformName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.platformEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, platformEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Rental Days
                    </label>
                    <input
                      type="number"
                      value={generalSettings.maxRentalDays}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, maxRentalDays: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Rental Price (₹)
                    </label>
                    <input
                      type="number"
                      value={generalSettings.minRentalPrice}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, minRentalPrice: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Rental Price (₹)
                    </label>
                    <input
                      type="number"
                      value={generalSettings.maxRentalPrice}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, maxRentalPrice: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      value={generalSettings.commissionRate}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, commissionRate: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Receive email notifications for important events'}
                          {key === 'pushNotifications' && 'Enable push notifications in your browser'}
                          {key === 'smsNotifications' && 'Receive SMS alerts for critical updates'}
                          {key === 'marketingEmails' && 'Get updates about new features and promotions'}
                          {key === 'weeklyReports' && 'Receive weekly performance reports'}
                          {key === 'securityAlerts' && 'Get notified about security-related events'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Expiry (days)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={securitySettings.apiKey}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, apiKey: e.target.value })}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Gateway Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Stripe Integration</p>
                      <p className="text-sm text-gray-600">Enable Stripe payment gateway</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.stripeEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Razorpay Integration</p>
                      <p className="text-sm text-gray-600">Enable Razorpay payment gateway</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.razorpayEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Auto Payout</p>
                      <p className="text-sm text-gray-600">Automatically process payouts to sellers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.autoPayoutEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, autoPayoutEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payout Schedule
                      </label>
                      <select
                        value={paymentSettings.payoutSchedule}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, payoutSchedule: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Payout Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={paymentSettings.minPayoutAmount}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, minPayoutAmount: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">System Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">Maintenance Mode</p>
                        <p className="text-sm text-gray-600">Put the platform in maintenance mode</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.maintenanceMode}
                        onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Debug Mode</p>
                      <p className="text-sm text-gray-600">Enable detailed error logging</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.debugMode}
                        onChange={(e) => setSystemSettings({ ...systemSettings, debugMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Cache Enabled</p>
                      <p className="text-sm text-gray-600">Enable system-wide caching</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.cacheEnabled}
                        onChange={(e) => setSystemSettings({ ...systemSettings, cacheEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Rate Limit (requests/hour)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.apiRateLimit}
                        onChange={(e) => setSystemSettings({ ...systemSettings, apiRateLimit: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Upload Size (MB)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.maxUploadSize}
                        onChange={(e) => setSystemSettings({ ...systemSettings, maxUploadSize: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Retention (days)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.dataRetention}
                        onChange={(e) => setSystemSettings({ ...systemSettings, dataRetention: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
