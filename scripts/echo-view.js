/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2020-11-06 14:30:35
 * @Description: 通过html文件或者ejs文件 转为json配置数据 作为Render-Server的配置项配置字符串
 */

/* eslint-disable */

const pkg = require('../package.json')
const fs = require('fs');
const path = require('path');
const index = process.argv[2];
let filePath;
if (index) {
  filePath = path.join(__dirname, `../dist/${pkg.name}/${pkg.version}/${index}.html`)
} else {
  filePath = path.join(__dirname, `./render-server.ejs`);
}


let data = fs.readFileSync(filePath);

console.log(JSON.stringify(data.toString()));
