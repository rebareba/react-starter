### 介绍

[react@17 + antd@4 + mobx@6 + webpack@5+ JS 开发脚手架](https://segmentfault.com/a/1190000038320901?_ea=91644518)

Github: https://github.com/rebareba/react-starter

它有这些功能：

- 开发打包有不同配置
- eslint 验证
- 代码风格统一
- 接口mock
- 热更新
- 异步组件

### 目录结构

```
├── .eslintignore                     --- eslint忽略配置
├── .eslintrc.js                      --- eslint相关配置	
├── .gitignore                        --- git 忽略配置
├── .prettierignore                   --- Prettier 忽略路径文件
├── .prettierrc.js                    --- Prettier 的配置
├── .vscode                           --- 编辑器配置
├── jsconfig.json                     --- 编辑器js环境配置
├── mock.json                         --- 动态生成mock文件 gitignore
├── api-cache                         --- 后端接口请求缓存 gitignore
├── config                            --- webpack 和 前端 配置文件目录
│   ├── conf.json                     --- 前端配置 动态生成  git不跟踪
│   ├── config.js                     --- 开发自定义配置替换default, git不跟踪
│   ├── config_default.js             --- 默认的开发配置
│   └── index.js
│   └── webpack.config.js             --- webpack配置
├── dist                              --- 打包出来的文件夹目录
│   ├── public
│   ├── react-starter
│   │   ├── 1.0.0
│   │   └── index.html
│   ├── react-starter_1.0.0_public.tgz
├── public                            --- 公共资源目录
│   ├── antd
│   └── react
├── scripts                           --- 无需关心的一些脚本
│   ├── api-proxy-cache.js            --- webpackSev的代理Hook
│   ├── build-mock.js
│   ├── tar.js
│   ├── util.js
│   └── webpack-init.js
└── src
    ├── assets                       --- 静态资源
    │   ├── image
    │   └── svg
    ├── common                     --- 公共代码层
    │   ├── colors.styl              --- 全局样式
    │   ├── common.styl
    │   ├── flexbox.styl	            
    │   ├── constant.js	             --- 常量定义
    │   ├── create-io.js	           --- 请求实例创建和mock处理
    │   ├── global-mock.json         --- 全局请求缓存
    │   └── global-store.js          --- 全局store处理
    ├── components                   --- 公共组件层
    │   └── icon
    ├── icons                        --- svg-sprite-loader的icon
    ├── index.html                   --- html-webpack-plugin 模板
    ├── index.jsx                    ---入口文件
    ├── pages
    │   ├── home                     --- 页面
    │   └── login                    --- 登录页
    │       ├── index.jsx
    │       ├── login-mock.json      --- 登陆页的接口mock数据
    │       ├── login-store.js       --- 登录页的store
    │       ├── login.jsx
    │       └── login.styl
    └── utils                      --- 工具方法一个文件一个方法			
        ├── index.jsx                --- 入口 @utils引入
        ├── config.js                --- 全局前端配置 引用config/conf.json
        ├── create-request.js        --- axios的封装 			 
        ├── history.js               --- react-router 的history
        ├── log.js                   --- log处理 可以替换console.log
        └── tips.jsx                 --- 提示message工具已经antd.message
```
### 常用命令

-  **开发**

```
$ npm start
```


- **生产打包**

```ssh
$ npm run build
$ ls dist 
public       react-starter                  react-starter_1.0.0_public.tgz
```

打包会输出到 `dist/[package.name]/[package.version]` 下 
拷贝`public`和 ` react-starter`文件夹到后端服务的静态资源目录下或通过压缩包解压部署。


- **cdn部署打包**

配置config/config.js下对应的cdnPrefix的值

```ssh
npm run build-cdn
```


- **eslint验证**

```ssh
# 测试
$npm run test
# 修复fix
$npm run fix
```

- **生成mock文件数据**

更加api-cache缓存的后端接口信息和对应的xx-mock.json文件添加mock数据到xx-mock.json

```
# "build-mock": "node ./scripts/build-mock.js"
# 所有：
npm run build-mock mockAll 
# 单个mock文件：
npm run build-mock login
# 单个mock接口：
npm run build-mock login.logout
# 混合
npm run build-mock login.logout user
```

### 项目配置

拉取代码后替换所有react-starter为你自己的的项目名称。 

#### 配置解耦

复制`config/config_default.js`为`config/config.js`( 本地配置)会优先使用config.js的配置， 配置文件是包含了webpage相关配置和前端的相关配置(动态生成`utils/config.js`引用)，及接口mock的开关配置。 `npm start` 后会有动态生成conf.json和mock.json

```
├── config
│   ├── conf.json                                    # git 不跟踪
│   ├── config.js                                    # git 不跟踪  本地个人开发
│   ├── config_default.js
│   ├── index.js
│   └── webpack.config.js
├── mock.json                                        # git utils/mock-data.js
```

#### 配置说明

```js
const pkg = require("../package.json");

module.exports = {
  // 名称
  projectName: pkg.name,
  version: pkg.version,
  // npm run build-cdn 打包的 publicPath 路径
  cdnPrefix: `//cdn.xxx.com/${pkg.name}/${pkg.version}/`,
  // npm run build 打包的 publicPath 路径
  versionPrefix: `/${pkg.name}/${pkg.version}/`,
  // 接口匹配转发 devServer.proxy
  port: 9999,
  // 接口转发
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
  // 前端代码配置 动态生成config/conf.json中的数据， 也是html-webpack-plugin模板的数据
  conf: {
    // 开发模式配置
    dev: {
      title: "React Starter",
      pathPrefix: "",
      // 统一接口前缀 没有写""
      apiPrefix: "/api",
      // 影响mock的处理和log的日志打印
      debug: true,
      // mock开关配置 
      mock: {
        // 对应global-mock.json的内容login.success 的内容
        "global.login": "success", // failed success
        "global.loginInfo": "failed", // success failed
        "global.logout": "success",
        "login.login": "success",
      },
      // 模板index.html 指定public资源的域名比如生产是cdn的资源 
      publicHost: ''
    },
    // 打包模式配置
    build: {
      title: "React Starter",
      pathPrefix: "",
      apiPrefix: "/api",
      debug: false,
      // 前端mock的延迟模拟100毫秒
      delay: 100,
      // 生产走前端mock不走接口
      mock: {},
      publicHost:''
    }
  }
};
```

### 接口请求

#### 接口封装

接口在`common/create-io.js` 中去封装`utils/create-request.js` 

- create-request.js 对axios的进一步封装，返回了axios的实例instance。 不会 throw error
- create-io.js  创建axios的实例，并对接口定义和mock进行处理和封装

```js
// utils/create-request.js
import axios from 'axios'
/**
 * option 字段参数定义
 * @typedef   {Object} Option  字段参数
 * @property  {String} baseURL 字段名
 * @property  {Number} timeout 超时 默认1分钟  60 * 1000
 * @property  {Object} headers 请求头 默认包含有{'X-Requested-With': 'XMLHttpRequest'}
 * @property  {Boolean} withCredentials 设置cross跨域 并设置访问权限 允许跨域携带cookie信息 默认false
 * @property  {Function|null} validateStatus 判断状态码是否promise.reject
 * @property  {Object} auth  Authorization Header设置  {username: 'janedoe',password: 's00pers3cret'}
 * @property  {String} responseType 默认json
 * @property  {Object} cancelToken 取消的token
 * @property  {Function|null} requestInterceptor 请求拦截器  (options) => options
 * @property  {Function|null} requestInterceptorWhen 请求拦截器条件 (options) => options.method === 'get'
 * @property  {Function|null} responseInterceptor 返回拦截器 (response) => { return response}
 * @property  {Function|null} tip 提示消息 (message) => {}
 * @property  {Object} showErrorTip 是否要提示消息
 * /
 
/**
 * 创建一个请求实例
 * @param {Option} option
 * @returns
 */
