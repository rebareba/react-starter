import axios from 'axios'

// 配置接口参数
// declare interface Options {
//   url: string
//   baseURL?: string
//   // 默认GET
//   method?: Method
//   // 标识是否注入到data参数
//   rejectToData?: boolean
//   // 是否直接弹出message 默认是
//   showError?: boolean
//   // 指定 回调操作 默认登录处理
//   action?(data: any): any
//   headers?: {
//     [index: string]: string
//   }
//   timeout?: number
//   // 指定路由参数
//   params?: {
//     [index: string]: string
//   }
//   // 指定url参数
//   query?: any
//   // 指定body 参数
//   body?: any
//   // 混合处理 Get到url, delete post 到body, 也替换路由参数 在createIo封装
//   data?: any
//   mock?: any
// }
// ajax 请求的统一封装
// TODO 1. 对jsonp请求的封装 2. 重复请求

/**
 * 返回ajax 请求的统一封装
 * @param Object option 请求配置
 * @param {boolean} opts.showError 是否错误调用message的error方法
 * @param {object} opts.message  包含 .error方法 showError true的时候调用
 * @param {boolean} opts.throwError 是否出错抛出异常
 * @param {function} opts.action  包含 自定义默认处理 比如未登录的处理
 * @param {object} opts.headers  请求头默认content-type: application/json
 * @param {number} opts.timeout  超时 默认60秒
 * @param {number} opts.delay   mock请求延迟
 * @returns {function} {params, url, headers, query, data, mock} data混合处理 Get到url, delete post 到body, 也替换路由参数 在createIo封装
 */
export default function request(option = {}) {
  return async (optionData) => {
    const options = {
      url: '',
      method: 'GET',
      showError: option.showError !== false,
      timeout: option.timeout || 60 * 1000,
      action: option.action,
      ...optionData,
      headers: {'X-Requested-With': 'XMLHttpRequest', ...option.headers, ...optionData.headers},
    }
    // 简单请求处理
    if (options.data) {
      if (typeof options.data === 'object') {
        Object.keys(options.data).forEach((key) => {
          if (key[0] === ':' && options.data) {
            options.url = options.url.replace(key, encodeURIComponent(options.data[key]))
            delete options.data[key]
          }
        })
      }
      if ((options.method || '').toLowerCase() === 'get' || (options.method || '').toLowerCase() === 'head') {
        options.query = Object.assign(options.data, options.query)
      } else {
        options.body = Object.assign(options.data, options.body)
      }
    }
    // 路由参数处理
    if (typeof options.params === 'object') {
      Object.keys(options.params).forEach((key) => {
        if (key[0] === ':' && options.params) {
          options.url = options.url.replace(key, encodeURIComponent(options.params[key]))
        }
      })
    }
    // query 参数处理
    if (options.query) {
      const paramsArray = []
      Object.keys(options.query).forEach((key) => {
        if (options.query[key] !== undefined) {
          paramsArray.push(`${key}=${encodeURIComponent(options.query[key])}`)
        }
      })
      if (paramsArray.length > 0 && options.url.search(/\?/) === -1) {
        options.url += `?${paramsArray.join('&')}`
      } else if (paramsArray.length > 0) {
        options.url += `&${paramsArray.join('&')}`
      }
    }
    if (option.log) {
      option.log('request  options', options.method, options.url)
      option.log(options)
    }
    if (options.headers['Content-Type'] === 'application/json' && options.body && typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body)
    }
    let retData = {success: false}
    // mock 处理
    if (options.mock) {
      retData = await new Promise((resolve) =>
        setTimeout(() => {
          // TODO mock数据被改变的问题
          resolve(options.mock)
        }, option.delay || 500),
      )
    } else {
      try {
        const opts = {
          url: options.url,
          baseURL: options.baseURL,
          params: options.params,
          method: options.method,
          headers: options.headers,
          data: options.body,
          timeout: options.timeout,
        }
        const {data} = await axios(opts)
        retData = data
      } catch (err) {
        retData.success = false
        retData.message = err.message
        if (err.response) {
          retData.status = err.response.status
          retData.content = err.response.data
          retData.message = `浏览器请求非正常返回: 状态码 ${retData.status}`
        }
      }
    }

    // 自动处理错误消息
    if (options.showError && retData.success === false && retData.message && option.message) {
      option.message.error(retData.message)
    }
    // 处理Action
    if (options.action) {
      options.action(retData)
    }
    if (option.log && options.mock) {
      option.log('request response:', JSON.stringify(retData))
    }
    if (option.throwError && !retData.success) {
      const err = new Error(retData.message)
      err.code = retData.code
      err.content = retData.content
      err.status = retData.status
      throw err
    }
    return retData
  }
}
