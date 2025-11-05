import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext";
import { useTheme } from "../../src/context/ThemeContext";
import { adminAPI } from "../utils/api";
import logo from '../../src/assets/logo.png'
import UserAvatar from './UserAvatar';
import {
  Menu,
  X,
  BookOpen,
  User,
  LogOut,
  Upload,
  Info,
  HelpCircle,
  Shield,
  Sun,
  Moon,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, loginWithGoogle, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const response = await adminAPI.checkAccess();
          setIsAdmin(response.isAdmin);
        } catch (error) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [user]);

  const scrollToFaqSection = useCallback(() => {
    const faqSection = document.getElementById("faq-section");
    if (!faqSection) {
      return false;
    }

    const headerOffset = 120; // offset for sticky navbar
    const elementPosition = faqSection.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: Math.max(elementPosition - headerOffset, 0),
      behavior: "smooth",
    });
    return true;
  }, []);

  useEffect(() => {
    const shouldScroll =
      location.pathname === "/" &&
      (location.hash === "#faq" ||
        location.hash === "#faq-section" ||
        location.state?.scrollToFaq);

    if (!shouldScroll) {
      return;
    }

    let attempts = 0;
    let timeoutId;

    const attemptScroll = () => {
      attempts += 1;
      const found = scrollToFaqSection();
      if (!found && attempts < 8) {
        timeoutId = window.setTimeout(attemptScroll, 120);
      }
    };

    timeoutId = window.setTimeout(attemptScroll, 120);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [location, scrollToFaqSection]);

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
      if (!scrollToFaqSection()) {
        setTimeout(scrollToFaqSection, 150);
      }
    } else {
      navigate("/", { state: { scrollToFaq: true } });
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { name: "Home", path: "/", icon: null, onClick: handleHomeClick },
    { name: "Materials", path: "/materials", icon: BookOpen },
    { name: "About Us", path: "/about", icon: Info },
  { name: "FAQ", path: "#faq-section", icon: HelpCircle, onClick: handleFAQClick },
    { name: "Upload", path: "/upload", icon: Upload, requireAuth: true },
  ];

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
            className={`flex items-center space-x-1 text-noto-primary dark:text-gray-300 font-medium transform transition-transform duration-300 group-hover:-translate-y-full group-hover:text-noto-secondary dark:group-hover:text-blue-400 ${
              hovered ? "transform -translate-y-full" : "transform translate-y-0"
            }`}
          >
            {link.icon && <link.icon className="w-4 h-4" />}
            <span>{link.name}</span>
          </span>
          <span
            className={`absolute left-0 top-full flex items-center space-x-1 text-noto-secondary dark:text-blue-400 font-medium transform transition-transform duration-300 group-hover:-translate-y-full ${
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
          className={`flex items-center space-x-1 text-noto-primary dark:text-gray-300 font-medium transform transition-transform duration-300 group-hover:-translate-y-full group-hover:text-noto-secondary dark:group-hover:text-blue-400 ${
            hovered ? "transform -translate-y-full" : "transform translate-y-0"
          }`}
        >
          {link.icon && <link.icon className="w-4 h-4" />}
          <span>{link.name}</span>
        </span>
        <span
          className={`absolute left-0 top-full flex items-center space-x-1 text-noto-secondary dark:text-blue-400 font-medium transform transition-transform duration-300 group-hover:-translate-y-full ${
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
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-20 w-full max-w-8xl bg-white/20 dark:bg-gray-900 backdrop-blur-sm rounded-2xl"></div>
      </div>

      <nav className="hidden lg:block sticky top-4 z-50 w-full">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur transition-colors duration-300">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={handleHomeClick}
              className="flex items-center -space-x-3"
            >
              <div className="w-16 h-10 rounded-lg flex items-center justify-center">
                <img src={logo} alt="Noto logo" />
              </div>
              <h1 className="text-xl sm:text-2xl font-heading text-noto-primary dark:text-blue-400 font-bold">
                NOTO
              </h1>
            </button>

            <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                if (link.requireAuth && !user) return null;
                return <SlidingNavLink key={link.name} link={link} />;
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-noto-light/50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-noto-primary dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </button>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-noto-light/50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <UserAvatar user={user} size="w-8 h-8" />
                    <span className="text-noto-primary dark:text-gray-300 font-medium">
                      {user.displayName}
                    </span>
                  </button>

                  <div className="absolute right-0 top-12 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-lg shadow-lg border border-noto-light dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-3 text-noto-primary dark:text-gray-300 hover:bg-noto-light/50 dark:hover:bg-gray-700 rounded-t-lg transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-3 text-noto-primary dark:text-gray-300 hover:bg-noto-light/50 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg w-full text-left transition-colors duration-200"
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

      <nav className="lg:hidden sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleHomeClick}
              className="flex items-center -space-x-4"
            >
              <div className="w-20 h-10 rounded-lg flex items-center justify-center">
                <img src={logo} alt="Noto logo" />
              </div>
              <span className="text-xl font-bold text-noto-primary dark:text-blue-400">NOTO</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-noto-light/50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-noto-primary dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-noto-primary dark:text-gray-300 p-2"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="border-t border-gray-200 dark:border-gray-700 py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur">
              <div className="space-y-3">
                {navLinks.map((link) => {
                  if (link.requireAuth && !user) return null;
                  const Icon = link.icon;

                  if (link.onClick) {
                    return (
                      <button
                        key={link.name}
                        onClick={link.onClick}
                        className="flex items-center space-x-2 text-noto-primary dark:text-gray-300 hover:text-noto-secondary dark:hover:text-blue-400 font-medium w-full text-left transition-colors duration-200"
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
                      className="flex items-center space-x-2 text-noto-primary dark:text-gray-300 hover:text-noto-secondary dark:hover:text-blue-400 font-medium transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {user ? (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <UserAvatar user={user} size="w-8 h-8" />
                    <span className="font-medium text-noto-primary dark:text-gray-300">{user.displayName}</span>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 text-noto-primary dark:text-gray-300 font-medium hover:text-noto-secondary dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 text-noto-primary dark:text-gray-300 font-medium hover:text-noto-secondary dark:hover:text-blue-400 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <Shield className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    <button
                      className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-medium"
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
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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