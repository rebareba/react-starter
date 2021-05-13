
const fs = require('fs')
const path = require('path')
 /**
 * 同步获取目录的文件列表并且过滤
 * @param {paht} dir
 * @param {function} fileter 路径过滤器方法 返回true或fales 劣势 (file) => /-mock.json$/.test(file)
 */
function syncWalkDir(dir = __dirname, filter) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    file = path.resolve(dir, file)
    const stat = fs.statSync(file)
    if (stat.isDirectory()) {
      results = results.concat(syncWalkDir(file, filter))
    }
    if (filter && filter(file)) {
      results.push(file)
    }
  })
  return results
}

exports.syncWalkDir = syncWalkDir

exports.getBody =  async (stream) => {
  return new Promise((resolve, reject) => {
    let body = ''
    stream
      .on('data', (chunk) => {
        body += chunk
      })
      .on('end', () => {
        resolve(body)
      })
      .on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error('getBody', err)
        reject(err)
      })
  })
}

exports.jsonParse = (data) => {
  if (!data) return data
  let obj = ''
  try {
    obj = JSON.parse(data)
  } catch (e) {
    obj = data
    console.error('jsonParse', e)
  }
  return obj
}

exports.getIPAdress = () => {
  let interfaces = require('os').networkInterfaces();　　
  for (let devName in interfaces) {　　　　
      let iface = interfaces[devName];　　　　　　
      for (let i = 0; i < iface.length; i++) {
          let alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }　　
  }
}