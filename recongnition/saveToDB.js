/**
 * 图像预处理
 * 统一裁剪至 200X200，然后保存到数据库中
 */
const path = require('path')
const fs = require('fs')
const gm = require('gm')
const chalk = require('chalk')
const excuteQuery = require('../mysql/mysql')

// 吓人的回调函数地狱，懒得去解决了😭
fs.readdir(path.resolve(__dirname, '../public/images/'), (err, files) => {
  if(err) {
    return console.log(err)
  }
  // 读取图片文件夹 
  files.forEach((file) => {
    if(file !== '.DS_Store') {
      // 分别读取三种病斑图像文件夹
      fs.readdir(path.resolve(__dirname, `../public/images/${file}`), (err, files) => {
        if(err) return console.log(err)
        files.forEach((img) => {
          if(img !== '.DS_Store') {
            gm(path.resolve(__dirname, `../public/images/${file}/${img}`))
            .resize(200, 200, '!')
            .write(path.resolve(__dirname, `../public/images/${file}/${img}`), (err) => {
              if(err) console.log(err)
              // 图片裁剪成功后写入数据库
              excuteQuery(`INSERT INTO IMAGE_LIBRARY (NAME, PATH) VALUES ('${img}', '${path.resolve(__dirname, `../public/images/${file}/${img}`)}')`).then((res) => {
                console.log(chalk.green('图片写入数据库成功'))
              }).catch((err) => {
                console.log(chalk.red(err))
              })
            })
          }
        })
      })
    }
  })
})