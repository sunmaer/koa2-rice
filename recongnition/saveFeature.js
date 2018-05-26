/**
 * 计算图像特征值保存到数据库中
 */

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const cv = require('opencv')
const feature = require('./getFeature')
const excuteQuery = require('../mysql/mysql')

// 获取稻瘟病图像特征值
function calculateRiceBlastFeature() {
  return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(__dirname, '../public/images/riceBlast'), (err, files) => {
        if(err) return console.log(err)
        let colorArr = [], textureArr = [], shapeArr = [], total = 0
        files.forEach((img) => {
          if(img !== '.DS_Store') {
            // 读取图像像素矩阵
            cv.readImage(path.resolve(__dirname, `../public/images/riceBlast/${img}`), (err, img) => {
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
                feature.shape(img).forEach((v, i) => {
                  shapeArr[i] = shapeArr[i] === void 0 ? 0 : shapeArr[i] + v
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
        // 形状特征
        shapeArr = shapeArr.map((v) => {
          return v / total
        })
        resolve([colorArr, textureArr, shapeArr])
      })
  })
}
// 获取白叶枯图像特征值
function calculateBacterialBlightFeature() {
  return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(__dirname, '../public/images/bacterialBlight'), (err, files) => {
        if(err) return console.log(err)
        let colorArr = [], textureArr = [], shapeArr = [], total = 0
        files.forEach((img) => {
          if(img !== '.DS_Store') {
            // 读取图像像素矩阵
            cv.readImage(path.resolve(__dirname, `../public/images/bacterialBlight/${img}`), (err, img) => {
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
                feature.shape(img).forEach((v, i) => {
                  shapeArr[i] = shapeArr[i] === void 0 ? 0 : shapeArr[i] + v
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
        // 形状特征
        shapeArr = shapeArr.map((v) => {
          return v / total
        })
        resolve([colorArr, textureArr, shapeArr])
      })
  })
}
// 获取纹枯病图像特征值
function calculateSclerotialBlightFeature() {
  return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(__dirname, '../public/images/sclerotialBlight'), (err, files) => {
        if(err) return console.log(err)
        let colorArr = [], textureArr = [], shapeArr = [], total = 0
        files.forEach((img) => {
          if(img !== '.DS_Store') {
            // 读取图像像素矩阵
            cv.readImage(path.resolve(__dirname, `../public/images/sclerotialBlight/${img}`), (err, img) => {
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
                feature.shape(img).forEach((v, i) => {
                  shapeArr[i] = shapeArr[i] === void 0 ? 0 : shapeArr[i] + v
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
        // 形状特征
        shapeArr = shapeArr.map((v) => {
          return v / total
        })
        resolve([colorArr, textureArr, shapeArr])
      })
  })
}

/** 
 * 病害图像三种特征写入数据库
 * @param {String} name 病害类型
 * @param {Array} arr 特征值数组
 * @return
 */
function saveFeature(name, arr) {
  try {
    excuteQuery(`INSERT INTO IMAGE_COLOR(NAME, HM1, HM2, HM3, SM1, SM2, SM3, IM1, IM2, IM3) VALUES ('${name}', ${arr[0][0]}, ${arr[0][1]}, ${arr[0][2]}, ${arr[0][3]}, ${arr[0][4]}, ${arr[0][5]}, ${arr[0][6]}, ${arr[0][7]}, ${arr[0][8]})`).then((res) => {
      if(res) {
        console.log(chalk.green(`${name}颜色特征值写入数据库成功`))
      }
    }).catch((err) => {
    console.log(chalk.red(`${name}颜色特征值写入数据库失败 ${err}`))            
    })
    excuteQuery(`INSERT INTO IMAGE_TEXTURE(NAME, M0, M1, M2, M3, M4, M5, M6, M7) VALUES ('${name}', ${arr[1][0]}, ${arr[1][1]}, ${arr[1][2]}, ${arr[1][3]}, ${arr[1][4]}, ${arr[1][5]}, ${arr[1][6]}, ${arr[1][7]})`).then((res) => {
      if(res) {
        console.log(chalk.green(`${name}纹理特征值写入数据库成功`))
      }
    }).catch((err) => {
    console.log(chalk.red(`${name}纹理特征值写入数据库失败 ${err}`))        
    })
    excuteQuery(`INSERT INTO IMAGE_SHAPE(NAME, Hu1, Hu2, Hu3, Hu4, Hu5, Hu6, Hu7) VALUES ('${name}', ${arr[2][0]}, ${arr[2][1]}, ${arr[2][2]}, ${arr[2][3]}, ${arr[2][4]}, ${arr[2][5]}, ${arr[2][6]})`).then((res) => {
      if(res) {
        console.log(chalk.green(`${name}形状特征值写入数据库成功`))
      }
    }).catch((err) => {
    console.log(chalk.red(`${name}形状特征值写入数据库失败 ${err}`))      
    })
  } catch(err) {
    console.log(chalk.red(`${name}特征值写入数据库失败 ${err}`))
  }
}

// 不能同时执行写入数据库操作，由于计算量大建议单独执行下面三个函数，每次执行一个
calculateRiceBlastFeature().then((res) => {
  saveFeature('稻瘟病', res)
})
calculateBacterialBlightFeature().then((res) => {
  saveFeature('白叶枯', res)
})
calculateSclerotialBlightFeature().then((res) => {
  saveFeature('纹枯病', res)
})