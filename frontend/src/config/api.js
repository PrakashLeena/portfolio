// API Configuration
const API_CONFIG = {
  development: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://portfolio-backend-git-main-prakashleenas-projects.vercel.app',
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
  
  // Always use the full URL with the endpoint
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// API connection test function
export const testApiConnection = async () => {
  try {
    console.log('🔄 Testing API connection to:', API_BASE_URL);
    const response = await fetch(createApiUrl('health'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API connection successful:', data);
      return { success: true, data };
    } else {
      console.error('❌ API connection failed:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('❌ API connection error:', error);
    return { success: false, error: error.message };
  }
};

// Common API request function with error handling
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = createApiUrl(endpoint);
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ API Success: ${endpoint}`, data);
      return { success: true, data };
    } else {
      console.error(`❌ API Error: ${endpoint}`, data);
      return { success: false, error: data.message || 'API request failed' };
    }
  } catch (error) {
    console.error(`❌ API Request Failed: ${endpoint}`, error);
    return { success: false, error: error.message };
  }
};

export default {
  API_BASE_URL,
  createApiUrl,
  testApiConnection,
  apiRequest,
  environment
};
