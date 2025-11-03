// Keep-alive ping service to prevent Render cold starts
// This file can be used with external monitoring services

const BACKEND_URL = 'https://noto-backend-m71f.onrender.com/api/health';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15 min)

let pingCount = 0;

async function pingBackend() {
  try {
    const startTime = Date.now();
    const response = await fetch(BACKEND_URL);
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      pingCount++;
      console.log(`✅ Ping #${pingCount} successful (${duration}ms) - ${new Date().toISOString()}`);
      return true;
    } else {
      console.error(`❌ Ping failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Ping error:`, error.message);
    return false;
  }
}

// Run immediately on start
pingBackend();

// Then ping every 14 minutes
setInterval(pingBackend, PING_INTERVAL);

console.log(`🚀 Keep-alive service started. Pinging every 14 minutes.`);
console.log(`📡 Target: ${BACKEND_URL}`);
