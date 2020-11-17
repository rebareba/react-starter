const pkg = require("../package.json");

module.exports = {
  // 名称
  projectName: pkg.name,
  version: pkg.version,

  // npm run build-cdn 打包的 publicPath 路径
  cdnPrefix: `//cdn.xxxx.com/${pkg.name}/${pkg.version}/`,
  // npm run build 打包的 publicPath 路径
  versionPrefix: `/${pkg.name}/${pkg.version}/`,
  // devServer.port
  port: 8888,
  // 接口匹配转发 devServer.proxy
  proxy: {
    "/api/react-starter/*": {
      target: `http://192.168.90.68:8888`,
      changeOrigin: true, // 支持跨域请求
      secure: true, // 支持 https
    },
    "/render-server/api/*": {
      target: `http://192.168.90.68:8888`,
      changeOrigin: true, // 支持跨域请求
      secure: true, // 支持 https
    },
  },
  // 多入口情况的重定向
  rewrites: [
    // {
    //   from: /^\/admin/, to: '/admin.html'
    // },
  ],
  // antd 主题配置
  antdThemeConfig: {
    '@primary-color': '#1890ff' // 全局主色
  },
  // 前端代码配置 动态生成config/conf.json中的数据
  conf: {
    dev: {
      title: "前端后台模板",
      pathPrefix: "/react-starter",
      apiPrefix: "/api/react-starter",
      debug: true,
      // mock数据模拟延迟
      delay: 500,
      mock: {
        // "global.login": "success",
        // "global.loginInfo": "success",
        // "global.logout": "success",
      }
    },
    build: {
      title: "前端后台模板",
      pathPrefix: "/react-starter",
      apiPrefix: "/api/react-starter",
      debug: false,
      mock: {}
    }
  }
};