export default function createRequest(option = {}) {
  //...
  const instance = axios.create({..})
  /**
   * 参数axios基本一致，除了这两还有其他axios的参数都支持
   * @typedef   {Object} Options  字段参数
   * @property  {String} url 请求地址
   * @property  {String} method 字段名
   * @property  {Object} headers 请求头
   * @property  {Object} params query参数和router参数的处理 {code: 'query上', ':userId': ‘router参数’}
   * @property  {Object} data body数据
   * @property  {Function} endAction 混合处理get header是params ,其他是data
   * @property  {Object} mock mock数据
   * @property  {Boolen} showErrorTip 是否判断提示
   */
  return async (options) => {...}
 
}
```

```js
// common/create-io.js
import {creatRequest, mockData} from '@utils'
// 创建一个request 实例
export const request = creatRequest({})

// 标识是否是简单传参数， 值为true标识复杂封装
export const rejectToData = Symbol('flag')
/**
 * 创建请求IO的封装
 * @param Option {any { url: string method?: string }}
  }
 * @param name mock数据的对应文件去除-mock.json后的
 */
export const createIo = (ioContent, name = '') => {
  const content = {}
  Object.keys(ioContent).forEach((key) => {
    // {Options} options
    content[key] = async (options = {}) => {
      // 这里判断简单请求封装 [rejectToData] :true 表示复杂封装
      if (!options[rejectToData]) {
        options = {
          mix: options,
        }
      }
      delete options[rejectToData]
      if (config.debug === false && "其他条件") {
        // 这个mock数据要深拷贝下 _.cloneDeep(value)
        ioContent[key].mock = JSON.parse(
          JSON.stringify(mockData[name][key][config.mock[`${name}.${key}`]])
        )
      } else if (name && config.debug === true) {
        const mockHeader = {'mock-key': name, 'mock-method': key}
        options.headers = options.headers ? {...options.headers, ...mockHeader} : mockHeader
      }
      const option = {...ioContent[key], ...options}
      // url / 开头使用绝对路径不是拼接统一前缀
      if (option.url[0] !== '/') {
        option.url = `${config.apiPrefix}/${option.url}`
      }
      return request(option)
    }
  })
  return content
}
```

#### 使用

##### 全局store

```js
// common/global-store.js
import {runInAction, makeAutoObservable} from 'mobx'
import {createIo, rejectToData} from './create-io'
const apis = {
  login: {
    method: 'POST',
    url: 'login/:userId',
  },
  // 其他接口定义
}
const io = createIo(apis, 'global') // // global-mock.json

