/**
 * 图像颜色、纹理、形状特征提取
 */
const path = require('path')
const gm = require('gm')

gm(path.resolve(__dirname, '../public/images/mona.png'))
  .identify((err, value) => {
    console.log(value)
  })