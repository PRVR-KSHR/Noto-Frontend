import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle error navigation
 */
export const useErrorHandler = () => {
  const navigate = useNavigate();

  const showError = (errorCode, errorMessage, errorDetails) => {
    navigate('/error', {
      state: {
        error: {
          code: errorCode,
          message: errorMessage,
          details: errorDetails
        }
      }
    });
  };

  return { showError };
};

/**
 * Error codes and their default messages
 */
export const ErrorCodes = {
  NOT_FOUND: {
    code: 404,
    message: 'Page Not Found',
    details: 'The page you are looking for does not exist or has been moved.'
  },
  FORBIDDEN: {
    code: 403,
    message: 'Access Denied',
    details: 'You do not have permission to access this resource.'
  },
  SERVER_ERROR: {
    code: 500,
    message: 'Internal Server Error',
    details: 'Something went wrong on our end. Please try again later.'
  },
  UNAUTHORIZED: {
    code: 401,
    message: 'Unauthorized',
    details: 'Please log in to access this page.'
  },
  BAD_REQUEST: {
    code: 400,
    message: 'Bad Request',
    details: 'The request could not be understood by the server.'
  }
};
