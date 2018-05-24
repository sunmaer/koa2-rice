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
        let colorArr = [], textureArr = [], total = 0
        files.forEach((img) => {
          if(img !== '.DS_Store') {
            // 读取图像像素矩阵
            cv.readImage(path.resolve(__dirname, `../public/images/${file}/${img}`), (err, img) => {
              if(err) {
                console.log(chalk.red(err))
              } else {
                total ++
                feature.color(img).forEach((v, i) => {
                  colorArr[i] = colorArr[i] === void 0 ? 0 : colorArr[i] + v
                })
                feature.texture(img).forEach((v, i) => {
                  textureArr[i] = textureArr[i] === void 0 ? 0 : textureArr[i] + v
                })
              }
            })
          }
        })
        // 计算每一类病害图像的平均颜色特征向量并存入数据库
        colorArr = colorArr.map((v) => {
          return v / total
        })
        // 纹理特征
        textureArr = textureArr.map((v) => {
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
          excuteQuery(`INSERT INTO IMAGE_COLOR(NAME, HM1, HM2, HM3, SM1, SM2, SM3, IM1, IM2, IM3) VALUES ('${name}', ${colorArr[0]}, ${colorArr[1]}, ${colorArr[2]}, ${colorArr[3]}, ${colorArr[4]}, ${colorArr[5]}, ${colorArr[6]}, ${colorArr[7]}, ${colorArr[8]})`).then((res) => {
            if(res) {
              console.log(chalk.green(`${name}颜色特征值写入数据库成功`))
            }
          }).catch((err) => {
          console.log(chalk.red(`${name}颜色特征值写入数据库失败 ${err}`))            
          })
          excuteQuery(`INSERT INTO IMAGE_TEXTURE(NAME, M0, M1, M2, M3, M4, M5, M6, M7) VALUES ('${name}', ${textureArr[0]}, ${textureArr[1]}, ${textureArr[2]}, ${textureArr[3]}, ${textureArr[4]}, ${textureArr[5]}, ${textureArr[6]}, ${textureArr[7]})`).then((res) => {
            if(res) {
              console.log(chalk.green(`${name}纹理特征值写入数据库成功`))
            }
          }).catch((err) => {
          console.log(chalk.red(`${name}纹理特征值写入数据库失败 ${err}`))            
          })
        } catch(err) {
          console.log(chalk.red(`${name}特征值写入数据库失败 ${err}`))
        }
      })
    }
  })
})