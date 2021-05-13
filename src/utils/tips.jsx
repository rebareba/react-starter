import {message} from 'antd'

export default (title, content, type = 'error') => {
  if (!content) {
    content = title
    title = ''
  }
  message[type]({
    title,
    content,
  })
}
