/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-04-22 22:21:08
 * @Description: webpack的脚本，动态生成mock.json和config/conf.json, 并且监听config目录下的config
 */ 
const path = require('path')
const fs = require('fs')
const {syncWalkDir} = require('./util')

let confGlobal = {}
let mockJsonData = {}
exports.getConf = () => confGlobal
exports.getMockJson =() => mockJsonData

/**
 * 初始化项目的配置 动态生成mock.json和config/conf.json
 * @param {string} env  dev|build
 */
 exports.init = (env = process.env.BUILD_ENV ? 'build' : 'dev') => {
   
  delete require.cache[require.resolve('../config')]
  const config  = require('../config')
  const confJson = env === 'build' ? config.conf.build : config.conf.dev
  confGlobal = confJson
  // 1.根据环境变量来生成
  fs.writeFileSync(path.join(__dirname, '../config/conf.json'),  JSON.stringify(confGlobal, null, '\t'))
  buildMock(confJson)
 }

 // 生成mock文件数据
 const buildMock = (conf) => {
  // 2.动态生成mock数据 读取src文件夹下面所有以 -mock.json结尾的文件 存储到io/index.json文件当中
  let mockJson = {}
  const mockFiles = syncWalkDir(path.join(__dirname, '../src'), (file) => /-mock.json$/.test(file))
  console.log('build mocks: ->>>>>>>>>>>>>>>>>>>>>>>')
  mockFiles.forEach((filePath) => {
    const p = path.parse(filePath)
    const mockKey = p.name.substr(0, p.name.length - 5)
    console.log(mockKey, filePath)
    if (mockJson[mockKey]) {
      console.error(`有相同的mock文件名称${p.name} 存在`, filePath)
    }
    delete require.cache[require.resolve(filePath)]
    mockJson[mockKey] = require(filePath)
  })
  // 如果是打包环境， 最小化mock资源数据
  const mockMap = conf.mock || {}
  const buildMockJson = {}
  Object.keys(mockMap).forEach((key) => {
    const [name, method] = key.split('.')
    if (mockJson[name] && mockJson[name][method] && mockJson[name][method][mockMap[key]]) {
      if (!buildMockJson[name]) buildMockJson[name] = {}
      if (!buildMockJson[name][method]) buildMockJson[name][method] = {}
      buildMockJson[name][method][mockMap[key]] = mockJson[name][method][mockMap[key]]
    }
  })
  mockJsonData = buildMockJson
  fs.writeFileSync(path.join(__dirname, '../mock.json'), JSON.stringify(buildMockJson, null, '\t'))
 }

// 监听配置文件目录下的config.js和config_default.js
const confPath = path.join(__dirname, '../config')

if ((env = process.env.BUILD_ENV ? 'build' : 'dev') === 'dev') {
  fs.watch(confPath, async (event, filename) => {
    if (filename === 'config.js' || filename === 'config_default.js') {
      delete require.cache[path.join(confPath, filename)]
      delete require.cache[require.resolve('../config')]
      const config  = require('../config')
      // console.log('config', JSON.stringify(config))
      const env = process.env.BUILD_ENV ? 'build' : 'dev'
      const confJson = env === 'build' ? config.conf.build : config.conf.dev
      if (JSON.stringify(confJson) !== JSON.stringify(confGlobal)) {
        this.init()
      }
    }
  });
}


