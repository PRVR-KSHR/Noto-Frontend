// src/pages/Profile/Profile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fileAPI, authAPI, messageAPI } from "../../utils/api";
import toast from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import PencilLoader from "../../components/PencilLoader/PencilLoader";
import UserAvatar from "../../components/UserAvatar";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Clock,
  FileSignature,
  Download,
  Calendar,
  User,
  Building2,
  Bookmark,
  BookmarkCheck,
  Upload,
  Heart,
  Eye,
  Settings,
  Trash2,
  AlertCircle,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Clock3,
  Star,
  RefreshCw,
} from "lucide-react";

const Profile = () => {
  const { user, userProfile, logout, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("materials");
  const [myMaterials, setMyMaterials] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [actualCounts, setActualCounts] = useState({
    uploads: 0,
    bookmarks: 0,
    messages: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Helper function to count words
  const countWords = (text) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  // ✅ NEW: Message Form state
  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: "",
    category: "general",
  });

  const handleMessageChange = (value) => {
    const wordCount = countWords(value);
    if (wordCount <= 1200) {
      setMessageForm({ ...messageForm, message: value });
    }
  };
  const [showMessageForm, setShowMessageForm] = useState(false);

  // ✅ NEW: Delete account with confirmation
  const handleDeleteAccount = async () => {
    const finalConfirmation = window.confirm(
      "⚠️ FINAL WARNING: This will permanently delete your account and ALL your uploaded files. This action CANNOT be undone. Are you absolutely sure?"
    );

    if (!finalConfirmation) {
      setShowDeleteModal(false);
      return;
    }

    const deleteToastId = toast.loading("🗑️ Deleting account...", {
      duration: Infinity,
    });

    try {
      await authAPI.deleteAccount();
      toast.dismiss(deleteToastId);
      toast.success("Account deleted successfully");

      // Log out and redirect
      await signOut(auth);
      navigate("/");
    } catch (error) {
      toast.dismiss(deleteToastId);
      toast.error(
        `Failed to delete account: ${
          error.response?.data?.message || error.message
        }`
      );
    }

    setShowDeleteModal(false);
  };

  // Categories for filtering
  const categories = [
    { value: "all", label: "All", icon: BookOpen },
    { value: "notes", label: "Notes", icon: BookOpen },
    { value: "assignments", label: "Assignments", icon: FileText },
    { value: "practical", label: "Practicals", icon: GraduationCap },
    { value: "prevquestionpaper", label: "PYQs", icon: Clock },
    { value: "researchpaper", label: "Research Papers", icon: FileSignature },
  ];

  // Message categories
  const messageCategories = [
    { value: "general", label: "General Inquiry" },
    { value: "event_request", label: "Event Request" },
    { value: "feedback", label: "Feedback" },
    { value: "review", label: "Review" },
    { value: "bug_report", label: "Bug Report" },
    { value: "feature_request", label: "Feature Request" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    // ✅ FETCH: Get actual counts on component mount
    fetchActualCounts();

    if (activeTab === "materials") {
      fetchMyMaterials();
    } else if (activeTab === "bookmarks") {
      fetchBookmarks();
    } else if (activeTab === "messages") {
      fetchMessages();
    }
  }, [activeTab, selectedCategory]);

  // ✅ NEW: Refresh data when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && activeTab === "materials") {
        // Refresh materials when user returns to the page
        fetchMyMaterials();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeTab]);

  // ✅ NEW: Fetch actual counts from API
  const fetchActualCounts = async () => {
    try {
      const [uploadsResponse, bookmarksResponse, messagesResponse] =
        await Promise.all([
          fileAPI.getMyUploads(),
          fileAPI.getUserBookmarks(),
          messageAPI.getUserMessages(),
        ]);

      setActualCounts({
        uploads: uploadsResponse.data.files?.length || 0,
        bookmarks: bookmarksResponse.data.files?.length || 0,
        messages: messagesResponse.messages?.length || 0,
      });
    } catch (error) {
      console.error("Failed to fetch actual counts:", error);
    }
  };

  const fetchMyMaterials = async () => {
    try {
      setLoading(true);
      const response = await fileAPI.getMyUploads();
      let materials = response.data.files || [];

      // Filter by category if not 'all'
      if (selectedCategory !== "all") {
        materials = materials.filter(
          (material) => material.category.type === selectedCategory
        );
      }

      setMyMaterials(materials);
      // ✅ UPDATE: Update actual upload count
      setActualCounts((prev) => ({
        ...prev,
        uploads: response.data.files?.length || 0,
      }));
    } catch (error) {
      toast.error("Failed to load your materials.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await fileAPI.getUserBookmarks();
      let bookmarkedFiles = response.data.files || [];

      // Filter by category if not 'all'
      if (selectedCategory !== "all") {
        bookmarkedFiles = bookmarkedFiles.filter(
          (material) => material.category.type === selectedCategory
        );
      }

      setBookmarks(bookmarkedFiles);
      // ✅ UPDATE: Update actual bookmark count
      setActualCounts((prev) => ({
        ...prev,
        bookmarks: response.data.files?.length || 0,
      }));
    } catch (error) {
      toast.error("Failed to load your bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch user messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await messageAPI.getUserMessages();
      setMessages(response.messages || []);
      setActualCounts((prev) => ({
        ...prev,
        messages: response.messages?.length || 0,
      }));
    } catch (error) {
      toast.error("Failed to load your messages.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Check if user has any existing messages
  const hasExistingMessage = () => {
    return messages.length > 0;
  };

  // ✅ NEW: Handle new message button click with limitation
  const handleNewMessageClick = () => {
    if (hasExistingMessage()) {
      toast.error(
        "You can only have one message at a time. Please delete your existing message before creating a new one."
      );
      return;
    }
    setShowMessageForm(true);
  };

  // ✅ NEW: Send new message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const sendToastId = toast.loading("📤 Sending message...", {
      duration: Infinity,
    });

    try {
      await messageAPI.createMessage(messageForm);
      toast.dismiss(sendToastId);
      toast.success("✅ Message sent successfully!");

      // Reset form and close modal
      setMessageForm({ subject: "", message: "", category: "general" });
      setShowMessageForm(false);

      // Refresh messages
      fetchMessages();
    } catch (error) {
      toast.dismiss(sendToastId);
      toast.error("Failed to send message. Please try again.");
    }
  };

  // ✅ NEW: Delete message
  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await messageAPI.deleteMessage(messageId);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      setActualCounts((prev) => ({ ...prev, messages: prev.messages - 1 }));
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fileAPI.downloadFile(fileId);
      window.open(response.data.downloadUrl, "_blank");
      toast.success(`📥 Downloading ${fileName}`);
    } catch (error) {
      toast.error("Download failed. Please try again.");
    }
  };

  // ✅ NEW: Delete material with confirmation
  // ✅ FIXED: Delete material with isolated error handling
  const handleDeleteMaterial = async (fileId, fileName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    const deleteToastId = toast.loading("🗑️ Deleting file...", {
      duration: Infinity,
    });

    // 1) Isolate the delete API call - only true delete failures show error toast
    try {
      await fileAPI.deleteMaterial(fileId);
      toast.dismiss(deleteToastId);
      toast.success(`🗑️ "${fileName}" deleted successfully`);
    } catch (deleteError) {
      toast.dismiss(deleteToastId);
      toast.error(`Failed to delete "${fileName}". Please try again.`);
      return; // Stop here if delete actually failed
    }

    // 2) Post-delete cleanup - errors here won't show "delete failed" toast
    try {
      // Update local state
      setMyMaterials((prev) =>
        prev.filter((material) => material._id !== fileId)
      );
      setActualCounts((prev) => ({ ...prev, uploads: prev.uploads - 1 }));

      console.log("✅ File deleted and UI updated");

      // Background refresh
      fetchActualCounts();
    } catch (uiError) {
      // Silent handling - UI refresh errors shouldn't confuse user about delete status
      console.warn("Post-delete UI update failed:", uiError);
    }
  };

  const handleRemoveBookmark = async (fileId) => {
    try {
      await fileAPI.removeBookmark(fileId);
      toast.success("Bookmark removed");

      // Update local state
      setBookmarks((prev) =>
        prev.filter((bookmark) => bookmark._id !== fileId)
      );
      setActualCounts((prev) => ({ ...prev, bookmarks: prev.bookmarks - 1 }));

      fetchBookmarks(); // Refresh bookmarks
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
  };

  const getCategoryInfo = (categoryType) => {
    return (
      categories.find((cat) => cat.value === categoryType) || categories[0]
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ✅ UPDATED: Material card with delete button
  const renderMaterialCard = (
    material,
    showBookmarkAction = false,
    showDeleteButton = false
  ) => {
    const categoryInfo = getCategoryInfo(material.category.type);
    const CategoryIcon = categoryInfo.icon;

    return (
      <div
        key={material._id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-4 sm:p-6 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 relative"
      >
        {/* ✅ DELETE BUTTON: Top right corner */}
        {showDeleteButton && (
          <button
            onClick={() => handleDeleteMaterial(material._id, material.title)}
            className="absolute top-3 right-3 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title={`Delete ${material.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <CategoryIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate pr-0 sm:pr-8 text-center sm:text-left">
                {material.title}
              </h3>
            </div>

            <div className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1 text-center sm:text-left">
              <p>
                <strong>Subject:</strong> {material.category.subject}
              </p>
              <p>
                <strong>Course:</strong> {material.category.branch}
              </p>
              <p>
                <strong>Semester:</strong> {material.category.semester}
              </p>
              <p>
                <strong>College:</strong> {material.metadata.collegeName}
              </p>
              {/* NEW: Verification Status Display - only for uploaded materials */}
              {!showBookmarkAction && material.verification && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <strong>Status:</strong>
                  <div className="relative group">
                    {material.verification.status === "verified" && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Verified</span>
                      </div>
                    )}
                    {material.verification.status === "pending" && (
                      <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                        <Clock3 className="w-4 h-4" />
                        <span className="font-medium">Pending Review</span>
                      </div>
                    )}
                    {material.verification.status === "rejected" && (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="font-medium">Rejected</span>
                      </div>
                    )}

                    {/* Hover tooltip with additional info */}
                    <div className="invisible group-hover:visible absolute z-10 w-72 p-4 mt-1 text-sm text-white bg-gray-800 dark:bg-gray-900 rounded-lg shadow-lg -left-20 sm:left-0">
                      {material.verification.status === "verified" && (
                        <div>
                          <p className="font-semibold text-green-300 dark:text-green-400 mb-2">
                            ✓ Verified by Admin
                          </p>
                          <p className="text-gray-300 dark:text-gray-400 mb-2">
                            This material has been reviewed and approved by
                            administrators.
                          </p>
                          {material.verification.verifiedAt && (
                            <p className="text-gray-400 dark:text-gray-500 text-xs">
                              Verified:{" "}
                              {new Date(
                                material.verification.verifiedAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                      {material.verification.status === "pending" && (
                        <div>
                          <p className="font-semibold text-yellow-300 dark:text-yellow-400 mb-2">
                            ⏳ Awaiting Review
                          </p>
                          <p className="text-gray-300 dark:text-gray-400">
                            Your material is currently being reviewed by
                            administrators. It will be visible to others once
                            approved.
                          </p>
                        </div>
                      )}
                      {material.verification.status === "rejected" && (
                        <div>
                          <p className="font-semibold text-red-300 dark:text-red-400 mb-2">
                            ✗ Rejected by Admin
                          </p>
                          <p className="text-gray-300 dark:text-gray-400 mb-3">
                            This material was not approved for public display.
                          </p>
                          {material.verification.rejectionReason && (
                            <div className="bg-red-900 bg-opacity-30 p-3 rounded border-l-2 border-red-400">
                              <p className="text-red-200 dark:text-red-300 font-medium text-xs mb-1">
                                Admin's Feedback:
                              </p>
                              <p className="text-red-100 dark:text-red-200 text-xs leading-relaxed">
                                {material.verification.rejectionReason}
                              </p>
                            </div>
                          )}
                          {material.verification.verifiedAt && (
                            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                              Rejected:{" "}
                              {new Date(
                                material.verification.verifiedAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* NEW: Show rejection reason prominently for rejected materials */}
              {!showBookmarkAction &&
                material.verification?.status === "rejected" &&
                material.verification?.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-800 dark:text-red-300 font-medium text-xs mb-1">
                          Admin Feedback:
                        </p>
                        <p className="text-red-700 dark:text-red-400 text-xs leading-relaxed">
                          {material.verification.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* File info */}
              <div className="flex justify-center sm:justify-start space-x-4 text-xs text-gray-400 dark:text-gray-500">
                <span>{formatFileSize(material.fileSize)}</span>
                <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                {/* Star count - only show for uploaded materials */}
                {!showBookmarkAction && (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{material.stats?.starCount || 0}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-center sm:justify-end items-center gap-2">
                {showBookmarkAction && (
                  <button
                    onClick={() => handleRemoveBookmark(material._id)}
                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Remove bookmark"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => navigate(`/materials/view/${material._id}`)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading && myMaterials.length === 0 && bookmarks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <PencilLoader />
      </div>
    );
  }

  // Get current data based on active tab
  const currentData =
    activeTab === "materials"
      ? myMaterials
      : activeTab === "bookmarks"
      ? bookmarks
      : messages;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-4 sm:p-6 mb-8 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            {/* Profile Image + Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 flex-1">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <UserAvatar
                  user={userProfile}
                  size="w-20 h-20"
                  className="text-2xl ring-2 ring-gray-200 dark:ring-gray-700"
                />
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {userProfile?.displayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {userProfile?.email}
                </p>
                {userProfile?.branch && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {userProfile.branch} • Semester {userProfile.semester} •{" "}
                    {userProfile.college}
                  </p>
                )}
                <div className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 dark:bg-red-500 text-white text-xs sm:text-sm rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex justify-center sm:justify-end gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {actualCounts.uploads}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Materials Uploaded
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {actualCounts.bookmarks}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Bookmarks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Storage Limit Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border-l-4 border-amber-500 dark:border-amber-400 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💾</div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1 transition-colors duration-300">
                  Storage Limit
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-100 transition-colors duration-300">
                  You can upload up to <strong>5 documents</strong> per user.
                  This limit will increase as we scale our cloud infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Timeline Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⏱️</div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1 transition-colors duration-300">
                  Verification Timeline
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-100 transition-colors duration-300">
                  All uploads go through admin review and are typically verified
                  within <strong>24 hours</strong>. Check your specific Material
                  for status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 transition-colors duration-300">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col sm:flex-row sm:space-x-8 px-4 sm:px-6">
              <button
                onClick={() => setActiveTab("materials")}
                className={`py-3 sm:py-4 px-3 sm:px-4 font-medium text-xs sm:text-sm text-left sm:text-center rounded-t-lg transition-all ${
                  activeTab === "materials"
                    ? "border-2 border-blue-400 border-b-4 border-b-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    : "border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                <span className="hidden sm:inline">
                  My Uploads ({actualCounts.uploads})
                </span>
                <span className="sm:hidden">
                  Uploads ({actualCounts.uploads})
                </span>
              </button>

              <button
                onClick={() => setActiveTab("bookmarks")}
                className={`py-3 sm:py-4 px-3 sm:px-4 font-medium text-xs sm:text-sm text-left sm:text-center rounded-t-lg transition-all ${
                  activeTab === "bookmarks"
                    ? "border-2 border-blue-400 border-b-4 border-b-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    : "border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Bookmark className="w-4 h-4 inline mr-2" />
                <span className="hidden sm:inline">
                  Bookmarks ({actualCounts.bookmarks})
                </span>
                <span className="sm:hidden">
                  Saved ({actualCounts.bookmarks})
                </span>
              </button>

              <button
                onClick={() => setActiveTab("messages")}
                className={`py-3 sm:py-4 px-3 sm:px-4 font-medium text-xs sm:text-sm text-left sm:text-center rounded-t-lg transition-all ${
                  activeTab === "messages"
                    ? "border-2 border-blue-400 border-b-4 border-b-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    : "border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                <span className="hidden sm:inline">
                  Messages ({actualCounts.messages})
                </span>
                <span className="sm:hidden">
                  Messages ({actualCounts.messages})
                </span>
              </button>
            </nav>
          </div>

          {/* Category Filter - Only show for materials and bookmarks, not for messages */}
          {activeTab !== "messages" && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.value
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <CategoryIcon className="w-4 h-4" />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeTab === "materials"
                  ? "My Materials"
                  : activeTab === "bookmarks"
                  ? "My Bookmarks"
                  : "My Messages"}
              </h2>
              {activeTab === "messages" ? (
                <div className="flex flex-col pl-4 sm:flex-row sm:items-center sm:justify-end gap-2">
                  <button
                    onClick={() => fetchMessages()}
                    className="bg-green-600 dark:bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full sm:rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
                    title="Refresh messages"
                    aria-label="Refresh messages"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  <button
                    onClick={handleNewMessageClick}
                    disabled={hasExistingMessage()}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm ${
                      hasExistingMessage()
                        ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                    }`}
                    title={
                      hasExistingMessage()
                        ? "Delete your existing message before creating a new one"
                        : "Send a new message to admin"
                    }
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">New Message</span>
                    <span className="sm:hidden">Message</span>
                  </button>
                  {hasExistingMessage() && (
                    <p className="text-xs text-red-600 dark:text-red-400 text-center sm:text-right max-w-full sm:max-w-48">
                      ⚠️ You have an existing message. Delete it before creating
                      a new one.
                    </p>
                  )}
                </div>
              ) : activeTab === "materials" ? (
                <button
                  onClick={() => fetchMyMaterials()}
                  className="bg-blue-600 dark:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2"
                  title="Refresh to see latest star counts"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              ) : activeTab === "bookmarks" ? (
                <button
                  onClick={() => fetchBookmarks()}
                  className="bg-purple-600 dark:bg-purple-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center gap-2"
                  title="Refresh bookmarks"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  {currentData.length}{" "}
                  {activeTab === "materials"
                    ? "materials uploaded"
                    : "bookmarks saved"}
                  {selectedCategory !== "all" &&
                    ` in ${getCategoryInfo(selectedCategory).label}`}
                </p>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                  {activeTab === "materials" ? (
                    <Upload className="w-full h-full" />
                  ) : activeTab === "bookmarks" ? (
                    <Bookmark className="w-full h-full" />
                  ) : (
                    <MessageSquare className="w-full h-full" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {activeTab === "materials"
                    ? "No materials uploaded"
                    : activeTab === "bookmarks"
                    ? "No bookmarks saved"
                    : "No messages sent"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {activeTab === "messages"
                    ? "You haven't sent any messages to admin yet. Click 'New Message' to get started."
                    : selectedCategory === "all"
                    ? activeTab === "materials"
                      ? "You haven't uploaded any materials yet."
                      : "You haven't bookmarked any materials yet."
                    : `No ${getCategoryInfo(
                        selectedCategory
                      ).label.toLowerCase()} ${
                        activeTab === "materials" ? "uploaded" : "bookmarked"
                      }.`}
                </p>
              </div>
            ) : activeTab === "messages" ? (
              <div className="space-y-4">
                {/* Message Limit Information */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 transition-colors duration-300">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1 text-sm sm:text-base">
                        Message Limit Policy
                      </h4>
                      <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-400 mb-2">
                        You can only have <strong>one message</strong> at a
                        time. This helps us manage support requests efficiently.
                      </p>
                      <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <li>
                          • If you have any existing message
                          (pending/approved/rejected), delete it before creating
                          a new one
                        </li>
                        <li>
                          • You must delete your previous message to send a new
                          message
                        </li>
                        <li>
                          • Use the delete button (🗑️) to remove your existing
                          messages
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {currentData.map((message) => (
                  <div
                    key={message._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-4 sm:p-6 border-l-4 border-blue-500 dark:border-blue-400 transition-colors duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {message.subject}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm sm:text-base">
                          {message.message}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                          <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            {message.category.replace("_", " ")}
                          </span>
                        </div>
                        {message.adminResponse && (
                          <div className="mt-3 sm:mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-2 border-blue-200 dark:border-blue-700 transition-colors duration-300">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium text-blue-900 dark:text-blue-300 text-sm">
                                Admin Response:
                              </span>
                            </div>
                            <p className="text-blue-800 dark:text-blue-400 text-sm">
                              {message.adminResponse}
                            </p>
                            {message.respondedAt && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                Responded on{" "}
                                {new Date(
                                  message.respondedAt
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-end sm:justify-start gap-2">
                        {/* Delete Message Button */}
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentData.map((material) =>
                  renderMaterialCard(
                    material,
                    activeTab === "bookmarks", // showBookmarkAction
                    activeTab === "materials" // showDeleteButton
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ✅ ADD: Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-base sm:text-lg font-semibold">
                Delete Account
              </h3>
            </div>

            <div className="mb-4">
              <Trash2 className="h-10 w-10 sm:h-12 sm:w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Are you sure you want to delete your account?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                This action cannot be undone. All your data will be permanently
                deleted from our databases, including:
              </p>
              <ul className="text-xs sm:text-sm text-gray-600 text-left mb-6 space-y-1">
                <li>• All uploaded materials and files</li>
                <li>• Your bookmarks and preferences</li>
                <li>• Your profile information</li>
                <li>• All associated data from our servers</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs sm:text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Message Form Modal */}
      {showMessageForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl dark:shadow-gray-950/70 max-w-md w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-gray-700">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Send Message to Admin
              </h3>
            </div>
            <form
              onSubmit={handleSendMessage}
              className="px-4 sm:px-6 py-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Category *
                </label>
                <select
                  value={messageForm.category}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, category: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="general">General Inquiry</option>
                  <option value="event_request">Event Request</option>
                  <option value="feedback">Feedback</option>
                  <option value="review">Review</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, subject: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter message subject..."
                  maxLength="200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Message *
                </label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="6"
                  placeholder="Enter your message (max 1200 words)..."
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {countWords(messageForm.message)}/1200 words
                  </p>
                  {countWords(messageForm.message) >= 1150 && (
                    <p className="text-xs text-orange-600">
                      {1200 - countWords(messageForm.message)} words remaining
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowMessageForm(false);
                    setMessageForm({
                      subject: "",
                      message: "",
                      category: "general",
                    });
                  }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
