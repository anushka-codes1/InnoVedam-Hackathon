import React from 'react';
import { Bot, ArrowRightLeft } from 'lucide-react';
import '../styles/robot-bee-animation.css';

const RobotBeeAnimation = () => {
  return (
    <div className="absolute top-8 left-8 z-50 pointer-events-none">
      {/* Container Sizing: w-64 (256px) x h-24 (96px) 
         This is sized to roughly hover around/over the text "CampusSwap" 
      */}
      <div className="relative w-64 h-24 flex items-center justify-center">
        
        {/* Visual Track (The dotted line) */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" style={{ zIndex: -1 }}>
          <defs>
            <linearGradient id="track-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="1.0" />
              <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M 20, 48 C 20, 10, 236, 10, 236, 48 C 236, 86, 20, 86, 20, 48 Z"
            fill="none"
            stroke="url(#track-gradient)"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="opacity-100"
          />
        </svg>

        {/* The Central Swap Effect (Anchor) */}
        <div className="absolute z-0 animate-pulse-slow">
           <ArrowRightLeft size={56} className="text-purple-500" />
        </div>

        {/* The Realistic Bee (Leader) */}
        <div className="absolute top-0 left-0 animate-bee-orbit">
          <div className="animate-bob">
            {/* Custom SVG for a Realistic Bee */}
            {/* Rotated 90deg to face forward along the path */}
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 100 100" 
              className="transform rotate-90 drop-shadow-sm"
            >
              <g>
                {/* Wings (fluttering) */}
                <ellipse cx="35" cy="30" rx="20" ry="12" fill="#e0f2fe" fillOpacity="0.8" stroke="#bae6fd" strokeWidth="2" transform="rotate(-30 35 30)" />
                <ellipse cx="65" cy="30" rx="20" ry="12" fill="#e0f2fe" fillOpacity="0.8" stroke="#bae6fd" strokeWidth="2" transform="rotate(30 65 30)" />
                
                {/* Body (Yellow) */}
                <ellipse cx="50" cy="55" rx="22" ry="30" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                
                {/* Stripes (Black) */}
                <path d="M 32 50 Q 50 60 68 50" stroke="#1f2937" strokeWidth="5" fill="none" />
                <path d="M 32 65 Q 50 75 68 65" stroke="#1f2937" strokeWidth="5" fill="none" />
                
                {/* Stinger */}
                <path d="M 50 85 L 54 95 L 46 95 Z" fill="#1f2937" />
                
                {/* Eyes */}
                <circle cx="42" cy="40" r="3" fill="#1f2937" />
                <circle cx="58" cy="40" r="3" fill="#1f2937" />
              </g>
            </svg>
          </div>
        </div>

        {/* The Robot (Chaser) - Increased Size */}
        <div className="absolute top-0 left-0 animate-robot-orbit">
          <div className="animate-bob">
            <Bot size={42} className="text-purple-600 fill-purple-400 drop-shadow-lg transform rotate-90" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default RobotBeeAnimation;
