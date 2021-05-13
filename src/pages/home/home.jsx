import {useEffect} from 'react'
import {inject, observer} from 'mobx-react'
import {Button} from 'antd'
import {config} from '@utils'

import Icon from '@components/icon'

// import '../../assets/sprite-icon'
// import logo from '../../assets/svg/logo.svg'
import reactLog from '@assets/image/react.png'

import './home.styl'

const Home = ({globalStore}) => {
  useEffect(() => {
    globalStore.loginInfo()
    // console.log('useEffect')
  }, [])
  const {userInfo} = globalStore
  // console.log('userInfo', userInfo, globalStore)
  return (
    <div className="fbh h100">
      {/* <div className="frame-logo p10">
        <img src={logo} className="w100 h100" />
      </div> */}
      <div className="fb1" />
      <div className="fbv">
        {/* <svg><use xlinkHref="#user" /></svg> */}
        <div className="fb1" />
        <div className="frame-logo p10">
          <img src={reactLog} className="w100 h100" />
        </div>
        <h1 style={{textAlign: 'center'}}>{config.title}</h1>
        <h1 style={{textAlign: 'center'}}>
          <svg>
            <use xlinkHref="#user" />
          </svg>
          <Icon name="user" />
        </h1>
        <div>{userInfo?.nickname}</div>
        <div className="fb1">
          <Button type="primary">按钮</Button>
        </div>
      </div>
      <div className="fb1" />
    </div>
  )
}
export default inject('globalStore')(observer(Home))
