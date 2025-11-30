"use client";

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import AIChatbot from './AIChatbot';

export default function AIChatbotWrapper() {
  const [showAIChatbot, setShowAIChatbot] = useState(false);

  return (
    <>
      {/* AI Chatbot */}
      <AIChatbot isOpen={showAIChatbot} onClose={() => setShowAIChatbot(false)} />

      {/* AI Chatbot Floating Button */}
      {!showAIChatbot && (
        <button
          onClick={() => setShowAIChatbot(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 group"
          title="AI Assistant - Ask me anything!"
        >
          <Sparkles className="w-7 h-7 text-white animate-pulse" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </button>
      )}
    </>
  );
}
