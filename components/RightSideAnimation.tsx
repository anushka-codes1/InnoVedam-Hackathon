"use client";

import React from 'react';
import { BookOpen, Camera, Bike, Smartphone, Shirt, Coffee, ArrowRightLeft } from 'lucide-react';

const RightSideAnimation = () => {
  // Configuration for the floating items
  const items = [
    { Icon: BookOpen, left: '10%', delay: '0s', duration: '15s', size: 24 },
    { Icon: ArrowRightLeft, left: '25%', delay: '5s', duration: '18s', size: 20 },
    { Icon: Camera, left: '40%', delay: '2s', duration: '20s', size: 28 },
    { Icon: Smartphone, left: '60%', delay: '8s', duration: '16s', size: 22 },
    { Icon: Shirt, left: '75%', delay: '3s', duration: '19s', size: 26 },
    { Icon: Bike, left: '85%', delay: '10s', duration: '22s', size: 30 },
    { Icon: Coffee, left: '50%', delay: '12s', duration: '17s', size: 20 },
    { Icon: ArrowRightLeft, left: '15%', delay: '15s', duration: '20s', size: 18 },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      
      {/* --- Animated Pastel Blob Layers --- */}
      {/* These blobs gently float and pulse, matching the pastel theme */}
      
      {/* Blob 1: Peach/Orange - Top Left */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob-1"></div>
      
      {/* Blob 2: Pink - Top Right */}
      <div className="absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] bg-pink-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob-2"></div>
      
      {/* Blob 3: Purple - Bottom Center */}
      <div className="absolute bottom-[-15%] left-[30%] w-[40vw] h-[40vw] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob-3"></div>
      
      {/* Blob 4: Lavender - Middle Right */}
      <div className="absolute top-[40%] right-[-10%] w-[35vw] h-[35vw] bg-violet-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob-4"></div>

      {/* --- Additional Gradient Mesh Overlay --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 rounded-full blur-[100px] mix-blend-overlay animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-300 opacity-10 rounded-full blur-[80px] mix-blend-multiply"></div>

      {/* --- Floating Icons --- */}
      {items.map((item, index) => (
        <div
          key={index}
          className="absolute bottom-[-50px] animate-float-up opacity-0"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {/* Icons are white/pink outlines, very subtle */}
          <item.Icon 
            size={item.size} 
            className="text-white mix-blend-overlay opacity-40 drop-shadow-sm" 
            strokeWidth={1.5}
          />
        </div>
      ))}

      {/* --- CSS Animations --- */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3; /* Fade in */
          }
          50% {
            transform: translateY(-400px) rotate(10deg) translateX(10px);
            opacity: 0.3;
          }
          90% {
            opacity: 0.1; /* Fade out before top */
          }
          100% {
            transform: translateY(-800px) rotate(-10deg) translateX(-10px);
            opacity: 0;
          }
        }

        .animate-float-up {
          animation-name: float-up;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        /* Blob Animations - Slow, organic movement */
        @keyframes blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob-1 {
          animation: blob-1 20s ease-in-out infinite;
        }

        @keyframes blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(0.95); }
          66% { transform: translate(20px, -20px) scale(1.05); }
        }
        .animate-blob-2 {
          animation: blob-2 25s ease-in-out infinite;
          animation-delay: -5s;
        }

        @keyframes blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 20px) scale(1.08); }
          66% { transform: translate(-30px, -30px) scale(0.92); }
        }
        .animate-blob-3 {
          animation: blob-3 22s ease-in-out infinite;
          animation-delay: -10s;
        }

        @keyframes blob-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, -40px) scale(1.05); }
          66% { transform: translate(35px, 25px) scale(0.95); }
        }
        .animate-blob-4 {
          animation: blob-4 28s ease-in-out infinite;
          animation-delay: -15s;
        }
      `}</style>
    </div>
  );
};

export default RightSideAnimation;
