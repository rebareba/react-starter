import * as React from 'react'
import {inject} from 'mobx-react'
import {Button} from 'antd'
import {log} from '@src/common/utils'

// import '../../assets/sprite-icon'
// import logo from '../../assets/svg/logo.svg'
import reactLog from '@src/assets/image/react.png'

@inject('globalStore')
class Home extends React.Component {
  componentDidMount() {
    // 获取用户信息， 不然获取不到会跳转到登录页面 可以在construct
    this.props.globalStore.loginInfo()
    log('this.props', this.props)
    this.props.globalStore.login({
      name: 'admin',
      password: 'e10adc3949ba59abbe56e057f20f883e',
    })
  }

  render() {
    return (
      <div className="FBH h100">
        {/* <div className="frame-logo p10"><img src={logo} className="w100 h100" /></div> */}
        <div className="FB1" />
        <div className="FBV">
          <div className="FB1" />
          <div className="frame-logo p10">
            <img src={reactLog} className="w100 h100" />
          </div>
          <h1 style={{textAlign: 'center'}}>React Starter</h1>
          <div className="FB1" />
        </div>

        {/* <svg>
          <use xlinkHref="#user" />
        </svg> */}
        <div className="FB1" />
      </div>
    )
  }
}
export default Home
