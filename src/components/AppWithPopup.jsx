import React, { useState } from 'react';
import { usePopupSession } from '../hooks/usePopupSession';
import DonationPromoPopup from './DonationPromoPopup/DonationPromoPopup'; // Updated import
import UPISupportPopup from './UPISupportPopup/UPISupportPopup';

const AppWithPopup = ({ children }) => {
  const { isVisible, dismissPopup } = usePopupSession();
  const [showUPIModal, setShowUPIModal] = useState(false);

  const handleSupportClick = () => {
    dismissPopup(); // Close the small popup
    setShowUPIModal(true); // Open the full UPI modal
  };

  return (
    <>
      {children}
      
      {/* Bottom-right donation promo popup */}
      {isVisible && (
        <DonationPromoPopup 
          onClose={dismissPopup}
          onSupport={handleSupportClick}
        />
      )}
      
      {/* Full UPI Support Modal */}
      <UPISupportPopup
        isOpen={showUPIModal}
        onClose={() => setShowUPIModal(false)}
        onSupport={() => {
          // Handle UPI app opening or additional actions
          window.open(`upi://pay?pa=yourname@paytm&pn=Noto&am=&cu=INR`);
        }}
      />
    </>
  );
};

export default AppWithPopup;
