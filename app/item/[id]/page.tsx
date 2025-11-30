'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Shield, User, Package, Repeat, ShoppingCart, Send, X, MessageCircle, Bike, Zap, TrendingUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Lender {
  id: string;
  name: string;
  trustScore: number;
  distance: number;
  rating: number;
  totalLends: number;
  responseTime: string;
  avatar?: string;
}

interface ItemDetails {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  buyPrice: number;
  borrowPrice: number;
  swapFor: string[];
  condition: string;
  availability: string;
}

const mockItems: { [key: string]: ItemDetails } = {
  '1': {
    id: '1',
    name: 'Chemistry Textbook',
    category: 'Books',
    description: 'Comprehensive Chemistry textbook for undergraduate students. Covers all major topics including Organic, Inorganic, and Physical Chemistry. Includes practice problems and solutions.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80&fit=crop',
    buyPrice: 1200,
    borrowPrice: 45,
    swapFor: ['Physics Books', 'Math Textbooks', 'Engineering Books'],
    condition: 'Very Good',
    availability: 'Available Now'
  },
  '2': {
    id: '2',
    name: 'Wireless Headphones',
    category: 'Electronics',
    description: 'Premium wireless headphones with active noise cancellation. 30-hour battery life, comfortable over-ear design. Perfect for studying, music, and online classes.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&fit=crop',
    buyPrice: 5500,
    borrowPrice: 65,
    swapFor: ['Gaming Headset', 'Earbuds', 'Studio Headphones'],
    condition: 'Excellent',
    availability: 'Available Now'
  },
  '3': {
    id: '3',
    name: 'Physics Textbook Set',
    category: 'Books',
    description: 'Complete set of Physics textbooks for semester 3 & 4. Includes solved examples and practice problems.',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80&fit=crop',
    buyPrice: 2500,
    borrowPrice: 50,
    swapFor: ['Chemistry Books', 'Math Textbooks'],
    condition: 'Good',
    availability: 'Available Now'
  },
  '4': {
    id: '4',
    name: 'Chemistry 1st Year B. Tech Notes',
    category: 'Books',
    description: 'Complete Chemistry notes for 1st year B. Tech students. Covers all topics including Organic, Inorganic, and Physical Chemistry. Includes solved examples, important formulas, and exam tips.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80&fit=crop',
    buyPrice: 800,
    borrowPrice: 30,
    swapFor: ['Physics Notes', 'Math Notes', 'Engineering Notes'],
    condition: 'Very Good',
    availability: 'Available Now'
  },
  '5': {
    id: '5',
    name: 'Gaming Headset',
    category: 'Electronics',
    description: 'HyperX Cloud II Pro gaming headset with 7.1 surround sound. Noise-canceling microphone, comfortable memory foam ear cups.',
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80&fit=crop',
    buyPrice: 4500,
    borrowPrice: 90,
    swapFor: ['Wireless Headphones', 'Studio Headphones'],
    condition: 'Very Good',
    availability: 'Available Now'
  },
  '6': {
    id: '6',
    name: 'Bicycle',
    category: 'Sports',
    description: 'Mountain bike in great condition. 21-speed gear system, front suspension, suitable for campus commuting and weekend trails.',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80&fit=crop',
    buyPrice: 12000,
    borrowPrice: 150,
    swapFor: ['Electric Scooter', 'Skateboard'],
    condition: 'Good',
    availability: 'Available Now'
  },
  '7': {
    id: '7',
    name: 'Lab Coat',
    category: 'Others',
    description: 'Professional white lab coat, 100% cotton. Size L. Perfect for chemistry, biology, and physics lab sessions. Clean and well-maintained.',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80&fit=crop',
    buyPrice: 800,
    borrowPrice: 25,
    swapFor: ['Safety Goggles', 'Lab Equipment', 'Lab Gloves'],
    condition: 'Excellent',
    availability: 'Available Now'
  },
  '8': {
    id: '8',
    name: 'Engineering Drawing Tools',
    category: 'Others',
    description: 'Complete engineering drawing tool set including compass, divider, protractor, set squares, drawing pencils, and scale ruler. Essential for mechanical and civil engineering students.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80&fit=crop',
    buyPrice: 1500,
    borrowPrice: 35,
    swapFor: ['Drafting Board', 'Technical Drawing Book', 'CAD Software License'],
    condition: 'Very Good',
    availability: 'Available Now'
  },
  '9': {
    id: '9',
    name: 'Soldering Kit',
    category: 'Electronics',
    description: 'Professional soldering kit with temperature-controlled iron, solder wire, flux, desoldering pump, and helping hands. Perfect for electronics projects and circuit board repairs.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80&fit=crop',
    buyPrice: 2500,
    borrowPrice: 55,
    swapFor: ['Multimeter', 'Arduino Kit', 'Electronic Components Set'],
    condition: 'Excellent',
    availability: 'Available Now'
  },
  '10': {
    id: '10',
    name: 'Bluetooth Speakers',
    category: 'Electronics',
    description: 'Portable Bluetooth speakers with powerful bass and 12-hour battery life. IPX7 waterproof rating. Perfect for dorm parties, outdoor events, and study sessions.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80&fit=crop',
    buyPrice: 3500,
    borrowPrice: 75,
    swapFor: ['Soundbar', 'Wireless Headphones', 'Home Theater System'],
    condition: 'Excellent',
    availability: 'Available Now'
  }
};

