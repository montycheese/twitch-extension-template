const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, 'dist/');

module.exports = (_env, argv) => {
  const entryPoints = {
    VideoOverlay: {
      path: './src/VideoOverlay.js',
      outputHtml: 'video_overlay.html',
      build: true,
    },
    Config: {
      path: './src/Config.js',
      outputHtml: 'config.html',
      build: true,
    },
    LiveConfig: {
      path: './src/LiveConfig.js',
      outputHtml: 'live_config.html',
      build: true,
    },
    Mobile: {
      path: './src/Mobile.js',
      outputHtml: 'mobile.html',
      build: false,
    },
  };

  const entry = {};

  // edit webpack plugins here!
  const plugins = [
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
  ];

  plugins.push(new webpack.DefinePlugin({ 'process.env.NEW_TWITCH_API_URL': JSON.stringify(_env.NEW_TWITCH_API_URL) }));
  plugins.push(new webpack.DefinePlugin({ 'process.env.EXT_CLIENT_ID': JSON.stringify(_env.EXT_CLIENT_ID) }));
  plugins.push(new webpack.DefinePlugin({ 'process.env.DEV': typeof argv.devrig !== 'undefined' }));
  plugins.push(
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  );
  plugins.push(new CopyPlugin([
    {
      from: `${__dirname}/public/index.css`,
      to: `${__dirname}/dist/index.css`,
    }
  ]));
  plugins.push(new CopyPlugin([
    {
      from: `${__dirname}/public/ga.js`,
      to: `${__dirname}/dist/ga.js`,
    }
  ]));

  for (name in entryPoints) {
    if (entryPoints[name].build) {
      entry[name] = entryPoints[name].path;
      if (argv.mode === 'production') {
        plugins.push(new HtmlWebpackPlugin({
          inject: true,
          chunks: [name],
          template: './template.html',
          filename: entryPoints[name].outputHtml,
        }));
      }
    }
  }

  const config = {
    // entry points for webpack- remove if not used/needed
    entry,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false
            }
          }
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        },
        {
          test: /\.(mp3)$/i,
          loader: 'file-loader',
          options: {
            name: 'audio/[name].[ext]',
          },
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: argv.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader, // fallback to style-loader in development
              options: {
                hmr: argv.mode === 'development'
              }
            },
            'css-loader', // translates CSS into CommonJS
            'sass-loader' // compiles Sass to CSS, using Node Sass by default
          ]
        },
        {
          test: /\.(woff(2)?|ttf|otf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          }],
        },
      ],
    },
    resolve: { extensions: ['*', '.js', '.jsx'] },
    output: {
      filename: '[name].bundle.js',
      path: bundlePath,
    },
    plugins,
  };

  if (argv.mode === 'development') {
    config.devServer = {
      contentBase: path.join(__dirname, 'public'),
      host: argv.devrig ? 'localhost.rig.twitch.tv' : 'localhost',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      port: 8080,
    };
    if (fs.existsSync(path.resolve(__dirname, 'conf/server.key'))) {
      config.devServer.https = {
        key: fs.readFileSync(path.resolve(__dirname, 'conf/server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'conf/server.crt')),
      };
    }
  }
  if (argv.mode === 'production') {
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: 'all',
          test: /node_modules/,
          name: false,
        },
      },
      name: false,
    };
  }

  return config;
};