export class GlobalStore {
  // 用户信息
  userInfo
  constructor() {
    makeAutoObservable(this)
  }
  // 获取当前的登录信息
  async login(mobile, password) {
    // mix的调用方式
    const {success, content, message} = await io.login({
      mobile,
      password,
      ':userId': 2
    })
    // 高级调用方式
    // const {success, content} = await io.login({
    //   [rejectToData]: true, // 标识使用了复杂方式
    //   data: {mobile, password},
    //   params: {':userId': 2},
    // })
    if (success) {
      runInAction(() => {
        this.userInfo = content
      })
      const querys = new URLSearchParams(history.location.search)
      const redirect = querys.get('redirect')
      if (redirect) {
        history.push(redirect)
      } else {
        history.push(`${config.pathPrefix}/home`)
      }
    }
    return {success, message}
  }
}
export default GlobalStore
```

```jsx
import GlobalStore from '@common/global-store'
const stores = {globalStore: new GlobalStore()}
const App = () => {
  return (
    <Suspense fallback="加载中">
      <Router history={history}>
        <Switch>
          <Route path={`${config.pathPrefix}/login`} component={Login} />
          <Route path={`${config.pathPrefix}`} component={Home} />
          <Redirect from="/" to={`${config.pathPrefix}`} />
        </Switch>
      </Router>
    </Suspense>
  )
}
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider {...stores}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root'),
)
```

##### 单独页面使用

一般每个页面都需要一个store去除了state包含一些后端的接口 比如我们在登陆页面有` login-store.js`

```
    ├── pages
    │   └── login
    │       ├── index.jsx
    │       ├── login-mock.json
    │       ├── login-store.js
    │       ├── login.jsx
    │       └── login.styl
