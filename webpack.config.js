const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './agoraLogic.js',
  output: {
    filename: 'bundledAgoraLogic.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Path to your existing index.html
      filename: 'index.html',   // Name of the file in the dist folder
    }),
  ],
  optimization: {
    minimize: true, // Ensure minification for production
  },
};
