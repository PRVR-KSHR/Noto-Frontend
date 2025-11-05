import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HeroBackgroundSVG from "../../components/HeroBackgroundSVG";
import UPISupportPopup from "../../components/UPISupportPopup/UPISupportPopup";
import DonationShow from "../../components/DonationShow";
import {
  BookOpen,
  Upload,
  Search,
  ChevronRight,
  Plus,
  Heart,
  X,
  Sparkles,
  Filter,
  BookmarkCheck,
  Bookmark,
  Star,
  ArrowUpDown,
} from "lucide-react";
import DashboardImage from "../../assets/dashboard.png";
import { RiBookShelfFill } from "react-icons/ri";
import { eventAPI } from "../../utils/api";
import {
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

  useEffect(() => {
    const fetchActiveEvents = async () => {
      try {
        const response = await eventAPI.getActiveEvents();
        setActiveEvents(response.events || []);
      } catch (error) {
        console.error("Failed to fetch active events:", error);
      }
    };

    fetchActiveEvents();

    const handleOpenDonationModal = () => {
      setShowUPIPopup(true);
    };

    window.addEventListener("openDonationModal", handleOpenDonationModal);

    return () => {
      window.removeEventListener("openDonationModal", handleOpenDonationModal);
    };
  }, []);

  const groupedEvents = activeEvents.reduce((groups, event) => {
    const sectionTitle = event.sectionTitle || "🎉 Current Events";
    if (!groups[sectionTitle]) {
      groups[sectionTitle] = [];
    }
    groups[sectionTitle].push(event);
    return groups;
  }, {});

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
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleContributeClick = () => {
    setShowUPIPopup(true);
  };

  const handleClosePopup = () => {
    setShowUPIPopup(false);
  };

  const openImageModal = (imageUrl, eventDescription) => {
    setSelectedImage({ url: imageUrl, name: eventDescription });
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 transition-colors duration-300">
      <section className="relative min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8 flex items-center dark:bg-gray-900 transition-colors duration-300">
        <HeroBackgroundSVG className="absolute -z-999" />

        <div className="container relative z-10 mx-auto -mt-">
          <div className="max-w-4xl text-center mx-auto">
            <DonationShow />
            <div
              className="bg-gradient-to-br text-sm from-pink-500 to-red-600 text-white px-1 py-1 md:px-2 md:py-2 rounded-full mx-auto mb-6 inline-flex items-center hover:bg-gradient-to-br hover:from-red-600 hover:to-pink-500 shadow-xl transition-colors cursor-pointer"
              onClick={handleContributeClick}
              role="button"
              tabIndex={0}
              aria-label="Contribute to support free education"
            >
              <Heart
                className="text-white w-5 h-5 mr-2 animate-pulse transition-transform duration-300 group-hover:scale-125"
                fill="currentColor"
              />
              Support Cloud Storage Costs
            </div>
            <h1 className="text-3xl md:text-6xl lg:text-[75px] font-bold text-center leading-tight sm:mb-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">
              Share{" "}
              <RiBookShelfFill className="italic inline-block p-2 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl shadow-xl border-x border-t mx-1 sm:mx-2 w-10 h-10 md:w-20 md:h-20 bg-white/20 dark:bg-gray-700/30" />{" "}
              Notes, <br />
              Share Knowledge —{" "}
              <span className="italic font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                #Together_We_Learn
              </span>{" "}
            </h1>
            <div className="flex flex-col items-center gap-6 sm:gap-8">
              <span className="text-gray-500 dark:text-gray-400 text-[12px] md:text-[15px] max-w-2xl px-4 transition-colors duration-300">
                Access thousands of notes, assignments, practicals, and PYQs
                shared by students across all engineering branches. Join our
                community of successful learners.
              </span>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {user ? (
                  <Link
                    to="/materials"
                    className="bg-blue-600 dark:bg-blue-500 text-white p-3 sm:p-4 w-48 sm:w-52 md:w-60 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-lg"
                  >
                    Browse Materials
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 -ml-3" />
                  </Link>
                ) : (
                  <button
                    onClick={loginWithGoogle}
                    className="bg-blue-600 dark:bg-blue-500 text-white p-3 sm:p-4 w-48 sm:w-52 md:w-60 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-lg"
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

      {Object.keys(groupedEvents).length > 0 &&
        Object.entries(groupedEvents).map(
          ([sectionTitle, events], sectionIndex) => (
            <section
              key={sectionTitle}
              className={`section ${
                sectionIndex % 2 === 0
                  ? "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20"
                  : "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20"
              } px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
            >
              <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-6 sm:mb-8 md:mb-12">
                  <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-noto-primary dark:text-blue-400 mb-4 transition-colors duration-300">
                    {sectionTitle}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 transition-colors duration-300">
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

                <div
                  className={`${
                    events.length === 1
                      ? "flex justify-center"
                      : events.length === 2
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
                  }`}
                >
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                        events.length === 1 ? "max-w-md w-full" : ""
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={event.imageUrl}
                          alt={event.description}
                          className={`${
                            events.length === 1
                              ? "h-64 sm:h-72"
                              : "h-48 sm:h-56"
                          } w-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105`}
                          loading="lazy"
                          onClick={() =>
                            openImageModal(event.imageUrl, event.description)
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
                        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-3 text-center leading-relaxed transition-colors duration-300">
                          {event.description}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-center text-xs sm:text-sm transition-colors duration-300">
                          Posted on {new Date(event.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        )}

      <section className="section relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <HeroBackgroundSVG className="w-full h-full opacity-30 dark:opacity-15" />
        </div>

        <div className="relative max-w-6xl mx-auto py-12 sm:py-16 lg:py-20">
          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-blue-100/60 via-pink-50/40 to-blue-100/60 dark:from-blue-900/30 dark:via-gray-900/50 dark:to-blue-900/30 blur-3xl -z-10"></div>

          <div className="relative rounded-[32px] border border-white/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/70 shadow-2xl backdrop-blur-xl p-6 sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:auto-rows-fr">
              <div className="grid gap-6">
                <div className="relative rounded-3xl border border-blue-200/70 dark:border-blue-900/40 bg-white/95 dark:bg-gray-900/85 shadow-2xl overflow-hidden min-h-[280px] sm:min-h-[340px] lg:min-h-[440px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/12 via-transparent to-pink-500/12"></div>
                  <img
                    src={DashboardImage}
                    alt="Screenshot of the Noto materials page"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white/85 px-4 py-2 text-xs font-semibold text-blue-700 shadow-lg dark:bg-gray-900/85 dark:text-blue-200">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Live materials interface
                    </span>
                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
                      🌙 Dual theme ready
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-pink-200/70 dark:border-pink-900/40 bg-gradient-to-br from-pink-50/80 to-white/75 dark:from-pink-900/30 dark:to-gray-900/70 p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-3 text-pink-600 dark:text-pink-300">
                    <BookmarkCheck className="w-5 h-5" />
                    <span className="text-sm font-semibold">Your saved stack</span>
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    <p>• Signals & Systems PYQ 2024</p>
                    <p>• Control Systems Formula Deck</p>
                    <p>• MATLAB Practicals – Sem 5</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2 text-blue-500 dark:text-blue-300">
                      <Star className="w-4 h-4" /> Star count syncs instantly
                    </span>
                    <span className="flex items-center gap-2 text-pink-500 dark:text-pink-300">
                      <Bookmark className="w-4 h-4" /> Profile bookmarks ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-3xl border border-blue-200/70 dark:border-blue-900/40 bg-gradient-to-br from-white/92 via-white/75 to-blue-50/50 dark:from-gray-900/85 dark:via-gray-900/65 dark:to-blue-950/25 p-6 sm:p-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    Materials Experience Preview
                  </span>
                  <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    See the materials workspace in action.
                  </h3>
                  <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Search across titles, subjects, professors, and college tags. Narrow results with branch, semester, and year filters, then keep the right PDFs close with stars and bookmarks.
                  </p>
                </div>

                <div className="rounded-3xl border border-blue-100/80 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-900/30 p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-pink-500 text-white shadow-md">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Instant search</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Type to filter notes, assignments, practicals, and PYQs.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-blue-600 dark:bg-gray-900/70 dark:text-blue-200">
                      <Filter className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Focused filters</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Apply branch, semester, and year from the sidebar controls.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/90 to-blue-600/90 text-white shadow-md">
                      <ArrowUpDown className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Sort the stack</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Toggle between recent uploads and popular picks.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200/70 dark:border-gray-800/60 bg-white/90 dark:bg-gray-900/80 p-6 flex flex-col gap-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Everything stays organised.</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Switch between material categories and open detailed views without losing your place. Downloads launch in a new tab so the list stays ready for the next pick.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800/60">Notes</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800/60">Assignments</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800/60">Practicals</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800/60">Previous Papers</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800/60">Research Papers</span>
                  </div>
                  <Link
                    to="/materials"
                    className="mt-2 inline-flex w-max items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                  >
                    Browse Materials
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-800 px-6 mt-10 lg:px-8 border border-noto-primary/10 dark:border-gray-700 transition-colors duration-300">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-noto-light dark:bg-gray-700 rounded-full mb-2 sm:mb-3 transition-colors duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-noto-primary dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-noto-primary dark:text-blue-400 transition-colors duration-300">
                    {stat.number}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-noto-light/30 dark:bg-gray-800/30 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-noto-primary dark:text-blue-400 mb-4 sm:mb-6 transition-colors duration-300">
              Everything You Need to Excel
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 transition-colors duration-300">
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
                  className="card dark:bg-gray-800 dark:border-gray-700 text-center hover:scale-105 transform transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6 bg-gray-50 dark:bg-gray-700 ${feature.color}`}
                  >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 dark:text-gray-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-noto-primary dark:text-blue-400 mb-3 sm:mb-4 transition-colors duration-300">
                Popular Engineering Branches
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
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
                className="card dark:bg-gray-700 dark:border-gray-600 hover:border-noto-secondary/50 dark:hover:border-blue-400/50 group cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-noto-primary dark:text-blue-400 group-hover:text-noto-secondary dark:group-hover:text-blue-300 transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
                      {category.count}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 group-hover:text-noto-secondary dark:group-hover:text-blue-400 transition-colors duration-200" />
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

      <section className="section bg-noto-light/30 dark:bg-gray-800/30 text-noto-primary dark:text-blue-400 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 dark:text-blue-400">
              Why Students Choose noto
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
              Join thousands of students who trust noto for their academic
              success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 dark:bg-gray-700 rounded-full transition-colors duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold dark:text-blue-400">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="faq-section"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 md:mt-10 bg-white dark:bg-gray-900 scroll-mt-28 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-noto-primary dark:text-blue-400 mb-12 transition-colors duration-300">
            Frequently Asked Questions
          </h2>
          <div className="space-y-0">
            {FAQ_DATA.map((faq, index) => {
              const isExpanded = expandedFAQ === index;
              return (
                <div
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-600 py-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-800 dark:text-blue-200 text-lg sm:text-xl font-semibold pr-8 transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      <div
                        className={`transform transition-all duration-300 ${
                          isExpanded ? "rotate-45 scale-110" : "rotate-0 scale-100"
                        }`}
                      >
                        <Plus
                          className={`w-6 h-6 transition-colors duration-300 ${
                            isExpanded
                              ? "text-noto-primary dark:text-blue-400"
                              : "text-noto-primary/50 dark:text-blue-400/50"
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
                      <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed pb-2 transition-colors duration-300">
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

      <section className="section bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-noto-primary dark:text-blue-400 transition-colors duration-300">
              Ready to Boost Your Grades?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4 transition-colors duration-300">
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

            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base transition-colors duration-300">
              🚀 Over 5,000 students already studying smarter with noto
            </p>
          </div>
        </div>
      </section>

      {isModalOpen &&
        selectedImage &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeImageModal}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
                aria-label="Close image modal"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-auto max-h-[80vh] object-contain"
                loading="lazy"
              />

              {selectedImage.name && (
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-800 dark:text-gray-200 text-center font-medium transition-colors duration-300">
                    {selectedImage.name}
                  </p>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {showUPIPopup && (
        <UPISupportPopup isOpen={showUPIPopup} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default Home;
