import React, { useState, useEffect } from 'react';
import { testApiConnection, debugApiConfig, apiRequest } from '../config/api';
import { testAllEndpoints, testContactForm, quickConnectionTest } from '../utils/testApi';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  useEffect(() => {
    // Debug API configuration on component mount
    debugApiConfig();
    
    // Quick connection test
    quickConnectionTest().then(result => {
      setConnectionStatus(result.success ? 'connected' : 'disconnected');
    });
  }, []);

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      console.log('🧪 Starting comprehensive API tests...');
      const results = await testAllEndpoints();
      setTestResults(results);
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      setTestResults([{
        test: 'Test Suite',
        success: false,
        error: error.message
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    const result = await testApiConnection();
    setConnectionStatus(result.success ? 'connected' : 'disconnected');
    setIsLoading(false);
  };

  const testContact = async () => {
    setIsLoading(true);
    const result = await testContactForm({
      name: 'API Test User',
      message: 'This is a test message from the API test component.'
    });
    
    setTestResults([{
      test: 'Contact Form',
      endpoint: 'contact',
      success: result.success,
      data: result.data,
      error: result.error
    }]);
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-500/20';
      case 'disconnected': return 'text-red-400 bg-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            API Configuration Test
          </h1>
          <p className="text-gray-300">
            Test your frontend API configuration and backend connectivity
          </p>
          
          {/* Connection Status */}
          <div className="mt-4 flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'disconnected' ? 'bg-red-500' : 
              'bg-yellow-500 animate-pulse'
            }`}></div>
            <span className="text-sm text-gray-400">
              API Status: {
                connectionStatus === 'connected' ? 'Connected' : 
                connectionStatus === 'disconnected' ? 'Disconnected' : 
                'Checking...'
              }
            </span>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Test Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-all"
            >
              Test Connection
            </button>
            <button
              onClick={runAllTests}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-all"
            >
              Run All Tests
            </button>
            <button
              onClick={testContact}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg font-medium transition-all"
            >
              Test Contact Form
            </button>
            <button
              onClick={debugApiConfig}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
            >
              Debug Config
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
              <span className="text-white">Running tests...</span>
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{result.test}</h3>
                    <span className={`text-sm px-2 py-1 rounded ${
                      result.success ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
                    }`}>
                      {result.success ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  
                  {result.endpoint && (
                    <p className="text-gray-400 text-sm mb-2">
                      Endpoint: <code className="bg-gray-800 px-1 rounded">{result.endpoint}</code>
                    </p>
                  )}
                  
                  {result.error && (
                    <p className="text-red-300 text-sm">
                      Error: {result.error}
                    </p>
                  )}
                  
                  {result.data && result.success && (
                    <details className="mt-2">
                      <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
                        View Response Data
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Configuration Info */}
        <div className="mt-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Configuration Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Environment:</span>
              <span className="text-white ml-2">{process.env.NODE_ENV || 'development'}</span>
            </div>
            <div>
              <span className="text-gray-400">Vercel:</span>
              <span className="text-white ml-2">{process.env.VERCEL ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-gray-400">API URL:</span>
              <span className="text-white ml-2">{process.env.REACT_APP_API_URL || 'Default'}</span>
            </div>
            <div>
              <span className="text-gray-400">Hostname:</span>
              <span className="text-white ml-2">{typeof window !== 'undefined' ? window.location.hostname : 'Server'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
