'use strict';

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const ChromeManifestPlugin = require('./plugins/chromemanifest.plugin.js')
const packageJson = require('./package.json')
const configJson = require('./config/development.json')

const TARGET_BROWSER = process.env.TARGET_BROWSER || 'chrome'

let extractStyles = new ExtractTextPlugin('styles/[name].css')
let extractHtml = new ExtractTextPlugin('[name].html')

module.exports = {
  context: path.join(__dirname, 'src'),
  output: {
    path: path.join(__dirname, 'build', TARGET_BROWSER),
    filename: '[name].js'
  },
  entry: {
    background: './background/index.js',
    newtab: './newtab/index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-runtime'],
          presets: ['env'],
          babelrc: false
        },
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        loader: extractHtml.extract({
          use: ['html-loader', 'pug-html-loader?pretty&exports=false']
        }),
        exclude: /node_modules/
      },
      { test: /\.json$/, loaders: ['json-loader'], exclude: /node_modules/ },
      {
        test: /\.scss$/,
        loader: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
            { loader: 'postcss-loader' }
          ]
        }),
      },
      {
        test: /\.css$/,
        loader: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'postcss-loader' }
          ]
        })
      },
      { test: /\.(png|jpg|svg)$/, loader: 'file-loader?name=images/[name].[ext]&publicPath=/'}
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
      }
    }),
    new ChromeManifestPlugin({
      filename: 'manifest.json',
      template: 'manifest.json',
      name: packageJson.name,
      version: packageJson.version,
      domain: configJson.domain,
    }),
    extractStyles,
    extractHtml,
  ],
  resolve: {
    alias: {
      config: path.join(__dirname, 'config/development'),
      browser: path.join(__dirname, 'polyfills', TARGET_BROWSER),
      samagri: path.join(__dirname, 'src/samagri')
    },
    extensions: ['.js', '.json', '.pug']
  }
};
