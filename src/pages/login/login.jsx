import React from 'react'
import {observer, inject} from 'mobx-react'
import './login.styl'

import bg from '@assets/image/bg.jpg'
import loginStore from './login-store'

const Login = function Login({globalStore}) {
  // const [loginStore] = useState(new LoginStore())
  const {loading, message, mobile, password} = loginStore

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    if (loginStore.checkLogin()) {
      loginStore.setLoading(true)
      const {message: m, success} = await globalStore.login(mobile, password)
      loginStore.setLoading(false)
      if (!success) loginStore.setMessage(m)
    }
  }
  return (
    <div className="loginMain" style={{backgroundImage: `url(${bg})`}}>
      <div className="formContainer cfb40">
        <div className="title mt30">登 录</div>
        <form className="mt30" onSubmit={handleSubmit}>
          <input
            name="mobile"
            type="text"
            value={mobile}
            placeholder="请输入手机号"
            onChange={(e) => loginStore.setMobile(e.target.value)}
          />
          <input
            name="password"
            type="password"
            value={password}
            placeholder="请输入密码"
            onChange={(e) => loginStore.setPassword(e.target.value)}
          />
          <div className="mt20">
            <input className="submitButton" type="submit" value={loading ? '登录中...' : '登录'} />
          </div>
          <div className="errorMessage">{message}</div>
        </form>
      </div>
    </div>
  )
}

export default inject('globalStore')(observer(Login))
