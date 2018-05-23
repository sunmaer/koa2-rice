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
 * @return {Object} 颜色特征向量
 */
function calculateColorFeature(img) {
  const width = img.width()
  const height = img.height()
  let sumH = sumS = sumI = 0, M = {MH: [], MS: [], MI: []}, N = width * height
  for(let j = 0; j < width; j++) {
    for(let k = 0; k < height; k++) {
      // 获取图像矩阵 RGB，OpenCV 中，RGB 图像的通道顺序为 BGR
      let rgb = img.pixel(j, k)
      let r = rgb[2]
      let g = rgb[1]
      let b = rgb[0]
      // 坐标变换法计算当前像素点的 H、S、I 值
      let angle = g === b ? 0 : Math.PI / 2 - Math.atan((2 * r - g - b) / Math.pow(3, 0.5) / (g - b))
      let h = g >= b ? angle : angle + Math.PI
      let s = 2 * Math.sqrt(((r - g) * (r - g) + (r - b) * (g - b))) / Math.sqrt(6)
      let i = (r + g + b) / Math.sqrt(3)
      sumH += h
      sumS += s
      sumI += i
    }
  }
  // 计算各个通道第一阶中心矩
  M.MH[0] = sumH / N
  M.MS[0] = sumS / N
  M.MI[0] = sumI / N

  // 计算各个通道第二阶中心矩和第三阶中心矩
  for(let j = 0; j < width; j++) {
    for(let k = 0; k < height; k++) {
      // 获取图像矩阵 RGB，OpenCV 中，RGB 图像的通道顺序为 BGR
      let rgb = img.pixel(j, k)
      let r = rgb[2]
      let g = rgb[1]
      let b = rgb[0]
      // 坐标变换法计算当前像素点的 H、S、I 值
      let angle = g === b ? 0 : Math.PI / 2 - Math.atan((2 * r - g - b) / Math.pow(3, 0.5) / (g - b))
      let h = g >= b ? angle : angle + Math.PI
      let s = 2 * Math.sqrt(((r - g) * (r - g) + (r - b) * (g - b))) / Math.sqrt(6)
      let i = (r + g + b) / Math.sqrt(3)
      M.MH[1] = M.MH[1] === void 0 ? 0 : M.MH[1] + (h - M.MH[0]) * (h - M.MH[0])
      M.MH[2] = M.MH[2] === void 0 ? 0 : M.MH[2] + Math.pow((h - M.MH[0]), 3)

      M.MS[1] = M.MS[1] === void 0 ? 0 : M.MS[1] + (s - M.MS[0]) * (s - M.MS[0])
      M.MS[2] = M.MS[2] === void 0 ? 0 : M.MS[2] + Math.pow((s - M.MS[0]), 3)

      M.MI[1] = M.MI[1] === void 0 ? 0 : M.MI[1] + (i - M.MI[0]) * (i - M.MI[0])
      M.MI[2] = M.MI[2] === void 0 ? 0 : M.MI[2] + Math.pow((i - M.MI[0]), 3)
    }
  }
  M.MH[1] = Math.sqrt(M.MH[1] / N)
  M.MH[2] = Math.cbrt(M.MH[2] / N)
  M.MS[1] = Math.sqrt(M.MS[1] / N)
  M.MS[2] = Math.cbrt(M.MS[2] / N)
  M.MI[1] = Math.sqrt(M.MI[1] / N)
  M.MI[2] = Math.cbrt(M.MI[2] / N)
  return [].concat(M.MH, M.MS, M.MI)
}

// 测试 DEMO
// cv.readImage(path.resolve(__dirname, '../public/images/riceBlast/50.jpg'), (err, img) => {
//   if(err) {
//     console.log(chalk.red(err))
//   } else {
//     console.log(calculateColorFeature(img))
//   }
// })

module.exports = {
  color: calculateColorFeature
}