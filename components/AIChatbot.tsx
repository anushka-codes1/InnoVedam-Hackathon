"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChatbot({ isOpen, onClose }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm CampusSwap AI Assistant 🎓 How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const lowerMessage = userMessage.toLowerCase();

    // Knowledge base responses
    if (lowerMessage.includes('rent') || lowerMessage.includes('borrow')) {
      return "To rent an item:\n\n1. Browse the marketplace 🛍️\n2. Select an item you need\n3. Choose rental duration\n4. Select delivery method (Self-Delivery, Buddy Courier, or Priority)\n5. Proceed to checkout\n6. Complete payment\n\nYou'll get pickup details via notification!";
    }

    if (lowerMessage.includes('list') || lowerMessage.includes('lend')) {
      return "Listing your items is easy! 📦\n\n1. Click 'Create Listing' from dashboard\n2. Upload clear photos\n3. Add title and description\n4. Set category and condition\n5. Our AI suggests a fair price\n6. Choose delivery options\n7. Publish!\n\nYour item goes live instantly and appears in marketplace searches.";
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return "We accept multiple payment methods:\n\n💳 Credit/Debit Cards (Visa, Mastercard, RuPay)\n📱 UPI (GPay, PhonePe, Paytm)\n🏦 Net Banking (All major banks)\n👛 Digital Wallets (Paytm, PhonePe, Amazon Pay)\n\nAll transactions are secure and encrypted! 🔒";
    }

    if (lowerMessage.includes('delivery') || lowerMessage.includes('pickup')) {
      return "We offer 3 delivery options:\n\n🚶 Self-Delivery: Meet at popular campus locations (Free)\n🎒 Buddy Courier: Student delivers to you (₹15-30 based on distance)\n⚡ Priority Delivery: Lender brings to you within 1 hour (₹20, Premium feature)\n\nChoose what works best for you!";
    }

    if (lowerMessage.includes('premium') || lowerMessage.includes('subscription')) {
      return "CampusSwap Premium unlocks amazing benefits! ✨\n\n⚡ 1-hour Priority Delivery\n💰 Zero Transaction Fees\n⭐ Featured Listings\n📊 Advanced Analytics\n🛡️ +10 Trust Score Boost\n📅 Extended Rental (30 days)\n💬 24/7 Priority Support\n\nPricing:\n• Monthly: ₹199/month\n• Yearly: ₹1999/year (Save ₹400!)\n\nUpgrade from the dashboard!";
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our pricing is fair and transparent:\n\n📌 Listing items: FREE\n📌 Transaction fee: ₹3 (₹0 for Premium)\n📌 Self-Delivery: FREE\n📌 Buddy Courier: ₹15-30\n📌 Priority Delivery: ₹20\n\nWe also auto-suggest fair rental prices based on category, condition, and demand!";
    }

    if (lowerMessage.includes('trust') || lowerMessage.includes('safe')) {
      return "Your safety is our priority! 🛡️\n\n✓ Trust Score System (0-100)\n✓ Verified college email required\n✓ User ratings & reviews\n✓ Pre-authorized payments\n✓ Security deposits for valuable items\n✓ Dispute resolution system\n✓ Community reporting\n\nAll transactions are secure and tracked!";
    }

    if (lowerMessage.includes('return') || lowerMessage.includes('late')) {
      return "Rental Returns:\n\n✅ Return on time: Get full collateral back\n⏰ Late returns: ₹10/hour penalty (automatically calculated)\n📸 Photo verification at return\n🔔 Reminders sent 2 days before due date\n\nAlways return items in good condition to maintain your trust score!";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
      return "Need help? We're here 24/7! 💬\n\n📧 Email: support@campusswap.edu\n💬 Live Chat: Available in Help Center\n📱 Phone: +91 98765 43210\n⏰ Response time: <2 hours\n\nPremium members get instant priority support!";
    }

    if (lowerMessage.includes('campus') || lowerMessage.includes('college')) {
      return "CampusSwap is designed exclusively for college students! 🎓\n\n✓ Only .edu emails allowed\n✓ Campus-verified locations\n✓ Student Buddy Couriers\n✓ Meeting points near your campus\n✓ Affordable student pricing\n✓ Build campus community\n\nShare, Save, Sustain! 🌱";
    }

    if (lowerMessage.includes('damage') || lowerMessage.includes('broken')) {
      return "Item Damage Policy:\n\n1️⃣ Report damage immediately via app\n2️⃣ Upload photos as evidence\n3️⃣ Our team assesses the damage\n4️⃣ Fair compensation from security deposit\n5️⃣ Dispute resolution if needed\n\nAlways check items before accepting to avoid issues!";
    }

    if (lowerMessage.includes('account') || lowerMessage.includes('profile')) {
      return "Managing Your Account:\n\n✏️ Edit profile from Profile → Settings\n🔒 Change password anytime\n🛡️ Enable Two-Factor Authentication\n🔔 Customize notifications\n📊 View earnings & statistics\n⭐ Track your trust score\n\nKeep your profile updated for better trust!";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 I'm your CampusSwap AI assistant. I can help you with:\n\n• Renting items\n• Listing your items\n• Payment methods\n• Delivery options\n• Premium membership\n• Trust & safety\n• And much more!\n\nWhat would you like to know?";
    }

    if (lowerMessage.includes('thank')) {
      return "You're welcome! 😊 Feel free to ask if you have any more questions. Happy swapping! 🎉";
    }

    // Default response
    return "I'd be happy to help! I can assist you with:\n\n🛍️ Renting items\n📦 Listing items\n💳 Payments\n🚚 Delivery options\n⭐ Premium membership\n🛡️ Safety & trust\n💬 Support\n\nCould you please be more specific about what you'd like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    const aiResponse = await getAIResponse(inputMessage);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How do I rent an item?",
    "What is Premium?",
    "How does delivery work?",
    "Is it safe?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">AI Assistant</h3>
            <p className="text-purple-100 text-xs">Always here to help! 🎓</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-purple-50/30 to-pink-50/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl p-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white border border-purple-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-100' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-purple-100 rounded-2xl p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-purple-100 bg-white">
          <p className="text-xs text-gray-600 mb-2 font-semibold">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputMessage(question);
                  setTimeout(handleSendMessage, 100);
                }}
                className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-xs transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-purple-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
