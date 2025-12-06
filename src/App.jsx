import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PencilLoader from "./components/PencilLoader/PencilLoader";
import AppWithPopup from "./components/AppWithPopup";
import ScrollToTop from "./components/SmoothScroll";
import VisitorCounter from "./components/VisitorCounter/VisitorCounter";

// Lazy load all pages for better performance
const Home = React.lazy(() => import("./pages/Home/Home"));
const Login = React.lazy(() => import("./pages/Login/Login"));
const AdminDashboard = React.lazy(() => import("./pages/Admin Dashboard/AdminDashboard"));
const Upload = React.lazy(() => import("./pages/Upload/Upload"));
const Materials = React.lazy(() => import("./pages/Materials/Materials"));
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
const ViewMaterial = React.lazy(() => import('./pages/ViewMaterial/ViewMaterial'));
const About = React.lazy(() => import('./pages/AboutUs/AboutUs'));
const ErrorPage = React.lazy(() => import('./pages/ErrorPage/ErrorPage'));

function App() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <PencilLoader />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">Loading noto...</p>
        </div>
      </div>
    );
  }

  return (
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <PencilLoader />
                  <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">Loading page...</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/materials/view/:fileId" element={<ViewMaterial />} />
                {/* NEW: public share alias for direct links */}
                <Route path="/view/:fileId" element={<ViewMaterial />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                {/* ✅ NEW: Admin Dashboard Route */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                {/* Error Page - Catch all unknown routes */}
                <Route path="*" element={<ErrorPage errorCode={404} />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        
          {/* Global toast notifications with isolated styling */}
          <Toaster position="top-center" />
        
          <AppWithPopup />
          
          {/* Visitor Counter */}
          <VisitorCounter />
        </div>
      </Router>
  );
}

export default App;
