const pkg = require("../package.json");

module.exports = {
  // 名称
  projectName: pkg.name,
  version: pkg.version,
  // npm run build-cdn 打包的 publicPath 路径
  cdnPrefix: `//cdn.xxx.com/${pkg.name}/${pkg.version}/`,
  // npm run build 打包的 publicPath 路径
  versionPrefix: `/${pkg.name}/${pkg.version}/`,
  port: 8890,
  // 接口匹配转发 devServer.proxy
  proxy: {
    "/api/*": {
      target: `http://192.168.90.160:8888`,
      changeOrigin: true, // 支持跨域请求
      secure: true,
    },
  },
  // webpack 打包忽略配置 要在index.html引入public资源
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  // 多入口情况的重定向
  rewrites: [
    // {
    //   from: /^\/admin/, to: '/admin.html'
    // },
  ],
  // 前端代码配置 动态生成config/conf.json中的数据， 也是index.html模板的数据
  conf: {
    dev: {
      title: "React Starter",
      pathPrefix: "",
      apiPrefix: "/api",
      debug: true,
      // 是否所有接口都使用mock 默认使用success配置项
      mockAll: true,
      mock: {
        "global": "success", // 所有global 使用success的值
        "global.login": "failed", // failed success 特殊指定login方法使用的值
        // "global.loginInfo": "failed", // success failed
        // "global.logout": "success",
        // "login.login": "success",
      },
      // 指定public资源的域名 是否是cdn的资源
      publicHost: ''
    },
    build: {
      title: "React Starter",
      pathPrefix: "",
      apiPrefix: "/api",
      debug: false,
      // mock数据模拟延迟
      delay: 100,
      mock: {},
      // 指定public资源的域名 是否是cdn的资源
      publicHost:''
    }
  }
};
