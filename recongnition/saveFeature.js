/**
 * 计算图像特征值保存到数据库中
 */

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const cv = require('opencv')
const feature = require('./getFeature')
const excuteQuery = require('../mysql/mysql')

let AverageColor = []

// 读取图片文件夹 
fs.readdir(path.resolve(__dirname, '../public/images/'), (err, files) => {
  if(err) {
    return console.log(err)
  }
  files.forEach((file) => {
    if(file !== '.DS_Store') {
      // 分别读取三种病斑图像文件夹
      fs.readdir(path.resolve(__dirname, `../public/images/${file}`), (err, files) => {
        if(err) return console.log(err)
        let arr = [], total = 0
        files.forEach((img) => {
          if(img !== '.DS_Store') {
            // 读取图像像素矩阵
            cv.readImage(path.resolve(__dirname, `../public/images/${file}/${img}`), (err, img) => {
              if(err) {
                console.log(chalk.red(err))
              } else {
                total ++
                feature.color(img).forEach((v, i) => {
                  arr[i] = arr[i] === void 0 ? 0 : arr[i] + v
                })
              }
            })
          }
        })
        // 计算每一类病害图像的平均颜色特征向量并存入数据库
        arr = arr.map((v) => {
          return v / total
        })
        let name = ''
        if(file === 'riceBlast') {
          name = '稻瘟病'
        } else if(file === 'bacterialBlight') {
          name = '白叶枯'
        } else {
          name = '纹枯病'
        }
        try {
          excuteQuery(`INSERT INTO IMAGE_COLOR(NAME, HM1, HM2, HM3, SM1, SM2, SM3, IM1, IM2, IM3) VALUES ('${name}', ${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]}, ${arr[4]}, ${arr[5]}, ${arr[6]}, ${arr[7]}, ${arr[8]})`).then((res) => {
            if(res) {
              console.log(chalk.green(`${name}特征值写入数据库成功`))
            }
          }).catch((err) => {
          console.log(chalk.red(`${name}特征值写入数据库失败 ${err}`))            
          })
        } catch(err) {
          console.log(chalk.red(`${name}特征值写入数据库失败 ${err}`))
        }
      })
    }
  })
})