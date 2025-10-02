const serverless = require('serverless-http');
const app = require('./index');

// Export the serverless function
exports.handler = serverless(app);
