import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ErrorPage = ({ errorCode = 404, errorMessage, errorDetails }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get default messages for different error codes
  const getDefaultMessage = (code) => {
    switch (code) {
      case 400:
        return {
          message: "Bad Request",
          details: "The request could not be understood by the server.",
        };
      case 401:
        return {
          message: "Unauthorized Access",
          details: "Please log in to access this page.",
        };
      case 403:
        return {
          message: "Access Forbidden",
          details: "You do not have permission to access this resource.",
        };
      case 404:
        return {
          message: "Look like you're lost",
          details: "The page you are looking for is not available!",
        };
      case 408:
        return {
          message: "Request Timeout",
          details: "The server timed out waiting for the request.",
        };
      case 500:
        return {
          message: "Internal Server Error",
          details: "Something went wrong on our end. Please try again later.",
        };
      case 502:
        return {
          message: "Bad Gateway",
          details:
            "The server received an invalid response. Please try again later.",
        };
      case 503:
        return {
          message: "Service Unavailable",
          details:
            "The server is temporarily unavailable. Please try again later.",
        };
      case 504:
        return {
          message: "Gateway Timeout",
          details:
            "The server did not respond in time. Please try again later.",
        };
      default:
        return {
          message: "Something Went Wrong",
          details: `An error occurred (Error Code: ${code}). Please try again.`,
        };
    }
  };

  // Determine error from location state or props
  const defaultError = getDefaultMessage(errorCode);
  const error = location.state?.error || {
    code: errorCode,
    message: errorMessage || defaultError.message,
    details: errorDetails || defaultError.details,
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200/60 dark:border-gray-800/60 bg-white/90 dark:bg-gray-900/90 shadow-xl shadow-gray-200/40 dark:shadow-black/30 backdrop-blur-sm text-center px-6 sm:px-10 py-10 transition-colors duration-300">
          <div
            className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[220px] sm:h-[320px] md:h-[360px] bg-center bg-no-repeat bg-contain opacity-90 dark:opacity-80"
            aria-hidden="true"
          >
            <h1 className="pt-6 sm:pt-10 text-6xl sm:text-7xl md:text-8xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
              {error.code}
            </h1>
          </div>

          <div className="-mt-8 sm:-mt-10 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
              {error.message}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {error.details}
            </p>

            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-colors transition-shadow outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/70 disabled:pointer-events-none disabled:opacity-50 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 hover:shadow-emerald-500/30 dark:bg-emerald-400 dark:hover:bg-emerald-300 dark:text-gray-900 h-11 px-10 mt-6"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
