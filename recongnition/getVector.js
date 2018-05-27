/**
 * 读取平均图像特征向量
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

module.exports = getAverageColorVector