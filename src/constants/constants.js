import { 
  BookOpen, 
  FileText, 
  FlaskConical, 
  Clock, 
  FileSignature, 
  PenTool, 
  GraduationCap, 
  Users, 
  Download, 
  Shield, 
  TrendingUp 
} from "lucide-react";

export const INDIAN_COURSES = [
  // Undergraduate Courses
  "BBA (Bachelor of Business Administration)",
  "BCA (Bachelor of Computer Applications)",
  "BTech (Bachelor of Technology)",
  "BALLB (Bachelor of Arts + Bachelor of Laws)",
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
].sort(); // Sort alphabetically

export const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export const MATERIAL_CATEGORIES = [
  { value: "notes", label: "Notes", icon: "BookOpen" },
  { value: "assignments", label: "Assignments", icon: "FileText" },
  { value: "practical", label: "Practical", icon: "GraduationCap" },
  { value: "prevquestionpaper", label: "Previous Question Papers", icon: "Clock" },
  { value: "researchpaper", label: "Research Paper", icon: "FileSignature" },
];

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Category icons data
export const CATEGORY_ICONS = [
  { icon: BookOpen, name: "Notes", color: "text-blue-500" },
  { icon: FileText, name: "Assignments", color: "text-green-500" },
  { icon: FlaskConical, name: "Practicals", color: "text-purple-500" },
  { icon: Clock, name: "Previous Papers", color: "text-orange-500" },
  { icon: FileSignature, name: "Research Papers", color: "text-red-500" },
];

// FAQ Data
export const FAQ_DATA = [
  {
    question: "How is Noto different from traditional study platforms?",
    answer: "No setup, no waiting. Get access to thousands of study materials instantly shared by students across India's top engineering colleges.",
  },
  {
    question: "Who is Noto for?",
    answer: "Noto is perfect for engineering students who want quick access to notes, assignments, practicals, and previous year questions from their peers.",
  },
  {
    question: "Is Noto completely free to use?",
    answer: "Yes! Noto is completely free. We believe education should be accessible to everyone. You can browse, download, and share materials without any cost.",
  },
  {
    question: "What types of study materials can I find?",
    answer: "You can find comprehensive notes, assignments with solutions, practical files, previous year question papers, and research papers across all engineering branches.",
  },
  {
    question: "Can I upload my own study materials?",
    answer: "Absolutely! We encourage students to share their materials. Simply create an account and start contributing to help fellow students succeed.",
  },
];

// Features data
export const FEATURES = [
  {
    icon: BookOpen,
    title: "Comprehensive Notes",
    description: "Access high-quality notes from all engineering branches and semesters.",
    color: "text-noto-primary",
  },
  {
    icon: PenTool,
    title: "Assignments & Solutions",
    description: "Find assignment questions with detailed solutions and explanations.",
    color: "text-noto-secondary",
  },
  {
    icon: FlaskConical,
    title: "Practical Files",
    description: "Complete practical files with observations and results for lab work.",
    color: "text-green-600",
  },
  {
    icon: GraduationCap,
    title: "Previous Year Questions",
    description: "Exam preparation made easy with PYQs from multiple years.",
    color: "text-purple-600",
  },
];

// Stats data
export const STATS = [
  { number: "10,000+", label: "Study Materials", icon: FileText },
  { number: "5,000+", label: "Active Students", icon: Users },
  { number: "50,000+", label: "Downloads", icon: Download },
  { number: "15+", label: "Engineering Branches", icon: BookOpen },
];

// Popular Categories data
export const POPULAR_CATEGORIES = [
  {
    name: "Computer Science",
    count: "2,500+ materials",
    path: "/materials?branch=cs",
  },
  {
    name: "Information Technology",
    count: "1,800+ materials",
    path: "/materials?branch=it",
  },
  {
    name: "Electronics & Communication",
    count: "1,200+ materials",
    path: "/materials?branch=ece",
  },
  {
    name: "Mechanical Engineering",
    count: "1,000+ materials",
    path: "/materials?branch=me",
  },
  {
    name: "Civil Engineering",
    count: "900+ materials",
    path: "/materials?branch=ce",
  },
  {
    name: "Electrical Engineering",
    count: "800+ materials",
    path: "/materials?branch=ee",
  },
];

// Benefits data
export const BENEFITS = [
  {
    icon: Shield,
    title: "Quality Assured",
    description: "All materials are reviewed by our community and verified for accuracy.",
  },
  {
    icon: Clock,
    title: "Always Updated",
    description: "Fresh content added daily by students and educators across the country.",
  },
  {
    icon: TrendingUp,
    title: "Trending Content",
    description: "Discover the most popular and helpful materials in your field of study.",
  },
];



// ViewMaterial constants
export const FILE_EXTENSION_MIME_MAP = {
  pdf: 'application/pdf',
  txt: 'text/plain',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

export const OFFICE_MIME_TYPES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

export const OFFICE_EXTENSIONS = ['doc', 'docx', 'ppt', 'pptx'];

export const VIEWER_STYLES = {
  border: {
    color: '#214C8D',
    width: '4px',
    radius: '12px',
    shadow: '0 10px 25px rgba(33, 76, 141, 0.3)',
    shadowComplex: '0 10px 25px rgba(33, 76, 141, 0.3), 0 0 0 1px rgba(33, 76, 141, 0.1)',
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
  },
  header: {
    background: 'linear-gradient(to right, #214C8D, #1e3a8a)',
  },
  errorBackground: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
};

export const ERROR_MESSAGES = {
  materialNotFound: "Material not found",
  loadFailed: "Failed to load material",
  downloadFailed: "Download failed. Please try again.",
  textLoadFailed: "❌ Unable to load text content. Please download the file to view it.",
  previewNotAvailable: "This document cannot be previewed. Please download to view.",
  fileEmpty: "This file appears to be empty.",
  limitedExtraction: "This document could not be processed for text extraction. This might be due to:\n- The file contains only images/scanned content\n- The file format is not fully supported\n- The file is encrypted or password protected\n\nYou can still download and view the file manually.",
};

export const SUCCESS_MESSAGES = {
  downloadSuccess: "downloaded successfully!",
  pdfLoaded: "✅ PDF loaded successfully",
  officeLoaded: "✅ Office document loaded successfully",
  textLoaded: "✅ Document text loaded:",
};

