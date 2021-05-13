import React, {Suspense} from 'react'
import * as ReactDOM from 'react-dom'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale-provider/zh_CN'
import {Router, Route, Switch, Redirect} from 'react-router-dom'
import {Provider} from 'mobx-react'

import '@common/flexbox.styl'
import '@common/common.styl'
import '@common/colors.styl'
import '@icons'

import {config, history} from '@utils'

import GlobalStore from '@common/global-store'

import Home from '@src/pages/home'
import Login from '@pages/login'

const stores = {globalStore: new GlobalStore()}

const App = () => {
  return (
    <Suspense fallback="加载中">
      <Router history={history}>
        <Switch>
          <Route path={`${config.pathPrefix}/login`} component={Login} />
          <Route path={`${config.pathPrefix}`} component={Home} />
          <Redirect from="/" to={`${config.pathPrefix}`} />
        </Switch>
      </Router>
    </Suspense>
  )
}
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider {...stores}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root'),
)
