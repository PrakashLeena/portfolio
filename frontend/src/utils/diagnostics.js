// Diagnostic utilities to debug API connection issues

export const runDiagnostics = async () => {
  console.log('🔍 Running API Connection Diagnostics...');
  
  const results = {
    environment: {},
    urls: {},
    tests: {}
  };

  // 1. Environment Information
  results.environment = {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    hostname: window.location.hostname,
    origin: window.location.origin,
    userAgent: navigator.userAgent
  };

  console.log('🌍 Environment:', results.environment);

  // 2. URL Construction
  const baseUrl = process.env.REACT_APP_API_URL || 'https://portfolio-backend-production-b85d.up.railway.app';
  results.urls = {
    baseUrl,
    healthUrl: `${baseUrl}/health`,
    contactUrl: `${baseUrl}/contact`,
    blogsUrl: `${baseUrl}/blogs`
  };

  console.log('🔗 URLs:', results.urls);

  // 3. Network Tests
  try {
    // Test 1: Basic fetch to Railway backend
    console.log('🧪 Testing Railway backend directly...');
    const healthResponse = await fetch(results.urls.healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });

    results.tests.health = {
      status: healthResponse.status,
      statusText: healthResponse.statusText,
      ok: healthResponse.ok,
      headers: Object.fromEntries(healthResponse.headers.entries())
    };

    if (healthResponse.ok) {
      results.tests.healthData = await healthResponse.json();
    } else {
      results.tests.healthError = await healthResponse.text();
    }

  } catch (error) {
    results.tests.healthError = {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  // Test 2: CORS preflight test
  try {
    console.log('🧪 Testing CORS preflight...');
    const corsResponse = await fetch(results.urls.contactUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });

    results.tests.cors = {
      status: corsResponse.status,
      statusText: corsResponse.statusText,
      headers: Object.fromEntries(corsResponse.headers.entries())
    };

  } catch (error) {
    results.tests.corsError = {
      name: error.name,
      message: error.message
    };
  }

  // Test 3: Actual POST request
  try {
    console.log('🧪 Testing POST request...');
    const postResponse = await fetch(results.urls.contactUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        name: 'Diagnostic Test',
        message: 'This is a test message from diagnostics'
      })
    });

    results.tests.post = {
      status: postResponse.status,
      statusText: postResponse.statusText,
      ok: postResponse.ok
    };

    if (postResponse.ok) {
      results.tests.postData = await postResponse.json();
    } else {
      results.tests.postError = await postResponse.text();
    }

  } catch (error) {
    results.tests.postError = {
      name: error.name,
      message: error.message
    };
  }

  console.log('📊 Diagnostic Results:', results);
  return results;
};

// Quick test function you can run from browser console
window.testApiConnection = runDiagnostics;
