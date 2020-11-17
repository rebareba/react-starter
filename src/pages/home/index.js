import {asyncComponent} from '@src/common/utils'
import './home.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./home')
    return module.default
  } catch (error) {
    // log('asyncComponent home', error)
  }
  return null
})
