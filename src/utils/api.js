import axios from 'axios';
import { signOut } from "firebase/auth";
import { auth } from '../firebase/config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with longer timeout for Render cold starts
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout to handle Render cold starts
});

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Add timeout to token refresh to prevent hanging
        const tokenPromise = user.getIdToken(true);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Token refresh timeout')), 5000)
        );
        
        const token = await Promise.race([tokenPromise, timeoutPromise]);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        // Silently fail for token refresh - request will go through without auth
        // This prevents blocking non-critical requests like analytics
        console.log('⚠️ Token refresh skipped (request will continue)');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Only log critical errors, not analytics failures
    const isAnalyticsEndpoint = error.config?.url?.includes('/analytics');
    if (!isAnalyticsEndpoint) {
      console.error('❌ API error:', error.response?.status, error.response?.data?.message);
    }

    // Only sign out on 401 if it's NOT during login/profile fetch
    if (error.response?.status === 401) {
      const isLoginEndpoint = error.config?.url?.includes('/auth/google') || error.config?.url?.includes('/auth/profile');
      const currentUser = auth.currentUser;
      if (currentUser && !isLoginEndpoint) {
        try {
          await signOut(auth);
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        } catch (signOutError) {
          console.error('❌ Error signing out:', signOutError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  googleLogin: async (idToken) => {
    console.log('📤 Sending Google login request...');
    try {
      const response = await api.post('/auth/google', { idToken });
      console.log('✅ Google login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Google login failed:', error);
      throw error;
    }
  },

  getProfile: async () => {
    console.log('📤 Fetching user profile...');
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    console.log('📤 Updating user profile...');
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  logout: async () => {
    console.log('📤 Logging out...');
    const response = await api.post('/auth/logout');
    return response.data;
  },

  deleteAccount: async () => {
    console.log('📤 Deleting user account...');
    const response = await api.delete('/auth/account');
    return response.data;
  }
};

export const fileAPI = {
  //Get file with extracted text content
  getFileWithText: async (fileId) => {
    console.log('📖 Fetching file with extracted text:', fileId);
    // ✅ FIXED: Use longer timeout specifically for text extraction
    const response = await axios.get(`${API_URL}/files/view/${fileId}`, {
      timeout: 60000, // 60 seconds for text extraction
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token if user is logged in
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true);
        response.config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('❌ Error getting ID token:', error);
      }
    }

    return response.data;
  },

  // Keep all your other existing methods unchanged...
  getFiles: async (params = {}) => {
    const response = await api.get('/files', { params });
    return response.data;
  },

  getFilesByCategory: async (category, params = {}) => {
    const response = await api.get(`/files/category/${category}`, { params });
    return response.data;
  },

  getMyUploads: async () => {
    const response = await api.get('/files/my-uploads');
    return response.data;
  },

  getFileById: async (fileId) => {
    const response = await api.get(`/files/${fileId}`);
    return response.data;
  },

  // Bookmark methods
  addBookmark: async (fileId) => {
    const response = await api.post(`/files/bookmark/${fileId}`);
    return response.data;
  },

  removeBookmark: async (fileId) => {
    const response = await api.delete(`/files/bookmark/${fileId}`);
    return response.data;
  },

  getUserBookmarks: async (params = {}) => {
    const response = await api.get('/files/bookmarks', { params });
    return response.data;
  },

  // Star methods
  addStar: async (fileId) => {
    const response = await api.post(`/files/star/${fileId}`);
    return response.data;
  },

  removeStar: async (fileId) => {
    const response = await api.delete(`/files/star/${fileId}`);
    return response.data;
  },

  getUserStars: async (params = {}) => {
    const response = await api.get('/files/stars', { params });
    return response.data;
  },

  deleteMaterial: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  downloadFile: async (fileId) => {
    const response = await api.get(`/files/download/${fileId}`);
    return response.data;
  },

  uploadFile: async (formData, onProgress) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const token = await user.getIdToken(true);
    const response = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      timeout: 120000, // 2 minutes for file upload
      onUploadProgress: onProgress
    });

    return response.data;
  }
};

