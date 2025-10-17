import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../../context/AuthContext"; // Added for user context
import { useNavigate } from "react-router-dom"; // ✅ NEW: Added navigation
import { fileAPI } from "../../utils/api";
import PencilLoader from '../../components/PencilLoader/PencilLoader'; 
import toast from "react-hot-toast";
import { Filters } from "./Filters/Filters";
import { FaWhatsapp } from "react-icons/fa";
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
  Eye,
  Bookmark,
  BookmarkCheck,
  Star,
  Info,
  MessageSquare,
  ArrowRight,
  X,
} from "lucide-react";

const Materials = () => {
  const navigate = useNavigate(); // ✅ NEW: Added navigation hook
  const { user } = useAuth(); // Added for bookmarks
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]); // Added bookmark state
  const [userStars, setUserStars] = useState([]); // Added star state
  const [sortBy, setSortBy] = useState("recent"); // Added sorting state
  const [showInfoBanner, setShowInfoBanner] = useState(true); // Info banner visibility

  const sentinelRef = useRef(null);

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Materials", icon: BookOpen },
    { value: "notes", label: "Notes", icon: BookOpen },
    { value: "assignments", label: "Assignments", icon: FileText },
    { value: "practical", label: "Practicals", icon: GraduationCap },
    { value: "prevquestionpaper", label: "Previous Papers", icon: Clock },
    { value: "researchpaper", label: "Research Papers", icon: FileSignature },
  ];

  useEffect(() => {
    async function fetchAllMaterials() {
      try {
        setLoading(true);
        const response = await fileAPI.getFiles({
          ...(selectedCategory !== "all" && { category: selectedCategory }),
        });
        const loadedMaterials = response.data.files || [];
        const sortedMaterials = applySorting(loadedMaterials);
        setMaterials(sortedMaterials);
        setFilteredMaterials(sortedMaterials);
        setVisibleCount(3);
        console.log("✅ Loaded materials:", loadedMaterials.length);
      } catch (error) {
        console.error("❌ Failed to load materials:", error);
        toast.error("Failed to load materials. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchAllMaterials();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    if (user) {
      fetchUserBookmarks();
      fetchUserStars();
    } else {
      setUserBookmarks([]);
      setUserStars([]);
    }
  }, [user]);

  const fetchUserBookmarks = async () => {
    try {
      const response = await fileAPI.getUserBookmarks();
      setUserBookmarks(response.data.files.map((file) => file._id) || []);
    } catch (error) {
      console.log("No bookmarks found or user not logged in");
      setUserBookmarks([]);
    }
  };

  const fetchUserStars = async () => {
    try {
      const response = await fileAPI.getUserStars();
      setUserStars(response.data.files.map((file) => file._id) || []);
    } catch (error) {
      console.log("No stars found or user not logged in");
      setUserStars([]);
    }
  };

  // Intersection Observer for smooth loading
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoadingMore && visibleCount < filteredMaterials.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 3, filteredMaterials.length));
            setIsLoadingMore(false);
          }, 200);
        }
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, [filteredMaterials.length, visibleCount, isLoadingMore]);

  // Handle the filters changes
  const handleFilterChange = (filters) => {
    let filtered = [...materials];

    if (filters.semester) {
      filtered = filtered.filter(
        (material) => material.category?.semester === filters.semester
      );
    }

    if (filters.course) {
      filtered = filtered.filter(
        (material) =>
          material.category?.branch
            ?.toLowerCase()
            .includes(filters.course.toLowerCase()) ||
          material.metadata?.course
            ?.toLowerCase()
            .includes(filters.course.toLowerCase())
      );
    }

    if (filters.year) {
      filtered = filtered.filter(
        (material) => material.metadata?.year?.toString() === filters.year
      );
    }

    // Apply sorting
    filtered = applySorting(filtered);

    setFilteredMaterials(filtered);
    setVisibleCount(3);
  };

  // Combined search for both material title and subject
  const handleSearchChange = (searchTerm) => {
    if (!searchTerm.trim()) {
      const sorted = applySorting([...materials]);
      setFilteredMaterials(sorted);
      setVisibleCount(3);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = materials.filter(
      (material) =>
        material.title?.toLowerCase().includes(lowerSearchTerm) ||
        material.category?.subject?.toLowerCase().includes(lowerSearchTerm) ||
        material.metadata?.course?.toLowerCase().includes(lowerSearchTerm) ||
        material.metadata?.collegeName
          ?.toLowerCase()
          .includes(lowerSearchTerm) ||
        material.metadata?.professorName
          ?.toLowerCase()
          .includes(lowerSearchTerm)
    );

    const sorted = applySorting(filtered);
    setFilteredMaterials(sorted);
    setVisibleCount(3);
  };

  // Sorting function
  const applySorting = (materialsToSort) => {
    const sorted = [...materialsToSort];
    
    switch (sortBy) {
      case "popular":
        return sorted.sort((a, b) => (b.stats?.starCount || 0) - (a.stats?.starCount || 0));
      case "recent":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return sorted;
    }
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const sorted = applySorting([...filteredMaterials]);
    setFilteredMaterials(sorted);
    setVisibleCount(3);
  };

  // Handle download
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fileAPI.downloadFile(fileId);
      window.open(response.data.downloadUrl, "_blank");
      toast.success(`Downloading ${fileName}`);
    } catch (error) {
      toast.error("Download failed. Please try again.");
    }
  };

  // ✅ NEW: Updated view file to navigate to view page
  const handleViewFile = async (materialId) => {
    navigate(`/materials/view/${materialId}`);
  };

  // Handle bookmark toggling
  const handleBookmark = async (fileId, isBookmarked) => {
    if (!user) {
      toast.error("Please login to bookmark materials");
      return;
    }
    try {
      if (isBookmarked) {
        await fileAPI.removeBookmark(fileId);
        setUserBookmarks((prev) => prev.filter((id) => id !== fileId));
        toast.success("Bookmark removed");
      } else {
        await fileAPI.addBookmark(fileId);
        setUserBookmarks((prev) => [...prev, fileId]);
        toast.success("Bookmark added");
      }
    } catch (error) {
      toast.error("Bookmark operation failed");
    }
  };

  // Handle star toggling
  const handleStar = async (fileId, isStarred) => {
    if (!user) {
      toast.error("Please login to star materials");
      return;
    }
    try {
      if (isStarred) {
        await fileAPI.removeStar(fileId);
        setUserStars((prev) => prev.filter((id) => id !== fileId));
        // Update the star count in materials
        setMaterials((prev) =>
          prev.map((m) =>
            m._id === fileId
              ? { ...m, stats: { ...m.stats, starCount: (m.stats?.starCount || 1) - 1 } }
              : m
          )
        );
        setFilteredMaterials((prev) =>
          prev.map((m) =>
            m._id === fileId
              ? { ...m, stats: { ...m.stats, starCount: (m.stats?.starCount || 1) - 1 } }
              : m
          )
        );
        toast.success("Star removed");
      } else {
        await fileAPI.addStar(fileId);
        setUserStars((prev) => [...prev, fileId]);
        // Update the star count in materials
        setMaterials((prev) =>
          prev.map((m) =>
            m._id === fileId
              ? { ...m, stats: { ...m.stats, starCount: (m.stats?.starCount || 0) + 1 } }
              : m
          )
        );
        setFilteredMaterials((prev) =>
          prev.map((m) =>
            m._id === fileId
              ? { ...m, stats: { ...m.stats, starCount: (m.stats?.starCount || 0) + 1 } }
              : m
          )
        );
        toast.success("Star added");
      }
    } catch (error) {
      toast.error("Star operation failed");
    }
  };

  // Get category info
  const getCategoryInfo = (categoryType) => {
    return categories.find((cat) => cat.value === categoryType) || categories[0];
  };

  // ✅ NEW: Added file extension helper
  const getExtensionLabel = (name) => {
    const ext = name?.split(".").pop() || "";
    return ext.toUpperCase();
  };

  // ✅ NEW: Added file size formatter
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <PencilLoader size="w-24 h-24" />
          <p className="text-noto-primary mt-6 text-lg font-medium">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* RESPONSIVE: Header */}
      <div className="bg-white shadow-sm border-b text-center">
        <div className="max-w-screen-2xl mt-10 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-noto-primary mb-2">
            Study Materials
          </h1>
          <p className="text-gray-600 mb-4">
            Browse and download academic resources shared by students
          </p>

          {/* Centered Info Banner - Below Description */}
          {showInfoBanner && (
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm mt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Have suggestions?</span> Share your feedback with admin
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/profile?tab=messages")}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                
                <button
                  onClick={() => setShowInfoBanner(false)}
                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESPONSIVE: Category Filter Section */}
      <div className="bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.value;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    isActive
                      ? "bg-noto-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RESPONSIVE: Main Layout */}
      <div className="flex flex-col lg:flex-row">
        {/* RESPONSIVE: Left Sidebar - Full width on mobile, fixed width on lg+ */}
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 lg:min-h-screen flex-shrink-0">
          <div className="p-4">
            <Filters 
              onFilterChange={handleFilterChange} 
              onSearchChange={handleSearchChange}
              onSortChange={handleSortChange}
              currentSort={sortBy}
            />
          </div>
        </div>

        {/* RESPONSIVE: Right Content Area */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Materials Count */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">{filteredMaterials.length}</span>{" "}
              {filteredMaterials.length === 1 ? "material" : "materials"} found
              {selectedCategory !== "all" &&
                ` in ${getCategoryInfo(selectedCategory).label}`}
            </p>
          </div>

          {/* RESPONSIVE: Materials Grid */}
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No materials found
              </h3>
              <p className="text-gray-400">
                {selectedCategory === "all"
                  ? "No materials have been uploaded yet."
                  : `No ${getCategoryInfo(selectedCategory).label.toLowerCase()} available with current filters.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredMaterials.slice(0, visibleCount).map((material, index) => {
                const categoryInfo = getCategoryInfo(material.category.type);
                const CategoryIcon = categoryInfo.icon;

                const isInitialCard = index < 3;
                const isNewCard = index >= visibleCount - 3 && !isInitialCard;
                const animationDelay = isNewCard ? `${(index % 3) * 200}ms` : '0ms';

                // Check if bookmarked
                const isBookmarked = userBookmarks.includes(material._id);
                // Check if starred
                const isStarred = userStars.includes(material._id);

                return (
                  <div
                    key={material._id}
                    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border group cursor-pointer ${
                      isNewCard ? 'animate-fade-in-smooth' : ''
                    }`}
                    style={{
                      animationDelay: isNewCard ? animationDelay : '0ms',
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="p-4">
                      <div className="bg-noto-primary/10 p-4 pb-6 mb-2 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-noto-primary/15 bg-black backdrop-blur-sm group-hover:opacity-100 opacity-0 z-20 transition-all duration-300 flex items-center justify-center">
                          <button
                            onClick={() => handleViewFile(material._id)} /* ✅ UPDATED: Now navigates to view page */
                            className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 bg-noto-primary hover:bg-noto-primary-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium shadow-lg flex items-center gap-2 text-sm sm:text-base"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>

                        {/* Category Badge */}
                        <div className="flex items-center mb-2 relative justify-between">
                          <div className="flex items-center bg-noto-primary/20 px-2 sm:px-3 py-1 rounded-full -ml-1">
                            <CategoryIcon className="w-3 h-3 sm:w-[14px] sm:h-[14px] text-noto-primary mr-1" />
                            <span className="text-[10px] sm:text-[12px] font-medium text-noto-primary capitalize">
                              {material.category.type}
                            </span>
                          </div>
                          
                          {/* Star Count Display */}
                          {(material.stats?.starCount > 0) && (
                            <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 text-yellow-600 fill-yellow-600 mr-1" />
                              <span className="text-[10px] sm:text-[12px] font-semibold text-yellow-700">
                                {material.stats.starCount}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-semibold text-gray-700 mb-2 font-noto capitalize line-clamp-2 sm:line-clamp-1 relative">
                          {material.title}
                        </h1>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-[10px] sm:text-[12px] relative text-gray-700 gap-2 sm:gap-4">
                          <span className="flex items-center">
                            <BookOpen className="w-3 h-3 sm:w-[12px] sm:h-[12px] mr-1 sm:mr-2" />
                            {material.category.subject}
                          </span>
                          <span className="hidden sm:inline">{"|"}</span>
                          <span>{`Semester ${material.category.semester}`}</span>
                        </div>

                        {/* File Info */}
                        <div className="my-1 text-sm text-gray-700">
                          <div className="flex items-center text-[10px] sm:text-[12px]">
                            <GraduationCap className="w-3 h-3 sm:w-[14px] sm:h-[14px] mr-1 sm:mr-2" />
                            <span className="truncate">{material.category.branch}</span>
                          </div>

                          <div className="flex items-center text-[10px] sm:text-[12px] mt-1">
                            <Building2 className="w-3 h-3 sm:w-[12px] sm:h-[12px] mr-1 sm:mr-2 text-gray-700" />
                            <span className="font-dark truncate">
                              {material.metadata.collegeName}
                            </span>
                          </div>
                          
                          {/* ✅ NEW: Added file size display */}
                          <div className="flex items-center justify-between text-[10px] sm:text-[12px] mt-1">
                            <div className="flex items-center">
                              <User className="w-3 h-3 sm:w-[12px] sm:h-[12px] mr-1 sm:mr-2" />
                              <span className="truncate">
                                Professor: {material.metadata?.professorName || "Not specified"}
                              </span>
                            </div>
                            {/* ✅ NEW: File size badge */}
                            {material.fileSize && (
                              <span className="bg-gray-100 px-2 py-1 rounded text-[9px] sm:text-[10px]">
                                {formatFileSize(material.fileSize)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* RESPONSIVE: Bottom section with bookmark and WhatsApp */}
                      <div className="px-2 flex justify-between items-end flex-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-neutral-400 -mb-1 text-[9px] sm:text-[10px]">
                            {new Date(material.createdAt).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[12px]">
                            <span>Uploaded By:</span>
                            <span className="font-bold -ml-1 truncate">
                              {material.uploader?.displayName || "Unknown User"}
                            </span>
                          </p>
                        </div>

                        {/* Action buttons container */}
                        <div className="flex items-center gap-2">
                          {/* Star Button - only show if user is logged in */}
                          {user && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStar(material._id, isStarred);
                              }}
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                                isStarred
                                  ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title={isStarred ? "Remove star" : "Add star"}
                            >
                              <Star 
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${isStarred ? 'fill-yellow-600' : ''}`}
                              />
                            </button>
                          )}

                          {/* Bookmark Button - only show if user is logged in */}
                          {user && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookmark(material._id, isBookmarked);
                              }}
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                                isBookmarked
                                  ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                              ) : (
                                <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                            </button>
                          )}

                          {/* WhatsApp Share Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const baseUrl = window.location.origin;
                              const viewUrl = `${baseUrl}/view/${material._id}`;
                              const waUrl = `https://wa.me/?text=${encodeURIComponent(
                                `Check out this study material on NOTO: ${viewUrl}`
                              )}`;
                              window.open(waUrl, "_blank");
                            }}
                            title="Share on WhatsApp"
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors flex-shrink-0"
                          >
                            <FaWhatsapp className="w-3 h-3 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Intersection Observer Sentinel */}
          {visibleCount < filteredMaterials.length && (
            <div 
              ref={sentinelRef}
              className="w-full h-20 flex items-center justify-center mt-8"
            >
              {isLoadingMore && (
                <div className="flex items-center space-x-2 text-noto-primary">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-noto-primary"></div>
                  <span className="text-sm font-medium">Loading more materials...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Smooth CSS animations moved to regular CSS */}
      <style>{`
        @keyframes fadeInSmooth {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
            filter: blur(4px);
          }
          50% {
            opacity: 0.6;
            transform: translateY(30px) scale(0.95);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        .animate-fade-in-smooth {
          animation: fadeInSmooth 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default Materials;
