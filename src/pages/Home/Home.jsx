import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { eventAPI } from "../../utils/api";
import HeroBackgroundSVG from "../../components/HeroBackgroundSVG";
import UPISupportPopup from "../../components/UPISupportPopup/UPISupportPopup";
import { RiBookShelfFill } from "react-icons/ri";
import DonationShow from "../../components/DonationShow";
import {
  BookOpen,
  Upload,
  Search,
  ChevronRight,
  Plus,
  Heart,
  X,
} from "lucide-react";
import DashboardImage from "../../assets/dashboard.png";

// Import constants
import {
  CATEGORY_ICONS,
  FAQ_DATA,
  FEATURES,
  STATS,
  POPULAR_CATEGORIES,
  BENEFITS,
} from "../../constants/constants";

const Home = () => {
  const { user, loginWithGoogle } = useAuth();
  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [showUPIPopup, setShowUPIPopup] = useState(false);
  const [activeEvents, setActiveEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAnchor, setModalAnchor] = useState({ x: null, y: null });

  // Fetch active events on component mount
  useEffect(() => {
    const fetchActiveEvents = async () => {
      try {
        const response = await eventAPI.getActiveEvents();
        setActiveEvents(response.events || []);
      } catch (error) {
        console.error("Failed to fetch active events:", error);
        // Silently fail - events are optional
      }
    };

    fetchActiveEvents();

    // Listen for donation modal open event
    const handleOpenDonationModal = () => {
      setShowUPIPopup(true);
    };

    window.addEventListener('openDonationModal', handleOpenDonationModal);

    return () => {
      window.removeEventListener('openDonationModal', handleOpenDonationModal);
    };
  }, []);

  // Group events by section title
  const groupedEvents = activeEvents.reduce((groups, event) => {
    const sectionTitle = event.sectionTitle || "🎉 Current Events";
    if (!groups[sectionTitle]) {
      groups[sectionTitle] = [];
    }
    groups[sectionTitle].push(event);
    return groups;
  }, {});

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeImageModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset"; // Cleanup on unmount
    };
  }, [isModalOpen]);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  // Add click handlers
  const handleContributeClick = () => {
    setShowUPIPopup(true);
  };

  const handleClosePopup = () => {
    setShowUPIPopup(false);
  };

  // Image modal handlers
  const openImageModal = (imageUrl, eventDescription, clickEvent) => {
    const rect = clickEvent.currentTarget.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    setModalAnchor({
      x: rect.left + scrollLeft + rect.width / 2,
      y: rect.top + scrollTop + rect.height / 2,
    });

    setSelectedImage({ url: imageUrl, name: eventDescription });
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setModalAnchor({ x: null, y: null });
    document.body.style.overflow = "unset"; // Restore scrolling
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Full SVG Background */}
      <section className="relative min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8 flex items-center">
        <HeroBackgroundSVG />

        <div className="container relative z-10 mx-auto -mt-16">
          <div className="max-w-4xl text-center mx-auto">
            <DonationShow />
            <div
              className="bg-gradient-to-br  from-pink-500 to-red-600 text-white px-1 py-1 md:px-2 md:py-2 rounded-full  mx-auto mb-6 inline-flex items-center hover:bg-gradient-to-br hover:from-red-600 hover:to-pink-500 shadow-xl transition-colors cursor-pointer"
              onClick={handleContributeClick}
              role="button"
              tabIndex={0}
              aria-label="Contribute to support free education"
            >
              <Heart
                  className="text-white w-5 h-5 mr-2 animate-pulse transition-transform duration-300 group-hover:scale-125"
                  fill="currentColor" // makes the heart filled instead of outline
                />
                Support Cloud Storage Costs
            </div>
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-center leading-tight mb-6 sm:mb-8 text-gray-800">
              Share{" "}
              <RiBookShelfFill className="italic inline-block p-2 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl shadow-xl border-x border-t mx-1 sm:mx-2 w-10 h-10 md:w-20 md:h-20 bg-white/20" />{" "}
              Notes, <br />
              Share Knowledge —{" "}
              <span className="italic font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                #Together_We_Learn
              </span>{" "}
            </h1>
            <div className="flex flex-col items-center gap-6 sm:gap-8">
              <span className="text-gray-500 text-[12px] md:text-[15px] max-w-2xl px-4">
                Access thousands of notes, assignments, practicals, and PYQs
                shared by students across all engineering branches. Join our
                community of successful learners.
              </span>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {user ? (
                  <Link
                    to="/materials"
                    className="bg-blue-600 text-white p-3 sm:p-4 w-48 sm:w-52 md:w-60 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                  >
                    Browse Materials
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 -ml-3" />
                  </Link>
                ) : (
                  <button
                    onClick={loginWithGoogle}
                    className="bg-blue-600 text-white p-3 sm:p-4 w-48 sm:w-52 md:w-60 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Get Started Free
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 -ml-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Sections - Shows separate sections for each event type */}
        {Object.keys(groupedEvents).length > 0 &&
          Object.entries(groupedEvents).map(
            ([sectionTitle, events], sectionIndex) => (
              <section
                key={sectionTitle}
                className={`section ${
                  sectionIndex % 2 === 0
                    ? "bg-gradient-to-br from-blue-50 to-indigo-100"
                    : "bg-gradient-to-br from-green-50 to-emerald-100"
                } px-4 sm:px-6 lg:px-8`}
              >
                <div className="container max-w-6xl mx-auto">
                  <div className="text-center mb-6 sm:mb-8 md:mb-12">
                    <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-noto-primary mb-4">
                      {sectionTitle}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                      {sectionTitle?.includes("Event")
                        ? "Don't miss out on exciting events happening at our college"
                        : sectionTitle?.includes("Achievement") ||
                          sectionTitle?.includes("Milestone")
                        ? "Celebrating our amazing achievements and milestones"
                        : sectionTitle?.includes("Sponsor") ||
                          sectionTitle?.includes("Partner")
                        ? "Meet our valued sponsors and partners"
                        : sectionTitle?.includes("Donation") ||
                          sectionTitle?.includes("Support")
                        ? "Support our initiatives and help us grow together"
                        : "Check out what's happening in our community"}
                    </p>
                  </div>

                  {/* Dynamic Grid Layout Based on Event Count */}
                  <div
                    className={`
              ${
                events.length === 1
                  ? "flex justify-center"
                  : events.length === 2
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
              }
            `}
                  >
                    {events.map((event, index) => (
                      <div
                        key={event._id}
                        className={`
                    bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                    ${events.length === 1 ? "max-w-md w-full" : ""}
                  `}
                      >
                        <div className="relative">
                          <img
                            src={event.imageUrl}
                            alt={event.description}
                            className={`
                        w-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105
                        ${events.length === 1 ? "h-64 sm:h-72" : "h-48 sm:h-56"}
                      `}
                            loading="lazy"
                            onClick={(e) =>
                              openImageModal(
                                event.imageUrl,
                                event.description,
                                e
                              )
                            }
                          />
                          <div className="absolute top-4 left-4">
                            <span
                              className={`text-white px-3 py-1 rounded-full text-sm font-medium ${
                                sectionTitle?.includes("Achievement") ||
                                sectionTitle?.includes("Milestone")
                                  ? "bg-yellow-600"
                                  : sectionTitle?.includes("Sponsor") ||
                                    sectionTitle?.includes("Partner")
                                  ? "bg-purple-600"
                                  : sectionTitle?.includes("Donation") ||
                                    sectionTitle?.includes("Support")
                                  ? "bg-green-600"
                                  : "bg-blue-600"
                              }`}
                            >
                              Live
                            </span>
                          </div>
                        </div>
                        <div className="p-4 sm:p-6">
                          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 text-center leading-relaxed">
                            {event.description}
                          </p>
                          <p className="text-gray-500 text-center text-xs sm:text-sm">
                            Posted on{" "}
                            {new Date(event.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          )}

      {/* Dashboard View Section with Upside Down SVG Background */}
      <section className="section hidden lg:block relative overflow-hidden">
        {/* Upside Down SVG Background */}
        <div className="absolute -z-10 w-full h-full rotate-180 -mt-12">
          <HeroBackgroundSVG className="w-full h-full object-cover" />
        </div>

        <div className="flex justify-center items-center relative min-h-[500px] max-w-6xl mx-auto">
          <div className="absolute md:w-[730px] md:h-[420px] lg:w-[880px] lg:h-[500px] bg-noto-primary rounded-2xl transform rotate-[4deg] opacity-90 shadow-lg z-10"></div>
          <div className="relative z-20">
            <img
              src={DashboardImage}
              alt="Dashboard Preview"
              className="md:w-full md:h-[420px] lg:w-full lg:h-[500px] rounded-xl object-contain border-2 border-white shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-white px-6 mt-10 lg:px-8 border border-noto-primary/10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-noto-light rounded-full mb-2 sm:mb-3">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-noto-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-noto-primary">
                    {stat.number}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-noto-light/30 px-4 sm:px-6 lg:px-8">
        <div className="container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-noto-primary mb-4 sm:mb-6">
              Everything You Need to Excel
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From comprehensive study notes to previous year questions, we've
              got all your academic needs covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card text-center hover:scale-105 transform transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6 bg-gray-50 ${feature.color}`}
                  >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section bg-white px-4 sm:px-6 lg:px-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-noto-primary mb-3 sm:mb-4">
                Popular Engineering Branches
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                Explore materials from the most active academic communities
              </p>
            </div>
            <Link to="/materials" className="btn-outline hidden lg:inline-flex">
              View All Branches
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {POPULAR_CATEGORIES.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="card hover:border-noto-secondary/50 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-noto-primary group-hover:text-noto-secondary transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      {category.count}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-noto-secondary transition-colors duration-200" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8 lg:hidden">
            <Link to="/materials" className="btn-outline">
              View All Branches
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-noto-light/30 text-noto-primary px-4 sm:px-6 lg:px-8">
        <div className="container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Why Students Choose noto
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who trust noto for their academic
              success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-full">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold ">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq-section"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 md:mt-10"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-0">
            {FAQ_DATA.map((faq, index) => {
              const isExpanded = expandedFAQ === index;
              return (
                <div
                  key={index}
                  className="border-b border-gray-700 py-6 cursor-pointer transition-all duration-200 hover:bg-gray-50/5"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-noto-primary/70 text-lg sm:text-xl font-semibold pr-8">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      <div
                        className={`transform transition-all duration-300 ${
                          isExpanded
                            ? "rotate-45 scale-110"
                            : "rotate-0 scale-100"
                        }`}
                      >
                        <Plus
                          className={`w-6 h-6 transition-colors duration-300 ${
                            isExpanded
                              ? "text-noto-primary"
                              : "text-noto-primary/50"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isExpanded
                        ? "max-h-screen opacity-100 mt-4"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <div
                      className={`transform transition-all duration-400 delay-100 ${
                        isExpanded ? "translate-y-0" : "-translate-y-4"
                      }`}
                    >
                      <p className="text-gray-500/60 text-base sm:text-lg leading-relaxed pb-2">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-white px-4 sm:px-6 lg:px-8">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-noto-primary">
              Ready to Boost Your Grades?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">
              Join our community of successful students and start accessing
              premium study materials today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/materials"
                    className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 flex items-center w-full sm:w-auto justify-center"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Start Studying Now
                  </Link>
                  <Link
                    to="/upload"
                    className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 flex items-center w-full sm:w-auto justify-center"
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Share Your Materials
                  </Link>
                </>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 flex items-center w-full sm:w-auto justify-center"
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Join noto Today
                </button>
              )}
            </div>

            <p className="text-gray-500 text-sm sm:text-base">
              🚀 Over 5,000 students already studying smarter with noto
            </p>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {isModalOpen && selectedImage && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
              aria-label="Close image modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Image */}
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="w-full h-auto max-h-[80vh] object-contain"
              loading="lazy"
            />
            
            {/* Description */}
            {selectedImage.name && (
              <div className="p-4 bg-white border-t border-gray-200">
                <p className="text-gray-800 text-center font-medium">
                  {selectedImage.name}
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* UPI Popup */}
      {showUPIPopup && (
        <UPISupportPopup isOpen={showUPIPopup} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default Home;