```



```js
// login-store.js
import {createIo, rejectToData} from './create-io'
import {makeAutoObservable} from 'mobx'
const apis = {
  login: {
    method: 'POST',
    url: 'login',
  },
}
const io = createIo(apis, 'login')
class LoginStore {
  loading = false
  userInfo
 	constructor() {
    // makeObservable(this, {
    //   mobile: observable,
    //   message: observable,
    //   loading: observable,
    //   password: observable,
    //   login: action,
    //   setMobile: action,
    //   setPassword: action,
    // })
    makeAutoObservable(this)
  }
  async login(mobile, password) {
    if (this.loading) return ''
    this.loading = true
    // 高级调用方式
    const {success, message, content} = await io.login({
    	[rejectToData]: true, // 标识使用了复杂方式
    	data: {mobile, password},
      showErrorTip: false, // 自己处理message 不统一处理
      // endAction: () => {} // 自己替换处理endAction
      // 其拦截器等
    })
    this.loading = false
    if (!success) {
      this.message = message
      this.userInfo = content
      // 其他跳转除了
      return ''
    }
    // 失败提示
    this.message = message
  }
}
```

```jsx
import {observer, inject} from 'mobx-react'
import loginStore from './login-store'
const Login = function Login({globalStore}) {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async (evt) => {
    evt.preventDefault()
    await loginStore.login(mobile, password)
  }
  return (
    <div className="loginMain" style={{backgroundImage: `url(${bg})`}}>
			<form className="mt30" onSubmit={handleSubmit}></form>
		</div>
  )
}
export default inject('globalStore')(observer(Login))
```

### Mock实现

`npm run dev/build` 会自动在`/` 目录下生成`mock.json`, 是根据src目录下所有以`-mock.json`结尾的文件合成

如存在 `login-mock.json`

```json
// src/pages/login/login-mock.json
{
  "login": {
		"failed": {
			"success": false,
			"code": "ERROR_PASS_ERROR",
			"content": null,
			"message": "账号或密码错误!"
		},
		"success": {
			"success": true,
			"code": 0,
			"content": {
				"name": "admin",
				"nickname": "超级管理员",
				"permission": 15
			},
			"message": ""
		}
	}
}
```

则生成的`mock.json`内容为

```json
{
	"login": {
		"login": {
			"success": {
				"success": true,
				"code": 0,
				"content": {
					"name": "admin",
					"nickname": "超级管理员",
					"permission": 15
				},
				"message": ""
			}
		}
	}
}
```

```js
// login-store.js
// 这里的第二个参数就是去对应 login-mock.json文件的内容
const io = createIo(apis, 'login')
```

这里`login-mock.json`对应的login有两种情况 `success` 和 `failed` 在配置文件配置使用个数据

```js
// config.js或 config_default.js
module.exports = {
  // 开发配置
  conf: {
    dev: {
			...
      debug: true,
      // 只有配置了mock的才会使用
      mock: {
        "login.login": "success" // 也可以改为failed模拟请求失败, 会热更新替换mock.json内容
      }
    },
  }
};
```

> 这是我们最终要实现的效果，这里有一个约定：**项目目录下所有以`-mock.jsom`文件结尾的文件为mock文件，且文件名不能重复**。

如何实现可以查看`script/api-proxy-cache.js`

### 其他

#### 常用实现

##### 使用useContent来实现全局Store

TODO

##### 使用拦截器和本地缓存实现token请求头会话

TODO

#### 项目部署

```
$ npm run build
$ ls dist 
public                                 react-starter                  react-starter_0.1.0_public.tgz
$ ls dist/react-starter                                                        
1.0.0      index.html
```

这里build会自动拷贝出打包出来的html文件到`dist/react-starter` 作为模板文件， 在配置模板路径`viewPath: "react-starter/index.html"`

##### 通过Render-Server部署

[Render-Server介绍](https://segmentfault.com/a/1190000038972576) 主要功能包含：

- 一键部署 npm run deploy
- 支持集群部署配置
- 是一个文件服务
- 是一个静态资源服务
- 在线可视化部署前端项目
- 配置热更新
- 在线Postman及接口文档
- 支持前端路由渲染， 支持模板
- 接口代理及路径替换
- Web安全支持 Ajax请求验证，Referer 校验
- 支持插件开发和在线配置 可实现： 前端模板参数注入、请求头注入、IP白名单、接口mock、会话、第三方登陆等等

上传资源到render-server服务器的静态目录

```
$scp -r dist/react-starter deploy@192.168.90.68:/data/render-server/static

