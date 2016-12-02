// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展

var HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('atool-build/lib/webpack');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

module.exports = function(webpackConfig) {
  webpackConfig.babel.plugins.push('transform-runtime');
  webpackConfig.babel.plugins.push(['antd', {
    style: 'css',  // if true, use less
  }]);

  // Enable this if you have to support IE8.
  // webpackConfig.module.loaders.unshift({
  //   test: /\.jsx?$/,
  //   loader: 'es3ify-loader',
  // });
// test.
  webpackConfig.plugins.push(
    // new HtmlWebpackPlugin({
    //   hash: true,
    //   template: "./src/entries/index.html",
    //   filename: "index1.html",
    //   files: {
    //     "css": [ "index.css" ],
    //     "js": [ "index.js", "index.js"]
    //   }
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     }
    // }),
    // new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  );
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify('production')
    })
  );
  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function(loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.test = /\.dont\.exist\.file/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.test = /\.less$/;
    }
  });

  // Load src/entries/*.js as entry automatically.
  const files = glob.sync('./src/entries/*.js');
  const newEntries = files.reduce(function(memo, file) {
    const name = path.basename(file, '.js');
    memo[name] = file;
    return memo;
  }, {});
  webpackConfig.entry = Object.assign({}, webpackConfig.entry, newEntries);

  return webpackConfig;
};
