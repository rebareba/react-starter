/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-10 11:25:56
 * @Description: 获取全局配置 可以通过模板在window全局配置进行覆盖
 */
import config from '@/config/conf.json'

export default Object.assign(config, window[config.winKey || 'config'])
