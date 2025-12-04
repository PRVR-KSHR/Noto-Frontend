import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fileAPI, adminAPI } from "../../utils/api"; // NEW: Added adminAPI
import PencilLoader from "../../components/PencilLoader/PencilLoader";
import toast from "react-hot-toast";
import Chatbot from "../Chatbot/Chatbot";
import { textExtractionService } from "../../services/textExtraction";
import { getOptimizedIframeUrl, getDownloadUrl, isCloudinaryUrl } from "../../utils/cloudinaryOptimizer"; // NEW: Bandwidth optimization
import {
  Download,
  ArrowLeft,
  FileText,
  Calendar,
  GraduationCap,
  AlertCircle,
  Bot,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Info,
  Maximize,
  CheckCircle, 
  XCircle, 
  Shield 
} from "lucide-react";

const ViewMaterial = () => {
  const { fileId, id } = useParams();
  const materialId = fileId || id; // Support both :fileId and :id route params
  const { user } = useAuth();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentText, setDocumentText] = useState("");
  const [viewerError, setViewerError] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [showDownloadWarning, setShowDownloadWarning] = useState(false);
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  // NEW: Optimized URLs for bandwidth savings
  const [optimizedViewUrl, setOptimizedViewUrl] = useState("");
  const [originalDownloadUrl, setOriginalDownloadUrl] = useState("");
  // NEW: Flags to inform chatbot docs-mode availability
  const [isHandwritten, setIsHandwritten] = useState(false);
  const [isImageFile, setIsImageFile] = useState(false);
  const materialFetchRef = useRef({ id: null, promise: null });
  
  // NEW: Admin verification states
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Removed documentType logic - now handling all documents the same way

  // Helper function to determine if we have valid document content for chatbot
  const hasValidDocumentContent = useMemo(() => {
    console.log("🔍 Checking document content validity:");
    console.log("Document Text Length:", documentText?.length || 0);
    console.log("First 200 chars:", documentText?.substring(0, 200));
    
    if (!documentText || documentText.length < 100) {
      console.log("❌ Document text too short or missing");
      return false;
    }
    
    // Check for common fallback messages that indicate failed extraction
    const fallbackIndicators = [
      'could not be processed',
      'could not be fully processed',
      'UNSUPPORTED_FILE_TYPE',
      'Unable to extract text',
      'text extraction is not available',
      'very little readable text',
      'EXTRACTION_FAILED',
      'ENOENT: no such file or directory',
      'could not be processed for text extraction'
    ];
    
    const hasFailureMessage = fallbackIndicators.some(indicator => 
      documentText.toLowerCase().includes(indicator.toLowerCase())
    );
    
    if (hasFailureMessage) {
      console.log("❌ Document contains failure message");
    } else {
      console.log("✅ Document content is valid for AI chat");
    }
    
    return !hasFailureMessage;
  }, [documentText]);

  const detectedMime = useMemo(() => {
    if (!material?.fileName) return null;
    const ext = material.fileName.split(".").pop().toLowerCase();
    const map = {
      pdf: "application/pdf",
      txt: "text/plain",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    return map[ext] || material.mimeType || null;
  }, [material]);

  // Derive handwritten + image flags when material loads
  useEffect(() => {
    if (!material) return;
    // Handwritten flag from backend metadata (if available)
    const docType = material?.metadata?.documentType || material?.documentType || "";
    setIsHandwritten(docType.toLowerCase() === "handwritten");

    // Image detection by mime or extension (defensive; images may be disallowed at upload)
    const fn = material?.fileName || "";
    const ext = (fn.split(".").pop() || "").toLowerCase();
    const mime = material?.fileType || detectedMime || "";
    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "avif", "heic", "tif", "tiff"];
    const isImg = (mime?.startsWith("image/")) || imageExts.includes(ext);
    setIsImageFile(!!isImg);
  }, [material, detectedMime]);

  // Download is disabled by default on each page load
  // User must see warning modal for each document/page visit

  // Lightweight preview for TXT (and optional PDF)
  useEffect(() => {
    const loadPreview = async () => {
      if (!material?.fileUrl || !detectedMime) return;
      try {
        if (detectedMime === "text/plain") {
          const res = await fetch(material.fileUrl);
          if (!res.ok) throw new Error("Failed text fetch");
          const txt = await res.text();
          setDocumentText(txt.slice(0, 20000)); // preview cap
        } else if (detectedMime === "application/pdf") {
          // Optional: short text preview via pdfjs, keep authoritative read on server
          // setDocumentText('[PDF preview enabled]');
        } else {
          setDocumentText(""); // non-TXT fallback; handled server-side
        }
      } catch (e) {
        console.error("Preview load failed", e);
        setViewerError(true);
      }
    };
    loadPreview();
  }, [material?.fileUrl, detectedMime]);

  const documentMeta = useMemo(
    () => ({
      fileUrl: material?.fileUrl || "",
      fileName: material?.fileName || "",
      mimeType: detectedMime || "",
      id: material?._id || "",
    }),
    [material, detectedMime]
  );

  // Remove PPT restriction - now all file types support chatbot if they have extracted text
  const isPptOnly = useMemo(() => {
    // No longer restricting any file types since we now support PowerPoint extraction
    return false;
  }, [detectedMime]);

  const handleZoomIn = () => {
    setPdfZoom((prev) => Math.min(prev + 25, 200)); // Max 200%
  };

  const handleZoomOut = () => {
    setPdfZoom((prev) => Math.max(prev - 25, 50)); // Min 50%
  };

  const handleZoomReset = () => {
    setPdfZoom(100); // Reset to 100%
  };

  // File size formatter function
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ✅ Authentication check
  useEffect(() => {
    if (!user) {
      // Store the current location so user returns here after login
      navigate("/login", { 
        state: { from: { pathname: `/view/${materialId}` } },
        replace: true 
      });
      return;
    }
  }, [user, navigate, materialId]);

  useEffect(() => {
    if (!user) return;

    let isCancelled = false;

    const loadMaterialOnce = () => {
      if (
        materialFetchRef.current.id === materialId &&
        materialFetchRef.current.promise
      ) {
        return materialFetchRef.current.promise;
      }

      const promise = fileAPI.getFileById(materialId);
      materialFetchRef.current = { id: materialId, promise };
      return promise;
    };

    const fetchMaterial = async () => {
      try {
        setLoading(true);

        const response = await loadMaterialOnce();

        if (isCancelled) {
          return;
        }

        const fileData = (() => {
          if (!response) return null;
          if (response.file) return response.file;
          if (response.data?.file) return response.data.file;
          if (response.data?.data?.file) return response.data.data.file;
          if (response.data) return response.data;
          return null;
        })();

        if (!fileData || !fileData._id) {
          console.warn("Material payload missing expected file data", response);
          toast.error("Material not found");
          navigate("/materials");
          return;
        }

        if (isCancelled) {
          return;
        }

        setMaterial(fileData);

  console.log("📄 File loaded:", fileData.fileName);

        setOptimizedViewUrl(fileData.fileUrl);
        setOriginalDownloadUrl(fileData.fileUrl);

        if (isCloudinaryUrl(fileData.fileUrl)) {
          console.log("🌩️ Cloudinary URL detected");
          console.log("💡 Note: Documents are served in original format for proper viewing");
        }

        if (isCancelled) {
          return;
        }

        console.log("📄 Starting text extraction for:", {
          fileName: fileData.fileName,
          fileType: fileData.fileType,
          hasExtractedText: !!fileData.extractedText,
          documentType: fileData.metadata?.documentType,
          extractionStatus: fileData.extractionStatus,
        });

        try {
          console.log("📄 File data received:", {
            title: fileData.title,
            fileName: fileData.fileName,
            hasExtractedText: !!fileData.extractedText,
            extractionStatus: fileData.extractionStatus,
          });

          if (
            fileData.extractedText &&
            fileData.metadata?.documentType === "handwritten"
          ) {
            console.log("✅ Using server-extracted OCR text (handwritten document)");
            console.log("📊 Text length:", fileData.extractedText.length);
            console.log(
              "📄 Preview:",
              fileData.extractedText.substring(0, 200)
            );
            if (isCancelled) return;
            setDocumentText(fileData.extractedText);
          } else if (
            fileData.extractionStatus === "not-required" ||
            !fileData.extractedText
          ) {
            console.log(
              "⚡ Typed document - extracting text client-side (saves MongoDB space)"
            );
            const extractedText = await textExtractionService.extractText(
              fileData.fileUrl,
              fileData.fileName,
              fileData.fileType
            );

            if (isCancelled) return;
            setDocumentText(extractedText);
            console.log(
              "✅ Client-side text extraction successful, length:",
              extractedText.length
            );
          } else {
            console.log("⚠️ Fallback: Attempting client-side extraction...");
            const extractedText = await textExtractionService.extractText(
              fileData.fileUrl,
              fileData.fileName,
              fileData.fileType
            );

            if (isCancelled) return;
            setDocumentText(extractedText);
            console.log(
              "✅ Fallback extraction successful, length:",
              extractedText.length
            );
          }
        } catch (error) {
          console.error("❌ Text extraction failed:", error);

          const fallbackText = `Document: ${fileData.title}
File: ${fileData.fileName}

This document couldn't be processed for text extraction on your device.
Please ensure the file is accessible and in a supported format.

Error: ${error.message}`;

          if (isCancelled) return;
          setDocumentText(fallbackText);
        }
      } catch (error) {
        if (materialFetchRef.current.id === materialId) {
          materialFetchRef.current = { id: null, promise: null };
        }

        if (isCancelled) {
          return;
        }

        if (error?.response?.status === 429) {
          console.warn("Rate limited while loading material:", error);
          toast.error("Too many requests. Please try again in a moment.");
        } else {
          console.error("Failed to load material:", error);
          toast.error("Failed to load material");
          navigate("/materials");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }

        if (materialFetchRef.current.id === materialId) {
          materialFetchRef.current = { id: null, promise: null };
        }
      }
    };

    fetchMaterial();

    return () => {
      isCancelled = true;
    };
  }, [materialId, user, navigate]);

  // NEW: Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.uid) return;
      try {
        const response = await adminAPI.checkAdminStatus();
        setIsAdmin(response.isAdmin);
      } catch (error) {
        console.log('User is not admin');
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [user]);

  // NEW: Admin verification functions
  const handleVerifyMaterial = async () => {
    if (!isAdmin || !material?._id) return;
    
    setIsVerifying(true);
    try {
      await adminAPI.verifyMaterial(material._id);
      toast.success(`✅ Material "${material.title}" verified successfully!`);
      
      // Refresh material data
      const response = await fileAPI.getFileWithText(id);
      if (response.data?.file) {
        setMaterial(response.data.file);
      }
      
      // Navigate back to admin dashboard
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (error) {
      console.error('Error verifying material:', error);
      toast.error('Failed to verify material');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRejectMaterial = async () => {
    if (!isAdmin || !material?._id) return;
    
    setIsVerifying(true);
    try {
      await adminAPI.rejectMaterial(material._id, rejectionReason || 'No reason provided');
      toast.success(`❌ Material "${material.title}" rejected successfully!`);
      
      // Navigate back to admin dashboard
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (error) {
      console.error('Error rejecting material:', error);
      toast.error('Failed to reject material');
    } finally {
      setIsVerifying(false);
      setShowRejectModal(false);
      setRejectionReason('');
    }
  };

  const handleDownload = async () => {
    if (!material) return;

    // Check if download is enabled (user has seen warning)
    if (!downloadEnabled) {
      setShowDownloadWarning(true);
      return;
    }

    try {
      // ✅ BANDWIDTH SAVER: Use original high-quality URL for download only
      const downloadUrl = originalDownloadUrl || material.fileUrl;
      
      // ✅ FIXED: Force download using blob instead of redirect
      const toastId = toast.loading(`📥 Preparing download...`);

      // Fetch the file as blob to force download
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create temporary download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = material.fileName; // Use original filename
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.dismiss(toastId);
      toast.success(`✅ ${material.fileName} downloaded successfully!`);

      // Track download in background
      try {
        await fileAPI.downloadFile(material._id);
      } catch (trackError) {
        console.log("Download tracking failed:", trackError);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Please try again.");
    }
  };

  const handleWarningClose = () => {
    // Enable download for this page session only
    setDownloadEnabled(true);
    setShowDownloadWarning(false);
  };

  const handleBack = () => {
    navigate("/materials");
  };

  // ✅ ENHANCED: Text File Viewer Component with styled border
  const TextFileViewer = ({ fileUrl, onError }) => {
    const [textContent, setTextContent] = useState("Loading...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchTextContent = async () => {
        try {
          setLoading(true);
          const response = await fetch(fileUrl);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const text = await response.text();
          setTextContent(text || "This file appears to be empty.");
        } catch (error) {
          console.error("Text file load error:", error);
          setTextContent(
            "❌ Unable to load text content. Please download the file to view it."
          );
          onError();
        } finally {
          setLoading(false);
        }
      };

      fetchTextContent();
    }, [fileUrl, onError]);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300 transition-colors duration-300">Loading text file...</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
        <div
          className="flex-shrink-0 px-4 py-2 border-2 rounded-lg"
          style={{
            background: "linear-gradient(to right, #609BC7, #4A7BA0)",
            borderColor: "#609BC7",
          }}
        >
          <span className="text-sm font-medium text-white">
            📄 Text File Content
          </span>
        </div>

        <div className="flex-1 overflow-auto">
          <pre className="p-4 text-sm text-gray-800 dark:text-gray-100 font-mono whitespace-pre-wrap h-full bg-white dark:bg-gray-950 transition-colors duration-300">
            {textContent}
          </pre>
        </div>
      </div>
    );
  };

  // Add fallback banner component for when text extraction fails
  const TextExtractionFailedBanner = () => (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 border border-orange-200 dark:border-orange-500/40 rounded-lg p-3 sm:p-4 text-center max-w-full transition-colors duration-300">
      <div className="flex items-center justify-center mb-2 sm:mb-3">
        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 dark:text-orange-300 mr-2" />
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
          Text Extraction Limited
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-2 text-xs sm:text-sm">
        This document contains mainly <strong>images or complex formatting</strong> that couldn't be processed for AI chat.
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
        You can still download and view the document. For text-based content, try uploading in a different format!
      </p>
      <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-400/20 text-orange-800 dark:text-orange-200 max-w-full">
        🔁 Switch to Global Mode for general AI assistance
      </div>
    </div>
  );

  // NEW: Explicit banner when Docs mode is unavailable for handwritten/images
  const DocsModeUnavailableBanner = () => (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-amber-500/10 dark:to-yellow-500/10 border border-amber-200 dark:border-amber-500/40 rounded-lg p-3 sm:p-4 text-center max-w-full transition-colors duration-300">
      <div className="flex items-center justify-center mb-2 sm:mb-3">
        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-300 mr-2" />
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
          Docs Mode Not Available
        </h3>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-2 text-xs sm:text-sm">
        {isHandwritten && !isImageFile
          ? "Handwritten documents aren't supported in Docs mode yet."
          : "Image-based documents aren't supported in Docs mode."}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
        Please use <span className="font-semibold">Global Mode</span> for general AI help about this material.
      </p>
      <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-200 max-w-full">
        🔁 Tip: Tap the Global tab above to continue
      </div>
    </div>
  );

  // ✅ ENHANCED: Document renderer with beautiful styled borders
  const renderDocument = () => {
    // ✅ CRITICAL: Check if material exists first
    if (!material) return null;

    // ✅ Error State - Updated with #214C8D border
    if (viewerError) {
      return (
        <div
          className="flex flex-col items-center justify-center h-full p-8 rounded-lg border-[4px] border-[#214C8D] dark:border-blue-500/70 shadow-2xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-500/10 dark:to-rose-500/5 transition-colors duration-300"
        >
          <AlertCircle className="w-16 h-16 text-[#214C8D] dark:text-blue-400 mb-4 transition-colors duration-300" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-300">
            Preview Not Available
          </h3>
          <p className="text-gray-500 dark:text-gray-300 mb-6 text-center max-w-md transition-colors duration-300">
            This document cannot be previewed. Please download to view.
          </p>
          <button
            onClick={handleDownload}
            className="relative group bg-gradient-to-r from-[#214C8D] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#214C8D] text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center shadow-lg transform hover:scale-105 hover:shadow-xl max-w-full"
          >
            <Download className="w-5 h-5 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="truncate">
              Download {material.fileName.split(".").pop().toUpperCase()}
            </span>

            {/* Desktop Tooltip */}
            <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-gray-900 text-white text-sm rounded-lg px-4 py-3 whitespace-nowrap z-50 shadow-xl min-w-max max-w-[250px]">
              <div className="flex items-center space-x-2">
                <span>📄</span>
                <div>
                  <div className="font-medium">{material?.fileName}</div>
                  <div className="text-xs opacity-75">
                    Size:{" "}
                    {formatFileSize(material?.fileSize || material?.size || 0)}
                  </div>
                </div>
              </div>
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>

            {/* Mobile Floating Info */}
            <div className="sm:hidden absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex items-center justify-between text-sm text-gray-800">
                <span className="font-medium">File Info:</span>
                <span className="text-blue-600">
                  {formatFileSize(material?.fileSize || material?.size || 0)}
                </span>
              </div>
            </div>
          </button>
        </div>
      );
    }

    // ✅ CRITICAL: Properly declare variables from material
    const { fileType, fileName } = material;
    const fileExtension = fileName.split(".").pop().toLowerCase();
    
    // ✅ BANDWIDTH OPTIMIZATION: Use optimized URL for viewing, original for download
    const displayUrl = optimizedViewUrl || material.fileUrl;

    // ✅ PDF Files - Updated with #214C8D border and OPTIMIZED URL
    if (fileType === "application/pdf" || fileExtension === "pdf") {
      return (
        <div
          className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-[4px] border-[#214C8D] dark:border-blue-500/70 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
        >
          {/* PDF Header */}
          <div className="bg-gradient-to-r from-[#214C8D] to-[#1e3a8a] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-white mr-2" />
              <span className="text-sm text-white font-medium">
                📄 PDF Document
              </span>
            </div>
          </div>
          <iframe
            src={displayUrl}
            className="w-full h-full"
            style={{
              height: "calc(100% - 40px)",
              border: "none",
              outline: "none",
            }}
            title="PDF Viewer"
            onLoad={() => console.log("✅ PDF loaded successfully")}
            onError={() => setViewerError(true)}
          />
        </div>
      );
    }

    // ✅ Office Files - Updated with #214C8D border
    if (
      ["doc", "docx", "ppt", "pptx"].includes(fileExtension) ||
      [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ].includes(fileType)
    ) {
      // Office viewer needs original URL (can't use Cloudinary transformations)
      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        material.fileUrl
      )}`;

      return (
        <div
          className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-[4px] border-[#214C8D] dark:border-blue-500/70 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
        >
          {/* Office Document Header */}
          <div className="bg-gradient-to-r from-[#214C8D] to-[#1e3a8a] px-4 py-2 flex items-center">
            <FileText className="w-5 h-5 text-white mr-2" />
            <span className="text-sm text-white font-medium">
              📊 {fileExtension.includes("ppt") ? "PowerPoint" : "Word"}{" "}
              Document
            </span>
          </div>
          <iframe
            src={officeViewerUrl}
            className="w-full"
            style={{
              height: "calc(100% - 40px)",
              border: "none",
              outline: "none",
            }}
            title="Office Document Viewer"
            onLoad={() => console.log("✅ Office document loaded successfully")}
            onError={() => setViewerError(true)}
          />
        </div>
      );
    }

    // ✅ Text Files - Updated with #214C8D border
    if (fileType === "text/plain" || fileExtension === "txt") {
      return (
        <div
          className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-[4px] border-[#214C8D] dark:border-blue-500/70 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
        >
          <TextFileViewer
            fileUrl={displayUrl}
            onError={() => setViewerError(true)}
          />
        </div>
      );
    }

    // Enhanced download option
    return (
      <div
        className="flex flex-col items-center justify-center h-full p-8 rounded-xl border-[4px] border-[#214C8D] dark:border-blue-500/70 bg-slate-50 dark:bg-slate-900 shadow-2xl transition-colors duration-300"
      >
        <FileText className="w-20 h-20 text-[#214C8D] dark:text-blue-400 mb-6 transition-colors duration-300" />
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3 transition-colors duration-300">
          {material.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md transition-colors duration-300">
          Click download to view this {fileExtension.toUpperCase()} document.
        </p>
        <button
          onClick={handleDownload}
          className="bg-gradient-to-r from-[#214C8D] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#214C8D] text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center shadow-lg transform hover:scale-105"
        >
          <Download className="w-5 h-5 mr-2" />
          Download {fileExtension.toUpperCase()}
        </button>
      </div>
    );
  };

  // REPLACE the unauthenticated spinner return
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <PencilLoader />
          <p className="mt-4 text-gray-600 dark:text-gray-300 transition-colors duration-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // REPLACE the loading spinner return
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <PencilLoader />
          <p className="mt-4 text-gray-600 dark:text-gray-300 transition-colors duration-300">Opening Preview...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-300">
            Material Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">
            The material you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10 transition-colors duration-300">
      {/* Download Warning Modal - Improved Design - Mobile Responsive */}
      {showDownloadWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-2 sm:p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[95vh] overflow-y-auto border border-transparent dark:border-gray-700">
            {/* Modal Header with Icon */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-t-xl sm:rounded-t-2xl p-4 sm:p-6 text-white sticky top-0 z-10">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Download className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-2xl font-bold truncate">
                    Download Notice
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Please read before downloading
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-5">
              {/* Main Message */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-l-4 border-amber-500 dark:border-amber-500/60 rounded-lg p-3 sm:p-5 shadow-sm transition-colors duration-300">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">⚠️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                      Why We Show This Message
                    </h4>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-xs sm:text-sm">
                      We rely on <strong className="text-amber-700 dark:text-amber-300">free cloud storage</strong> with limited monthly bandwidth. 
                      Every download counts toward our quota. By viewing online, you help us keep this 
                      service <strong className="text-green-700 dark:text-green-300">free for everyone</strong>! 🌟
                    </p>
                  </div>
                </div>
              </div>

              {/* Best Practices Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/40 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-colors duration-300">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <h5 className="font-bold text-green-900 dark:text-green-200 text-sm sm:text-base">Recommended</h5>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-green-800 dark:text-green-100">
                    <li className="flex items-start">
                      <span className="mr-1.5 sm:mr-2">•</span>
                      <span>View documents online (instant & free)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5 sm:mr-2">•</span>
                      <span>Use AI chatbot for questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5 sm:mr-2">•</span>
                      <span>Take screenshots if needed</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/40 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-colors duration-300">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <span className="text-xl sm:text-2xl">💾</span>
                    <h5 className="font-bold text-blue-900 dark:text-blue-200 text-sm sm:text-base">Download When</h5>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800 dark:text-blue-100">
                    <li className="flex items-start">
                      <span className="mr-1.5 sm:mr-2">•</span>
                      <span>You need offline access</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5 sm:mr-2">•</span>
                      <span>No internet for studying</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5 sm:mr-2">•</span>
                      <span>Want to print the material</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick Action Note */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border-2 border-purple-300 dark:border-purple-500/50 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-colors duration-300">
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                  <span className="text-2xl sm:text-3xl flex-shrink-0">🎯</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-purple-900 dark:text-purple-200 font-semibold text-xs sm:text-sm">
                      After clicking "I Understand", the download button will be enabled. 
                      Click it again to start your download!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-3 sm:px-6 pb-3 sm:pb-6 pt-2 sticky bottom-0 bg-white dark:bg-gray-900">
              <button
                onClick={handleWarningClose}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform active:scale-95 sm:hover:scale-[1.02]"
              >
                <span className="text-sm sm:text-lg">I Understand - Enable Download</span>
                <Download className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              </button>
              <p className="text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2 sm:mt-3">
                This message appears once per document to promote mindful downloading 💚
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {/* Header */}
  <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-16 z-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-auto sm:h-16 py-2 sm:py-0 gap-2 sm:gap-0">
            {/* Back Button */}
            <div className="flex items-center justify-start">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Back to Materials</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>

            {/* Info + Download */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-end gap-2 sm:space-x-4 w-full sm:w-auto text-center">
              {/* Info Text */}
              <div className="mt-1 sm:mt-2 text-center sm:text-left">
                <p className="text-[10px] xs:text-[11px] sm:text-sm md:text-xs text-gray-600 dark:text-gray-300 flex items-center justify-center sm:justify-start gap-1.5 font-medium leading-snug transition-colors duration-300">
                  <span className="text-green-600">💡</span>
                  <span>
                    For the best experience, please view these notes directly on
                    the website.
                  </span>
                </p>
                <p className="text-[10px] xs:text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 italic leading-snug transition-colors duration-300">
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    Downloads are limited due to cloud storage bandwidth
                  </span>{" "}
                  — use this option only if necessary.
                </p>
              </div>

              {/* Download Button - Changes color based on state */}
              <button
                onClick={handleDownload}
                className={`relative group font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-all duration-300 flex items-center text-xs sm:text-sm transform hover:scale-105 hover:shadow-lg ${
                  downloadEnabled
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md'
                    : 'bg-gray-400 hover:bg-gray-500 text-gray-100 cursor-pointer'
                }`}
              >
                <Download className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0 transition-transform duration-300 ${
                  downloadEnabled ? 'group-hover:rotate-12 group-hover:scale-110' : 'group-hover:animate-bounce'
                }`} />
                <span className="hidden sm:inline">
                  {downloadEnabled ? 'Download Now' : 'Download'}
                </span>
                <span className="sm:hidden">
                  {downloadEnabled ? '✓ Download' : 'Download'}
                </span>

                {/* Status Indicator Badge */}
                {downloadEnabled && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                )}

                {/* Tooltip for Desktop */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-50 shadow-lg min-w-max max-w-[200px] hidden sm:block">
                  <span className="flex items-center">
                    {downloadEnabled ? (
                      <>✅ Ready to download - Size: {formatFileSize(material?.fileSize || material?.size || 0)}</>
                    ) : (
                      <>⚠️ Click to enable download - Size: {formatFileSize(material?.fileSize || material?.size || 0)}</>
                    )}
                  </span>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>

                {/* Tooltip for Mobile */}
                <div className="sm:hidden absolute -top-2 -right-2 bg-green-500 text-white text-[10px] xs:text-xs rounded-full px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {formatFileSize(material?.fileSize || material?.size || 0)}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Material Info */}
  <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 truncate capitalize transition-colors duration-300">
                {material.title}
              </h1>
              <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-x-2 sm:space-x-4 transition-colors duration-300">
                <div className="flex items-center">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="truncate">
                    {material.category.type.charAt(0).toUpperCase() +
                      material.category.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="truncate">{material.category.subject}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>Sem {material.category.semester}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Admin Verification Section */}
      {isAdmin && material?.verification?.status === 'pending' && (
        <div className="bg-amber-50 border-t border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-800 font-medium">Admin Review Required</span>
                </div>
                <div className="text-sm text-amber-700">
                  This material is awaiting your verification
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleVerifyMaterial}
                  disabled={isVerifying}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isVerifying ? 'Verifying...' : 'Verify & Approve'}
                </button>
                
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isVerifying}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Main Content */}
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 px-2 sm:px-4 lg:px-6 xl:px-8 py-4">
        {/* Document Viewer Section */}
        <div className="w-full xl:flex-1 xl:max-w-[65%]">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div 
              className="w-full document-viewer"
              style={{
                height: "75vh",
                minHeight: "600px",
                maxHeight: "900px",
              }}
            >
              {renderDocument()}
            </div>
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="w-full xl:flex-1 xl:max-w-[35%] mt-4 xl:mt-0">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-300">
            {/* Info Message */}
            <div className="bg-blue-50 dark:bg-blue-500/10 border-b border-blue-100 dark:border-blue-500/30 px-3 py-2 transition-colors duration-300">
              <div className="space-y-2 text-center">
                <p className="text-blue-700 dark:text-blue-200 font-semibold text-xs sm:text-sm transition-colors duration-300">
                  💬 AI Chat
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-100 text-[11px] font-medium">
                    PDF • Word • PPT • Text
                  </span>
                  {!hasValidDocumentContent ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-200 text-[11px] font-medium">
                      Text extraction limited — Global mode only
                    </span>
                  ) : isHandwritten ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-200 text-[11px] font-medium">
                      🖊️ Handwritten OCR ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-200 text-[11px] font-medium">
                      ✅ Docs mode available
                    </span>
                  )}
                </div>
                <p className="text-blue-600 dark:text-blue-300 text-[10px] sm:text-xs opacity-75 transition-colors duration-300">
                  Tip: if the AI is busy (503), wait a few seconds and try again.
                </p>
              </div>
            </div>
            
            {/* Chatbot Content */}
            <div 
              className="relative chatbot-container bg-white dark:bg-gray-950 transition-colors duration-300"
              style={{
                height: "75vh",
                minHeight: "600px",
                maxHeight: "900px",
              }}
            >
              <div className="h-full bg-white dark:bg-gray-950 transition-colors duration-300">
                <Chatbot
                  documentText={documentText}
                  initialMode={hasValidDocumentContent ? "document" : "global"}
                  disableDocumentMode={!hasValidDocumentContent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Spacing */}
      <div className="h-6 sm:h-8 xl:h-4"></div>

      {/* NEW: Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 border border-transparent dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  Reject Material
                </h3>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejecting "{material?.title}". This will help the uploader understand the issue.
              </p>
              
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason (optional)..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={4}
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectMaterial}
                  disabled={isVerifying}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'Rejecting...' : 'Reject Material'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        /* Mobile First Approach */
        @media (max-width: 640px) {
          .document-viewer {
            height: 60vh !important;
            min-height: 450px !important;
            max-height: 650px !important;
          }
          .chatbot-container {
            height: 60vh !important;
            min-height: 450px !important;
            max-height: 650px !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .document-viewer {
            height: 70vh !important;
            min-height: 550px !important;
            max-height: 750px !important;
          }
          .chatbot-container {
            height: 70vh !important;
            min-height: 550px !important;
            max-height: 750px !important;
          }
        }

        @media (min-width: 1280px) {
          .document-viewer {
            height: 80vh !important;
            min-height: 650px !important;
            max-height: 1000px !important;
          }
          .chatbot-container {
            height: 80vh !important;
            min-height: 650px !important;
            max-height: 1000px !important;
          }
        }

        /* Smooth transitions */
        .document-viewer, .chatbot-container {
          transition: height 0.3s ease-in-out;
        }

        /* Prevent page scroll when chatbot is focused */
        .chatbot-container {
          position: relative;
          overflow: hidden;
        }
        
        .chatbot-container * {
          scroll-behavior: auto;
        }
        
        /* Ensure chatbot scrolling stays within container */
        .chatbot-container .overflow-y-auto {
          scroll-behavior: smooth;
          overscroll-behavior: contain;
        }
      `}</style>
    </div>
  );
};

export default ViewMaterial;
