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
  const instance = axios.create({
    baseURL: option.baseURL || '',
    timeout: option.timeout || 60 * 1000,
    headers: {'X-Requested-With': 'XMLHttpRequest', ...option.headers},
    // //设置cross跨域 并设置访问权限 允许跨域携带cookie信息, 注意后端要设置Access-Control-Allow-Origin指定源地址不能是* ?
    withCredentials: option.withCredentials || false,
    // 判断状态码觉得是否promise resolved:If `validateStatus` returns `true` (or is set to `null` or `undefined`), rejected : returns false
    // validateStatus: function (status) {  return status >= 200 && status < 300; // default } // 这是默认
    validateStatus:
      option.validateStatus ||
      ((status) => {
        return status >= 200 && status < 300
      }),
    auth: option.auth || undefined,
    responseType: option.responseType || 'json',
    // 手动取消请求 const CancelToken = axios.CancelToken; const source = CancelToken.source(); //   cancelToken: source.token
    cancelToken: option.cancelToken || undefined,
  })
  // 请求拦截器 requestInterceptor 和 requestInterceptorWhen
  if (option.requestInterceptor) {
    const requestInterceptorWhen = option.requestInterceptorWhen || (() => true)
    instance.interceptors.request.use(option.requestInterceptor, null, requestInterceptorWhen)
  }
  // 响应拦截器 responseInterceptor 和 responseInterceptorWhen
  if (option.responseInterceptor) {
    instance.interceptors.response.use(option.responseInterceptor)
  }
  /**
   * 参数axios基本一致，除了这两还有其他axios的参数都支持
   * @typedef   {Object} Options  字段参数
   * @property  {String} url 请求地址
   * @property  {String} method 字段名
   * @property  {Object} headers 请求头
   * @property  {Object} params query参数和router参数的处理 {code: 'query上', ':userId': ‘router参数’}
   * @property  {Object} data body数据
   * @property  {Function} endAction 混合处理get header是params ,其他是data
   * @property  {Boolen} showErrorTip 是否判断提示
   */
  return async (options) => {
    const endAction = options.endAction || option.endAction
    const showErrorTip = typeof options.showErrorTip !== 'undefined' ? options.showErrorTip : option.showErrorTip
    // 混合请求处理字段
    if (options.mix) {
      if (typeof options.mix === 'object') {
        Object.keys(options.mix).forEach((key) => {
          if (key[0] === ':' && options.data) {
            options.url = options.url.replace(key, encodeURIComponent(options.data[key]))
            delete options.data[key]
          }
        })
      }
      const method = (options.method || 'get').toLowerCase()
      if (method === 'get' || method === 'head') {
        options.params = Object.assign(options.mix, options.params)
      } else {
        options.data = Object.assign(options.mix, options.data)
      }
    }
    // 路由参数处理
    if (typeof options.params === 'object') {
      Object.keys(options.params).forEach((key) => {
        if (key[0] === ':' && options.params) {
          options.url = options.url.replace(key, encodeURIComponent(options.params[key]))
          delete options.params[key]
        }
      })
    }
    if (option.log) {
      option.log('request  options', options.method, options.url)
      option.log(options)
    }
    if (
      (options.headers['Content-Type'] || '').startsWith('application/json') &&
      options.data &&
      typeof options.data !== 'string'
    ) {
      options.data = JSON.stringify(options.data)
    }
    let retData = {success: false}
    // mock 处理
    if (options.mock) {
      retData = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(options.mock)
        }, option.delay || 500),
      )
    } else {
      try {
        delete options.mock
        delete options.mix
        delete options.showErrorTip
        const {data} = await instance(options)
        retData = data
      } catch (err) {
        retData.success = false
        retData.message = err.message
        if (err.response) {
          retData.status = err.response.status
          retData.content = err.response.data
          retData.message = `浏览器请求非正常返回: 状态码 ${retData.status}`
        } else if (option.log) {
          option.log('ajax response error', err)
        }
      }
    }
    // 自动处理错误消息
    if (showErrorTip && retData.success === false && retData.message && option.tip) {
      option.tip.warning(retData.message)
    }
    // 返回前处理
    if (endAction) {
      endAction(retData)
    }
    return retData
  }
}
