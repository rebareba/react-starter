/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-12 14:26:14
 * @Description: webpack proxy 模块的接口代理的 前处理 onProxyReq 后处理 onProxyRes 来处理接口缓存操作
 */
const fs = require('fs')
const path = require('path')
const prettier = require('prettier')
const moment = require('moment')
const {getConf, getMockJson} = require('./webpack-init')
const API_CACHE_DIR = path.join(__dirname, '../api-cache')
const {jsonParse, getBody} = require('./util')

try {
  fs.mkdirSync(API_CACHE_DIR,{recursive: true})
} catch(e){}

// https://github.com/chimurai/http-proxy-middleware
module.exports = {
  onProxyReq: async (_, req, res) => {
    req.reqBody = await getBody(req)
    const {'mock-method': mockMethod, 'mock-key': mockKey} = req.headers
    // eslint-disable-next-line no-console
    console.log(`Ajax 请求: ${mockKey}.${mockMethod}`,req.method, req.url)
    // eslint-disable-next-line no-console
    req.reqBody && console.log(JSON.stringify(req.reqBody, null, '\t'))
    if (mockKey && mockMethod) {
      req.mockKey = mockKey
      req.mockMethod = mockMethod
      const conf = getConf()
      const mockJson = getMockJson()
      if (conf.mock && conf.mock[`${mockKey}.${mockMethod}`] && mockJson[mockKey] && mockJson[mockKey][mockMethod]) {
        // eslint-disable-next-line no-console
        console.log('use mock data'.blue, `${mockKey}.${mockMethod}:`.green, conf.mock[`${mockKey}.${mockMethod}`])
        res.mock = true
        res.append('isMock','yes')
        res.send(mockJson[mockKey][mockMethod][conf.mock[`${mockKey}.${mockMethod}`]])
        _.destroy()
      }
     
    }
  },
  onProxyRes: async (res, req) => {
    const {method, url, query, path: reqPath, mockKey, mockMethod} = req
    
    if (mockKey && mockMethod && res.statusCode === 200) {
      
      let resBody = await getBody(res)
      resBody = jsonParse(resBody)
      const filePath = path.join(API_CACHE_DIR, `${mockKey}.${mockMethod}.json`)
      let  data = {}
      if (fs.existsSync(filePath)) {
        data = jsonParse(fs.readFileSync(filePath).toString())
      }
      const cacheObj = {
        date: moment().format('YYYY-MM-DD hh:mm:ss'),
        method,
        path: reqPath,
        url,
        resHeader: res.headers,
        reqHeader: req.headers,
        query,
        reqBody: await jsonParse(req.reqBody),
        resBody: resBody
      }
      if (resBody.success === false) {
        data.failed = cacheObj
      } else {
        data.success = cacheObj
      }
      // eslint-disable-next-line no-console
      fs.writeFile(filePath, JSON.stringify(data,'', '\t'), (err) => { err && console.log('writeFile', err)})
    }
  },
  onError(err, req, res) {
    setTimeout(() => {
     if (!res.mock) {
       res.writeHead(500, {
         'Content-Type': 'text/plain',
       });
       res.end('Something went wrong. And we are reporting a custom error message.');
     }
   }, 10)
  }
}