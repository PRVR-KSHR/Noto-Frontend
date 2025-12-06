import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Loader2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const MaterialManagementTab = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, hidden: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hiddenFilter, setHiddenFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actioningId, setActioningId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  useEffect(() => {
    fetchMaterials();
    fetchStats();
  }, [searchQuery, statusFilter, hiddenFilter, page]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/materials/admin/all-materials', {
        params: {
          search: searchQuery,
          status: statusFilter,
          isHidden: hiddenFilter,
          page,
          limit: 10
        }
      });
      setMaterials(response.data.materials || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch materials');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/materials/admin/stats');
      setStats(response.data.stats || { total: 0, pending: 0, verified: 0, hidden: 0 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (materialId) => {
    try {
      setActioningId(materialId);
      const response = await api.delete(`/materials/admin/material/${materialId}`);
      if (response.data.success) {
        toast.success('Material deleted permanently');
        setShowDeleteModal(false);
        fetchMaterials();
        fetchStats();
      }
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete material');
    } finally {
      setActioningId(null);
    }
  };

  const handleHide = async (materialId) => {
    try {
      setActioningId(materialId);
      await api.patch(`/materials/admin/material/${materialId}/hide`, {
        reason: 'Hidden by admin'
      });
      toast.success('Material hidden');
      fetchMaterials();
      fetchStats();
    } catch (error) {
      toast.error('Failed to hide material');
    } finally {
      setActioningId(null);
    }
  };

  const handleUnhide = async (materialId) => {
    try {
      setActioningId(materialId);
      await api.patch(`/materials/admin/material/${materialId}/unhide`);
      toast.success('Material unhidden');
      fetchMaterials();
      fetchStats();
    } catch (error) {
      toast.error('Failed to unhide material');
    } finally {
      setActioningId(null);
    }
  };

  if (loading && materials.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Total</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold">Pending</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-600 dark:text-green-400 text-sm font-semibold">Verified</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.verified}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Hidden</p>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.hidden}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search materials..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'verified'].map(status => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          {['hidden', 'visible'].map(hidden => (
            <button
              key={hidden}
              onClick={() => {
                setHiddenFilter(hidden === 'hidden' ? 'true' : 'false');
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                hiddenFilter === (hidden === 'hidden' ? 'true' : 'false')
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {hidden.charAt(0).toUpperCase() + hidden.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Table/List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {materials.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No materials found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Uploader</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Hidden</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(material => (
                <tr key={material._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{material.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{material.category?.subject || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{material.uploaderName || material.uploadedBy?.username || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      material.verification?.status === 'verified'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {material.verification?.status?.charAt(0).toUpperCase() + material.verification?.status?.slice(1) || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{material.isHidden ? '✓ Hidden' : '- Visible'}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    {material.isHidden ? (
                      <button
                        onClick={() => handleUnhide(material._id)}
                        disabled={actioningId === material._id}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        title="Unhide"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleHide(material._id)}
                        disabled={actioningId === material._id}
                        className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
                        title="Hide"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMaterialToDelete(material);
                        setShowDeleteModal(true);
                      }}
                      disabled={actioningId === material._id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded transition ${
                page === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && materialToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Material?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              This will permanently delete: <strong>{materialToDelete.title}</strong>
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">This action cannot be undone.</p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setMaterialToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(materialToDelete._id)}
                disabled={actioningId === materialToDelete._id}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialManagementTab;
