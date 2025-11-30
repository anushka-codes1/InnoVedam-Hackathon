'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import BackgroundAnimation from '../../components/BackgroundAnimation';
import RobotBeeAnimation from '../../components/RobotBeeAnimation';
import LogoOrbit from '@/components/LogoOrbit';
import RightSideAnimation from '@/components/RightSideAnimation';
import { loginUser, getRedirectPath, UserRole } from '../../lib/auth';
import { 
  ArrowRightLeft, 
  Mail, 
  Lock, 
  ArrowRight,
  BookOpen,
  Calculator,
  Cpu,
  Briefcase,
  Music,
  Camera,
  Zap,
  Laptop,
  Headphones,
  Bike,
  Coffee,
  Pizza,
  Backpack,
  Book,
  Users,
  ShoppingCart,
  TrendingUp,
  Heart,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  KeyRound
} from 'lucide-react';

const CampusSwapLogin = () => {
  const router = useRouter();
  const { setUserData } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Load saved credentials if Remember Me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Live activity feed data
  const activities = [
    { user: 'Aaryaa', item: 'Chemistry Textbook', icon: BookOpen },
    { user: 'Navneet', item: 'Graphing Calculator', icon: Calculator },
    { user: 'Aayush', item: 'MacBook Pro', icon: Cpu },
    { user: 'Jake', item: 'Designer Backpack', icon: Briefcase },
    { user: 'Lily', item: 'Guitar', icon: Music },
  ];

  // Rotate through activities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sample item cards for the masonry grid
  const itemCards = [
    { id: '1', title: 'MacBook Pro 14"', price: '₹500', color: 'from-purple-400 to-purple-600', icon: Laptop },
    { id: '3', title: 'Physics Textbook', price: '₹50', color: 'from-blue-400 to-blue-600', icon: BookOpen },
    { id: '2', title: 'DSLR Camera', price: '₹400', color: 'from-pink-400 to-pink-600', icon: Camera },
    { id: '4', title: 'Chemistry Notes', price: '₹30', color: 'from-cyan-400 to-cyan-600', icon: BookOpen },
    { id: '5', title: 'Gaming Headset', price: '₹90', color: 'from-red-400 to-red-600', icon: Headphones },
    { id: '6', title: 'Bicycle', price: '₹150', color: 'from-orange-400 to-orange-600', icon: Bike },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempted with:', email, password);
    
    // Check if user has a stored password
    const storedPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    if (storedPasswords[email] && storedPasswords[email] !== password) {
      alert('Incorrect password! Please try again or use "Forgot password".');
      return;
    }
    
    // Store the password for this user if not already stored
    if (!storedPasswords[email]) {
      storedPasswords[email] = password;
      localStorage.setItem('userPasswords', JSON.stringify(storedPasswords));
    }
    
    // Handle Remember Me functionality
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
    
    // Extract name from email (before @)
    const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ');
    const capitalizedName = nameFromEmail
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // All regular users get 'user' role (no admin access for consumers)
    const userRole: UserRole = 'user';
    
    // Create auth user object
    const authUser = {
      id: Date.now().toString(),
      email: email,
      name: capitalizedName || 'Guest User',
      role: userRole
    };
    
    // Login user and save to localStorage
    loginUser(authUser);
    
    // Store current user ID for premium tracking (use email as unique identifier)
    localStorage.setItem('currentUserId', email);
    
    // Load saved profile data or create default
    const allUserProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    const savedProfile = allUserProfiles[email];
    
    const userDataToSet = savedProfile || {
      fullName: capitalizedName || 'Guest User',
      email: email,
      phone: '+1 (555) 123-4567',
      address: 'Campus Housing',
      collegeName: 'Your University',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    
    // If no saved profile exists, save the default one
    if (!savedProfile) {
      allUserProfiles[email] = userDataToSet;
      localStorage.setItem('userProfiles', JSON.stringify(allUserProfiles));
    }
    
    // Save user data to context
    setUserData(userDataToSet);
    
    // Redirect based on user role
    const redirectPath = getRedirectPath(userRole);
    router.push(redirectPath);
  };

  const handlePasswordReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    // Get stored passwords or initialize
    const storedPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    
    // Update password for this email
    storedPasswords[resetEmail] = newPassword;
    localStorage.setItem('userPasswords', JSON.stringify(storedPasswords));
    
    // Update remembered password if it's the same email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail === resetEmail) {
      localStorage.setItem('rememberedPassword', newPassword);
    }
    
    // Show success
    setResetSuccess(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetSuccess(false);
      setResetEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setEmail(resetEmail);
    }, 2000);
  };

  const activity = activities[currentActivity];
  const ActivityIcon = activity.icon;

  return (
    <>
      {/* Interactive Background Animation */}
      <BackgroundAnimation />
      
      {/* Robot Bee Chase Animation */}
      <RobotBeeAnimation />
      
      <div className="min-h-screen flex flex-col lg:flex-row font-sans">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-md relative z-10">
          {/* Logo with Orbiting Animation */}
          <div className="mb-8 animate-fade-in flex justify-center lg:justify-start">
            <LogoOrbit />
          </div>

          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Campus. Your Needs.<br />Instantly Met.
            </h2>
            <p className="text-gray-600">
              Join thousands of students buying & selling on campus
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name2029@university.org.in"
                  pattern="[a-z]+\.[a-z]+[0-9]{4}@[a-z]+\.org\.in"
                  title="Email must be in format: your.name2029@university.org.in"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 
                           transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 
                           transition-all duration-200 hover:border-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-gray-600 group-hover:text-gray-900">Remember me</span>
              </label>
              <button 
                type="button"
                onClick={() => setShowForgotPassword(true)} 
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="group relative w-full bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 
                       text-white font-semibold py-4 rounded-xl 
                       hover:shadow-2xl hover:shadow-pink-500/50
                       active:scale-[0.98] hover:scale-105
                       transition-all duration-300
                       overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Trading
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-gray-600">
            New to CampusSwap?{' '}
            <Link href="/signup" className="text-purple-600 hover:text-pink-600 font-semibold">
              Create an account
            </Link>
          </p>

          {/* Trust Badges */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-pink-500 rounded-full" />
                <span>Verified Students</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Safe Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Grid */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2] 
                    relative overflow-hidden p-8 lg:p-16 min-h-[400px] lg:min-h-screen">
        
        {/* Floating Items Animation */}
        <RightSideAnimation />

        {/* Live Activity Ticker */}
        <div className="relative z-10 mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <p className="font-semibold">
                <span className="font-bold">{activity.user}</span> just swapped a {activity.item}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Cards */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {itemCards.map((item, index) => {
            const ItemIcon = item.icon;
            const gradientMap: { [key: string]: string } = {
              'from-purple-400 to-purple-600': 'from-blue-400/30 to-cyan-400/30',
              'from-blue-400 to-blue-600': 'from-purple-400/30 to-pink-400/30',
              'from-pink-400 to-pink-600': 'from-orange-400/30 to-red-400/30',
              'from-cyan-400 to-cyan-600': 'from-green-400/30 to-emerald-400/30',
              'from-red-400 to-red-600': 'from-yellow-400/30 to-orange-400/30',
              'from-orange-400 to-orange-600': 'from-pink-400/30 to-purple-400/30'
            };
            const newGradient = gradientMap[item.color] || 'from-blue-400/30 to-cyan-400/30';
            
            return (
              <Link
                key={index}
                href={`/item/${item.id}`}
                className={`
                  group relative bg-gradient-to-br ${newGradient} backdrop-blur-xl p-6
                  rounded-3xl shadow-xl border border-white/50
                  hover:scale-105 transition-transform duration-300 cursor-pointer block
                `}
              >
                {/* Card Content */}
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center">
                      <ItemIcon className="w-6 h-6 text-gray-800" />
                    </div>
                    <span className="text-2xl">✨</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    {item.title}
                  </h3>
                  
                  <p className="text-3xl font-black text-gray-900">{item.price}</p>
                  <p className="text-sm text-gray-600 mt-1">Available now</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Shiny Gradient Stat Bubbles */}
        <div className="relative z-10 mt-8 flex gap-4 justify-center flex-wrap">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <div>
                <p className="text-2xl font-black">5K+</p>
                <p className="text-xs font-medium opacity-90">Active Users</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <div>
                <p className="text-2xl font-black">12K+</p>
                <p className="text-xs font-medium opacity-90">Items Traded</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <div>
                <p className="text-2xl font-black">98%</p>
                <p className="text-xs font-medium opacity-90">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetSuccess(false);
                setResetEmail('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {!resetSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                  <p className="text-gray-600 text-sm">Enter your email and create a new password</p>
                </div>

                {/* Reset Form */}
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="your.name2029@university.org.in"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 
                                 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* New Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 
                                 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                                 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 
                                 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl 
                             font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Reset Password
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
                  <p className="text-gray-600">Your password has been successfully updated.</p>
                  <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CampusSwapLogin;
