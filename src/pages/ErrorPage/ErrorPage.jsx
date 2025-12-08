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
    <section className="bg-white dark:bg-gray-900 font-serif min-h-screen flex items-center justify-center transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-black dark:text-white text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8 font-bold">
                {error.code}
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl text-black dark:text-white sm:text-3xl font-bold mb-4">
                {error.message}
              </h3>
              <p className="mb-6 text-black dark:text-gray-300 sm:mb-5">{error.details}</p>

              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-sm shadow-black/5 h-10 px-8 my-5"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
