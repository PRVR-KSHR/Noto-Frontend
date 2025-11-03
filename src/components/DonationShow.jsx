import React, { useState, useEffect } from 'react';
import { Heart, IndianRupee } from 'lucide-react';
import { donationAPI } from '../utils/api';

const DonationShow = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isColdStart, setIsColdStart] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        console.log('🚀 Fetching donations from backend API...');
        
        // Show cold start message if loading takes more than 5 seconds
        const coldStartTimer = setTimeout(() => {
          setIsColdStart(true);
          console.log('⏰ Cold start detected - backend is waking up...');
        }, 5000);
        
        // Fetch actual donations from public API
        const response = await donationAPI.getDonations();
        
        // Clear cold start timer
        clearTimeout(coldStartTimer);
        setIsColdStart(false);
        
        console.log('✅ API Response received:', response);
        
        // Handle different response structures
        let donationsList = [];
        if (response?.success && response?.data) {
          donationsList = response.data;
          console.log('📊 Found donations in response.data:', donationsList.length);
        } else if (response?.donations) {
          donationsList = response.donations;
          console.log('📊 Found donations in response.donations:', donationsList.length);
        } else if (Array.isArray(response)) {
          donationsList = response;
          console.log('📊 Response is array:', donationsList.length);
        } else {
          console.warn('⚠️ Unexpected response structure:', response);
        }
        
        // Process and filter latest 20 active donations
        const latestDonations = donationsList
          ?.filter(donation => {
            // Accept donations that are explicitly active or don't have isActive field
            return donation && (donation.isActive !== false);
          })
          ?.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.updatedAt || 0);
            const dateB = new Date(b.createdAt || b.updatedAt || 0);
            return dateB - dateA; // Sort descending (newest first)
          })
          ?.slice(0, 20) || []; // Get only latest 20
        
        console.log('🔄 Processed donations:', latestDonations.length);
        console.log('📋 First few donations:', latestDonations.slice(0, 3));
        
        // Always set the real donations from backend, even if empty
        setDonations(latestDonations);
        
      } catch (error) {
        console.error('❌ API Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        
        // Don't show error fallback - just show loading or empty state
        console.log('⚠️ API error - keeping donations empty until backend responds');
        setDonations([]);
        setIsColdStart(false);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
    
    // Refresh donations every 60 seconds
    const interval = setInterval(fetchDonations, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Create seamless infinite loop - triple the donations for smooth continuity
  const infiniteDonations = donations.length > 0 
    ? [...donations, ...donations, ...donations] 
    : [];

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden py-10 -mt-20">
        <style jsx>{`
          @keyframes infiniteScrollLoading {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
          }
          .marquee-content-loading {
            animation: infiniteScrollLoading 25s linear infinite;
            display: flex;
            width: max-content;
          }
        `}</style>
        
        <div className="text-center mb-3">
          <h3 className="text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
            {isColdStart ? (
              <>
                ⏰ Waking up server (first visit may take 30s)...
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" fill="currentColor" />
              </>
            ) : (
              <>
                🙏 Loading Supporters...
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" fill="currentColor" />
              </>
            )}
          </h3>
          {isColdStart && (
            <p className="text-xs text-gray-500 mt-1">
              Server is starting up (free tier limitation)
            </p>
          )}
        </div>
        
        <div className="overflow-hidden">
          <div className="marquee-content-loading">
            <div className="flex whitespace-nowrap">
              {[...Array(15)].map((_, i) => (
                <div key={`loading1-${i}`} className="inline-flex items-center space-x-3 mx-6 animate-pulse flex-shrink-0">
                  <div className="w-3 h-3 bg-pink-200 rounded-full"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-6 bg-green-200 rounded-full"></div>
                </div>
              ))}
            </div>
            <div className="flex whitespace-nowrap">
              {[...Array(15)].map((_, i) => (
                <div key={`loading2-${i}`} className="inline-flex items-center space-x-3 mx-6 animate-pulse flex-shrink-0">
                  <div className="w-3 h-3 bg-pink-200 rounded-full"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-6 bg-green-200 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="w-full py-3 text-center">
        <p className="text-gray-500 text-sm flex items-center justify-center">
          <Heart className="w-4 h-4 mr-2 text-pink-400" />
          {isLoading ? 'Loading supporters...' : 'Be the first to support! 💝'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden py-10 -mt-20">
      {/* Inline CSS for infinite marquee animation */}
      <style jsx>{`
        @keyframes infiniteScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        
        .marquee-content {
          animation: infiniteScroll 30s linear infinite;
          display: flex;
          width: max-content;
        }
        
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
        
        .marquee-wrapper {
          display: flex;
          width: 200%; /* Double width to accommodate duplicate content */
        }
      `}</style>
      
      {/* Title */}
      <div className="text-center mb-3">
        <h3 className="text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
          🙏 Recent Supporters
          <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
        </h3>
      </div>

      {/* True Infinite Marquee */}
      <div className="marquee-container overflow-hidden">
        <div className="marquee-content">
          {/* First set of donations */}
          <div className="flex whitespace-nowrap">
            {donations.map((donation, index) => (
              <div
                key={`set1-${donation._id}-${index}`}
                className="inline-flex items-center space-x-3 mx-6 group cursor-default flex-shrink-0"
              >
                {/* Heart Icon */}
                <Heart 
                  className="w-3 h-3 text-pink-500 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" 
                  fill="currentColor"
                />
                
                {/* Donor Info */}
                <span className="font-medium text-gray-700 text-sm group-hover:text-pink-600 transition-colors duration-200">
                  {donation.donorName}
                </span>
                
                <span className="text-gray-300 text-xs">•</span>
                
                {/* Amount with Rupee Symbol */}
                <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-200 shadow-sm">
                  <IndianRupee className="w-3 h-3 text-green-600" />
                  <span className="font-bold text-green-700 text-sm">
                    {donation.amount.toLocaleString()}
                  </span>
                </div>

                {/* Thank you message if notes exist */}
                {donation.notes && (
                  <>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-xs text-gray-500 italic max-w-20 truncate">
                      "{donation.notes}"
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Duplicate set for seamless infinite loop */}
          <div className="flex whitespace-nowrap">
            {donations.map((donation, index) => (
              <div
                key={`set2-${donation._id}-${index}`}
                className="inline-flex items-center space-x-3 mx-6 group cursor-default flex-shrink-0"
              >
                {/* Heart Icon */}
                <Heart 
                  className="w-3 h-3 text-pink-500 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" 
                  fill="currentColor"
                />
                
                {/* Donor Info */}
                <span className="font-medium text-gray-700 text-sm group-hover:text-pink-600 transition-colors duration-200">
                  {donation.donorName}
                </span>
                
                <span className="text-gray-300 text-xs">•</span>
                
                {/* Amount with Rupee Symbol */}
                <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-200 shadow-sm">
                  <IndianRupee className="w-3 h-3 text-green-600" />
                  <span className="font-bold text-green-700 text-sm">
                    {donation.amount.toLocaleString()}
                  </span>
                </div>

                {/* Thank you message if notes exist */}
                {donation.notes && (
                  <>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-xs text-gray-500 italic max-w-20 truncate">
                      "{donation.notes}"
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationShow;
