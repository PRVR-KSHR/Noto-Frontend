import React, { useState, useEffect, useRef } from 'react';
import { Users } from 'lucide-react';
import api from '../../utils/api';

const VisitorCounter = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const sessionIdRef = useRef(null);
  const fetchIntervalRef = useRef(null);
  const pingIntervalRef = useRef(null);

  useEffect(() => {
    // Initialize session on component mount
    initializeSession();
    
    // Fetch active users count after a delay
    setTimeout(() => {
      fetchActiveUsers();
    }, 1000);
    
    // Set up less aggressive periodic updates - every 60 seconds instead of 30
    fetchIntervalRef.current = setInterval(fetchActiveUsers, 60000);
    
    // Keep session alive every 90 seconds
    pingIntervalRef.current = setInterval(pingSession, 90000);

    return () => {
      if (fetchIntervalRef.current) clearInterval(fetchIntervalRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    };
  }, []);

  const initializeSession = async () => {
    try {
      // Generate unique session ID for this browser
      const sid = sessionIdRef.current || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionIdRef.current = sid;
      setSessionId(sid);

      // Start session on backend
      try {
        await api.post('/analytics/session/start', {
          sessionId: sid,
          page: window.location.pathname
        });
      } catch (error) {
        // Silent fail - don't throw errors for analytics
        console.log('Session init skipped (analytics optional)');
      }
    } catch (error) {
      console.log('Session init failed (analytics optional)');
    }
  };

  const pingSession = async () => {
    if (!sessionIdRef.current) return;
    try {
      await api.post('/analytics/session/ping', {
        sessionId: sessionIdRef.current
      });
    } catch (error) {
      // Silent fail - don't throw errors for analytics
      console.log('Session ping skipped (analytics optional)');
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const response = await api.get('/analytics/active-users');
      if (response.data.success) {
        setActiveUsers(response.data.activeUsers || 0);
      }
    } catch (error) {
      // Silently fail - don't show errors for analytics
      // Analytics is non-critical and shouldn't affect user experience
      if (error.response?.status !== 404) {
        console.log('Analytics fetch skipped (non-critical)');
      }
    }
  };

  // Don't show counter if no users online and haven't loaded yet
  if (activeUsers === 0 && sessionId === null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-xl border border-green-200 dark:border-green-600 transition-all">
      <Users className="w-4 h-4 text-green-600 dark:text-green-400 animate-pulse" />
      <span className="text-sm font-semibold">{activeUsers}</span>
      <span className="text-xs text-gray-600 dark:text-gray-400">online</span>
    </div>
  );
};

export default VisitorCounter;
