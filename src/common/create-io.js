import {Modal} from 'antd'
import {config, history, creatRequest, mockData, tips, log} from '@utils'
import {ERROR_CODE} from './constant'

// 这个表示登陆的弹框只弹出一次
let reloginFlag = false

// 创建一个request
export const request = creatRequest({
  // 自定义的请求头
  headers: {'Content-Type': 'application/json'},
  // 最后的数据处理和response拦截器处理位置不一样
  endAction: (responseData) => {
    // 统一处理未登录的弹框
    if (responseData.success === false && responseData.code === ERROR_CODE.UN_LOGIN && !reloginFlag) {
      reloginFlag = true
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
  // 提示错误的方法
  tip: tips,
  // 是否错误显示message
  showErrorTip: true,
  // mock 数据请求的等待时间
  delay: config.delay,
  // 日志打印
  log,
  responseInterceptor: (response) => {
    return response
  },
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
      // 这里判断简单请求封装 [rejectToData] :true 表示复杂封装
      if (!options[rejectToData]) {
        options = {
          mix: options,
        }
      }
      delete options[rejectToData]
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
