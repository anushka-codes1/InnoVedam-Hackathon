'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Zap
} from 'lucide-react';

const CampusSwapLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentActivity, setCurrentActivity] = useState(0);

  // Live activity feed data
  const activities = [
    { user: 'Sarah', item: 'Chemistry Textbook', icon: BookOpen },
    { user: 'Mike', item: 'Graphing Calculator', icon: Calculator },
    { user: 'Emma', item: 'MacBook Pro', icon: Cpu },
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
    { title: 'Chemistry Textbook', price: '$45', color: 'from-blue-400 to-blue-600', icon: BookOpen },
    { title: 'TI-84 Calculator', price: '$65', color: 'from-purple-400 to-purple-600', icon: Calculator },
    { title: 'Mini Fridge', price: '$80', color: 'from-pink-400 to-pink-600', icon: Zap },
    { title: 'MacBook Adapter', price: '$35', color: 'from-green-400 to-green-600', icon: Cpu },
    { title: 'Camera Lens', price: '$120', color: 'from-yellow-400 to-yellow-600', icon: Camera },
    { title: 'Study Desk', price: '$55', color: 'from-indigo-400 to-indigo-600', icon: Briefcase },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempted with:', email, password);
    // Simulate login and redirect to dashboard
    router.push('/dashboard');
  };

  const activity = activities[currentActivity];
  const ActivityIcon = activity.icon;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Inter',sans-serif]">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="relative">
              <ArrowRightLeft className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              CampusSwap
            </h1>
          </div>

          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Turn your stuff<br />into cash 💸
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
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@university.edu"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 
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
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 
                           transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-gray-600 group-hover:text-gray-900">Remember me</span>
              </label>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Forgot password?
              </a>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="group relative w-full bg-gradient-to-r from-emerald-600 to-teal-600 
                       text-white font-semibold py-4 rounded-xl 
                       hover:shadow-2xl hover:shadow-emerald-500/50
                       active:scale-[0.98]
                       transition-all duration-300
                       overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Trading
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-gray-600">
            New to CampusSwap?{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Create an account
            </a>
          </p>

          {/* Trust Badges */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Verified Students</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Safe Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Grid */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 
                    relative overflow-hidden p-8 lg:p-16 min-h-[400px] lg:min-h-screen">
        {/* Animated Background Blobs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* Live Activity Ticker */}
        <div className="relative z-10 mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 
                        bg-white/20 backdrop-blur-md rounded-full 
                        border border-white/30 shadow-lg">
            <div className="relative">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </div>
            <ActivityIcon className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium animate-slide-in">
              <span className="font-bold">{activity.user}</span> just swapped a {activity.item}
            </span>
          </div>
        </div>

        {/* Masonry Grid of Item Cards */}
        <div className="relative z-10 grid grid-cols-2 gap-4 lg:gap-6">
          {itemCards.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={index}
                className={`
                  group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6
                  border border-white/20 shadow-xl
                  hover:bg-white/20 hover:scale-105 hover:shadow-2xl
                  transition-all duration-300 cursor-pointer
                  ${index % 3 === 0 ? 'lg:translate-y-8' : ''}
                  ${index % 3 === 2 ? 'lg:translate-y-16' : ''}
                  animate-fade-in-up
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 
                              group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300`} />
                
                {/* Card Content */}
                <div className="relative">
                  <div className={`inline-flex p-3 bg-gradient-to-br ${item.color} 
                                rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <ItemIcon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg mb-2 leading-tight">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {item.price}
                    </span>
                    <span className="text-white/70 text-sm">
                      Available now
                    </span>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Stats */}
        <div className="relative z-10 mt-8 grid grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-1">5K+</div>
            <div className="text-white/80 text-xs">Active Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-1">12K+</div>
            <div className="text-white/80 text-xs">Items Traded</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-1">98%</div>
            <div className="text-white/80 text-xs">Satisfaction</div>
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
  );
};

export default CampusSwapLogin;
