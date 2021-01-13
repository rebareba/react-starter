/* eslint-disable no-console */
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin') // 压缩js的
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// 静态资源输出
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 热更新
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const {init} = require('../scripts/webpack-init');
const config = require('.')

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

const isDev = env === 'dev'

// webpack相关配置
const webpackConf = {
  entry,
  output: {
    path: env === 'dev' ? path.join(__dirname, '../dist') : path.join(__dirname, `../dist/${config.projectName}/${config.version}`),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    publicPath,
  },
  devServer: {
    contentBase: path.join(__dirname, '..'), // 本地服务器所加载的页面所在的目录
    inline: true,
    port: config.port,
    publicPath: '/',
    historyApiFallback: {
      disableDotRule: true,
      // 指明哪些路径映射到哪个html
      rewrites: config.rewrites,
    },
    host: '127.0.0.1',
    hot: true,
    proxy: config.proxy,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    alias: {
      '@': path.join(__dirname, "../"),
      '@src': path.join(__dirname, "../src"),
    },
  },
  ...(isDev ? {} : {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  }),
  optimization: {
    splitChunks: {
      // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
      chunks: 'all',
      // 表示在压缩前的最小模块大小，默认为0；
      minSize: 30000,
      // 表示被引用次数，默认为1
      minChunks: 1,
      // 最大的按需(异步)加载次数，默认为1；
      maxAsyncRequests: 3,
      // 最大的初始化加载次数，默认为1；
      maxInitialRequests: 3,
      // 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；设置ture则使用默认值
      name: true,
      // 缓存组，目前在项目中设置cacheGroup可以抽取公共模块，不设置则不会抽取
      cacheGroups: {
        // 缓存组信息，名称可以自己定义
        commons: {
          // 拆分出来块的名字,默认是缓存组名称+"~" + [name].js
          // name: "test",
          // 同上
          chunks: 'all',
          // 同上
          minChunks: 3,
          // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
          enforce: true,
          // test: 缓存组的规则，表示符合条件的的放入当前缓存组，值可以是function、boolean、string、RegExp，默认为空；
          test: '',
        },
        // 设置多个缓存规则
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          name: 'vendor',
          // 表示缓存的优先级
          priority: 10,
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    // 自动加载
    // new webpack.HotModuleReplacementPlugin(),
  ],
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
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              // 如果antd css 引用的是cdn或公共资源就可以注释， 这里的是按需加载css 所以不需要全局引入全量的andt.css
              ["import", { "libraryName": "antd", "style": 'css'}, "antd"],
              // ["import", { "libraryName": "antd-mobile", "style": 'css'}, "antd-mobile"],
              '@babel/plugin-syntax-dynamic-import',
              ['@babel/plugin-proposal-decorators', {legacy: true}],
              ['@babel/plugin-proposal-class-properties', {loose: true}]
            ].concat(isDev? [require.resolve('react-refresh/babel')]: []),
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            // MiniCssExtractPlugin 不支持热更新
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              // publicPath: '../'
            },
          },
          { 
            loader: 'css-loader',
             options: { 
              // url: false 
            } 
          }
        ],
      },
      {
        test: /\.styl$/,
        use: [
          {
            // MiniCssExtractPlugin 不支持热更新
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          { loader: 'css-loader', options: {} },
          'stylus-loader',
        ],
        include: [path.resolve(__dirname, '../src')],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          {
            // MiniCssExtractPlugin 不支持热更新
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          { loader: 'css-loader', options: {modules: true} },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true, // 选择是ant的支持
              modifyVars: config.antdThemeConfig || {}
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        include: [path.resolve(__dirname, '../src')],
        exclude: [path.resolve(__dirname, '../src/assets/sprite-icon')],
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.resolve(__dirname, "../src/assets/sprite-icon")],
        use: [{ 
          loader: "svg-sprite-loader",
          options:{
            // symbolId:'icon-[name]' // 对应为<use xlinkHref="#icon-user" /> 默认<use xlinkHref="#user" />
          }
        }]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: true,
    }),
    // 自动加载
    // new webpack.HotModuleReplacementPlugin()
    isDev && new ReactRefreshPlugin()
  ].filter(Boolean),
}

// 入口文件 和pages下的html对应
Object.keys(entry).forEach((fileIndex) => {
  const filename = fileIndex
  webpackConf.plugins.push(
    new HtmlWebpackPlugin({
      template: path.join(__dirname, `../src/pages/${fileIndex}.html`), // 指定模板路径
      filename: `${filename}.html`,
      inject: true,
      chunks: ['vendor', fileIndex],
    }),
  )
})

if (env === 'build') {
  webpackConf.optimization.minimizer = [
    new TerserPlugin({
      cache: false,
      parallel: false,
      sourceMap: false, // set to true if you want JS source maps
    }),
    new OptimizeCSSAssetsPlugin({}),
  ]
  webpackConf.plugins.unshift(
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist/public'),
        ignore: ['.*'],
      },
    ]),
    new CleanWebpackPlugin({
      verbose: true, // 开启在控制台输出信息
      // dry Use boolean "true" to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false,
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, `../dist/${config.projectName}`), path.join(__dirname,'../dist/public')]
    }),
  )
}

module.exports = webpackConf