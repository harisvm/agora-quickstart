const path = require('path');

module.exports = {
  entry: './agoraLogic.js',
  output: {
    filename: 'bundledAgoraLogic.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production', // Ensure this is set to 'production'
  module: {
    rules: [
      // Add any loaders if needed for processing other file types
    ],
  },
  optimization: {
    minimize: true, // Ensure minification for production
  },
  // Exclude devServer configuration as it's not used in production builds
};
