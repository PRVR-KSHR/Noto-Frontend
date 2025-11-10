// src/components/ProfessorSearch/ProfessorSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Search, X, Plus, AlertCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfessorSearch = ({ onProfessorsSelected, initialProfessors = [], collegeName, subject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [professors, setProfessors] = useState([]);
  const [selectedProfessors, setSelectedProfessors] = useState(initialProfessors);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Validation: College and Subject should be selected
  const isFilteredSearch = collegeName && collegeName.trim().length > 0 && subject && subject.trim().length > 0;

  // Search professors with debouncing
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setHighlightedIndex(-1);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 1) {
      setProfessors([]);
      setShowDropdown(false);
      return;
    }

    // Show dropdown with loader if query is 1+ chars
    if (query.trim().length >= 1) {
      setShowDropdown(true);
      setLoading(true);
    }

    // Debounce the actual search - wait 300ms before making API call
    searchTimeoutRef.current = setTimeout(async () => {
      if (query.trim().length < 1) {
        setProfessors([]);
        setLoading(false);
        return;
      }

      try {
        // Build query parameters with college and subject filters
        const params = new URLSearchParams();
        params.append('query', query);
        if (collegeName && collegeName.trim().length > 0) {
          params.append('collegeName', collegeName.trim());
        }
        if (subject && subject.trim().length > 0) {
          params.append('subject', subject.trim());
        }

        const response = await api.get(`/professors/search?${params.toString()}`);
        
        if (response.data.success) {
          // Filter out already selected professors
          const filtered = response.data.professors.filter(
            prof => !selectedProfessors.find(sp => sp._id === prof._id)
          );
          setProfessors(filtered);
        }
      } catch (error) {
        console.error('Error searching professors:', error);
        setProfessors([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Wait 300ms after user stops typing
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || professors.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < professors.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < professors.length) {
          handleSelectProfessor(professors[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        break;
      default:
        break;
    }
  };

  // Handle professor selection
  const handleSelectProfessor = (professor) => {
    setSelectedProfessors([...selectedProfessors, professor]);
    setSearchQuery('');
    setProfessors([]);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    
    // Call callback
    onProfessorsSelected([...selectedProfessors, professor]);
  };

  // Remove selected professor
  const handleRemoveProfessor = (professorId) => {
    const updated = selectedProfessors.filter(p => p._id !== professorId);
    setSelectedProfessors(updated);
    onProfessorsSelected(updated);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      {/* NEW: Warning if college or subject not selected */}
      {!isFilteredSearch && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-500/40 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-200">
            Please select a <strong>College</strong> and <strong>Subject</strong> first to see professors who teach those subjects.
          </p>
        </div>
      )}

      <div className="relative" ref={inputRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchQuery.trim().length >= 1 || isFilteredSearch) {
                setShowDropdown(true);
              }
            }}
            placeholder={isFilteredSearch ? "Type professor name, college, or subject..." : "Select College & Subject first"}
            disabled={!isFilteredSearch}
            className={`w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition ${
              !isFilteredSearch ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            </div>
          )}
          {!loading && searchQuery.trim().length > 0 && professors.length > 0 && (
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          )}
        </div>

        {/* Dropdown Suggestions */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto">
            {loading && searchQuery.trim().length >= 1 && (
              <div className="px-4 py-8 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Searching professors...</span>
                </div>
              </div>
            )}

            {!loading && professors.length > 0 && (
              <>
                {professors.map((professor, index) => (
                  <button
                    key={professor._id}
                    onClick={() => handleSelectProfessor(professor)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition flex items-start justify-between group ${
                      highlightedIndex === index
                        ? 'bg-blue-50 dark:bg-blue-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {professor.fullName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {professor.collegeName} • ID: {professor.professorId}
                      </p>
                      {professor.subjects && professor.subjects.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {professor.subjects.map((subj, idx) => (
                            <span
                              key={idx}
                              className="inline-block text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded"
                            >
                              {subj}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{professor.email}</p>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600 mt-1 flex-shrink-0" />
                  </button>
                ))}
              </>
            )}

            {!loading && searchQuery.trim().length >= 1 && professors.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                <p className="text-sm">No professors found matching "{searchQuery}"</p>
                <p className="text-xs mt-2 opacity-70">Try searching by professor name, college, or subject</p>
              </div>
            )}

            {!loading && searchQuery.trim().length === 0 && (
              <div className="px-4 py-6 text-center text-gray-600 dark:text-gray-400">
                <p className="text-sm">Start typing to search for professors</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Professors */}
      {selectedProfessors.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
            Tagged Professors ({selectedProfessors.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedProfessors.map((professor) => (
              <div
                key={professor._id}
                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg text-sm"
              >
                <div className="flex-1">
                  <p className="font-semibold">{professor.fullName}</p>
                  <p className="text-xs opacity-75">{professor.collegeName}</p>
                  {professor.subjects && professor.subjects.length > 0 && (
                    <p className="text-xs opacity-70">📚 {professor.subjects.join(', ')}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveProfessor(professor._id)}
                  className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 p-1 rounded transition"
                  title="Remove professor"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        💡 Tagging registered professors will send them notifications to verify this material.
      </p>
    </div>
  );
};

export default ProfessorSearch;
