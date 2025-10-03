// Test utility for API configuration
import { testApiConnection, debugApiConfig, apiRequest } from '../config/api';

// Test all main API endpoints
export const testAllEndpoints = async () => {
  console.log('🧪 Starting API endpoint tests...');
  
  // Debug current configuration
  debugApiConfig();
  
  const tests = [
    { name: 'Health Check', endpoint: 'health' },
    { name: 'Test Endpoint', endpoint: 'test' },
    { name: 'Blogs List', endpoint: 'blogs' },
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n🔄 Testing ${test.name}...`);
    try {
      const result = await apiRequest(test.endpoint);
      results.push({
        test: test.name,
        endpoint: test.endpoint,
        success: result.success,
        data: result.data,
        error: result.error
      });
      
      if (result.success) {
        console.log(`✅ ${test.name} - SUCCESS`);
      } else {
        console.log(`❌ ${test.name} - FAILED:`, result.error);
      }
    } catch (error) {
      console.log(`💥 ${test.name} - EXCEPTION:`, error.message);
      results.push({
        test: test.name,
        endpoint: test.endpoint,
        success: false,
        error: error.message
      });
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.table(results);
  
  return results;
};

// Test contact form submission
export const testContactForm = async (testData = { name: 'Test User', message: 'Test message from API test' }) => {
  console.log('📧 Testing contact form submission...');
  
  try {
    const result = await apiRequest('contact', {
      method: 'POST',
      body: JSON.stringify(testData)
    });
    
    if (result.success) {
      console.log('✅ Contact form test - SUCCESS');
    } else {
      console.log('❌ Contact form test - FAILED:', result.error);
    }
    
    return result;
  } catch (error) {
    console.log('💥 Contact form test - EXCEPTION:', error.message);
    return { success: false, error: error.message };
  }
};

// Quick connection test
export const quickConnectionTest = async () => {
  console.log('⚡ Quick connection test...');
  return await testApiConnection();
};

export default {
  testAllEndpoints,
  testContactForm,
  quickConnectionTest
};
