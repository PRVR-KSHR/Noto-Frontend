/**
 * Keep-Alive Service
 * Pings the backend every 10 minutes to prevent Render free tier from sleeping
 * Render puts free tier apps to sleep after 15 minutes of inactivity
 */

const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutes (Render sleeps after 15)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://noto-backend-m71f.onrender.com';

let keepAliveInterval = null;
let lastPingTime = 0;

/**
 * Start the keep-alive service
 */
export const startKeepAlive = () => {
  // Only start if not already running
  if (keepAliveInterval) {
    console.log('⚠️ Keep-alive service already running');
    return;
  }

  console.log('🔄 Starting backend keep-alive service (every 10 minutes)');

  // Ping immediately on startup
  pingBackend();

  // Then ping every 10 minutes
  keepAliveInterval = setInterval(() => {
    pingBackend();
  }, KEEP_ALIVE_INTERVAL);

  // Also ping on user activity (page visibility change)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden === false) {
      // Page became visible - user returned
      const now = Date.now();
      if (now - lastPingTime > 5 * 60 * 1000) {
        // If more than 5 minutes since last ping, ping now
        console.log('👁️ User returned - pinging backend');
        pingBackend();
      }
    }
  });

  // Ping when window focus returns
  window.addEventListener('focus', () => {
    const now = Date.now();
    if (now - lastPingTime > 5 * 60 * 1000) {
      console.log('🔍 Window focused - pinging backend');
      pingBackend();
    }
  });
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
    lastPingTime = Date.now();
    const response = await fetch(`${BACKEND_URL}/api/keep-alive`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Backend keep-alive ping successful at ${new Date().toLocaleTimeString()}`);
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
