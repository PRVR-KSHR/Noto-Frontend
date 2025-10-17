import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fileAPI } from "../../utils/api";
import {
  Upload as UploadIcon,
  Search,
  FileText,
  User,
  Calendar,
  GraduationCap,
  Building2,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSignature,
  PenTool,
} from "lucide-react";

const Upload = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  // Form state - UPDATED: Removed description, separated course and subject, added documentType
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    course: "",
    subject: "",
    collegeName: "",
    professorName: "",
    semester: "",
    year: new Date().getFullYear(),
    file: null,
    documentType: "typed", // NEW: "typed" or "handwritten"
  });

  const [courseSearch, setCourseSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showHandwrittenModal, setShowHandwrittenModal] = useState(false);


  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

 useEffect(() => {
  // Refresh user profile once when component mounts to get latest upload count
  if (user && refreshUserProfile) {
    refreshUserProfile();
  }
}, [user]); 


  // Categories
  const categories = [
    { value: "notes", label: "Notes", icon: BookOpen },
    { value: "assignments", label: "Assignments", icon: FileText },
    { value: "practical", label: "Practical", icon: GraduationCap },
    {
      value: "prevquestionpaper",
      label: "Previous Question Papers",
      icon: Clock,
    },
    { value: "researchpaper", label: "Research Paper", icon: FileSignature },
  ];

  // UPDATED: Indian college courses
  const indianCourses = [
    // Undergraduate Courses
    "BBA (Bachelor of Business Administration)",
    "BCA (Bachelor of Computer Applications)",
    "BALLB (Bachelor of Arts + Bachelor of Laws)",
    "BBA LLB(Bachelor of Business Administration and Bachelor of Legislative Law)",
    "BJMC (Bachelor of Journalism and Mass Communication)",
    "BA (Bachelor of Arts)",
    "BCom (Bachelor of Commerce)",
    "BSc (Bachelor of Science)",
    "BE (Bachelor of Engineering)",
    "BArch (Bachelor of Architecture)",
    "BFA (Bachelor of Fine Arts)",
    "BPT (Bachelor of Physiotherapy)",
    "BPharm (Bachelor of Pharmacy)",
    "BAMS (Bachelor of Ayurvedic Medicine and Surgery)",
    "BHMS (Bachelor of Homeopathic Medicine and Surgery)",
    "BDS (Bachelor of Dental Surgery)",
    "MBBS (Bachelor of Medicine and Bachelor of Surgery)",
    "BSW (Bachelor of Social Work)",
    "BEd (Bachelor of Education)",
    "BPE (Bachelor of Physical Education)",
    "BTTM (Bachelor of Travel and Tourism Management)",
    "BHM (Bachelor of Hotel Management)",

    // Postgraduate Courses
    "MBA (Master of Business Administration)",
    "MCA (Master of Computer Applications)",
    "MTech (Master of Technology)",
    "MBALLB (Master of Arts + Master of Laws)",
    "LLM (Master of Laws)",
    "MA (Master of Arts)",
    "MCom (Master of Commerce)",
    "MSc (Master of Science)",
    "ME (Master of Engineering)",
    "MArch (Master of Architecture)",
    "MFA (Master of Fine Arts)",
    "MPT (Master of Physiotherapy)",
    "MPharm (Master of Pharmacy)",
    "MD (Doctor of Medicine)",
    "MS (Master of Surgery)",
    "MSW (Master of Social Work)",
    "MEd (Master of Education)",
    "MPE (Master of Physical Education)",
    "BCA+MCA (Dual Degree)",
    "BJMC+MJMC (Dual Degree)",
    "BBA+MBA (Dual Degree)",

    // Diploma Courses
    "Diploma in Engineering",
    "Diploma in Computer Science",
    "Diploma in Mechanical Engineering",
    "Diploma in Civil Engineering",
    "Diploma in Electrical Engineering",
    "Diploma in Electronics",
    "Diploma in IT",
    "Diploma in Hotel Management",
    "Diploma in Fashion Design",
    "Diploma in Interior Design",

    // Professional Courses
    "CA (Chartered Accountancy)",
    "CS (Company Secretary)",
    "CMA (Cost and Management Accountancy)",
    "PhD (Doctor of Philosophy)",
    "Other",
  ].sort();

  // Handle course search
  useEffect(() => {
    if (courseSearch) {
      const filtered = indianCourses.filter((course) =>
        course.toLowerCase().includes(courseSearch.toLowerCase())
      );
      setFilteredCourses(filtered.slice(0, 10));
    } else {
      setFilteredCourses(indianCourses.slice(0, 10));
    }
  }, [courseSearch]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Add this state for progress tracking
  const [uploadProgress, setUploadProgress] = useState(0);


// Update your handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("📋 Please fill all required fields correctly.");
    return;
  }

    console.log('🔍 Form data before upload:', {
    title: formData.title,
    category: formData.category,
    course: formData.course,
    subject: formData.subject,
    collegeName: formData.collegeName,
    semester: formData.semester,
    year: formData.year,
    file: formData.file?.name
  });

  setUploading(true);
  setUploadProgress(0); // Reset progress
  const uploadToastId = "upload-progress-toast";
  toast.loading("📤 Preparing upload...", { id: uploadToastId, duration: Infinity });

  try {
    // Create FormData
    const uploadData = new FormData();
   uploadData.append("title", formData.title?.trim() || "");
    uploadData.append("category", formData.category || "");
    uploadData.append("course", formData.course || "");
    uploadData.append("subject", formData.subject?.trim() || "");
    uploadData.append("collegeName", formData.collegeName?.trim() || "");
    uploadData.append("professorName", formData.professorName?.trim() || "");
    uploadData.append("semester", formData.semester || "");
    uploadData.append("year", formData.year?.toString() || new Date().getFullYear().toString());
    uploadData.append("documentType", formData.documentType || "typed"); // NEW: Include document type


    if (!formData.file) {
      toast.dismiss(uploadToastId);
      toast.error("Please select a file to upload.");
      setUploading(false);
      setUploadProgress(0);
      return;
    }

    uploadData.append("file", formData.file);

    console.log('📤 FormData contents:');
    for (let [key, value] of uploadData.entries()) {
      console.log(`${key}:`, value);
    }

    console.log("📤 Uploading to NOTO backend...");

    // ✅ FIXED: Upload with progress callback using correct variable name
   const result = await fileAPI.uploadFile(uploadData, (progressEvent) => {
  // Safely compute total; fall back to the actual file size so the bar moves smoothly
  const fileBlob = uploadData.get('file');
  const total = progressEvent.total || (fileBlob?.size ?? 1);
  const raw = Math.round((progressEvent.loaded * 100) / total);

  // Cap at 95% so the last 5% visually represents server processing time
  const capped = Math.min(95, isFinite(raw) ? raw : 0);

  setUploadProgress(capped);

  // Persist the same toast and update its text; do NOT dismiss here
  toast.loading(`📤 Uploading... ${capped}%`, { id: uploadToastId, duration: Infinity });
});


    console.log("✅ Upload successful:", result);
    setUploadProgress(100);
    toast.dismiss(uploadToastId);
    
    // NEW: Enhanced success message with verification notice
    toast.success(
      "🎉 Material uploaded successfully!\n📋 Your document is now awaiting admin verification before appearing in materials page.",
      { 
        duration: 6000,
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontWeight: '500'
        }
      }
    );

     if (refreshUserProfile) {
      await refreshUserProfile();
    }

    // Reset form
    setFormData({
      title: "",
      category: "",
      course: "",
      subject: "",
      collegeName: "",
      professorName: "",
      semester: "",
      year: new Date().getFullYear(),
      file: null,
      documentType: "typed", // NEW: Reset to default
    });

    setCourseSearch("");
    setUploadProgress(0);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";

    // Redirect to materials page
    navigate("/materials");
  } catch (error) {
    console.error("❌ Upload error:", error);
    console.error("❌ Error details:", error.response?.data);
    toast.dismiss(uploadToastId);
    
    // ✅ IMPROVED: Handle upload limit error specifically
   if (error.response?.status === 400 && error.response?.data?.message?.includes('Upload limit reached')) {
      toast.error(error.response.data.message);
    } else if (error.response?.status === 400) {
      // ✅ NEW: Better error message for 400 errors
      toast.error(
        `❌ Upload failed: ${error.response?.data?.message || 'Please check all required fields are filled correctly'}`
      );
    } else {
      toast.error(
        `❌ Upload failed: ${error.response?.data?.message || error.message}`
      );
    }
  } finally {
    setUploading(false);
    setUploadProgress(0);
  }
};


  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      // ✅ ONLY: PDF, DOC, DOCX, PPT, PPTX, TXT
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
      ];

      // ✅ File type validation
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "❌ File type not supported! Only PDF, DOC, DOCX, PPT, PPTX, and TXT files are allowed."
        );
        e.target.value = "";
        setFormData((prev) => ({ ...prev, file: null }));
        setErrors((prev) => ({ ...prev, file: "File type not supported" }));
        return;
      }

      // File size validation
      if (file.size > maxSize) {
        toast.error("📁 File size exceeds 5MB limit.");
        e.target.value = "";
        setFormData((prev) => ({ ...prev, file: null }));
        setErrors((prev) => ({
          ...prev,
          file: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, file }));
      setErrors((prev) => ({ ...prev, file: "" }));
      toast.success(` File "${file.name}" is ready for upload!`);
    }
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    setFormData((prev) => ({ ...prev, course }));
    setCourseSearch(course);
    setShowCourseDropdown(false);
  };

  // UPDATED: Form validation - added subject, documentType, removed description
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.documentType) newErrors.documentType = "Document type is required"; // NEW
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.collegeName.trim())
      newErrors.collegeName = "College name is required";
    if (!formData.professorName.trim())
      newErrors.professorName = "Professor name is required";
    if (!formData.semester) newErrors.semester = "Semester is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.file) newErrors.file = "Please select a file to upload";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-noto-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-noto-primary">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="py-4 sm:py-8">
        <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-noto rounded-full mb-4">
            <UploadIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-noto-primary mb-2">
            Upload Materials
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Share your study materials with the NOTO community
          </p>
          
          {/* Admin Verification Notice */}
          <div className="mt-4 mx-auto max-w-lg">
            <div 
              className="bg-amber-50 border border-amber-200 rounded-lg p-3 cursor-help"
              title="All uploaded materials are reviewed by our admin team to ensure quality and appropriateness before being made public. You can track the verification status in your profile."
            >
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800 text-xs sm:text-sm font-medium">
                  📋 Materials require admin verification before going live
                </span>
              </div>
              <p className="text-amber-700 text-xs mt-1 text-center">
                Hover for more details • Check status in Profile
              </p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Uploaded By Info */}
            <div className="bg-noto-light/30 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-noto-primary" />
                <span className="text-gray-700">
                  <strong>Uploaded by:</strong>{" "}
                  {userProfile?.displayName || user?.displayName || "Anonymous"}
                </span>
              </div>
            </div>

            {/* 1. Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-noto-primary mb-2">
                Select Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          category: category.value,
                        }))
                      }
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 text-left ${
                        formData.category === category.value
                          ? "border-noto-primary bg-noto-primary/5 text-noto-primary"
                          : "border-gray-200 hover:border-noto-secondary"
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">{category.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* 2. Document Type Selection - NEW */}
            <div>
              <label className="block text-sm font-semibold text-noto-primary mb-2">
                Document Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      documentType: "typed",
                    }))
                  }
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 text-center ${
                    formData.documentType === "typed"
                      ? "border-noto-primary bg-noto-primary/5 text-noto-primary"
                      : "border-gray-200 hover:border-noto-secondary"
                  }`}
                >
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm sm:text-base block">Keyboard Typed</span>
                    <span className="text-xs text-gray-500">Digital documents, PDFs, printed text</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowHandwrittenModal(true);
                  }}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 text-center ${
                    formData.documentType === "handwritten"
                      ? "border-noto-primary bg-noto-primary/5 text-noto-primary"
                      : "border-gray-200 hover:border-noto-secondary"
                  }`}
                >
                  <PenTool className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm sm:text-base block">Handwritten</span>
                    <span className="text-xs text-gray-500">Scanned notes, photos, handwritten text</span>
                  </div>
                </button>
              </div>
              {errors.documentType && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.documentType}</p>
              )}
            </div>

            {/* Handwritten Instructions Modal */}
            {showHandwrittenModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto animate-fade-in max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="bg-gradient-noto text-white p-4 sm:p-6 rounded-t-xl sticky top-0 z-10">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <PenTool className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold">Handwritten Document Guidelines</h3>
                        <p className="text-xs sm:text-sm text-white/90 mt-1">Please read carefully for best results</p>
                      </div>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded">
                      <p className="text-xs sm:text-sm text-blue-900 font-semibold mb-2">
                        📚 For Best AI Chatbot Performance:
                      </p>
                      <ul className="text-xs sm:text-sm text-blue-800 space-y-1.5 sm:space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2 flex-shrink-0">✓</span>
                          <span><strong>Fewer pages work better</strong> - AI can understand content more accurately with concise documents</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 flex-shrink-0">✓</span>
                          <span><strong>Keep file size under 1 MB</strong> - Faster processing and better OCR results</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded">
                      <p className="text-xs sm:text-sm text-green-900 font-semibold mb-2">
                        📝 Quality Requirements:
                      </p>
                      <ul className="text-xs sm:text-sm text-green-800 space-y-1.5 sm:space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2 flex-shrink-0">✓</span>
                          <span><strong>Clear & Visible</strong> - Ensure all pages are properly scanned with good lighting</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 flex-shrink-0">✓</span>
                          <span><strong>Neat Handwriting</strong> - Clean, legible writing ensures accurate text recognition</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 flex-shrink-0">✓</span>
                          <span><strong>High Contrast</strong> - Dark ink on white paper works best for OCR</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 sm:p-4 rounded">
                      <p className="text-xs sm:text-sm text-amber-900 font-semibold mb-2">
                        ⚠️ Important Notes:
                      </p>
                      <ul className="text-xs sm:text-sm text-amber-800 space-y-1.5 sm:space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2 flex-shrink-0">•</span>
                          <span>Processing may take 30-60 seconds for handwritten documents</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 flex-shrink-0">•</span>
                          <span>OCR works best with printed-style handwriting</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 flex-shrink-0">•</span>
                          <span>PDF format is recommended over images</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-b-xl flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sticky bottom-0 z-10">
                    <button
                      type="button"
                      onClick={() => setShowHandwrittenModal(false)}
                      className="w-full sm:w-auto text-gray-600 hover:text-gray-800 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          documentType: "handwritten",
                        }));
                        setShowHandwrittenModal(false);
                        toast.success("📝 Handwritten document mode activated!");
                      }}
                      className="w-full sm:w-auto bg-gradient-noto text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>I Understand</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Course Selection with Search - UPDATED */}
            <div className="relative">
              <label className="block text-sm font-semibold text-noto-primary mb-2">
                Course *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => {
                    setCourseSearch(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      course: e.target.value,
                    }));
                    setShowCourseDropdown(true);
                  }}
                  onFocus={() => setShowCourseDropdown(true)}
                  placeholder="Search course (e.g., BTech, BCA, MBA)..."
                  className="input text-sm sm:text-base pl-10"
                />
              </div>

              {/* Course Dropdown */}
              {showCourseDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCourses.map((course, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCourseSelect(course)}
                      className="w-full px-4 py-2 text-left hover:bg-noto-light/30 transition-colors duration-200"
                    >
                      {course}
                    </button>
                  ))}
                </div>
              )}
              {errors.course && (
                <p className="text-red-500 text-sm mt-1">{errors.course}</p>
              )}
            </div>

            {/* 3. Subject Field - NEW: Free text input */}
            <div>
              <label className="block text-sm font-semibold text-noto-primary mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g., Data Structures, Mathematics, Physics, Marketing..."
                className="input"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            {/* 4. Title */}
            <div>
              <label className="block text-sm font-semibold text-noto-primary mb-2">
                Material Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Data Structures Notes - Unit 1"
                className="input"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* 5. Academic Details Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-noto-primary mb-2">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select Semester</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Semester {i + 1}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <p className="text-red-500 text-sm mt-1">{errors.semester}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-noto-primary mb-2">
                  Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="input"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {errors.year && (
                  <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                )}
              </div>
            </div>

            {/* 6. College Name */}
            <div>
              <label className="block text-sm font-semibold text-noto-primary mb-2">
                College Name *
              </label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleInputChange}
                placeholder="e.g., NIST College"
                className="input"
              />
              {errors.collegeName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.collegeName}
                </p>
              )}
            </div>

            {/* 7. Professor Name (Required) */}
            <div>
              <label className="block text-sm font-semibold text-noto-primary mb-2">
                Professor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="professorName"
                value={formData.professorName}
                onChange={handleInputChange}
                placeholder="e.g., Dr. Smith"
                className={`input ${errors.professorName ? "border-red-500" : ""}`}
                required
              />
              {errors.professorName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.professorName}
                </p>
              )}
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Uploading {formData.file?.name}...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {uploadProgress < 100
                    ? "Please wait, do not close this page..."
                    : "Processing... Please Wait.."}
                </div>
              </div>
            )}

            {/* 8. File Upload */}
            <div>
              <label className="block text-sm font-semibold text-noto-primary mb-2">
                Upload File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-noto-primary transition-colors duration-200">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <UploadIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600">
                    {formData.file
                      ? formData.file.name
                      : "Click to upload file"}
                  </span>
                  <span className="text-sm text-gray-400">
                    PDF, DOC, PPT, TXT (Max: 5MB)
                  </span>
                </label>
              </div>
              {errors.file && (
                <p className="text-red-500 text-sm mt-1">{errors.file}</p>
              )}
            </div>

            {/* Important Messages */}
            <div className="space-y-2">
              {/* Storage Limit Warning */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg animate-pulse">💾</span>
                  <p className="font-semibold text-red-700 text-center text-xs sm:text-sm">
                    Due to cloud space shortage, the limit is only 5 documents per user.
                  </p>
                </div>
              </div>

              {/* Handwritten Processing Time Note */}
              {formData.documentType === "handwritten" && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg animate-pulse">⏱️</span>
                    <p className="font-medium text-amber-800 text-center text-xs sm:text-sm">
                      Processing may take 30-60 seconds for handwritten documents
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className={`w-full btn-primary py-4 text-lg font-semibold ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Upload Material</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-noto-primary mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Upload Guidelines
          </h3>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• Ensure materials are original or properly cited</li>
            <li>• Use clear, descriptive titles for better searchability</li>
            <li>• Maximum file size: 5MB</li>
            <li>• Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT</li>
            <li>• All uploads are subject to community moderation</li>
            <li>• Help fellow students by providing accurate information</li>
          </ul>
        </div>
        </div>
      </div>
  );
};

export default Upload;
