import React from 'react';

/**
 * UserAvatar Component
 * Displays user photo or first letter of name as fallback
 * @param {Object} props
 * @param {Object} props.user - User object with displayName and photoURL
 * @param {string} props.size - Size class (e.g., 'w-8 h-8', 'w-10 h-10')
 * @param {string} props.className - Additional CSS classes
 */
const UserAvatar = ({ user, size = 'w-8 h-8', className = '' }) => {
  const [imageError, setImageError] = React.useState(false);

  // Get first letter of display name
  const getInitial = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Get background color based on name
  const getBackgroundColor = (name) => {
    if (!name) return 'bg-gray-400';
    
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500',
    ];
    
    // Use first character code to pick a color
    const colorIndex = name.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  // If user has a photo and it hasn't errored, show it
  if (user?.photoURL && !imageError) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || 'User'}
  className={`${size} rounded-full border-2 border-noto-secondary dark:border-blue-400 object-cover transition-colors duration-200 ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback: Show first letter
  return (
    <div
      className={`${size} rounded-full border-2 border-noto-secondary dark:border-blue-400 flex items-center justify-center text-white font-semibold transition-colors duration-200 ${getBackgroundColor(
        user?.displayName
      )} ${className}`}
    >
      {getInitial(user?.displayName)}
    </div>
  );
};

export default UserAvatar;
