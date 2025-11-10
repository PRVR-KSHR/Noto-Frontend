// src/components/ProfessorMaterialVerification/ProfessorMaterialVerification.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, XCircle, MessageSquare, Eye, XCircle as XCircleIcon } from 'lucide-react';

const ProfessorMaterialVerification = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  
  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingMaterial, setRejectingMaterial] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionCategory, setRejectionCategory] = useState('quality');
  
  // Quick Templates
  const quickTemplates = [
    "Poor image quality or unreadable content",
    "File appears to be corrupted or incomplete",
    "Content does not match the selected category",
    "Duplicate of existing material",
    "Contains inappropriate or irrelevant content"
  ];

  useEffect(() => {
    fetchTaggedMaterials();
  }, []);

  const fetchTaggedMaterials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/materials/professor/tagged-materials');
      
      if (response.data.success) {
        setMaterials(response.data.materials);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You are not yet approved as a professor validator');
      } else {
        toast.error('Failed to fetch materials');
      }
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify Material
  const handleVerifyMaterial = async (materialId, materialTitle) => {
    if (!window.confirm(`Are you sure you want to verify "${materialTitle}"?`)) {
      return;
    }

    try {
      setVerifyingId(materialId);
      const response = await api.patch(
        `/materials/professor/material/${materialId}/verify`,
        {
          verificationStatus: 'approved',
          feedback: ''
        }
      );

      if (response.data.success) {
        toast.success('✅ Material verified successfully!');
        fetchTaggedMaterials(); // Refresh list
      }
    } catch (error) {
      console.error('Error verifying material:', error);
      toast.error(error.response?.data?.message || 'Failed to verify material');
    } finally {
      setVerifyingId(null);
    }
  };

  // Handle Reject Material - Open Modal
  const handleRejectMaterial = (material) => {
    setRejectingMaterial(material);
    setShowRejectModal(true);
    setRejectionReason('');
    setRejectionCategory('quality');
  };

  // Apply Quick Template
  const applyTemplate = (template) => {
    setRejectionReason(template);
  };

  // Process Rejection
  const processRejection = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setVerifyingId(rejectingMaterial._id);
      const fullReason = `[${rejectionCategory.toUpperCase()}] ${rejectionReason.trim()}`;
      
      const response = await api.patch(
        `/materials/professor/material/${rejectingMaterial._id}/verify`,
        {
          verificationStatus: 'rejected',
          feedback: fullReason
        }
      );

      if (response.data.success) {
        toast.success(`✅ Material "${rejectingMaterial.title}" rejected successfully`);
        
        // Close modal and reset state
        setShowRejectModal(false);
        setRejectingMaterial(null);
        setRejectionReason('');
        setRejectionCategory('quality');
        
        // Refresh the list
        fetchTaggedMaterials();
      }
    } catch (error) {
      console.error('Error rejecting material:', error);
      toast.error(error.response?.data?.message || 'Failed to reject material');
    } finally {
      setVerifyingId(null);
    }
  };

  // Cancel Rejection
  const cancelRejection = () => {
    setShowRejectModal(false);
    setRejectingMaterial(null);
    setRejectionReason('');
    setRejectionCategory('quality');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No materials tagged to you yet</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Desktop / Tablet Table */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Material Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Uploaded By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {materials.map((material) => {
              const myVerification = material.taggedProfessors?.[0] || {};
              const isPending = myVerification.verificationStatus === 'pending';
              const isApproved = myVerification.verificationStatus === 'approved';
              const isRejected = myVerification.verificationStatus === 'rejected';

              return (
                <tr key={material._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{material.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{material.category?.type} • {material.category?.subject}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{material.metadata?.course} • Semester {material.category?.semester}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-200">User ID: {material.uploadedBy}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">College: {material.metadata?.collegeName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(material.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {isPending && <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">Pending</span>}
                    {isApproved && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"><CheckCircle className="w-4 h-4" />Approved</span>}
                    {isRejected && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"><XCircle className="w-4 h-4" />Rejected</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/materials/view/${material._id}`, '_blank')}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/60 transition"
                        title="View full document with all details"
                      >
                        <Eye className="h-4 w-4 mr-1" />View
                      </button>
                      {isPending && (
                        <button
                          onClick={() => handleVerifyMaterial(material._id, material.title)}
                          disabled={verifyingId === material._id}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-900/40 dark:text-green-200 dark:hover:bg-green-900/60 transition disabled:opacity-50"
                        >
                          {verifyingId === material._id ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}Verify
                        </button>
                      )}
                      {isPending && (
                        <button
                          onClick={() => handleRejectMaterial(material)}
                          disabled={verifyingId === material._id}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60 transition disabled:opacity-50"
                        >
                          {verifyingId === material._id ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="space-y-4 sm:hidden">
        {materials.map((material) => {
          const myVerification = material.taggedProfessors?.[0] || {};
          const isPending = myVerification.verificationStatus === 'pending';
          const isApproved = myVerification.verificationStatus === 'approved';
          const isRejected = myVerification.verificationStatus === 'rejected';
          return (
            <div key={material._id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{material.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{material.category?.type} • {material.category?.subject}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{material.metadata?.course} • Sem {material.category?.semester}</p>
                </div>
                <span>
                  {isPending && <span className="inline-flex px-2 py-1 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">Pending</span>}
                  {isApproved && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"><CheckCircle className="w-3 h-3" />Approved</span>}
                  {isRejected && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"><XCircle className="w-3 h-3" />Rejected</span>}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <p>User: {material.uploadedBy}</p>
                <p>{material.metadata?.collegeName}</p>
                <p className="text-[10px] mt-1">Uploaded: {new Date(material.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => window.open(`/materials/view/${material._id}`, '_blank')}
                  className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/60"
                >
                  <Eye className="w-3 h-3" />View
                </button>
                {isPending && (
                  <button
                    onClick={() => handleVerifyMaterial(material._id, material.title)}
                    disabled={verifyingId === material._id}
                    className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-200 dark:hover:bg-green-900/60 disabled:opacity-50"
                  >
                    {verifyingId === material._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}Verify
                  </button>
                )}
                {isPending && (
                  <button
                    onClick={() => handleRejectMaterial(material)}
                    disabled={verifyingId === material._id}
                    className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60 disabled:opacity-50"
                  >
                    {verifyingId === material._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}Reject
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Rejection Modal */}
      {showRejectModal && rejectingMaterial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reject Material</h2>
              </div>
              <button
                onClick={cancelRejection}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Material Info Display */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Material: <span className="text-blue-600 dark:text-blue-400">{rejectingMaterial.title}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {rejectingMaterial.category?.type} • {rejectingMaterial.category?.subject}
                </p>
              </div>

              {/* Rejection Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rejection Category *
                </label>
                <select
                  value={rejectionCategory}
                  onChange={(e) => setRejectionCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 outline-none transition"
                >
                  <option value="quality">Quality Issues</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="copyright">Copyright Violation</option>
                  <option value="duplicate">Duplicate Material</option>
                  <option value="format">File Format Issues</option>
                  <option value="accuracy">Inaccurate Information</option>
                  <option value="guidelines">Violates Guidelines</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Detailed Reason */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Detailed Reason *
                  </label>
                  <span className={`text-xs font-medium ${
                    rejectionReason.length > 450
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {rejectionReason.length}/500 characters
                  </span>
                </div>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setRejectionReason(e.target.value);
                    }
                  }}
                  placeholder="Provide a detailed reason for rejecting this material..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 outline-none transition resize-none"
                />
                {rejectionReason.length > 450 && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    ⚠️ Only {500 - rejectionReason.length} characters remaining
                  </p>
                )}
              </div>

              {/* Quick Templates */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Quick Templates
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {quickTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyTemplate(template)}
                      className="text-left px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-300 transition font-medium"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={cancelRejection}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={processRejection}
                  disabled={!rejectionReason.trim() || verifyingId === rejectingMaterial._id}
                  className={`flex-1 px-4 py-2 text-white font-semibold rounded-lg transition ${
                    !rejectionReason.trim() || verifyingId === rejectingMaterial._id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {verifyingId === rejectingMaterial._id ? 'Rejecting...' : 'Reject Material'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorMaterialVerification;
