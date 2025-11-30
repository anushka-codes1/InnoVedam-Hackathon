'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Package,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: number;
  type: 'reminder' | 'overdue' | 'returned' | 'borrowed' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  itemName?: string;
  priority: 'high' | 'medium' | 'low';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'reminders'>('all');

  useEffect(() => {
    // Load notifications from localStorage
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const rentals = JSON.parse(localStorage.getItem('activeRentals') || '[]');
    const today = new Date();
    
    const generatedNotifications: Notification[] = [];

    // Generate notifications from active rentals
    rentals.forEach((rental: any) => {
      const returnDate = new Date(rental.endDate);
      const daysRemaining = Math.ceil((returnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining < 0) {
        // Overdue notification
        generatedNotifications.push({
          id: rental.id * 10 + 1,
          type: 'overdue',
          title: '⚠️ Overdue Item!',
          message: `${rental.itemName} was due ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) > 1 ? 's' : ''} ago. Please return to ${rental.lenderName} immediately.`,
          timestamp: returnDate.toISOString(),
          read: false,
          itemName: rental.itemName,
          priority: 'high'
        });
      } else if (daysRemaining === 0) {
        // Due today
        generatedNotifications.push({
          id: rental.id * 10 + 2,
          type: 'reminder',
          title: '📅 Due Today!',
          message: `${rental.itemName} must be returned to ${rental.lenderName} today.`,
          timestamp: today.toISOString(),
          read: false,
          itemName: rental.itemName,
          priority: 'high'
        });
      } else if (daysRemaining === 1) {
        // Due tomorrow
        generatedNotifications.push({
          id: rental.id * 10 + 3,
          type: 'reminder',
          title: '🔔 Due Tomorrow',
          message: `${rental.itemName} is due tomorrow. Plan to return it to ${rental.lenderName}.`,
          timestamp: today.toISOString(),
          read: false,
          itemName: rental.itemName,
          priority: 'medium'
        });
      } else if (daysRemaining === 2) {
        // Due in 2 days
        generatedNotifications.push({
          id: rental.id * 10 + 4,
          type: 'reminder',
          title: '📢 Reminder',
          message: `${rental.itemName} is due in 2 days. Return date: ${new Date(rental.endDate).toLocaleDateString('en-IN')}.`,
          timestamp: today.toISOString(),
          read: false,
          itemName: rental.itemName,
          priority: 'low'
        });
      }
    });

    // Sort by priority and timestamp
    generatedNotifications.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setNotifications(generatedNotifications);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'reminders') return notif.type === 'reminder' || notif.type === 'overdue';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string, priority: string) => {
    if (type === 'overdue') return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (type === 'reminder') return <Clock className="w-5 h-5 text-yellow-600" />;
    if (type === 'returned') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (type === 'borrowed') return <Package className="w-5 h-5 text-blue-600" />;
    return <Bell className="w-5 h-5 text-purple-600" />;
  };

  const getNotificationBg = (type: string, priority: string, read: boolean) => {
    if (read) return 'bg-gray-50 border-gray-200';
    if (type === 'overdue') return 'bg-red-50 border-red-300';
    if (priority === 'high') return 'bg-yellow-50 border-yellow-300';
    return 'bg-purple-50 border-purple-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2] pb-20">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-600">{unreadCount} unread</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm font-medium text-purple-600 hover:text-pink-600 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white/70 backdrop-blur-xl rounded-xl p-2 shadow-sm border border-white/20">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('reminders')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'reminders'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Reminders
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 text-center shadow-sm border border-white/20">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white/70 backdrop-blur-xl rounded-xl p-4 border-2 ${getNotificationBg(
                  notification.type,
                  notification.priority,
                  notification.read
                )} hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'overdue' ? 'bg-red-100' :
                    notification.type === 'reminder' ? 'bg-yellow-100' :
                    notification.type === 'returned' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-bold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className={`text-sm mb-2 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleDateString('en-IN', {
                           day: 'numeric',
                           month: 'short',
                           hour: '2-digit',
                           minute: '2-digit'
                         })}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs font-medium text-purple-600 hover:text-pink-600 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
