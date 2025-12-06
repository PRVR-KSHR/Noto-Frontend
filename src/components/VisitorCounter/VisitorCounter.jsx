import React, { useState, useEffect, useRef } from 'react';
import { Eye, Users } from 'lucide-react';
import api from '../../utils/api';

const VisitorCounter = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const sessionIdRef = useRef(null);

  useEffect(() => {
    // Initialize session on component mount
    initializeSession();
    
    // Fetch active users count immediately
    fetchActiveUsers();
    
    // Set up periodic updates
    const fetchInterval = setInterval(fetchActiveUsers, 30000); // Update every 30 seconds
    const pingInterval = setInterval(pingSession, 60000); // Keep session alive every 60 seconds

    return () => {
      clearInterval(fetchInterval);
      clearInterval(pingInterval);
    };
  }, []);

  const initializeSession = async () => {
    try {
      // Generate unique session ID for this browser
      const sid = sessionIdRef.current || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionIdRef.current = sid;
      setSessionId(sid);

      // Start session on backend
      await api.post('/analytics/session/start', {
        sessionId: sid,
        page: window.location.pathname
      });
    } catch (error) {
      console.log('Session init failed (will use local tracking)');
    }
  };

  const pingSession = async () => {
    if (!sessionIdRef.current) return;
    try {
      await api.post('/analytics/session/ping', {
        sessionId: sessionIdRef.current
      });
    } catch (error) {
      console.log('Session ping failed');
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const response = await api.get('/analytics/active-users');
      if (response.data.success) {
        setActiveUsers(response.data.activeUsers || 0);
      }
    } catch (error) {
      console.log('Failed to fetch active users');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-xl border border-green-200 dark:border-green-600 transition-all">
      <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
      <span className="text-sm font-semibold">{activeUsers}</span>
      <span className="text-xs text-gray-600 dark:text-gray-400">online</span>
    </div>
  );
};

export default VisitorCounter;
