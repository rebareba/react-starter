import React, {Component} from 'react'
import {Modal} from 'antd'
import conf from '@/config/conf.json'
import h from './history'

export const config = Object.assign(conf, window.conf)
export * from './constant'

export const history = h

export function asyncComponent(getComponent) {
  class AsyncComponent extends Component {
    static Component

    constructor(props) {
      super(props)
      this.state = {component: AsyncComponent.Component}
      if (!this.state.component) {
        getComponent().then((component) => {
          AsyncComponent.Component = component
          this.setState({component})
        })
      }
    }

    render() {
      const C = this.state.component

      return C ? <C {...this.props} /> : null
    }
  }
  return AsyncComponent
}

// 打印日志
export function log(...arg) {
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log(...arg)
  }
}

// 统一失败提示
export function errorTip(title, content) {
  const l = arguments.length
  if (l === 0) {
    title = '系统异常'
  } else if (l === 1) {
    content = title
    title = ''
  }
  Modal.error({
    title,
    content,
  })
}
