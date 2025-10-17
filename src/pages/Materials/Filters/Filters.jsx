import React, { useState, useEffect } from "react";
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { INDIAN_COURSES, SEMESTER_OPTIONS } from "../../../constants/constants";

export const Filters = ({ onFilterChange, onSearchChange, onSortChange, currentSort }) => {
  const courseOptions = INDIAN_COURSES;
  const semesterOptions = SEMESTER_OPTIONS;

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const [filters, setFilters] = useState({
    semester: "",
    course: "",
    year: ""
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle individual filter changes
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Enhanced search handling
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const emptyFilters = {
      semester: "",
      course: "",
      year: ""
    };
    setFilters(emptyFilters);
    setSearchTerm("");
    onFilterChange(emptyFilters);
    onSearchChange("");
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== "") || searchTerm !== "";

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  return (
    <>
      {/* ✅ DESKTOP/TABLET VERSION - Your exact code for md+ screens */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Enhanced Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Materials & Subjects
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by material name, subject, course, college, or professor..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Search across material titles, subjects, courses, colleges, and professor names
              </p>
            </div>

            {/* Sort By Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ArrowUpDown className="inline-block w-4 h-4 mr-1" />
                Sort By
              </label>
              <select
                value={currentSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular (Stars)</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Semesters</option>
                {semesterOptions.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                value={filters.course}
                onChange={(e) => handleFilterChange('course', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Courses</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => handleSearchChange("")}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {key}: {value}
                        <button
                          onClick={() => handleFilterChange(key, "")}
                          className="ml-1 text-gray-600 hover:text-gray-800"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ MOBILE VERSION - Search + Filter Button */}
      <div className="md:hidden">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="space-y-4">
            {/* Mobile Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Materials
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search materials..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Mobile Sort Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ArrowUpDown className="inline-block w-4 h-4 mr-1" />
                Sort By
              </label>
              <select
                value={currentSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular (Stars)</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-noto-primary text-white py-2 px-4 rounded-lg hover:bg-noto-dark transition-colors duration-200"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-noto-secondary text-white text-xs px-2 py-1 rounded-full">
                  {Object.values(filters).filter(v => v !== "").length}
                </span>
              )}
            </button>

            {/* Active filters on mobile */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    Search: "{searchTerm}"
                  </span>
                )}
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <span key={key} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                      {key}: {value}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Mobile Off-Canvas Filter Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Semester Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-noto-primary rounded-full mr-2"></span>
                    Semester
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {semesterOptions.map((semester) => (
                      <button
                        key={semester}
                        onClick={() => handleFilterChange("semester", filters.semester === semester ? "" : semester)}
                        className={`p-2 text-sm border rounded-lg transition-colors ${
                          filters.semester === semester
                            ? 'bg-noto-primary text-white border-noto-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Semester {semester}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Course Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-noto-secondary rounded-full mr-2"></span>
                    Course
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {courseOptions.slice(0, 10).map((course) => (
                      <button
                        key={course}
                        onClick={() => handleFilterChange("course", filters.course === course ? "" : course)}
                        className={`w-full text-left p-2 text-sm border rounded-lg transition-colors ${
                          filters.course === course
                            ? 'bg-noto-secondary text-white border-noto-secondary'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Year
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {yearOptions.slice(0, 9).map((year) => (
                      <button
                        key={year}
                        onClick={() => handleFilterChange("year", filters.year === year.toString() ? "" : year.toString())}
                        className={`p-2 text-sm border rounded-lg transition-colors ${
                          filters.year === year.toString()
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer with Clear All Button */}
              {hasActiveFilters && (
                <div className="border-t border-gray-200 p-4">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setIsDrawerOpen(false);
                    }}
                    className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
