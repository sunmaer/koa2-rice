/**
 * 测试识别率
 */
const fs = require('fs')
const path = require('path')
const cv = require('opencv')
const gm = require('gm')
const chalk = require('chalk')
const excuteQuery = require('../mysql/mysql')
const feature = require('./getFeature')

// 数据库读取三类病害图像的平均颜色特征向量
async function getAverageColorVector() {
  let arr = []
  try {
    let result = await excuteQuery('SELECT * FROM IMAGE_COLOR')
    if(result) {
      result.forEach((row, index) => {
        arr[index] = {
          name: row.name,
          vector: [row.HM1, row.HM2, row.HM3, row.SM1, row.SM2, row.SM3, row.IM1, row.IM2, row.IM3]
        }
      })
    }
  } catch(err) {
    console.log(chalk.red(`平均颜色特征向量读取失败 ${err}`))
  }
  return arr
}

getAverageColorVector().then((res) => {
  fs.readdir(path.resolve(__dirname, '../public/images/riceBlast'), (err, files) => {
    if(err) {
      return console.log(err)
    }
    let total = count = 0
    files.forEach((file, index) => {
      cv.readImage(path.resolve(__dirname, `../public/images/riceBlast/${file}`), (err, img) => {
        if(err) {
          console.log(chalk.red(err))
        } else {
        let vector = feature.color(img), type = '', minDistance
        res.forEach((v, i) => {
          let sum = 0, distance
          vector.forEach((item, index) => {
            sum += (item - v.vector[index]) * (item - v.vector[index])
          })
          distance = Math.sqrt(sum)
          if(minDistance === void 0 || distance < minDistance) {
            minDistance = distance
            type = v.name
          }
        })
        total++
        if(type === '稻瘟病') {
          count++
        }
        // console.log(type)
        }
      })
    })
    console.log(count, total, count / total)
  })
  
  gm(path.resolve(__dirname, '../public/test/timg.jpeg'))
  .resize(200, 200, '!')
  .write(path.resolve(__dirname, '../public/test/timg.jpeg'), (err) => {
    if(err) {
      console.log(err)
    } else {
      cv.readImage(path.resolve(__dirname, '../public/test/timg.jpeg'), (err, img) => {
        if(err) {
          console.log(chalk.red(err))
        } else {
          let vector = feature.color(img), type = '', minDistance
          res.forEach((v, i) => {
            let sum = 0, distance
            vector.forEach((item, index) => {
              sum += (item - v.vector[index]) * (item - v.vector[index])
            })
            distance = Math.sqrt(sum)
            if(minDistance === void 0 || distance < minDistance) {
              minDistance = distance
              type = v.name
            }
          })
          console.log(type)
        }
      })
    }
  })
})

