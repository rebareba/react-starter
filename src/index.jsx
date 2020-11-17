import React, {Component} from 'react'
import * as ReactDOM from 'react-dom'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale-provider/zh_CN'
import {Router, Route, Switch, Redirect} from 'react-router-dom'
import {Provider} from 'mobx-react'

import '@babel/polyfill'
import '@src/common/flexbox.css'
import '@src/common/common.styl'
import history from '@src/common/history'
import {config} from '@src/common/utils'

import GlobalStore from '@src/io/global-store'

import Home from '@src/pages/home'

const stores = {globalStore: new GlobalStore()}

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path={`${config.pathPrefix}`} component={Home} />
          <Redirect from="/" to={`${config.pathPrefix}`} />
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider {...stores}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root'),
)
