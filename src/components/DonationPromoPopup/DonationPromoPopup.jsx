import React from 'react';
import { X, Heart, Coffee } from 'lucide-react';

const DonationPromoPopup = ({ onClose, onSupport }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 max-w-sm w-full border border-gray-200 dark:border-gray-700 z-50 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              Support Noto for Free Education
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
              Help us maintain and improve our platform. Your support keeps education free for everyone.
            </p>
            <button 
              onClick={onSupport}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Support Now</span>
            </button>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="flex-shrink-0 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close popup"
        >
          <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DonationPromoPopup;
