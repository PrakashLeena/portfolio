// API Configuration
const API_CONFIG = {
  development: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || '/api',
  }
};

// Determine environment
const environment = process.env.REACT_APP_ENVIRONMENT || 
                   (process.env.NODE_ENV === 'production' ? 'production' : 'development');

console.log('🔧 API Config:', { 
  environment, 
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL
});

const config = API_CONFIG[environment];
export const API_BASE_URL = config.baseURL;

// Helper function to create API URLs
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  if (environment === 'production') {
    // For Netlify functions, use the full path
    return `${API_BASE_URL}/${cleanEndpoint}`;
  } else {
    return `${API_BASE_URL}/${cleanEndpoint}`;
  }
};

export default {
  API_BASE_URL,
  createApiUrl,
  environment
};
