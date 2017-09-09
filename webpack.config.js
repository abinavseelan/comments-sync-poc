const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const precss = require('precss');
const postcssImport = require('postcss-import');
const cssNext = require('postcss-cssnext');
const cssNested = require('postcss-nested');

const CLIENT_PATH_PREFIX = 'client';
const CLIENT_SOURCE_PATH = 'src';
const ENTRY_POINT_APP = 'index.js';
const CLIENT_BUILD_PATH = 'build';

module.exports = {
  entry: {
    app: path.resolve(__dirname, CLIENT_PATH_PREFIX, CLIENT_SOURCE_PATH, ENTRY_POINT_APP),
  },
  output: {
    path: path.resolve(__dirname, CLIENT_PATH_PREFIX, CLIENT_BUILD_PATH),
    publicPath: '/',
    filename: 'js/[name].[chunkhash:6].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  precss,
                  postcssImport({
                    addDependencyTo: webpack,
                  }),
                  cssNext({
                    browsers: ['Chrome >= 31', 'Firefox >= 31', 'IE >= 9'],
                    url: false,
                  }),
                  cssNested,
                ],
              },
            },
            'sass-loader',
          ],
        }),
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      template: './client/src/index.html',
    }),
    new ExtractTextPlugin('css/app.[chunkhash:6].bundle.css'),
  ],
};
