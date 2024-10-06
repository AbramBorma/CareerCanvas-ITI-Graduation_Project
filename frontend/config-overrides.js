const path = require('path');

module.exports = function override(config) {
  // Set up fallback for 'fs' and 'path'
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: require.resolve('path-browserify'),
  };

  return config;
};
