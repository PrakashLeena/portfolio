import React, { useState, useEffect } from 'react';
import { createApiUrl, testApiConnection, apiRequest, debugApiConfig } from '../config/api';

const ConnectionDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get debug info on component mount
    debugApiConfig();
    setDebugInfo({
      environment: process.env.NODE_ENV,
      reactAppApiUrl: process.env.REACT_APP_API_URL,
      reactAppEnvironment: process.env.REACT_APP_ENVIRONMENT,
      vercel: process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      hostname: window.location.hostname,
      origin: window.location.origin
    });
  }, []);

  const runTests = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // Test 1: Basic connection
      console.log('🧪 Running connection tests...');
      results.connection = await testApiConnection();

      // Test 2: Health endpoint
      results.health = await apiRequest('health');

      // Test 3: Test endpoint
      results.test = await apiRequest('test');

      // Test 4: Contact endpoint (POST)
      results.contact = await apiRequest('contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          message: 'This is a test message from the debugger'
        })
      });

      // Test 5: Blogs endpoint
      results.blogs = await apiRequest('blogs');

      setTestResults(results);
    } catch (error) {
      console.error('❌ Test error:', error);
      results.error = error.message;
      setTestResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 w-96 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4 text-purple-400">🔧 API Connection Debugger</h3>
      
      {/* Debug Info */}
      <div className="mb-4">
        <h4 className="font-semibold text-green-400">Environment Info:</h4>
        <div className="text-xs space-y-1">
          <div>NODE_ENV: <span className="text-yellow-300">{debugInfo.environment}</span></div>
          <div>API URL: <span className="text-yellow-300">{debugInfo.reactAppApiUrl}</span></div>
          <div>Hostname: <span className="text-yellow-300">{debugInfo.hostname}</span></div>
          <div>Origin: <span className="text-yellow-300">{debugInfo.origin}</span></div>
          <div>Vercel: <span className="text-yellow-300">{debugInfo.vercel || 'false'}</span></div>
        </div>
      </div>

      {/* Test Button */}
      <button
        onClick={runTests}
        disabled={isLoading}
        className="w-full mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-semibold disabled:opacity-50"
      >
        {isLoading ? 'Running Tests...' : 'Run API Tests'}
      </button>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div>
          <h4 className="font-semibold text-green-400 mb-2">Test Results:</h4>
          <div className="space-y-2 text-xs">
            {Object.entries(testResults).map(([test, result]) => (
              <div key={test} className="border border-gray-700 rounded p-2">
                <div className="font-semibold">
                  {test.toUpperCase()}: 
                  <span className={result.success ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                    {result.success ? '✅ PASS' : '❌ FAIL'}
                  </span>
                </div>
                {result.error && (
                  <div className="text-red-300 mt-1">Error: {result.error}</div>
                )}
                {result.data && (
                  <div className="text-gray-300 mt-1">
                    Data: {JSON.stringify(result.data).substring(0, 100)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* URLs being tested */}
      <div className="mt-4 text-xs">
        <h4 className="font-semibold text-blue-400">Test URLs:</h4>
        <div className="space-y-1 text-gray-300">
          <div>Health: {createApiUrl('health')}</div>
          <div>Contact: {createApiUrl('contact')}</div>
          <div>Blogs: {createApiUrl('blogs')}</div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDebugger;
