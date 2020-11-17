import {createIo} from '.'
// 用户登录相关接口配置
const apis = {
  login: {
    method: 'POST',
    url: '/login',
    apiPrefix: '/render-server/api',
  },
  logout: {
    method: 'POST',
    url: '/auth/logout',
    apiPrefix: '/api/react-starter',
  },
  loginInfo: {
    method: 'GET',
    url: '/login_info',
    apiPrefix: '/render-server/api',
  },
}
export default createIo(apis, 'global')