# 这个后续没有修改只需上传一次
$scp -r dist/public deploy@192.168.90.68:/data/render-server/static
```

或者上传压缩包react-starter_1.0.0_public.tgz 到服务器/data/render-server/static 下解压

Render-Server 的页面渲染配置：

```jsx
{
    "key": "react-starter",
    "name": "前端脚手架模板",
    "description": "项目的接口",
    "viewRender": [
        {
            "paths": [
                "/react-starter/(.*)",
                "/react-starter"
            ],
            "hosts": [],
            "plugins": [],
            "defaultData": {},
            "viewType": "path",
            "viewPath": "react-starter/index.html",
            "viewData": ""
        }
    ],
    "apiProxy": [
        {
            "methods": [],
            "paths": [
                "/react-starter/api/(.*)"
            ],
            "referers": [],
            "pathPrefix": "/react-starter/api",
            "prefixPath": "",
            "plugins": [],
            "backHost": "http://192.168.90.68:9999"
        }
    ]
}
```

##### Nginx部署

假设Nginx web目录在`/data/nginx/web/`上传打包的静态文件到该目录下

```
$scp -r dist/react-starter deploy@192.168.90.68:/data/nginx/web/

# 这个后续没有修改只需上传一次
$scp -r dist/public deploy@192.168.90.68:/data/nginx/web/
```

nginx配置

```
server {
        listen       80;
        server_name  test.com;
        access_log  /opt/third/nginx/logs/vhosts/test.access.log main;

        location ^~ /api/ {
          proxy_redirect off;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          client_max_body_size 100M;
          proxy_buffering on;
          proxy_buffer_size          128k;
          proxy_buffers              4 256k;
          proxy_busy_buffers_size    256k;
          proxy_pass http://127.0.0.1:8881/api;
        }
        
        location / {
        	root /data/nginx/web/
        	index index.html
        	try_files $uri $uri /react-starter/index.html =500;
        	
        }
}
```

#### Commit 规范

```js
<type>: <description>
```

格式说明：
`<type>`(必须)：代表某次提交的类型，所有的type类型如下

- `build`：修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
- `ci`：修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
- `docs`：文档更新，如README, CHANGELOG等
- `feat`：新增功能
- `fix`：修复bug
- `perf`：优化相关，如提升性能、体验等
- `refactor`：重构代码，既没有新增功能，也没有修复 bug
- `style`：不影响程序逻辑的代码修改(修改空白字符，格式缩进、补全缺失的分号等)
- `test`：新增测试用例或是更新现有测试
- `revert`：回滚某个更早之前的提交
- `chore`：其他类型，如改变构建流程、或者增加依赖库、工具等

`<description>`(必须)： 描述简要描述本次改动，概述就好了

示例

```
# 增加一个的导出功能
git commit -m "feat: 增加预测用户列表导出功能"

# 修改了翻页bug
git commit -m "fix: 修改了预测用户翻页bug"

# 优化某某功能
git commit -m "perf: 优化了预测用户接口响应太慢"

# 修改了xx处缺少分号问题
git commit -m "style: 修改xx处缺少分号问题"
```

#### 通用组件开发

目录`src/components` 下
通用组件推荐使用react hooks编写，组件尽量写成纯函数

```js
import React, { useState } from "react";

export default function  Button()  {
  const  [buttonText, setButtonText] =  useState("Click me,   please");

  function handleClick()  {
    return setButtonText("Thanks, been clicked!");
  }

  return  <button  onClick={handleClick}>{buttonText}</button>;
}
```

#### 常用网站

- [CDN资源](https://www.bootcdn.cn)

  到CDN 下载第三方product的min文件到 src/pubic/xxx/version/xx.js 然后resov

- [Antd  组件](https://ant.design/components/overview-cn/)

- [React官网文档](https://zh-hans.reactjs.org/docs/getting-started.html)

- [prettier-eslint](https://github.com/prettier/prettier-eslint)

