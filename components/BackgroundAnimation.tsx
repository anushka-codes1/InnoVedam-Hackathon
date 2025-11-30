import React, { useEffect, useRef, useState } from 'react';
import { 
  ArrowRightLeft, 
  DollarSign, 
  RefreshCw, 
  BookOpen, 
  Laptop, 
  Coffee, 
  Gamepad2, 
  Headphones 
} from 'lucide-react';
import '../styles/background-animation.css';

const BackgroundAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized position (-1 to 1)
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;

      setMousePosition({ x, y });
      
      // Update CSS variables for smoother performance
      containerRef.current.style.setProperty('--mouse-x', x.toString());
      containerRef.current.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden bg-orange-50"
    >

      {/* 1. Base Gradient Background (Soft Pastels) */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 transition-colors duration-1000"></div>

      {/* 2. Interactive Spotlight Follower (Soft overlay) */}
      <div className="absolute inset-0 spotlight transition-opacity duration-300 mix-blend-overlay"></div>

      {/* 3. Parallax Blob Layers (Watercolor Effect) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Blob 1: Soft Purple */}
        <div className="absolute top-0 left-[-10%] w-[60vw] h-[60vw] bg-purple-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 layer-1 transition-transform duration-100 ease-out"></div>
        {/* Blob 2: Soft Indigo/Blue */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 layer-2 transition-transform duration-100 ease-out"></div>
        {/* Blob 3: Soft Pink Highlight */}
        <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-pink-300 rounded-full mix-blend-multiply filter blur-[60px] opacity-50 layer-3 transition-transform duration-100 ease-out animate-pulse"></div>
      </div>

      {/* 4. Thematic Floating Icons (Items + Swaps) - More Visible */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        
        {/* Main Swap Actions */}
        <div className="absolute top-[20%] left-[15%] text-purple-400 animate-float-slow layer-1">
          <ArrowRightLeft size={64} />
        </div>
        <div className="absolute bottom-[30%] right-[35%] text-pink-400 animate-float-reverse layer-2">
          <ArrowRightLeft size={48} />
        </div>

        {/* Currency & Value */}
        <div className="absolute top-[60%] right-[20%] text-pink-500 animate-float-medium layer-2">
          <DollarSign size={80} />
        </div>

        {/* Campus Items */}
        <div className="absolute top-[15%] right-[15%] text-indigo-400 animate-float-fast layer-3">
          <Laptop size={56} />
        </div>
        <div className="absolute bottom-[20%] left-[10%] text-orange-400 animate-float-slow layer-1">
          <BookOpen size={48} />
        </div>
        <div className="absolute top-[40%] left-[5%] text-purple-400 animate-float-medium layer-2">
          <Headphones size={40} />
        </div>
        <div className="absolute bottom-[10%] right-[10%] text-emerald-400 animate-float-fast layer-1">
          <Coffee size={42} />
        </div>
        <div className="absolute top-[80%] left-[45%] text-blue-400 animate-float-reverse layer-3">
          <Gamepad2 size={36} />
        </div>

        {/* Tiny Background Swaps (Texture) */}
        <div className="absolute top-[30%] left-[30%] text-slate-500/40 animate-pulse layer-3">
          <RefreshCw size={24} />
        </div>
        <div className="absolute top-[70%] right-[40%] text-slate-500/40 animate-pulse layer-2" style={{ animationDelay: '1s' }}>
          <RefreshCw size={20} />
        </div>

        {/* Abstract Shapes */}
        <div className="absolute top-[10%] right-[10%] w-4 h-4 bg-pink-400 rounded-full blur-sm opacity-80 layer-3"></div>
        <div className="absolute bottom-[40%] left-[5%] w-6 h-6 bg-purple-400 rounded-full blur-sm opacity-80 layer-2"></div>
      </div>

      {/* 5. Noise Texture Overlay (Premium Feel) */}
      <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay pointer-events-none"></div>

    </div>
  );
};

export default BackgroundAnimation;
