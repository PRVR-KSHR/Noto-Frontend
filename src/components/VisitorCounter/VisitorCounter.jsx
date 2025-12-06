import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import api from '../../utils/api';

const VisitorCounter = () => {
  const [todayVisits, setTodayVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Log visitor on component mount
    logVisit();
    // Fetch visitor stats
    fetchVisitorStats();
  }, []);

  const logVisit = async () => {
    try {
      await api.post('/analytics/visit', {
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.log('Visit logged (local fallback)');
      // Fallback: store in localStorage if API fails
      const visits = JSON.parse(localStorage.getItem('visitorData') || '{"today": 0, "total": 0}');
      visits.today += 1;
      visits.total += 1;
      localStorage.setItem('visitorData', JSON.stringify(visits));
    }
  };

  const fetchVisitorStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/visits');
      if (response.data.success) {
        setTodayVisits(response.data.todayVisits || 0);
        setTotalVisits(response.data.totalVisits || 0);
      }
    } catch (error) {
      console.log('Using local visitor data');
      // Fallback to localStorage
      const visits = JSON.parse(localStorage.getItem('visitorData') || '{"today": 0, "total": 0}');
      setTodayVisits(visits.today || 0);
      setTotalVisits(visits.total || 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* Main Counter Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
          isExpanded 
            ? 'bg-blue-600 text-white' 
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-xl'
        } border border-blue-200 dark:border-blue-600`}
      >
        <Eye className="w-4 h-4" />
        <span className="text-sm font-semibold">{totalVisits}</span>
      </button>

      {/* Expanded Stats */}
      {isExpanded && (
        <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-48 border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="space-y-3">
            {/* Today's Visits */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Today</span>
              </div>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{todayVisits}</span>
            </div>

            {/* Total Visits */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Total</span>
              </div>
              <span className="font-bold text-lg text-green-600 dark:text-green-400">{totalVisits}</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Last 7 Days Average */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {todayVisits > 0 ? `~${Math.round(totalVisits / 30)} per day` : 'No visits yet'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorCounter;
