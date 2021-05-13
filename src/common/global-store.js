import {runInAction, makeAutoObservable} from 'mobx'
// import {createIo, rejectToData} from './create-io'
import {history, config} from '@utils'
import {createIo} from './create-io'
// 用户登录相关接口配置
const apis = {
  login: {
    method: 'POST',
    url: 'login',
  },
  logout: {
    method: 'POST',
    url: 'auth/logout',
  },
  loginInfo: {
    method: 'GET',
    url: 'login_info',
  },
}
const io = createIo(apis, 'global')

export class GlobalStore {
  // 用户信息
  userInfo

  constructor() {
    makeAutoObservable(this)
  }
  // 获取当前的登录信息

  async loginInfo() {
    if (this.userInfo) return
    const {success, content} = await io.loginInfo()
    if (!success) return
    runInAction(() => {
      this.userInfo = content
    })
  }

  // 获取当前的登录信息
  async login(mobile, password) {
    const {success, content, message} = await io.login({
      mobile,
      password,
    })
    // 高级调用方式
    // const {success, content} = await io.login({
    //   [rejectToData]: true,
    //   data: login,
    //   params: {user: 1, ':userId': 2},
    // })
    if (success) {
      runInAction(() => {
        this.userInfo = content
      })
      const querys = new URLSearchParams(history.location.search)
      const redirect = querys.get('redirect')
      if (redirect) {
        history.push(redirect)
      } else {
        history.push(`${config.pathPrefix}/home`)
      }
    }
    return {success, message}
  }
}
export default GlobalStore
