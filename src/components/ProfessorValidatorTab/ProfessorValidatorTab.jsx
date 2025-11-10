// src/components/ProfessorValidatorTab/ProfessorValidatorTab.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';

const ProfessorValidatorTab = () => {
  const { user, userProfile } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: userProfile?.displayName || '',
    email: user?.email || '',
    collegeName: userProfile?.collegeName || '',
    professorId: '',
    subjects: [] // NEW: Subjects the professor teaches
  });
  const [submitting, setSubmitting] = useState(false);
  const [subjectInput, setSubjectInput] = useState(''); // NEW: For adding subjects

  // Fetch application status
  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const fetchApplicationStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/professors/my-application');
      
      if (response.data.application) {
        setApplication(response.data.application);
        setShowForm(false);
      } else {
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.professorId || formData.professorId.trim().length === 0) {
      toast.error('Professor ID is required');
      return;
    }

    // NEW: Validate subjects
    if (!formData.subjects || formData.subjects.length === 0) {
      toast.error('Please add at least one subject you teach');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/professors/apply', {
        fullName: formData.fullName,
        email: formData.email,
        collegeName: formData.collegeName,
        professorId: formData.professorId.trim(),
        subjects: formData.subjects // NEW: Include subjects
      });

      if (response.data.success) {
        toast.success('Application submitted successfully! Admin will review shortly.');
        setApplication(response.data.application);
        setShowForm(false);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit application';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!showForm && application) {
    // Show application status
    const getStatusBadge = () => {
      switch (application.status) {
        case 'approved':
          return (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Approved</span>
            </div>
          );
        case 'pending':
          return (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Pending Review</span>
            </div>
          );
        case 'rejected':
          return (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">Rejected</span>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Professor Validator Application
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Your application status and details
            </p>
          </div>

          {/* Status Badge */}
          <div>
            {getStatusBadge()}
          </div>

          {/* Application Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <p className="text-gray-900 dark:text-white text-sm sm:text-base break-words">{application.fullName}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <p className="text-gray-900 dark:text-white text-sm sm:text-base break-all">{application.email}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">College Name</label>
              <p className="text-gray-900 dark:text-white text-sm sm:text-base break-words">{application.collegeName}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Professor ID</label>
              <p className="text-gray-900 dark:text-white text-sm sm:text-base break-words">{application.professorId}</p>
            </div>

            {/* Subjects */}
            {application.subjects && application.subjects.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subjects Taught</label>
                <div className="flex flex-wrap gap-2">
                  {application.subjects.map((subject, idx) => (
                    <span key={idx} className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs sm:text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Applied On</label>
              <p className="text-gray-900 dark:text-white text-sm sm:text-base">
                {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>

            {application.status === 'rejected' && application.rejectionReason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2 text-sm sm:text-base">Rejection Reason</h3>
                <p className="text-red-800 dark:text-red-200 text-sm break-words">{application.rejectionReason}</p>
              </div>
            )}

            {application.status === 'approved' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 text-sm sm:text-base">✨ Great News!</h3>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Your application has been approved! You can now verify materials tagged to you in your Material Verification section.
                </p>
              </div>
            )}
          </div>

          {/* New Application Button (if rejected) */}
          {application.status === 'rejected' && (
            <button
              onClick={() => {
                setApplication(null);
                setShowForm(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 text-sm sm:text-base"
            >
              Apply Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-6 sm:py-4 pb-20 sm:pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Apply as Professor Validator
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                Become a professor validator to review and approve materials tagged to you. This helps maintain quality content on our platform.
              </p>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">ℹ️ What is a Professor Validator?</h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                <li>• Review materials uploaded by students and tagged with your name</li>
                <li>• Approve or reject materials based on accuracy and quality</li>
                <li>• Provide feedback to students on their materials</li>
                <li>• Help maintain high-quality content on NOTO</li>
              </ul>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name - Auto-filled, disabled */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-filled from your profile</p>
              </div>

              {/* Email - Auto-filled, disabled */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-filled from your account</p>
              </div>

              {/* College Name - Auto-filled but can be edited */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  College Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  placeholder="Enter your college name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition text-sm"
                  required
                />
              </div>

              {/* Professor ID - Required Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Professor ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="professorId"
                  value={formData.professorId}
                  onChange={handleInputChange}
                  placeholder="e.g., PROF-AMU-2024-001 or your employee ID"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition text-sm"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your unique professor ID at this college</p>
              </div>

              {/* Subjects - Multiple Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Subjects You Teach <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
                          setFormData(prev => ({
                            ...prev,
                            subjects: [...prev.subjects, subjectInput.trim()]
                          }));
                          setSubjectInput('');
                        }
                      }
                    }}
                    placeholder="e.g., Data Structures (Press Enter to add)"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
                        setFormData(prev => ({
                          ...prev,
                          subjects: [...prev.subjects, subjectInput.trim()]
                        }));
                        setSubjectInput('');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm sm:text-base whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>

                {/* Display added subjects */}
                {formData.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((subject, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        <span>{subject}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              subjects: prev.subjects.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Add all subjects you're qualified to validate</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Apply as Professor Validator'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProfessorValidatorTab;
