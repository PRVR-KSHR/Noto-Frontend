import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PencilLoader from "./components/PencilLoader/PencilLoader";
import AppWithPopup from "./components/AppWithPopup";
import ScrollToTop from "./components/SmoothScroll";

// Lazy load all pages for better performance
const Home = React.lazy(() => import("./pages/Home/Home"));
const Login = React.lazy(() => import("./pages/Login/Login"));
const AdminDashboard = React.lazy(() => import("./pages/Admin Dashboard/AdminDashboard"));
const Upload = React.lazy(() => import("./pages/Upload/Upload"));
const Materials = React.lazy(() => import("./pages/Materials/Materials"));
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
const ViewMaterial = React.lazy(() => import('./pages/ViewMaterial/ViewMaterial'));
const About = React.lazy(() => import('./pages/AboutUs/AboutUs'));

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PencilLoader />
          <p className="mt-4 text-gray-600 text-lg">Loading noto...</p>
        </div>
      </div>
    );
  }

  return (
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <PencilLoader />
                  <p className="mt-4 text-gray-600 text-lg">Loading page...</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/materials/view/:id" element={<ViewMaterial />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                {/* ✅ NEW: Admin Dashboard Route */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        
        {/* Global toast notifications with isolated styling */}
        <Toaster />
        
        <AppWithPopup />
        </div>
      </Router>
  );
}

export default App;
