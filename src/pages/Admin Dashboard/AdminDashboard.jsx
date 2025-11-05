import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI, adminMessageAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Users,
  IndianRupee,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Activity,
  Calendar,
  Image,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  FileText
} from 'lucide-react';
import PencilLoader from '../../components/PencilLoader/PencilLoader';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);
  const [pendingMaterials, setPendingMaterials] = useState([]); // NEW: Pending materials
  const [activeTab, setActiveTab] = useState('donations');
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    activeDonations: 0,
    recentDonations: []
  });

  // Form states for donations
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [formData, setFormData] = useState({
    donorName: '',
    amount: '',
    notes: ''
  });

  // Form states for events
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormLoading, setEventFormLoading] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    sectionTitle: '',
    description: '',
    eventImage: null
  });

  // Messages state management
  const [messages, setMessages] = useState([]);
  const [messageStats, setMessageStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [messageFilters, setMessageFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  });

  // NEW: Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingMaterial, setRejectingMaterial] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionCategory, setRejectionCategory] = useState('quality');

  // NEW: Message reply modal state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Check admin access on component mount
  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const response = await adminAPI.checkAccess();
      if (!response.isAdmin) {
        toast.error('Admin access required');
        navigate('/');
        return;
      }
      
      setIsAdmin(true);
      await fetchDashboardData();
    } catch (error) {
      console.error('Admin check failed:', error);
      toast.error('Failed to verify admin access');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [donationsResponse, statsResponse, eventsResponse, messagesResponse, materialsResponse] = await Promise.all([
        adminAPI.getDonations(),
        adminAPI.getDonationStats(),
        adminAPI.getEvents(),
        adminMessageAPI.getAllMessages(),
        adminAPI.getPendingMaterials() // NEW: Fetch pending materials
      ]);

      setDonations(donationsResponse.data.donations || []);
      setStats(statsResponse.data || {
        totalAmount: 0,
        totalDonations: 0,
        activeDonations: 0,
        recentDonations: []
      });
      setEvents(eventsResponse.events || []);
      setPendingMaterials(materialsResponse.data || []); // NEW: Set pending materials
      
      // Set messages and calculate stats - with better error handling
      console.log('Messages response:', messagesResponse); // Debug log
      const messagesData = messagesResponse?.messages || [];
      setMessages(messagesData);
      
      const stats = messagesData.reduce((acc, msg) => {
        acc[msg.status] = (acc[msg.status] || 0) + 1;
        acc.total++;
        return acc;
      }, { pending: 0, approved: 0, rejected: 0, total: 0 });
      
      setMessageStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set empty states on error to prevent crashes
      setMessages([]);
      setMessageStats({ pending: 0, approved: 0, rejected: 0, total: 0 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.donorName.trim() || !formData.amount) {
      toast.error('Please fill in required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount < 1 || amount > 1000000) {
      toast.error('Amount must be between ₹1 and ₹10,00,000');
      return;
    }

    try {
      if (editingDonation) {
        await adminAPI.updateDonation(editingDonation._id, {
          donorName: formData.donorName.trim(),
          amount: amount,
          notes: formData.notes.trim(),
          isActive: true
        });
        toast.success('Donation updated successfully');
      } else {
        await adminAPI.addDonation({
          donorName: formData.donorName.trim(),
          amount: amount,
          notes: formData.notes.trim()
        });
        toast.success('Donation added successfully');
      }

      // Reset form and refresh data
      setFormData({ donorName: '', amount: '', notes: '' });
      setShowAddForm(false);
      setEditingDonation(null);
      await fetchDashboardData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to save donation'
      );
    }
  };

  const handleEdit = (donation) => {
    setFormData({
      donorName: donation.donorName,
      amount: donation.amount.toString(),
      notes: donation.notes || ''
    });
    setEditingDonation(donation);
    setShowAddForm(true);
  };

  const handleToggleActive = async (donation) => {
    try {
      await adminAPI.updateDonation(donation._id, {
        ...donation,
        isActive: !donation.isActive
      });
      toast.success(
        `Donation ₹{donation.isActive ? 'hidden' : 'shown'} in marquee`
      );
      await fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update donation status');
    }
  };

  const handleDelete = async (donation) => {
    if (!window.confirm(`Are you sure you want to delete donation from ₹{donation.donorName}?`)) {
      return;
    }

    try {
      await adminAPI.deleteDonation(donation._id);
      toast.success('Donation deleted successfully');
      await fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete donation');
    }
  };

  const handleCancel = () => {
    setFormData({ donorName: '', amount: '', notes: '' });
    setShowAddForm(false);
    setEditingDonation(null);
  };

  // ✅ NEW: Event Management Functions
  const handleEventSubmit = async (e) => {
    e.preventDefault();

    if (!eventFormData.description.trim()) {
      toast.error('Please enter event description');
      return;
    }

    if (!editingEvent && !eventFormData.eventImage) {
      toast.error('Please select an event image');
      return;
    }

    setEventFormLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('description', eventFormData.description.trim());
      formDataToSend.append('sectionTitle', eventFormData.sectionTitle.trim() || '🎉 Current Events');
      
      if (eventFormData.eventImage) {
        formDataToSend.append('eventImage', eventFormData.eventImage);
      }

      if (editingEvent) {
        toast.loading('Updating event... This may take a moment for image uploads.');
        await adminAPI.updateEvent(editingEvent._id, formDataToSend);
        toast.dismiss();
        toast.success('Event updated successfully');
      } else {
        toast.loading('Creating event... This may take a moment for image uploads.');
        await adminAPI.createEvent(formDataToSend);
        toast.dismiss();
        toast.success('Event created successfully');
      }

      handleEventCancel();
      await fetchDashboardData();
    } catch (error) {
      toast.dismiss();
      console.error('Event operation failed:', error);
      
      // Better error messages based on error type
      if (error.code === 'ECONNABORTED') {
        toast.error('Upload timeout - Please check your internet connection and try with a smaller image');
      } else if (error.response?.status === 413) {
        toast.error('Image file is too large. Please use an image smaller than 5MB');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || 'Invalid input data');
      } else if (error.response?.status === 500) {
        toast.error('Server error - Please try again later');
      } else {
        toast.error(editingEvent ? 'Failed to update event' : 'Failed to create event');
      }
    } finally {
      setEventFormLoading(false);
    }
  };  const handleEventEdit = (event) => {
    setEditingEvent(event);
    setEventFormData({
      sectionTitle: event.sectionTitle || '',
      description: event.description || '',
      eventImage: null
    });
    setShowEventForm(true);
  };

  const handleEventToggle = async (event) => {
    try {
      await adminAPI.toggleEventStatus(event._id);
      toast.success(`Event ${event.isActive ? 'deactivated' : 'activated'} successfully`);
      await fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update event status');
    }
  };

  const handleEventDelete = async (event) => {
    if (!window.confirm(`Are you sure you want to delete this event: "${event.description}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteEvent(event._id);
      toast.success('Event deleted successfully');
      await fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleEventCancel = () => {
    setEventFormData({ sectionTitle: '', description: '', eventImage: null });
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setEventFormData({ ...eventFormData, eventImage: file });
    }
  };

  // ✅ NEW: Message Management Functions
  const handleUpdateMessageStatus = async (messageId, newStatus) => {
    try {
      await adminMessageAPI.updateMessageStatus(messageId, {
        status: newStatus
      });
      toast.success(`Message ${newStatus} successfully`);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Failed to update message status');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await adminMessageAPI.deleteMessage(messageId);
      toast.success('Message deleted successfully');
      await fetchDashboardData();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // NEW: Message reply presets based on category
  const replyPresets = {
    bug_report: [
      'Fixed - Issue has been resolved',
      'Fixing - We are currently working on this',
      'Not Reproducible - We could not reproduce this issue',
      'Working As Intended - This is expected behavior'
    ],
    feedback: [
      'Noted - Thank you for your feedback',
      'Implementing - We are considering this suggestion',
      'Planned - This is on our roadmap',
      'Under Review - We are evaluating this'
    ],
    feature_request: [
      'Noted - Thank you for the suggestion',
      'Planned - This will be added in future updates',
      'Considering - We will evaluate this request',
      'Not Planned - This does not align with our vision'
    ],
    event_request: [
      'Approved - Your event request has been approved. Please reach out to us at praveerkishore45@gmail.com for next steps',
      'Under Review - We are currently reviewing your event proposal and will respond within 48 hours',
      'Declined - Thank you for your interest, but we cannot host this event at this time',
      'More Info Needed - We need additional details about your event. Please contact us at kaushalmandal13590@gmail.com'
    ],
    review: [
      'Thank you for your review',
      'We appreciate your feedback',
      'Thank you for using our platform',
      'We value your input'
    ],
    general: [
      'Thank you for your message',
      'We will get back to you soon',
      'Your message has been received',
      'Thank you for reaching out'
    ],
    other: [
      'Thank you for your message',
      'We will review and respond soon',
      'Your message has been received',
      'Thank you for contacting us'
    ]
  };

  // NEW: Handle message reply
  const handleSendReply = async () => {
    if (!replyingTo || !replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    const replyToastId = toast.loading('Sending reply...');

    try {
      await adminMessageAPI.replyToMessage(replyingTo._id, replyText);
      toast.dismiss(replyToastId);
      toast.success('Reply sent successfully!');
      setReplyingTo(null);
      setReplyText('');
      await fetchDashboardData();
    } catch (error) {
      toast.dismiss(replyToastId);
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  // ✅ NEW: Material Verification Functions
  const fetchPendingMaterials = async () => {
    try {
      const response = await adminAPI.getPendingMaterials();
      setPendingMaterials(response.data || []);
    } catch (error) {
      console.error('Error fetching pending materials:', error);
      toast.error('Failed to fetch pending materials');
    }
  };

  const handleVerifyMaterial = async (materialId, materialTitle) => {
    if (!window.confirm(`Are you sure you want to verify "${materialTitle}"?`)) {
      return;
    }

    try {
      await adminAPI.verifyMaterial(materialId);
      toast.success('Material verified successfully!');
      fetchPendingMaterials(); // Refresh the list
    } catch (error) {
      console.error('Error verifying material:', error);
      toast.error('Failed to verify material');
    }
  };

  // NEW: Enhanced rejection with modal
  const handleRejectMaterial = async (materialId, materialTitle) => {
    setRejectingMaterial({ id: materialId, title: materialTitle });
    setShowRejectModal(true);
  };

  // NEW: Process the actual rejection
  const processRejection = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const fullReason = `[${rejectionCategory.toUpperCase()}] ${rejectionReason.trim()}`;
      await adminAPI.rejectMaterial(rejectingMaterial.id, fullReason);
      toast.success(`✅ Material "${rejectingMaterial.title}" rejected successfully`);
      
      // Close modal and reset state
      setShowRejectModal(false);
      setRejectingMaterial(null);
      setRejectionReason('');
      setRejectionCategory('quality');
      
      // Refresh the list
      fetchPendingMaterials();
    } catch (error) {
      console.error('Error rejecting material:', error);
      toast.error('Failed to reject material');
    }
  };

  // NEW: Cancel rejection
  const cancelRejection = () => {
    setShowRejectModal(false);
    setRejectingMaterial(null);
    setRejectionReason('');
    setRejectionCategory('quality');
  };

  const getFilteredMessages = () => {
    return messages.filter(message => {
      const statusMatch = messageFilters.status === 'all' || message.status === messageFilters.status;
      const categoryMatch = messageFilters.category === 'all' || message.category === messageFilters.category;
      const priorityMatch = messageFilters.priority === 'all' || message.priority === messageFilters.priority;
      
      return statusMatch && categoryMatch && priorityMatch;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-900/40';
      case 'high':
        return 'text-orange-600 bg-orange-50 dark:text-orange-300 dark:bg-orange-900/40';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-900/40';
      case 'low':
        return 'text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-900/40';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-300 dark:bg-gray-800/60';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <PencilLoader size="w-20 h-20" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage donations, events, and student messages in one place.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 p-4 sm:p-6 transition-colors duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{stats.totalAmount?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 p-4 sm:p-6 transition-colors duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Donations</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalDonations || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 p-4 sm:p-6 transition-colors duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Active Events</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{events.filter(event => event.isActive).length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 mb-6 transition-colors duration-300">
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex flex-wrap gap-2" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('donations')}
                className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === 'donations'
                    ? 'border-2 border-blue-400 bg-blue-50 text-blue-600 dark:border-blue-500/70 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
                    : 'border border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:text-gray-200 dark:hover:bg-gray-800/60'
                }`}
              >
                <IndianRupee className="h-4 w-4" />
                Donations
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === 'events'
                    ? 'border-2 border-blue-400 bg-blue-50 text-blue-600 dark:border-blue-500/70 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
                    : 'border border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:text-gray-200 dark:hover:bg-gray-800/60'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Events
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === 'messages'
                    ? 'border-2 border-blue-400 bg-blue-50 text-blue-600 dark:border-blue-500/70 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
                    : 'border border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:text-gray-200 dark:hover:bg-gray-800/60'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Messages ({messageStats.pending})
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === 'materials'
                    ? 'border-2 border-blue-400 bg-blue-50 text-blue-600 dark:border-blue-500/70 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
                    : 'border border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:text-gray-200 dark:hover:bg-gray-800/60'
                }`}
              >
                <FileText className="h-4 w-4" />
                Material Verification ({pendingMaterials.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Donations Tab Content */}
        {activeTab === 'donations' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Manage Donations</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Control marquee shout-outs and celebrate supporters in real time.
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
              >
                <Plus className="h-4 w-4" />
                {showAddForm ? 'Close Donation Form' : 'Add New Donation'}
              </button>
            </div>

            {showAddForm && (
              <div className="rounded-lg border border-gray-100 bg-white p-4 sm:p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/40">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {editingDonation ? 'Edit Donation' : 'Add New Donation'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Highlight donors that keep our mission running smoothly.
                </p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Donor Name *
                      </label>
                      <input
                        type="text"
                        value={formData.donorName}
                        onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                        placeholder="Enter donor name"
                        maxLength={100}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                        placeholder="Enter amount"
                        min="1"
                        max="1000000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      placeholder="Add any notes about this donation"
                      rows="3"
                      maxLength={500}
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
                    >
                      {editingDonation ? 'Update Donation' : 'Add Donation'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="rounded-lg border border-gray-100 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/40">
              <div className="flex flex-col gap-2 justify-between border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:px-6 dark:border-gray-700">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">All Donations</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Manage supporters displayed in the homepage marquee.
                  </p>
                </div>
                <button
                  onClick={() => fetchDashboardData()}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-500/40 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                  title="Refresh donations data"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:bg-gray-800/80 dark:text-gray-300">
                    <tr>
                      <th className="px-3 sm:px-6 py-3">Donor Name</th>
                      <th className="px-3 sm:px-6 py-3">Amount</th>
                      <th className="px-3 sm:px-6 py-3">Status</th>
                      <th className="px-3 sm:px-6 py-3">Date Added</th>
                      <th className="px-3 sm:px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {donations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-3 sm:px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                          No donations added yet. Click "Add New Donation" to get started.
                        </td>
                      </tr>
                    ) : (
                      donations.map((donation) => (
                        <tr key={donation._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                          <td className="px-3 sm:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {donation.donorName}
                            </div>
                            {donation.notes && (
                              <div className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                                {donation.notes}
                              </div>
                            )}
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              ₹{donation.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium uppercase tracking-wide rounded-full ${
                                donation.isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                              }`}
                            >
                              {donation.isActive ? 'Active' : 'Hidden'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => handleEdit(donation)}
                                className="rounded p-1 text-blue-600 transition-colors hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/40"
                                title="Edit donation"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleActive(donation)}
                                className={`rounded p-1 transition-colors ${
                                  donation.isActive
                                    ? 'text-orange-600 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-900/40'
                                    : 'text-green-600 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/40'
                                }`}
                                title={donation.isActive ? 'Hide from marquee' : 'Show in marquee'}
                              >
                                {donation.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleDelete(donation)}
                                className="rounded p-1 text-red-600 transition-colors hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/40"
                                title="Delete donation"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab Content */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Manage Events</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Keep the homepage spotlight fresh with timely updates.</p>
              </div>
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
              >
                <Plus className="h-4 w-4" />
                {showEventForm ? 'Close Event Form' : 'Add New Event'}
              </button>
            </div>

            {showEventForm && (
              <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/40">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={eventFormData.sectionTitle}
                      onChange={(e) => setEventFormData({ ...eventFormData, sectionTitle: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      placeholder="e.g., 🎉 Current Events, 🏆 Achievements, 🤝 Sponsorships"
                      maxLength={50}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Appears as the main heading on the homepage events block. Leave empty for default.
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description *
                    </label>
                    <textarea
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      placeholder="Enter event description or announcement details"
                      maxLength={200}
                      required
                      rows={3}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      This is shown beneath the heading. {200 - eventFormData.description.length} characters remaining.
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Event Image {!editingEvent && '*'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEventImageChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      required={!editingEvent}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Max size 5MB • Supported: JPG, PNG, GIF</p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={eventFormLoading}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 ${
                        eventFormLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {eventFormLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                          {editingEvent ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingEvent ? 'Update Event' : 'Create Event'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleEventCancel}
                      disabled={eventFormLoading}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900 ${
                        eventFormLoading
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="rounded-lg border border-gray-100 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/40">
              <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Events Overview</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Review the announcements that power the homepage highlights.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    Active: {events.filter((event) => event.isActive).length}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                    Inactive: {events.filter((event) => !event.isActive).length}
                  </div>
                  <button
                    onClick={() => fetchDashboardData()}
                    className="inline-flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-green-500/40 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                    title="Refresh events data"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center dark:border-gray-600 dark:bg-gray-900/40">
                    <Calendar className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No events yet</h4>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Create your first announcement to bring life to the homepage events section.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
                    {events.map((event) => {
                      const formattedDate = new Date(event.createdAt).toLocaleDateString();
                      return (
                        <article
                          key={event._id}
                          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-blue-500/60"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row">
                            <div className="lg:w-48">
                              <div className="relative h-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                                {event.imageUrl ? (
                                  <img
                                    src={event.imageUrl}
                                    alt={event.sectionTitle || event.description}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-400 dark:text-gray-500">
                                    No image
                                  </div>
                                )}
                                <span
                                  className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ${
                                    event.isActive ? 'bg-green-600/90' : 'bg-gray-500/80'
                                  }`}
                                >
                                  {event.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-col gap-2">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                  Section Title
                                </p>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  {event.sectionTitle || '🎉 Current Events'}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {event.description}
                                </p>
                              </div>

                              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                                  <Calendar className="h-3 w-3" />
                                  {formattedDate}
                                </span>
                                {event.createdBy && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    <Users className="h-3 w-3" />
                                    {event.createdBy}
                                  </span>
                                )}
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                  <FileText className="h-3 w-3" />
                                  ID: {event._id.slice(-6)}
                                </span>
                              </div>

                              <div className="mt-5 flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => handleEventEdit(event)}
                                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-500/40 dark:text-blue-300 dark:hover:bg-blue-900/40"
                                  title="Edit event"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleEventToggle(event)}
                                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${
                                    event.isActive
                                      ? 'border-orange-300 text-orange-600 hover:bg-orange-50 focus:ring-orange-400 dark:border-orange-500/40 dark:text-orange-300 dark:hover:bg-orange-900/40'
                                      : 'border-green-300 text-green-600 hover:bg-green-50 focus:ring-green-400 dark:border-green-500/40 dark:text-green-300 dark:hover:bg-green-900/40'
                                  }`}
                                  title={event.isActive ? 'Deactivate event' : 'Activate event'}
                                >
                                  {event.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  {event.isActive ? 'Hide' : 'Show'}
                                </button>
                                <button
                                  onClick={() => handleEventDelete(event)}
                                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-900/40"
                                  title="Delete event"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab Content */}
        {activeTab === 'messages' && (
          <div>
            {/* Message Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 p-3 sm:p-4 transition-colors duration-300">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400">{messageStats.pending}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 p-3 sm:p-4 transition-colors duration-300">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Approved</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">{messageStats.approved}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 p-3 sm:p-4 transition-colors duration-300">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                    <p className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">{messageStats.rejected}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 p-3 sm:p-4 transition-colors duration-300">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-600 dark:text-gray-200">{messageStats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Filters */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 p-4 mb-4 sm:mb-6 transition-colors duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={messageFilters.status}
                    onChange={(e) => setMessageFilters({...messageFilters, status: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    value={messageFilters.category}
                    onChange={(e) => setMessageFilters({...messageFilters, category: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Categories</option>
                    <option value="event_request">Event Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="review">Review</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="general">General</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                  <select
                    value={messageFilters.priority}
                    onChange={(e) => setMessageFilters({...messageFilters, priority: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 transition-colors duration-300">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">Student Messages</h3>
                <button
                  onClick={() => fetchDashboardData()}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
                  title="Refresh messages data"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
              
              {/* Mobile Card Layout */}
              <div className="block sm:hidden">
                {getFilteredMessages().length === 0 ? (
                  <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No messages found matching current filters
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {getFilteredMessages().map((message) => (
                      <div key={message._id} className="p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(message.priority)}`}>
                                {message.priority}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{message.subject}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{message.userName} • {message.userEmail}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 whitespace-pre-wrap break-words">{message.message}</p>
                            {message.adminResponse && (
                              <div className="mt-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-500/40 rounded p-2 whitespace-pre-wrap break-words">
                                <span className="font-medium">Your reply:</span> {message.adminResponse}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="capitalize">{message.category.replace('_', ' ')}</span>
                              <span>•</span>
                              <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setReplyingTo(message)}
                            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/60 flex-1 transition-colors"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/60">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Student & Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category & Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Reply
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {getFilteredMessages().length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No messages found matching current filters
                        </td>
                      </tr>
                    ) : (
                      getFilteredMessages().map((message) => (
                        <tr key={message._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {message.userName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {message.userEmail}
                              </div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                                {message.subject}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap break-words max-w-md">
                                {message.message}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                {message.category.replace('_', ' ').toUpperCase()}
                              </span>
                              <div className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                                  {message.priority.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                            {message.adminResponse ? (
                              <div className="max-w-xs whitespace-pre-wrap break-words">
                                {message.adminResponse}
                                {message.respondedAt && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(message.respondedAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 italic">No reply yet</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setReplyingTo(message)}
                                className="p-1 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
                                title="Reply to message"
                              >
                                <Send className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="p-1 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"
                                title="Delete message"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Material Verification Tab Content */}
        {activeTab === 'materials' && (
          <div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/40 transition-colors duration-300">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Material Verification Queue
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Review pending uploads before they go live for students.
                </p>
              </div>

              {pendingMaterials.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No materials pending verification</p>
                </div>
              ) : (
                <div className="px-4 sm:px-6 py-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/60">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Material Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Uploaded By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Upload Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {pendingMaterials.map((material) => (
                        <tr key={material._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {material.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {material.category?.type} • {material.category?.subject}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {material.metadata?.course} • Semester {material.category?.semester}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-gray-200">
                              User ID: {material.uploadedBy}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              College: {material.metadata?.collegeName}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(material.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              {/* View Document Button - Navigate to view page */}
                              <button
                                onClick={() => navigate(`/materials/view/${material._id}`)}
                                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/60"
                                title="View full document with all details"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </button>
                              
                              <button
                                onClick={() => handleVerifyMaterial(material._id, material.title)}
                                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-900/40 dark:text-green-200 dark:hover:bg-green-900/60"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verify
                              </button>
                              <button
                                onClick={() => handleRejectMaterial(material._id, material.title)}
                                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

      {/* NEW: Enhanced Rejection Modal */}
      {showRejectModal && rejectingMaterial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl dark:shadow-gray-950/70 max-w-md w-full mx-4 border border-transparent dark:border-gray-700">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  Reject Material
                </h3>
                <button
                  onClick={cancelRejection}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Material Info */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/70 rounded-lg border border-transparent dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Material: {rejectingMaterial.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  This action will permanently reject this material and remove it from storage.
                </p>
              </div>

              {/* Rejection Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Rejection Category *
                </label>
                <select
                  value={rejectionCategory}
                  onChange={(e) => setRejectionCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="quality">Quality Issues</option>
                  <option value="content">Inappropriate Content</option>
                  <option value="copyright">Copyright Violation</option>
                  <option value="duplicate">Duplicate Material</option>
                  <option value="format">File Format Issues</option>
                  <option value="accuracy">Inaccurate Information</option>
                  <option value="guidelines">Violates Guidelines</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Rejection Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Detailed Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a detailed explanation for rejecting this material..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="4"
                  maxLength="500"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {rejectionReason.length}/500 characters
                  </p>
                  {rejectionReason.length > 450 && (
                    <p className="text-xs text-orange-600">
                      {500 - rejectionReason.length} characters remaining
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Reason Templates */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Quick Templates:</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Poor image quality or unreadable content",
                    "File appears to be corrupted or incomplete",
                    "Content does not match the selected category",
                    "Duplicate of existing material",
                    "Contains inappropriate or irrelevant content"
                  ].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setRejectionReason(template)}
                      className="text-left text-xs text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 p-2 rounded transition-colors"
                    >
                      "{template}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelRejection}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={processRejection}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Material
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Message Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl dark:shadow-gray-950/70 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-gray-700">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Reply to Message
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  From: <span className="font-medium text-gray-700 dark:text-gray-200">{replyingTo.userName}</span> ({replyingTo.userEmail})
                </p>
              </div>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 space-y-4">
              {/* Original Message Context */}
              <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-4 border-l-4 border-blue-400/80">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Original Message</p>
                <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1">{replyingTo.subject}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{replyingTo.message}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="capitalize bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {replyingTo.category.replace('_', ' ')}
                  </span>
                  <span>{new Date(replyingTo.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Reply Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Quick Replies ({replyingTo.category})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(replyPresets[replyingTo.category] || replyPresets.general).map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReplyText(preset)}
                      className={`text-left px-3 py-2 text-sm rounded-lg border transition-colors ${
                        replyText === preset
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/20 dark:text-blue-200'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Reply */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Your Reply (or customize above)
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                  rows="5"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {replyText.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
