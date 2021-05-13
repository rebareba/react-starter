/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-10 10:57:56
 * @Description: 获取mock数据
 */
import log from './log'

const mockData = {}
try {
  // eslint-disable-next-line global-require
  const data = require('@/mock.json')
  Object.assign(mockData, data)
} catch (e) {
  log(e)
}

export default mockData
