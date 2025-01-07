const webpack = require('webpack');
const { override, addWebpackPlugin } = require('customize-cra');

module.exports = override(
  (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/"),
        "util": require.resolve("util/"),
        "url": require.resolve("url/"),
        "process": false
      }
    };

    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
        'process.browser': true
      })
    ];

    return config;
  }
); 