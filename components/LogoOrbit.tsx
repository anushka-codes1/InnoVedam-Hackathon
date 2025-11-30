"use client";

import React from 'react';
import { ArrowRightLeft, Send, CircleDollarSign, Sparkles } from 'lucide-react';
import '@/styles/logo-orbit.css';

const LogoOrbit = () => {
  return (
    <div className="relative inline-flex items-center justify-center p-8 scale-110">
      
      {/* --- 1. THE TRACK (SVG Background) --- */}
      {/* Visual representation of the orbit path */}
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="halo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0" />
             <stop offset="50%" stopColor="#d8b4fe" stopOpacity="0.6" />
             <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* The Path: Wide Oval Loop */}
        <path 
          d="M 0,30 Q 130,-15 260,30 Q 130,75 0,30 Z"
          fill="none" 
          stroke="url(#halo-gradient)" 
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-50"
        />
      </svg>

      {/* --- 2. ORBITING OBJECTS (CSS Motion Path) --- */}
      
      {/* Orbiter 1: Paper Plane (Faces direction of travel) */}
      <div className="absolute top-0 left-0 animate-orbit-plane" style={{ zIndex: 10 }}>
         <div className="transform rotate-90 text-purple-600 bg-white p-1.5 rounded-full shadow-sm border border-purple-100">
            <Send size={14} fill="currentColor" />
         </div>
      </div>

      {/* Orbiter 2: Coin (Stays upright, Delayed) */}
      <div className="absolute top-0 left-0 animate-orbit-coin" style={{ zIndex: 10 }}>
         <div className="bg-white rounded-full p-[2px] shadow-sm border border-pink-100">
            <CircleDollarSign size={16} className="text-pink-500 fill-pink-50" />
         </div>
      </div>

      {/* --- 3. CENTER LOGO SYSTEM --- */}
      <div className="relative z-20 flex items-center gap-4">
        
        {/* Icon Container with Hover Spin */}
        <div className="relative group cursor-pointer">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-purple-400/30 rounded-xl blur-md group-hover:bg-purple-400/50 transition-all duration-500"></div>
          
          {/* Icon Box */}
          <div className="relative w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <ArrowRightLeft 
              size={24} 
              className="text-purple-600 group-hover:rotate-180 transition-transform duration-700 ease-in-out" 
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Brand Text */}
        <div className="flex flex-col relative">
          <h1 className="text-4xl font-black tracking-tight flex gap-0.5">
            <span className="bg-gradient-to-br from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Campus
            </span>
            <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              Swap
            </span>
          </h1>
          {/* Floating Sparkle Decor */}
          <Sparkles size={18} className="absolute -top-3 -right-6 text-yellow-400 animate-pulse" />
        </div>

      </div>
    </div>
  );
};

export default LogoOrbit;
