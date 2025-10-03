// API Configuration
const API_CONFIG = {
  development: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  },
  production: {
    // For Vercel deployment, use relative path since frontend and backend are on same domain
    baseURL: process.env.REACT_APP_API_URL || '/api',
  }
};

// Determine environment - better detection for Vercel
const isVercelProduction = process.env.VERCEL === '1' || 
  process.env.VERCEL_ENV === 'production' ||
  (typeof window !== 'undefined' && (
    window.location.hostname.includes('.vercel.app') ||
    window.location.hostname.includes('vercel.app')
  ));

const environment = process.env.REACT_APP_ENVIRONMENT || 
                   (process.env.NODE_ENV === 'production' || isVercelProduction ? 'production' : 'development');

console.log('🔧 API Config:', { 
  environment, 
  isVercelProduction,
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  VERCEL: process.env.VERCEL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  baseURL: API_CONFIG[environment]?.baseURL
});

const config = API_CONFIG[environment];
export const API_BASE_URL = config.baseURL;

// Helper function to create API URLs
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // For production (Vercel), the baseURL is '/api', so we need to construct properly
  if (API_BASE_URL === '/api') {
    return `/api/${cleanEndpoint}`;
  }
  
  // For development, use full URL
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
    console.log('🔧 Request options:', { ...options, body: options.body ? 'Present' : 'None' });
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      console.warn(`⚠️ Non-JSON response from ${endpoint}:`, text);
      data = { message: text };
    }
    
    if (response.ok) {
      console.log(`✅ API Success: ${endpoint}`, data);
      return { success: true, data };
    } else {
      console.error(`❌ API Error: ${endpoint} (${response.status})`, data);
      return { success: false, error: data.message || `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error(`❌ API Request Failed: ${endpoint}`, error);
    return { success: false, error: error.message };
  }
};

// Debug function to log current configuration
export const debugApiConfig = () => {
  console.log('🔍 API Configuration Debug:', {
    environment,
    isVercelProduction,
    API_BASE_URL,
    sampleEndpoints: {
      health: createApiUrl('health'),
      contact: createApiUrl('contact'),
      blogs: createApiUrl('blogs')
    },
    envVars: {
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      VERCEL: process.env.VERCEL
    }
  });
};

export default {
  API_BASE_URL,
  createApiUrl,
  testApiConnection,
  apiRequest,
  debugApiConfig,
  environment
};
