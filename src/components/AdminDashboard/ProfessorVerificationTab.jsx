import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Loader2, CheckCircle, XCircle, Trash2, Mail, Building2, Badge, BookOpen, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfessorVerificationTab = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectingId, setRejectingId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/professors/admin/all?status=${statusFilter}`);
      setApplications(response.data.applications || []);
    } catch (error) {
      toast.error('Failed to fetch applications');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/professors/admin/stats');
      setStats(response.data.stats || { pending: 0, approved: 0, rejected: 0, total: 0 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      await api.patch(`/professors/admin/${applicationId}/approve`);
      toast.success('Professor application approved!');
      fetchApplications();
      fetchStats();
    } catch (error) {
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (applicationId) => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    try {
      await api.patch(`/professors/admin/${applicationId}/reject`, {
        rejectionReason: rejectionReason.trim()
      });
      toast.success('Application rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      fetchApplications();
      fetchStats();
    } catch (error) {
      toast.error('Failed to reject application');
    }
  };

  const handleDeleteProfessor = async (applicationId) => {
    try {
      await api.delete(`/professors/admin/${applicationId}/delete`);
      toast.success('Professor status revoked successfully!');
      setShowDeleteModal(false);
      setDeletingId(null);
      fetchApplications();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to revoke professor status');
      console.error('Delete professor error:', error.response?.data || error.message);
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold">Pending</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-600 dark:text-green-400 text-sm font-semibold">Approved</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.approved}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm font-semibold">Rejected</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.rejected}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Total</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No {statusFilter} applications found
          </div>
        ) : (
          applications.map(app => (
            <div key={app._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg overflow-hidden">
              {/* Card Header with Status */}
              <div className={`px-6 py-4 border-b-2 ${
                statusFilter === 'pending' 
                  ? 'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/20' 
                  : statusFilter === 'approved'
                  ? 'border-green-200 bg-green-50/50 dark:bg-green-900/20'
                  : 'border-red-200 bg-red-50/50 dark:bg-red-900/20'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{app.fullName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusFilter === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' 
                      : statusFilter === 'approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                  }`}>
                    {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </div>
                </div>
              </div>

              {/* Card Body - Full Details */}
              <div className="px-6 py-4 space-y-4">
                {/* Row 1: Email & College */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Email</p>
                      <p className="text-sm text-gray-900 dark:text-white">{app.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">College</p>
                      <p className="text-sm text-gray-900 dark:text-white">{app.collegeName}</p>
                    </div>
                  </div>
                </div>

                {/* Row 2: Professor ID & Subjects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Badge className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Professor ID</p>
                      <p className="text-sm text-gray-900 dark:text-white">{app.professorId}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Subjects Taught</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {app.subjects && app.subjects.length > 0 ? (
                          app.subjects.map((subject, idx) => (
                            <span key={idx} className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">No subjects specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason (if applicable) */}
                {app.rejectionReason && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase">Rejection Reason</p>
                    <p className="text-sm text-red-800 dark:text-red-200 mt-1">{app.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Card Footer - Actions */}
              {statusFilter === 'pending' && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setRejectingId(app._id);
                      setShowRejectModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(app._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              )}

              {statusFilter === 'approved' && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setDeletingId(app._id);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Revoke Professor
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reject Application</h3>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Professor Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revoke Professor Status</h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to revoke this user's professor status? They will be reverted to normal user status and can apply again if needed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProfessor(deletingId)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Revoke Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorVerificationTab;
