/**
 * 图像颜色、纹理、形状特征提取
 */
const path = require('path')
const cv = require('opencv')
const chalk = require('chalk')

// 读取图像像素矩阵
cv.readImage(path.resolve(__dirname, '../public/images/riceBlast/1.jpg'), (err, mat) => {
  if(err) {
    console.log(chalk.red(err))
  } else {
    console.log(typeof mat)
  }
})