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
  BAD_REQUEST: {
    code: 400,
    message: 'Bad Request',
    details: 'The request could not be understood by the server.'
  },
  UNAUTHORIZED: {
    code: 401,
    message: 'Unauthorized',
    details: 'Please log in to access this page.'
  },
  FORBIDDEN: {
    code: 403,
    message: 'Access Denied',
    details: 'You do not have permission to access this resource.'
  },
  NOT_FOUND: {
    code: 404,
    message: 'Page Not Found',
    details: 'The page you are looking for does not exist or has been moved.'
  },
  REQUEST_TIMEOUT: {
    code: 408,
    message: 'Request Timeout',
    details: 'The server timed out waiting for the request.'
  },
  SERVER_ERROR: {
    code: 500,
    message: 'Internal Server Error',
    details: 'Something went wrong on our end. Please try again later.'
  },
  BAD_GATEWAY: {
    code: 502,
    message: 'Bad Gateway',
    details: 'The server received an invalid response.'
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    message: 'Service Unavailable',
    details: 'The server is temporarily unavailable. Please try again later.'
  },
  GATEWAY_TIMEOUT: {
    code: 504,
    message: 'Gateway Timeout',
    details: 'The server did not respond in time.'
  }
};
