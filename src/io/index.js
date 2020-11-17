import {message, Modal} from 'antd'
import {config, log, history} from '@src/common/utils'
import {ERROR_CODE} from '@src/common/constant'

import creatRequest from '@src/common/request'

let mockData = {}
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  mockData = require('@/mock.json')
} catch (e) {
  log(e)
}

let reloginFlag = false
// 创建一个request
export const request = creatRequest({
  // 自定义的请求头
  headers: {'Content-Type': 'application/json'},
  // 配置默认返回数据处理
  action: (data) => {
    // 统一处理未登录的弹框
    if (data.success === false && data.code === ERROR_CODE.UN_LOGIN && !reloginFlag) {
      reloginFlag = true
      // TODO 这里可能统一跳转到 也可以是弹窗点击跳转
      Modal.confirm({
        title: '重新登录',
        content: '',
        onOk: () => {
          // location.reload()
          history.push(`${config.pathPrefix}/login?redirect=${window.location.pathname}${window.location.search}`)
          reloginFlag = false
        },
      })
    }
  },
  // 是否错误显示message
  showError: true,
  message,
  // 是否以抛出异常的方式 默认false {success: boolean判断}
  throwError: false,
  // mock 数据请求的等待时间
  delay: config.delay,
  // 日志打印
  log,
})

// 标识是否是简单传参数， 值为true标识复杂封装
export const rejectToData = Symbol('flag')

/**
 * 创建请求IO的封装
 * @param ioContent {any { url: string method?: string mock?: any apiPrefix?: string}}
  }
 * @param name mock数据的对应文件去除-mock.json后的
 */
export const createIo = (ioContent, name = '') => {
  const content = {}
  Object.keys(ioContent).forEach((key) => {
    /**
     * @param {baseURL?: string, rejectToData?: boolean,  params?: {}, query?: {}, timeout?: number, action?(data: any): any, headers?: {},  body?: any, data?: any,   mock?: any}
     * @returns {message, content, code,success: boolean}
     */
    content[key] = async (options = {}) => {
      // mock 数据的注入

      // 这里判断简单请求封装 rejectToData=true 表示复杂封装
      if (!options[rejectToData]) {
        delete options[rejectToData]
        options = {
          data: options,
        }
      }
      if (
        name &&
        config.mock &&
        config.mock[`${name}.${key}`] &&
        mockData[name] &&
        mockData[name][key] &&
        config.debug === false
      ) {
        // 这个mock数据要深拷贝下 _.cloneDeep(value)
        ioContent[key].mock = JSON.parse(JSON.stringify(mockData[name][key][config.mock[`${name}.${key}`]]))
      } else if (name && config.debug === true) {
        if (options.headers) {
          options.headers[''] = name
          options.headers['mock-method'] = key
        } else {
          options.headers = {'mock-key': name, 'mock-method': key}
        }
      }
      const option = {...ioContent[key], ...options}

      option.url = ((option.apiPrefix ? option.apiPrefix : config.apiPrefix) || '') + option.url

      return request(option)
    }
  })
  return content
}
