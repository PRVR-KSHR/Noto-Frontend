import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, Calendar, BarChart3, Users } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [popularPages, setPopularPages] = useState([]);
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDays]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/history?days=${selectedDays}`);
      if (response.data.success) {
        setStats(response.data.summary);
        setDailyData(response.data.dailyData || []);
        setPopularPages(response.data.popularPages || []);
      }
    } catch (error) {
      toast.error('Failed to fetch analytics');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxVisits = dailyData.length > 0 ? Math.max(...dailyData.map(d => d.visits)) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Website Analytics</h2>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[7, 14, 30, 60].map(days => (
          <button
            key={days}
            onClick={() => setSelectedDays(days)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedDays === days
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Last {days} Days
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin">
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading analytics...</span>
        </div>
      ) : stats ? (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Visits</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalVisits?.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">in {selectedDays} days</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Unique Visitors</span>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.uniqueVisitors?.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">different users</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Avg Daily Visits</span>
              </div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.avgDailyVisits?.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">per day</p>
            </div>
          </div>

          {/* Daily Chart */}
          {dailyData.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Daily Visits
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
                <div className="flex items-end gap-1 h-40" style={{ minWidth: '100%' }}>
                  {dailyData.map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer relative group"
                        style={{
                          height: maxVisits > 0 ? `${(day.visits / maxVisits) * 100}%` : '0%',
                          minHeight: day.visits > 0 ? '4px' : '0px'
                        }}
                        title={`${new Date(day.date).toLocaleDateString()}: ${day.visits} visits`}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.visits} visits
                        </div>
                      </div>
                      {dailyData.length <= 7 && (
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {dailyData.length > 7 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Showing {dailyData.length} days of data
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Popular Pages */}
          {popularPages.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Popular Pages</h3>
              <div className="space-y-2">
                {popularPages.map((page, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{page._id || '/'}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{page.views}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No analytics data available yet</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
