import React, { useState, useEffect } from 'react';
import { X, Heart, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import qrCodeImage from "../../assets/ankushPaytmQr.jpg";

const UPISupportPopup = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const copyUPIId = () => {
    const upiId = "yourname@paytm"; // Replace with your UPI ID
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div 
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Support Noto</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Help keep education free</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            {/* QR Code */}
            <div className="mb-6">
              <div className="w-40 h-40 mx-auto bg-white border-2 border-gray-200 rounded-xl p-3 shadow-sm">
                <img
                  src={qrCodeImage}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Support our mission
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Scan to donate or copy our UPI ID. Every contribution helps us keep Noto free for students.
            </p>

            {/* UPI ID with Copy Button */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">UPI ID</p>
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                    ankush.nk@ptyes
                  </p>
                </div>
                <button
                  onClick={copyUPIId}
                  className="ml-3 p-2 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-lg transition-colors flex items-center justify-center"
                  title="Copy UPI ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Footer text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              Thank you for supporting free education 💝
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UPISupportPopup;
