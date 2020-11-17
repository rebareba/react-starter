import {observable, action, runInAction} from 'mobx'
import io from './global-io'
// import {config, log} from './utils'

export class GlobalStore {
  // 用户信息
  @observable userInfo

  // 获取当前的登录信息
  @action.bound
  async loginInfo() {
    if (this.userInfo) return
    const {success, content} = await io.loginInfo()
    if (!success) return
    runInAction(() => {
      this.userInfo = content
    })
  }

  // 获取当前的登录信息
  @action.bound
  async login(params) {
    const {success, content} = await io.login(params)
    if (!success) return
    runInAction(() => {
      this.userInfo = content
    })
  }
}
export default GlobalStore
