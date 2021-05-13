/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-10 11:25:16
 * @Description: 统一console日志开关处理
 */
import conf from './config'

export default (...arg) => {
  if (conf.debug) {
    // eslint-disable-next-line no-console
    console.log(...arg)
  }
}
