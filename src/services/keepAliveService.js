/**
 * Keep-Alive Service
 * Pings the backend every 14 minutes to prevent Render free tier from sleeping
 * Render puts free tier apps to sleep after 15 minutes of inactivity
 */

const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://noto-backend-m71f.onrender.com';

let keepAliveInterval = null;

/**
 * Start the keep-alive service
 */
export const startKeepAlive = () => {
  // Only start if not already running
  if (keepAliveInterval) {
    console.log('⚠️ Keep-alive service already running');
    return;
  }

  console.log('🔄 Starting backend keep-alive service (every 14 minutes)');

  // Ping immediately on startup
  pingBackend();

  // Then ping every 14 minutes
  keepAliveInterval = setInterval(() => {
    pingBackend();
  }, KEEP_ALIVE_INTERVAL);
};

/**
 * Stop the keep-alive service
 */
export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('🛑 Keep-alive service stopped');
  }
};

/**
 * Ping the backend keep-alive endpoint
 */
const pingBackend = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/keep-alive`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Backend keep-alive ping successful (${new Date().toLocaleTimeString()})`);
      return true;
    } else {
      console.warn(`⚠️ Keep-alive ping returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Keep-alive ping failed:', error.message);
    // Don't throw error - keep running even if ping fails
    return false;
  }
};

export default {
  startKeepAlive,
  stopKeepAlive,
  pingBackend
};
