import React from 'react';
import Link from 'next/link';
import { 
  FaApple, 
  FaGooglePlay, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin 
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const CampusSwapFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & App Links - First Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                CampusSwap
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Your Campus Marketplace
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Download App</h3>
              
              {/* App Store Button */}
              <button className="flex items-center gap-3 w-full bg-black hover:bg-gray-800 transition-colors rounded-lg px-4 py-3 border border-gray-700">
                <FaApple className="text-3xl" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>

              {/* Google Play Button */}
              <button className="flex items-center gap-3 w-full bg-black hover:bg-gray-800 transition-colors rounded-lg px-4 py-3 border border-gray-700">
                <FaGooglePlay className="text-2xl" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* About CampusSwap - Second Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About CampusSwap</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/press" 
                  className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link 
                  href="/ambassadors" 
                  className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                >
                  Campus Ambassadors
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support - Third Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Help & Support</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/help" 
                  className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/safety" 
                  className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                >
                  Safety Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/guidelines" 
                  className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social - Fourth Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/terms" 
                    className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cookies" 
                    className="text-gray-300 hover:text-violet-300 transition-colors text-sm"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Follow Us</h3>
              <div className="flex gap-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-violet-600 transition-colors flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-violet-600 transition-colors flex items-center justify-center"
                  aria-label="X (Twitter)"
                >
                  <FaXTwitter className="text-xl" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-violet-600 transition-colors flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-violet-600 transition-colors flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-400">
            © 2025 CampusSwap Technologies Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CampusSwapFooter;