// ✅ NEW: Admin API calls
export const adminAPI = {
  // Check if current user is admin
  checkAccess: async () => {
    const response = await api.get('/admin/check-access');
    return response.data;
  },

  // Get all donations (admin only)
  getDonations: async (params = {}) => {
    const response = await api.get('/admin/donations', { params });
    return response.data;
  },

  // Add new donation (admin only)
  addDonation: async (donationData) => {
    const response = await api.post('/admin/donations', donationData);
    return response.data;
  },

  // Update donation (admin only)
  updateDonation: async (donationId, donationData) => {
    const response = await api.put(`/admin/donations/${donationId}`, donationData);
    return response.data;
  },

  // Delete donation (admin only)
  deleteDonation: async (donationId) => {
    const response = await api.delete(`/admin/donations/${donationId}`);
    return response.data;
  },

  // Get donation statistics (admin only)
  getDonationStats: async () => {
    const response = await api.get('/admin/donations/stats');
    return response.data;
  },

  // ✅ NEW: Event Management (admin only)
  // Get all events for admin
  getEvents: async () => {
    const response = await api.get('/admin/events');
    return response.data;
  },

  // Create new event (admin only)
  createEvent: async (eventData) => {
    const response = await api.post('/admin/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for file upload
    });
    return response.data;
  },

  // Update event (admin only)
  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/admin/events/${eventId}`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for file upload
    });
    return response.data;
  },

  // Delete event (admin only)
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/admin/events/${eventId}`);
    return response.data;
  },

  // Toggle event status (admin only)
  toggleEventStatus: async (eventId) => {
    const response = await api.patch(`/admin/events/${eventId}/toggle`);
    return response.data;
  },

  // ✅ NEW: Material Verification (admin only)
  // Get pending materials for verification
  getPendingMaterials: async () => {
    const response = await api.get('/admin/materials/pending');
    return response.data;
  },

  // Verify material (admin only)
  verifyMaterial: async (materialId) => {
    const response = await api.post(`/admin/materials/${materialId}/verify`);
    return response.data;
  },

  // Reject material (admin only)
  rejectMaterial: async (materialId, reason) => {
    const response = await api.post(`/admin/materials/${materialId}/reject`, { reason });
    return response.data;
  },

  // ✅ NEW: Get pending professor applications (admin only)
  getPendingProfessors: async () => {
    const response = await api.get('/professors/admin/all?status=pending');
    return response.data;
  },

  // ✅ NEW: Get total materials count
  getTotalMaterials: async () => {
    const response = await api.get('/files');
    return response.data;
  },

  // ✅ NEW: Get approved/active professors count
  getActiveProfessors: async () => {
    const response = await api.get('/professors/admin/all?status=approved');
    return response.data;
  }
};

// ✅ NEW: Public Donation API calls
export const donationAPI = {
  // Get all active donations (for marquee)
  getDonations: async () => {
    const response = await api.get('/donations');
    return response.data;
  }
};

// ✅ NEW: Public Event API calls
export const eventAPI = {
  // Get active events (for homepage)
  getActiveEvents: async () => {
    const response = await api.get('/events/active');
    return response.data;
  }
};

// ✅ NEW: Message API calls
export const messageAPI = {
  // Create new message (user)
  createMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Get user's messages (for profile page)
  getUserMessages: async (page = 1, status = 'all') => {
    const response = await api.get(`/messages/my-messages?page=${page}&status=${status}`);
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response.data;
  },

  // Delete message (user)
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  }
};

// ✅ NEW: Admin Message API calls
export const adminMessageAPI = {
  // Get all messages (admin)
  getAllMessages: async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...filters
    });
    const response = await api.get(`/messages/admin/all?${params}`);
    return response.data;
  },

  // Update message status (admin)
  updateMessageStatus: async (messageId, updateData) => {
    const response = await api.patch(`/messages/admin/${messageId}/status`, updateData);
    return response.data;
  },

  // Delete message (admin)
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/admin/${messageId}`);
    return response.data;
  },

  // NEW: Reply to message (admin)
  replyToMessage: async (messageId, replyText) => {
    const response = await api.post(`/messages/admin/${messageId}/reply`, {
      reply: replyText
    });
    return response.data;
  }
};

export default api;
