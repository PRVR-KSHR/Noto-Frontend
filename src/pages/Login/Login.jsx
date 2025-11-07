import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, ArrowRight } from 'lucide-react';
import logo from '../../assets/logo.png'

const Login = () => {
  const { user, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      // Error is handled in the context
      console.error('Login failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-950 dark:to-black flex items-center justify-center px-4 transition-colors duration-300">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-noto-primary dark:border-blue-400 border-t-transparent mx-auto"></div>
          <p className="text-noto-primary dark:text-gray-200 font-medium">Signing you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-950 dark:to-black flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-800 p-8 backdrop-blur-sm transition-colors duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg dark:shadow-2xl">
               <div className="w-20 h-20 rounded-lg flex items-center justify-center">
                <img src={logo}></img>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-noto-primary dark:text-blue-300 mb-3">
              Welcome to noto
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Sign in to access thousands of study materials
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-noto-primary dark:hover:border-blue-400 hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-3 mb-8 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-lg">Continue with Google</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Features Preview */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-noto-primary to-noto-secondary rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Access 10,000+ study materials</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-noto-primary to-noto-secondary rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Share your notes with community</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-noto-primary to-noto-secondary rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Download materials instantly</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              🚀 Join over 5,000 students already studying smarter
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            By signing in, you agree to our{' '}
            <span className="text-noto-primary dark:text-blue-400 hover:underline cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-noto-primary dark:text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
