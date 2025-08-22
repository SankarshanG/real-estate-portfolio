const webpack = require('webpack');

const webpackOverride = (config, env) => {
  // Add fallbacks for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "util": require.resolve("util/"),
    "buffer": require.resolve("buffer/"),
    "process": require.resolve("process/browser"),
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "fs": false,
    "path": false,
    "os": false,
    "http": false,
    "https": false,
    "zlib": false,
    "querystring": false,
    "url": false,
    "net": false,
    "tls": false,
    "child_process": false,
    "cluster": false,
    "worker_threads": false,
    "readline": false,
    "repl": false,
    "tty": false,
    "v8": false,
    "vm": false,
    "perf_hooks": false,
    "async_hooks": false,
    "inspector": false,
    "trace_events": false,
    "domain": false,
    "dns": false,
    "dgram": false,
    "assert": false,
    "constants": false,
    "events": false,
    "punycode": false,
    "string_decoder": false,
    "sys": false,
    "timers": false,
    "tty": false,
    "v8": false,
    "vm": false,
    "zlib": false
  };

  // Add plugins for global variables
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};

const devServerOverride = (configFunction) => {
  return (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);
    // Allow all hosts to avoid schema error when env provides empty values
    config.allowedHosts = 'all';
    // Keep history API fallback for SPA routing
    config.historyApiFallback = true;
    return config;
  };
};

module.exports = {
  webpack: webpackOverride,
  devServer: devServerOverride,
};
