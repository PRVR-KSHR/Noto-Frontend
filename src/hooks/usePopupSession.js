import { useState, useEffect } from 'react';

export const usePopupSession = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const alreadyShown = sessionStorage.getItem('UPISupportPopup_Shown');
    
    // If not shown yet in this session, show it once
    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Mark as shown for this session (won't show again on navigation)
        sessionStorage.setItem('UPISupportPopup_Shown', 'true');
      }, 2000); // Show after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency - runs only once per component mount

  const dismissPopup = () => {
    setIsVisible(false);
    // No need to set additional storage - already marked as shown
  };

  return { isVisible, dismissPopup };
};