const mockLenders: Lender[] = [
  {
    id: '1',
    name: 'Manya Agrawal',
    trustScore: 98,
    distance: 0.3,
    rating: 4.9,
    totalLends: 45,
    responseTime: '< 5 min'
  },
  {
    id: '2',
    name: 'Subhesh Kumar',
    trustScore: 95,
    distance: 0.5,
    rating: 4.8,
    totalLends: 38,
    responseTime: '< 5 min'
  },
  {
    id: '3',
    name: 'Rupesh Kumar',
    trustScore: 92,
    distance: 0.8,
    rating: 4.7,
    totalLends: 32,
    responseTime: '< 8 min'
  },
  {
    id: '4',
    name: 'Nishant Chahar',
    trustScore: 89,
    distance: 0.9,
    rating: 4.6,
    totalLends: 28,
    responseTime: '< 10 min'
  },
  {
    id: '5',
    name: 'Prasanna Swain',
    trustScore: 87,
    distance: 1.0,
    rating: 4.5,
    totalLends: 25,
    responseTime: '< 10 min'
  },
  {
    id: '6',
    name: 'Nitish Kumar',
    trustScore: 85,
    distance: 0.7,
    rating: 4.4,
    totalLends: 22,
    responseTime: '< 7 min'
  }
];

// Campus Delivery Volunteers / "Buddy Couriers"
const campusCouriers = [
  {
    id: 'c1',
    name: 'Rahul Sharma',
    rating: 4.9,
    totalDeliveries: 147,
    distance: 0.3,
    fee: 15,
    available: true,
    responseTime: '< 5 min',
    avatar: '🚴'
  },
  {
    id: 'c2',
    name: 'Priya Patel',
    rating: 4.8,
    totalDeliveries: 98,
    distance: 0.5,
    fee: 20,
    available: true,
    responseTime: '< 8 min',
    avatar: '🛴'
  },
  {
    id: 'c3',
    name: 'Arjun Singh',
    rating: 4.7,
    totalDeliveries: 76,
    distance: 0.4,
    fee: 18,
    available: true,
    responseTime: '< 6 min',
    avatar: '🚲'
  },
  {
    id: 'c4',
    name: 'Sneha Gupta',
    rating: 4.9,
    totalDeliveries: 134,
    distance: 0.6,
    fee: 22,
    available: false,
    responseTime: '< 10 min',
    avatar: '🛵'
  }
];

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  const [selectedOption, setSelectedOption] = useState<'borrow' | 'swap' | 'buy'>('borrow');
  const [showChat, setShowChat] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'online' | 'cod' | null>(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'self-pickup' | 'campus-courier' | 'priority-delivery' | null>('self-pickup');
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [rentalDuration, setRentalDuration] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [autoReminders, setAutoReminders] = useState(true);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' | 'lender' }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const item = mockItems[itemId] || mockItems['1'];
  const sortedLenders = [...mockLenders].sort((a, b) => b.trustScore - a.trustScore);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const userEmail = localStorage.getItem('userEmail');
      const authUser = localStorage.getItem('authUser');
      
      if (!userEmail && !authUser) {
        // User is not logged in, redirect to login
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Check premium status
  useEffect(() => {
    const checkPremiumStatus = () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const subscriptions = JSON.parse(localStorage.getItem('premiumSubscriptions') || '{}');
          const userSubscription = subscriptions[userEmail];
          
          if (userSubscription && userSubscription.active) {
            const expiryDate = new Date(userSubscription.expiryDate);
            const now = new Date();
            setIsPremium(expiryDate > now);
          } else {
            setIsPremium(false);
          }
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      }
    };
    
    checkPremiumStatus();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset priority delivery if user is not premium
  useEffect(() => {
    if (selectedDeliveryMethod === 'priority-delivery' && !isPremium) {
      setSelectedDeliveryMethod('self-pickup');
    }
  }, [isPremium, selectedDeliveryMethod]);

  // Calculate dates based on rental duration
  useEffect(() => {
    if (selectedOption === 'borrow' && rentalDuration > 0) {
      const today = new Date();
      const start = new Date(today);
      start.setDate(start.getDate() + 1); // Start from tomorrow
      const end = new Date(start);
      end.setDate(end.getDate() + rentalDuration);
      
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [rentalDuration, selectedOption]);

  // Setup automatic reminders
  useEffect(() => {
    if (paymentCompleted && autoReminders && endDate) {
      const returnDate = new Date(endDate);
      const today = new Date();
      const daysUntilReturn = Math.ceil((returnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Store rental info in localStorage for reminder system
      const rentals = JSON.parse(localStorage.getItem('activeRentals') || '[]');
      const newRental = {
        id: Date.now(),
        itemName: item.name,
        lenderName: selectedLender?.name,
        startDate,
        endDate,
        daysRemaining: daysUntilReturn,
        remindersEnabled: true,
        status: 'active'
      };
      rentals.push(newRental);
      localStorage.setItem('activeRentals', JSON.stringify(rentals));
    }
  }, [paymentCompleted, autoReminders, endDate]);

  const handleBack = () => {
    router.back();
  };

  const handleLenderClick = (lender: Lender) => {
    setSelectedLender(lender);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    // Validate: Non-premium users cannot use priority delivery
    if (selectedDeliveryMethod === 'priority-delivery' && !isPremium) {
      alert('⚠️ Priority Delivery is a Premium feature. Please upgrade to Premium or select another delivery option.');
      return;
    }

    // Calculate total amount with delivery fees
    let totalAmount = selectedOption === 'borrow' 
      ? (item.borrowPrice * rentalDuration) + 60 
      : selectedOption === 'buy' 
      ? item.buyPrice + 10 
      : 10;
    
    if (selectedDeliveryMethod === 'campus-courier' && selectedCourier) {
      totalAmount += campusCouriers.find(c => c.id === selectedCourier)?.fee || 0;
    }
    
    if (selectedDeliveryMethod === 'priority-delivery') {
      totalAmount += 50;
    }

    // If online payment is selected, navigate to checkout page
    if (selectedPaymentMethod === 'online') {
      // Store order details in localStorage for checkout page
      const orderDetails = {
        itemId: item.id,
        itemName: item.name,
        itemPrice: selectedOption === 'borrow' ? item.borrowPrice * rentalDuration : item.buyPrice,
        duration: rentalDuration,
        durationUnit: selectedOption === 'borrow' ? 'days' : 'one-time',
        platformFee: selectedOption === 'borrow' ? Math.round(item.borrowPrice * rentalDuration * 0.10) : Math.round(item.buyPrice * 0.05),
        gst: selectedOption === 'borrow' ? Math.round(item.borrowPrice * rentalDuration * 0.15) : Math.round(item.buyPrice * 0.18),
        totalAmount: selectedOption === 'borrow' 
          ? Math.round(item.borrowPrice * rentalDuration * 1.25)
          : Math.round(item.buyPrice * 1.23),
        itemImage: '📦',
        itemCategory: item.category,
        lenderName: selectedLender?.name || 'Unknown',
        transactionType: selectedOption,
        startDate,
        endDate,
        autoReminders
      };
      
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      router.push('/checkout');
      return;
    }

    // For COD, create order and navigate to confirmation page
    if (selectedPaymentMethod === 'cod') {
      const orderId = `COD-${Date.now()}`;
      const orderDate = new Date().toISOString();
      
      const codOrderDetails = {
        orderId,
        orderDate,
        itemId: item.id,
        itemName: item.name,
        itemImage: '📦',
        itemCategory: item.category,
        itemPrice: selectedOption === 'borrow' ? item.borrowPrice : item.buyPrice,
        duration: rentalDuration,
        totalAmount,
        lenderName: selectedLender?.name || 'Unknown',
        transactionType: selectedOption,
        paymentMethod: 'Cash on Delivery',
        deliveryMethod: selectedDeliveryMethod,
        courierName: selectedCourier ? campusCouriers.find(c => c.id === selectedCourier)?.name : null,
        startDate,
        endDate,
        autoReminders,
        status: 'Pending'
      };

      // Save to localStorage for confirmation page
      localStorage.setItem('codOrderDetails', JSON.stringify(codOrderDetails));

      // Also save to orders history
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      existingOrders.push(codOrderDetails);
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));

      // Navigate to confirmation page
      router.push('/order/confirmation');
      return;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = { text: inputMessage, sender: 'user' as const };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate lender typing
    setIsTyping(true);
    
    // Simulate lender response after a delay
    setTimeout(() => {
      const lenderResponse = {
        text: `Thanks for reaching out! I'll get back to you about "${inputMessage}" shortly.`,
        sender: 'lender' as const
      };
      setMessages(prev => [...prev, lenderResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2]">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Item Details */}
          <div className="space-y-6">
            {/* Item Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x600/6366f1/ffffff?text=' + encodeURIComponent(item.name);
                }}
              />
            </div>

            {/* Item Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {item.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-3">{item.name}</h1>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {item.condition}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {item.availability}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed">{item.description}</p>

              {selectedOption === 'swap' && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Swap Options:</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.swapFor.map((swapItem, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-purple-200"
                      >
                        {swapItem}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Transaction Type</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Borrow Option */}
                <button
                  onClick={() => setSelectedOption('borrow')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedOption === 'borrow'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Repeat className={`w-8 h-8 mx-auto mb-2 ${
                    selectedOption === 'borrow' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">Borrow</p>
                    <p className="text-sm text-gray-600 mt-1">₹{item.borrowPrice}/day</p>
                  </div>
                </button>

                {/* Swap Option */}
                <button
                  onClick={() => setSelectedOption('swap')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedOption === 'swap'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Repeat className={`w-8 h-8 mx-auto mb-2 ${
                    selectedOption === 'swap' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">Swap</p>
                    <p className="text-sm text-gray-600 mt-1">Exchange items</p>
                  </div>
                </button>

                {/* Buy Option */}
                <button
                  onClick={() => setSelectedOption('buy')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedOption === 'buy'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ShoppingCart className={`w-8 h-8 mx-auto mb-2 ${
                    selectedOption === 'buy' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">Buy</p>
                    <p className="text-sm text-gray-600 mt-1">₹{item.buyPrice}</p>
                  </div>
                </button>
              </div>

              {/* Price Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {selectedOption === 'borrow' && 'Daily Rental Price'}
                    {selectedOption === 'swap' && 'Exchange Value'}
                    {selectedOption === 'buy' && 'Purchase Price'}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {selectedOption === 'borrow' && `₹${item.borrowPrice}`}
                    {selectedOption === 'swap' && 'Negotiable'}
                    {selectedOption === 'buy' && `₹${item.buyPrice}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Lenders List */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Available Lenders Nearby
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Sorted by trust score • {sortedLenders.length} lenders found
              </p>

              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {sortedLenders.map((lender, index) => (
                  <div
                    key={lender.id}
                    onClick={() => handleLenderClick(lender)}
                    className="group border border-gray-200 rounded-xl p-4 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                          {lender.name.charAt(0)}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                            👑
                          </div>
                        )}
                      </div>

                      {/* Lender Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {lender.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">
                              {lender.distance} km
                            </span>
                          </div>
                        </div>

                        {/* Trust Score - Prominent Display */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Shield className={`w-4 h-4 ${getTrustScoreColor(lender.trustScore)}`} />
                            <span className="text-sm font-semibold text-gray-700">
                              Trust Score:
                            </span>
                            <span className={`text-sm font-bold ${getTrustScoreColor(lender.trustScore)}`}>
                              {lender.trustScore}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {lender.rating}
                          </span>
                          <span>{lender.totalLends} successful lends</span>
                          <span className="text-green-600">⚡ {lender.responseTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLender(lender);
                          setShowChat(true);
                          setMessages([
                            {
                              text: `Hi! I'm interested in your ${item.name}. Can we discuss the details?`,
                              sender: 'user'
                            },
                            {
                              text: `Hello! Sure, I'd be happy to discuss. What would you like to know about the ${item.name}?`,
                              sender: 'lender'
                            }
                          ]);
                        }}
                        className="bg-blue-50 border border-blue-200 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact
                      </button>
                      <button 
                        onClick={() => handleLenderClick(lender)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        {selectedOption === 'borrow' && 'Borrow'}
                        {selectedOption === 'swap' && 'Swap'}
                        {selectedOption === 'buy' && 'Buy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-gray-700">
                Lenders with higher trust scores are more reliable. Choose lenders closer to you for faster delivery and lower service fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedLender && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Payment Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Complete Payment</h2>
                  <p className="text-purple-100 text-sm">Secure transaction with {selectedLender.name}</p>
                </div>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Item Summary */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{selectedOption}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-green-100 px-2 py-1 rounded-md">
                        <p className="text-xs font-semibold text-green-700">
                          Trust: {selectedLender.trustScore}/100
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lender Info */}
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedLender.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{selectedLender.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedLender.distance} away</span>
                    <span className="text-yellow-600">★ {selectedLender.rating}</span>
                  </div>
                </div>
              </div>

              {/* Rental Duration Selector - Only for Borrow */}
              {selectedOption === 'borrow' && (
                <div className="border border-purple-200 rounded-xl p-4 bg-purple-50 space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">📅 Rental Duration</h3>
                    <div className="flex items-center gap-2 text-xs text-purple-600">
                      <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                      Time-Bound Rental
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Number of Days</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setRentalDuration(Math.max(1, rentalDuration - 1))}
                        className="w-10 h-10 bg-white border-2 border-purple-300 rounded-lg font-bold text-purple-600 hover:bg-purple-100 transition-colors"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center">
                        <div className="text-3xl font-bold text-purple-600">{rentalDuration}</div>
                        <div className="text-xs text-gray-600">day{rentalDuration > 1 ? 's' : ''}</div>
                      </div>
                      <button
                        onClick={() => setRentalDuration(rentalDuration + 1)}
                        className="w-10 h-10 bg-white border-2 border-purple-300 rounded-lg font-bold text-purple-600 hover:bg-purple-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {startDate && endDate && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <p className="text-xs text-gray-500 mb-1">Start Date</p>
                        <p className="text-sm font-bold text-gray-900">{new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <p className="text-xs text-gray-500 mb-1">Return By</p>
                        <p className="text-sm font-bold text-purple-600">{new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  )}

                  {/* Auto-Reminders Toggle */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔔</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Auto-Reminders</p>
                        <p className="text-xs text-gray-500">Get notified before return date</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoReminders}
                        onChange={(e) => setAutoReminders(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
                    </label>
                  </div>

                  {autoReminders && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                      <p className="font-semibold mb-1">📬 Reminder Schedule:</p>
                      <ul className="space-y-1 ml-4">
                        <li>• 2 days before return date</li>
                        <li>• 1 day before return date</li>
                        <li>• On return date (morning)</li>
                        <li>• Overdue alerts if not returned</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-gray-900 mb-3">Price Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {selectedOption === 'borrow' ? `Rental Price (${rentalDuration} day${rentalDuration > 1 ? 's' : ''})` : selectedOption === 'buy' ? 'Item Price' : 'Swap Value'}
                    </span>
                    <span className="font-semibold">
                      ₹{selectedOption === 'borrow' ? item.borrowPrice * rentalDuration : selectedOption === 'buy' ? item.buyPrice : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-semibold">₹10</span>
                  </div>
                  {selectedOption === 'borrow' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Security Deposit (refundable)</span>
                      <span className="font-semibold">₹50</span>
                    </div>
                  )}
                  {selectedDeliveryMethod === 'campus-courier' && selectedCourier && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Campus Courier Fee</span>
                      <span className="font-semibold text-blue-600">
                        ₹{campusCouriers.find(c => c.id === selectedCourier)?.fee || 0}
                      </span>
                    </div>
                  )}
                  {selectedDeliveryMethod === 'priority-delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Priority Delivery by Lender</span>
                      <span className="font-semibold text-purple-600">₹50</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">Total Amount</span>
                      <span className="font-bold text-purple-600 text-lg">
                        ₹{(() => {
                          let baseAmount = selectedOption === 'borrow' 
                            ? (item.borrowPrice * rentalDuration) + 60 
                            : selectedOption === 'buy' 
                            ? item.buyPrice + 10 
                            : 10;
                          
                          if (selectedDeliveryMethod === 'campus-courier' && selectedCourier) {
                            baseAmount += campusCouriers.find(c => c.id === selectedCourier)?.fee || 0;
                          }
                          
                          if (selectedDeliveryMethod === 'priority-delivery') {
                            baseAmount += 50;
                          }
                          
                          return baseAmount;
                        })()}
                      </span>
                    </div>
                    {selectedOption === 'borrow' && (
                      <p className="text-xs text-gray-500 mt-2">
                        💰 Late return penalty: ₹{Math.round(item.borrowPrice * 1.5)}/day after {new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900">Select Payment Method</h3>
                
                {/* Online Payment */}
                <div
                  onClick={() => setSelectedPaymentMethod('online')}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'online'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'online' ? 'border-purple-600' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'online' && (
                          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Online Payment</p>
                        <p className="text-xs text-gray-500">UPI, Cards, Net Banking</p>
                      </div>
                    </div>
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setSelectedPaymentMethod('cod')}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'cod'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'cod' ? 'border-purple-600' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'cod' && (
                          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when you receive</p>
                      </div>
                    </div>
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Delivery Options
                </h3>
                
                {/* Self Pickup */}
                <div
                  onClick={() => setSelectedDeliveryMethod('self-pickup')}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedDeliveryMethod === 'self-pickup'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedDeliveryMethod === 'self-pickup' ? 'border-purple-600' : 'border-gray-300'
                      }`}>
                        {selectedDeliveryMethod === 'self-pickup' && (
                          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Self Pickup</p>
                        <p className="text-xs text-gray-500">Collect from lender's location</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <span className="text-sm font-bold">FREE</span>
                    </div>
                  </div>
                </div>

                {/* Campus Courier */}
                <div
                  onClick={() => setSelectedDeliveryMethod('campus-courier')}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedDeliveryMethod === 'campus-courier'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedDeliveryMethod === 'campus-courier' ? 'border-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedDeliveryMethod === 'campus-courier' && (
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                          <Bike className="w-4 h-4 text-blue-600" />
                          Campus Courier
                          <span className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-0.5 rounded-full font-bold">NEW</span>
                        </p>
                        <p className="text-xs text-gray-500">Student volunteers deliver to your dorm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <span className="text-sm font-bold">₹15-25</span>
                    </div>
                  </div>
                  
                  {selectedDeliveryMethod === 'campus-courier' && (
                    <div className="space-y-2 border-t border-blue-200 pt-3 mt-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Select Your Buddy Courier:</p>
                      {campusCouriers.filter(c => c.available).map((courier) => (
                        <div
                          key={courier.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourier(courier.id);
                          }}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedCourier === courier.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{courier.avatar}</span>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{courier.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    {courier.rating}
                                  </span>
                                  <span>•</span>
                                  <span>{courier.totalDeliveries} deliveries</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {courier.distance} km
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-blue-600">₹{courier.fee}</p>
                              <p className="text-xs text-gray-500">{courier.responseTime}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                        <p className="text-xs text-blue-700">
                          <span className="font-semibold">🎓 Earn with Campus Courier!</span> Join as a volunteer and earn ₹10-30 per delivery.{' '}
                          <a href="#" className="underline font-semibold">Sign up</a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Priority Delivery */}
                <div
                  onClick={() => {
                    if (isPremium) {
                      setSelectedDeliveryMethod('priority-delivery');
                    }
                  }}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    !isPremium 
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                      : selectedDeliveryMethod === 'priority-delivery'
                        ? 'border-purple-600 bg-purple-50 cursor-pointer'
                        : 'border-gray-200 hover:border-purple-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedDeliveryMethod === 'priority-delivery' ? 'border-purple-600' : 'border-gray-300'
                      }`}>
                        {selectedDeliveryMethod === 'priority-delivery' && (
                          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          Priority Delivery
                          <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-bold">PREMIUM</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {isPremium 
                            ? 'Lender delivers directly to you within 1 hour'
                            : '🔒 Upgrade to Premium to unlock 1-hour priority delivery'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-purple-600">
                      <span className="text-sm font-bold">₹50</span>
                    </div>
                  </div>
                  {selectedDeliveryMethod === 'priority-delivery' && isPremium && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mt-3">
                      <p className="text-xs text-purple-700">
                        <span className="font-semibold">⚡ Lightning Fast!</span> {selectedLender?.name || 'The lender'} will deliver the item directly to your location within 1 hour.
                      </p>
                    </div>
                  )}
                  {!isPremium && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mt-3">
                      <p className="text-xs text-orange-700">
                        <span className="font-semibold">✨ Premium Feature</span> Upgrade to Premium for instant 1-hour delivery access. <button onClick={() => router.push('/dashboard/premium')} className="underline font-semibold">Upgrade Now</button>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-800">Secure Transaction</p>
                  <p className="text-xs text-green-700 mt-1">
                    Your payment is protected. Security deposit will be refunded after item return.
                  </p>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handlePaymentComplete}
                disabled={
                  !selectedPaymentMethod || 
                  (selectedDeliveryMethod === 'campus-courier' && !selectedCourier) ||
                  (selectedDeliveryMethod === 'priority-delivery' && !isPremium)
                }
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedPaymentMethod === 'online' ? 'Proceed to Payment' : 'Confirm Cash on Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Box Modal */}
      {showChat && selectedLender && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {selectedLender.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {selectedLender.name}
                  </h3>
                  <p className="text-xs text-white/80">Chat with Lender • {selectedLender.distance} km away</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChat(false);
                  setMessages([]);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item Context Bar */}
            <div className="bg-purple-50 p-3 border-b border-purple-100">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-600">
                    {selectedOption === 'borrow' && `₹${item.borrowPrice}/day rental`}
                    {selectedOption === 'buy' && `₹${item.buyPrice} purchase`}
                    {selectedOption === 'swap' && 'Swap Exchange'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Trust Score</p>
                  <p className="font-bold text-green-600">{selectedLender.trustScore}</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {message.sender === 'lender' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        {selectedLender?.name.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      {selectedLender?.name.charAt(0)}
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white shadow-sm border border-gray-200">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to the lender..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💬 Chat directly with {selectedLender.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
