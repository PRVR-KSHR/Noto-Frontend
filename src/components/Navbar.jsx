import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext";
import { adminAPI } from "../utils/api";
import logo from '../../src/assets/logo.png'
import {
  Menu,
  X,
  Search,
  BookOpen,
  User,
  LogOut,
  Upload,
  Info,
  HelpCircle,
  Shield,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // ✅ ADD this state
  const { user, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ADD: Check if user is admin (minimal admin check)
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          console.log('🔍 Checking admin status for user:', user.email);
          const response = await adminAPI.checkAccess();
          console.log('📝 Admin check response:', response);
          setIsAdmin(response.isAdmin);
        } catch (error) {
          console.error('❌ Admin check failed:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [user]);

  // Handle FAQ navigation after route changes
  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#faq") {
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        const faqSection = document.getElementById("faq-section");
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/materials?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const handleFAQClick = (e) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname === "/") {
      // Already on home page, just scroll to FAQ
      const faqSection = document.getElementById("faq-section");
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page with FAQ hash
      navigate("/#faq");
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname === "/" && location.hash === "#faq") {
      // Currently viewing FAQ section, go to hero section
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Regular home navigation
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Home", path: "/", icon: null, onClick: handleHomeClick },
    { name: "Materials", path: "/materials", icon: BookOpen },
    { name: "About Us", path: "/about", icon: Info },
    { name: "FAQ", path: "#faq", icon: HelpCircle, onClick: handleFAQClick },
    { name: "Upload", path: "/upload", icon: Upload, requireAuth: true },
  ];

  // Sliding Link Component with proper navigation handling
  const SlidingNavLink = ({ link }) => {
    const [hovered, setHovered] = useState(false);

    const handleClick = (e) => {
      if (link.onClick) {
        link.onClick(e);
      }
    };

    if (link.onClick) {
      return (
        <button
          onClick={handleClick}
          className="group relative block overflow-hidden cursor-pointer h-6"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span
            className={`flex items-center space-x-1 text-noto-primary font-medium transform transition-transform duration-300 group-hover:-translate-y-full group-hover:text-noto-secondary ${
              hovered
                ? "transform -translate-y-full"
                : "transform translate-y-0"
            }`}
          >
            {link.icon && <link.icon className="w-4 h-4" />}
            <span>{link.name}</span>
          </span>
          <span
            className={`absolute left-0 top-full flex items-center space-x-1 text-noto-secondary font-medium transform transition-transform duration-300 group-hover:-translate-y-full ${
              hovered ? "transform translate-y-0" : "transform translate-y-full"
            }`}
          >
            {link.icon && <link.icon className="w-4 h-4" />}
            <span>{link.name}</span>
          </span>
        </button>
      );
    }

    return (
      <Link
        to={link.path}
        className="group relative block overflow-hidden cursor-pointer h-6"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setIsOpen(false)}
      >
        <span
          className={`flex items-center space-x-1 text-noto-primary font-medium transform transition-transform duration-300 group-hover:-translate-y-full group-hover:text-noto-secondary ${
            hovered ? "transform -translate-y-full" : "transform translate-y-0"
          }`}
        >
          {link.icon && <link.icon className="w-4 h-4" />}
          <span>{link.name}</span>
        </span>
        <span
          className={`absolute left-0 top-full flex items-center space-x-1 text-noto-secondary font-medium transform transition-transform duration-300 group-hover:-translate-y-full ${
            hovered ? "transform translate-y-0" : "transform translate-y-full"
          }`}
        >
          {link.icon && <link.icon className="w-4 h-4" />}
          <span>{link.name}</span>
        </span>
      </Link>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-20 w-full max-w-8xl bg-white/20 backdrop-blur-sm rounded-2xl"></div>
      </div>

      {/* Desktop navbar with centered navigation */}
      <nav className="hidden lg:block sticky top-4 z-50 w-full">
         <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 border border-zinc-200 rounded-2xl shadow-sm bg-white/90">
          <div className="flex items-center justify-between py-4">
            {/* Logo - Left with Home navigation */}
            <button
              onClick={handleHomeClick}
              className="flex items-center -space-x-3"
            >
              <div className="w-16 h-10 rounded-lg flex items-center justify-center">
                <img src={logo}></img>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading text-noto-primary font-bold">
                NOTO
              </h1>
            </button>

            {/* Navigation Links - Center with sliding animation */}
            <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                if (link.requireAuth && !user) return null;
                return <SlidingNavLink key={link.name} link={link} />;
              })}
            </div>

            {/* Authentication - Right */}
            <div className="flex items-center">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-noto-light/50">
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full border-2 border-noto-secondary"
                    />
                    <span className="text-noto-primary font-medium">
                      {user.displayName}
                    </span>
                  </button>

                  <div className="absolute right-0 top-12 w-48 bg-white/95 backdrop-blur rounded-lg shadow-lg border border-noto-light opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-3 text-noto-primary hover:bg-noto-light/50 rounded-t-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={loginWithGoogle} className="btn-primary text-sm sm:text-base">
                  Login with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile navbar */}
      <nav className="lg:hidden sticky top-0 z-50 w-full bg-white/90 border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleHomeClick}
              className="flex items-center -space-x-4"
            >
              <div className="w-20 h-10 rounded-lg flex items-center justify-center">
                <img src={logo}></img>
              </div>
              <span className="text-xl font-bold text-noto-primary">NOTO</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-noto-primary p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {isOpen && (
            <div className="border-t border-gray-200 py-4 bg-white/95 backdrop-blur">
              <div className="space-y-3">
                {navLinks.map((link) => {
                  if (link.requireAuth && !user) return null;
                  const Icon = link.icon;

                  if (link.onClick) {
                    return (
                      <button
                        key={link.name}
                        onClick={link.onClick}
                        className="flex items-center space-x-2 text-noto-primary hover:text-noto-secondary font-medium w-full text-left"
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        <span>{link.name}</span>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center space-x-2 text-noto-primary hover:text-noto-secondary font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile user menu (same as before) */}
              {user ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{user.displayName}</span>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 text-noto-primary font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    <button
                      className="flex items-center space-x-2 text-red-600 font-medium"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    className="btn-primary w-full"
                    onClick={() => {
                      loginWithGoogle();
                      setIsOpen(false);
                    }}
                  >
                    Login with Google
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;