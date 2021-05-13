/* eslint-disable no-console */
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const colors = require('colors');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin') // 压缩js的
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// 静态资源输出
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 热更新
const ReactRefreshWebpackPlugin= require('@pmmmwh/react-refresh-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const {init, getConf} = require('../scripts/webpack-init');
const {getIPAdress} = require('../scripts/util');


// 配置文件
const config = require('.')

/* 解析路径 上一级目录 */
const resolve = dir => {
  return path.join(__dirname, '../', dir)
}

// 入口文件 获取src 目录下的js或jsx文件作为入口文件
const entry = {}
const entryFiles = fs.readdirSync(path.join(__dirname, '../src'))
entryFiles.forEach((file) => {
  const p = path.parse(file)
  if (['.tsx', '.jsx'].indexOf(p.ext) >= 0) {
    entry[p.name] = path.join(__dirname, '../src', file)
  }
})

let env = process.env.BUILD_ENV ? 'build' : 'dev'
let publicPath = '/' // 输出的路径前缀
if (process.env.BUILD_ENV === 'VERSION') publicPath = config.versionPrefix || '/'
if (process.env.BUILD_ENV === 'CDN') publicPath = config.cdnPrefix || '/'

// 初始化mock.json和conf.json
init(env);
console.log('env', env)
console.log('entrys', Object.keys(entry))
console.log('publicPath', publicPath)

// 接口请求本地缓存
const apiProxyCache = require('../scripts/api-proxy-cache')
for(let key in config.proxy) {
  config.proxy[key] = Object.assign(config.proxy[key], apiProxyCache);
}
// 是否是dev环境
const isDev = env === 'dev'

// webpack相关配置
const webpackConf = {
  context: resolve('src'),
  entry,
  output: {
    path: isDev
      ? resolve('dist')
      : resolve(`dist/${config.projectName}/${config.version}`),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    publicPath,
  },
  devServer: {
    contentBase: resolve('.'), // 本地服务器所加载的页面所在的目录
    inline: true,
    port: config.port,
    publicPath: '/',
    historyApiFallback: {
      disableDotRule: true,
      // 指明哪些路径映射到哪个html
      rewrites: config.rewrites,
    },
    host: '0.0.0.0',
    open: true,
    openPage: `http://127.0.0.1:${config.port}`,
    hot: true,
    proxy: config.proxy,
  },
  devtool: isDev ? 'cheap-module-source-map' : false, // source-map | false |cheap-module-source-map
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    alias: {
      '@': resolve('.'),
      '@src': resolve('src'),
      '@pages': resolve('src/pages'),
      '@models': resolve('src/models'),
      '@components': resolve('src/components'),
      '@utils': resolve('src/utils'),
      '@i18n': resolve('src/i18n'),
      '@icons': resolve('src/icons'),
      '@assets': resolve('src/assets'),
      '@common': resolve('src/common'),
    },
  },
  // 性能设置 https://webpack.docschina.org/configuration/performance/
  performance: {
    hints: isDev? false: 'warning',
    // 针对指定的入口最大体积
    maxEntrypointSize: 400000,
    // webpack 生成的任何文件
    maxAssetSize: 100000,
  },
  stats: {
    preset: 'errors-warnings',
  },
  externals: isDev ? {} : config.externals,
  optimization: {
    splitChunks: {
      chunks: 'all',
      // 待会直接自己试一下
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
        },
        defaultVendors: {
          test: /\/src\//,
          name: 'rise',
          chunks: 'all',
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: !isDev,
    minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        // include: ['./src'],
        use: {
          loader: 'babel-loader',
          options: {
            // babel 转义的配置选项
            babelrc: false, // 不使用.babelrc文件
            presets: [
              [
                '@babel/preset-env',
                // babel/polyfill + core-js@3
                {
                  useBuiltIns: 'usage',
                  corejs: {version: 3, proposals: true},
                },
              ],
              '@babel/preset-react',
            ],
            plugins: [
              // 如果antd css 引用的是cdn或公共资源就可以注释， 这里的是按需加载css 所以不需要全局引入全量的andt.css
              ["import", { "libraryName": "antd", "style": 'css'}, "antd"],
              // ["import", { "libraryName": "antd-mobile", "style": 'css'}, "antd-mobile"],
              ['@babel/plugin-proposal-decorators', {legacy: true}],
              ['@babel/plugin-proposal-class-properties', {loose: false}],
              isDev && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          { 
            loader: 'css-loader',
             options: { 
              // url: false 
            } 
          }
        ].filter(Boolean),
      },
      {
        test: /\.styl$/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                //    // styl 模块的写法格式: xxxx.module.styl
                auto: /\.module\.styl$/,
                localIdentName: '[local]-[hash:5]',
                exportLocalsConvention: 'camelCase',
              },
            },
          },
          'stylus-loader',
        ].filter(Boolean),
        include: [resolve('src')],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          isDev && 'style-loader',
          !isDev && {
            // MiniCssExtractPlugin 不支持热更新
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          { loader: 'css-loader', options: {modules: false} },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true, // 选择是ant的支持
              modifyVars: config.antdThemeConfig || {}
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        include: [resolve('src')],
        exclude: [resolve('src/icons')],
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'static/[name].[hash:8].[ext]',
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.resolve(__dirname, "../src/icon")],
        use: [
          { 
            loader: "svg-sprite-loader",
            options:{
              // symbolId:'icon-[name]' // 对应为<use xlinkHref="#icon-user" /> 默认<use xlinkHref="#user" />
            }
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {removeTitle: true},
                {convertColors: {shorthex: true}},
                {convertPathData: true},
                {removeComments: true},
                {removeDesc: true},
                {removeUselessDefs: true},
                {removeEmptyAttrs: true},
                {removeHiddenElems: true},
                {removeEmptyText: true},
                {removeUselessStrokeAndFill: true},
                {moveElemsAttrsToGroup: true},
                {removeStyleElement: true},
                {cleanupEnableBackground: true},
              ],
            },
          },
        ]
      }
    ],
  },
  plugins: [
    !isDev && new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: true,
    }),
    !isDev && new CopyWebpackPlugin({
      patterns:[
        {
          from: resolve('public'),
          to: resolve('dist/public'),
        }
      ]
    }),
    !isDev && new CleanWebpackPlugin({
      verbose: true, // 开启在控制台输出信息
      // dry Use boolean "true" to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false,
      cleanOnceBeforeBuildPatterns: [resolve(`dist/${config.projectName}`), resolve('dist/public')]
    }),
    // 自动加载
    isDev && new webpack.HotModuleReplacementPlugin(),
    isDev && new ReactRefreshWebpackPlugin(),
    isDev && new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `http://${getIPAdress()}:${config.port} 或 http://127.0.0.1:${config.port}`.green,
        ],
      },
      onErrors: (severity, errors) => {
        if (severity !== 'error') {
          console.log(`访问：http://${getIPAdress()}:${config.port} 或 http://127.0.0.1:${config.port} 打开`.green)
          return
        }
      },
      clearConsole: true,
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
  ].filter(Boolean),
}

// 入口文件 和pages下的html对应
Object.keys(entry).forEach((fileIndex) => {
  const filename = fileIndex
  webpackConf.plugins.push(
    new HtmlWebpackPlugin({
      ...getConf(),
      template:  resolve(`src/${fileIndex}.html`), // 指定模板路径
      filename: `${filename}.html`,
      inject: true,
      chunks: ['vendor', fileIndex],
    }),
  )
})

module.exports = webpackConf