/**
 * 图像颜色、纹理、形状特征提取
 */
const path = require('path')
const cv = require('opencv')
const chalk = require('chalk')

/** 
 * 计算图像的颜色特征值
 * 
 * @param {Object} img 图像像素矩阵对象
 * @return {Array} M 图像前三阶中心矩 
 */
function calcuateColorFeature(img) {
  const width = img.width()
  const height = img.height()
  let sum = 0, M = []
  for(let i=0; i<width; i++) {
    for(let j=0; j<height; j++) {
      // 获取图像矩阵 RGB，OpenCV 中，RGB 图像的通道顺序为 BGR
      let rgb = img.pixel(i, j)
      let r = rgb[2]
      let g = rgb[1]
      let b = rgb[0]
      // 坐标变换法计算当前像素点的 H 值
      let angle = g === b ? 0 : Math.PI/2 - Math.atan((2*r - g - b) / Math.pow(3, 0.5) / (g-b))
      let h = g >= b ? angle : angle + Math.PI
      sum += h
    }
  }
  // 计算第一阶中心矩
  M[0] = sum / width / height
  // 计算第二阶中心矩和第三阶中心矩
  for(let i=0; i<width; i++) {
    for(let j=0; j<height; j++) {
      // 获取图像矩阵 RGB，OpenCV 中，RGB 图像的通道顺序为 BGR
      let rgb = img.pixel(i, j)
      let r = rgb[2]
      let g = rgb[1]
      let b = rgb[0]
      // 坐标变换法计算当前像素点的 H 值
      let angle = g === b ? 0 : Math.PI/2 - Math.atan((2*r - g - b) / Math.pow(3, 0.5) / (g-b))
      let h = g >= b ? angle : angle + Math.PI
      M[1] = M[1] === void 0 ? 0 : M[1] + (h-M[0])*(h-M[0])
      M[2] = M[2] === void 0 ? 0 : M[2] + Math.pow((h-M[0]), 3)
    }
  }
  M[1] = Math.sqrt(M[1] / width / height)
  M[2] = Math.sqrt(M[2] / width / height)
  return M
}

// 读取图像像素矩阵
cv.readImage(path.resolve(__dirname, '../public/images/riceBlast/1.jpg'), (err, img) => {
  if(err) {
    console.log(chalk.red(err))
  } else {
    console.log(calcuateColorFeature(img))
  }
})

module.exports = {
  color: calcuateColorFeature
}