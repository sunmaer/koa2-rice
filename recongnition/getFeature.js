/**
 * 图像颜色、纹理、形状特征提取
 */
const path = require('path')
const cv = require('opencv')
const chalk = require('chalk')

/** 
 * HSI 中心矩法提取图像颜色特征
 * 
 * @param {Object} img 图像像素矩阵
 * @return {Object} 图像颜色特征向量
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
      M.MH[1] = M.MH[1] === void 0 ? (h - M.MH[0]) * (h - M.MH[0]) : M.MH[1] + (h - M.MH[0]) * (h - M.MH[0])
      M.MH[2] = M.MH[2] === void 0 ? Math.pow((h - M.MH[0]), 3) : M.MH[2] + Math.pow((h - M.MH[0]), 3)

      M.MS[1] = M.MS[1] === void 0 ? (s - M.MS[0]) * (s - M.MS[0]) : M.MS[1] + (s - M.MS[0]) * (s - M.MS[0])
      M.MS[2] = M.MS[2] === void 0 ? Math.pow((s - M.MS[0]), 3) : M.MS[2] + Math.pow((s - M.MS[0]), 3)

      M.MI[1] = M.MI[1] === void 0 ? (i - M.MI[0]) * (i - M.MI[0]) : M.MI[1] + (i - M.MI[0]) * (i - M.MI[0])
      M.MI[2] = M.MI[2] === void 0 ? Math.pow((i - M.MI[0]), 3) : M.MI[2] + Math.pow((i - M.MI[0]), 3)
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

/** 
 * 灰度共生矩阵提取图像纹理特征
 * 
 * @param {Object} img 图像像素矩阵
 * @return {Object} 图像纹理特征向量
 */
function calculateTextureFeature(img) {
  const width = img.width()
  const height = img.height()
  let initGLCM = [], GLCM = []
  GLCM[0] = [], GLCM[1] = [], GLCM[2] = [], GLCM[3] = []
  // 图像灰度化并降低灰度等级
  for(let i=0; i<width; i++) {
    initGLCM[i] = []
    for(let j=0; j<height; j++) {
      // 获取图像矩阵 RGB，OpenCV 中，RGB 图像的通道顺序为 BGR
      let rgb = img.pixel(i, j)
      let r = rgb[2]
      let g = rgb[1]
      let b = rgb[0]
      initGLCM[i][j] = parseInt((0.3 * r + 0.59 * g + 0.11 * b) / 32) + 1
    }
  }
  // 计算图像0度、45度、90度、135度四个方向的灰度共生矩阵
  for(let i=0; i<8; i++) {
    GLCM[0][i] = [], GLCM[1][i] = [], GLCM[2][i] = [], GLCM[3][i] = []
    for(let j=0; j<8; j++) {
      GLCM[0][i][j] = GLCM[1][i][j] = GLCM[2][i][j] = GLCM[3][i][j] = 0
      for(let w=1; w<width; w++) {
        for(let h=0; h<height-1; h++) {
          // 0度方向灰度共生矩阵
          if(initGLCM[w][h] === i && initGLCM[w][h+1] === j && i === j) {
            GLCM[0][i][j] += 2
          } else if(initGLCM[w][h] === i && initGLCM[w][h+1] === j) {
            GLCM[0][i][j]++
          }
          // 45度方向灰度共生矩阵
          if(initGLCM[w][h] === i && initGLCM[w-1][h+1] === j && i === j) {
            GLCM[1][i][j] += 2
          } else if(initGLCM[w][h] === i && initGLCM[w-1][h+1] === j) {
            GLCM[1][i][j]++
          }
          // 90度方向灰度共生矩阵
          if(initGLCM[w][h] === i && initGLCM[w][h-1] === j && i === j) {
            GLCM[2][i][j] += 2
          } else if(initGLCM[w][h] === i && initGLCM[w][h-1] === j) {
            GLCM[2][i][j]++
          }
          // 135度方向灰度共生矩阵
          if(initGLCM[w][h] === i && initGLCM[w-1][h-1] === j && i === j) {
            GLCM[3][i][j] += 2
          } else if(initGLCM[w][h] === i && initGLCM[w-1][h-1] === j) {
            GLCM[3][i][j]++
          }
        }
      }
    }
  }
  // 归一化
  function normalize(glcm) {
		let sum = 0
	    for(let i=0; i<8; i++) {
	    	for(let j=0; j<8; j++) {
          sum += glcm[i][j]
        }
      }
	    for(let i=0; i<8; i++) {
	    	for(let j=0; j<8; j++) {
          glcm[i][j] = glcm[i][j] / sum
        }
      }
	    return glcm
  }
  // 归一化
  for(let i=0; i<4; i++) {
    normalize(GLCM[i])
  }
  // 计算每个灰度共生矩阵的纹理一致性，纹理对比度，纹理熵，纹理相关性
  let consistence = [], contrast = [], entropy = [], correlation = [] 
  for(i=0; i<8; i++) {
    for(j=0; j<8; j++) {
      for(d=0; d<4; d++) {
        	//熵,加0.000001是为了避免值为0
          entropy[d] = entropy[d] === void 0 ? GLCM[d][i][j] * Math.log(GLCM[d][i][j]+0.00001) / Math.log(2) : 
            entropy[d] + GLCM[d][i][j] * Math.log(GLCM[d][i][j]+0.00001) / Math.log(2)
					//对比度,取k=2,入=1
          contrast[d] = contrast[d] === void 0 ? (i-j)*(i-j) * GLCM[d][i][j] :
            contrast[d] + (i-j)*(i-j) * GLCM[d][i][j]
					//一致性(能量)
          consistence[d] = consistence[d] === void 0 ? GLCM[d][i][j] * GLCM[d][i][j] :
            consistence[d] + GLCM[d][i][j] * GLCM[d][i][j]
					//相关性
          correlation[d] = correlation[d] === void 0 ? i * j * GLCM[d][i][j] :
            correlation[d] + i * j * GLCM[d][i][j]
      }
    }
  }
  // console.log(entropy, contrast, consistence, correlation)
  // 计算每个灰度共生矩阵的均值和标准差
  let ux = [], uy = [], ax = [], ay = []
  for(let i=0; i<8; i++) {
    for(let j=0; j<8; j++) {
      for(d=0; d<4; d++) {
        ux[d] = ux[d] === void 0 ? i * GLCM[d][i][j] : ux[d] + i * GLCM[d][i][j]
        uy[d] = uy[d] === void 0 ? j * GLCM[d][i][j] : uy[d] + j * GLCM[d][i][j]
        ax[d] = ax[d] === void 0 ? (i-ux[d]) * (i-ux[d]) * GLCM[d][i][j] : ax[d] + (i-ux[d]) * (i-ux[d]) * GLCM[d][i][j]
        ay[d] = ay[d] === void 0 ? (j-uy[d]) * (j-uy[d]) * GLCM[d][i][j] : ay[d] + (j-uy[d]) * (j-uy[d]) * GLCM[d][i][j]
        ax[d] = Math.sqrt(ax[d])
        ay[d] = Math.sqrt(ay[d])
      }
    }
  }
  // 计算纹理相关性
  for (let d=0; d<4; d++) {
    correlation[d] = (correlation[d] - ux[d] * uy[d]) / ax[d] / ay[d]
  }
  // 期望
	function expect(num) {
		let sum = 0
		for(let i=0; i<num.length; i++)
			sum += num[i]
		return sum / num.length
	}
	// 标准差
	function stdv(num) {
		let avg = expect(num), sum = 0
		for(let i=0; i<num.length; i++)
			sum += Math.pow(num[i]-avg, 2)
		return Math.sqrt(sum / num.length)
  }
  let M = []
  M[0] = expect(consistence)
  M[1] = expect(contrast)
  M[2] = expect(entropy)
  M[3] = expect(correlation)
  M[4] = stdv(consistence)
  M[5] = stdv(contrast)
  M[6] = stdv(entropy)
  M[7] = stdv(correlation)
  return M
}

/** 
 * 形状不变矩法提取图像形状体征
 * 
 * @param {Object} img 图像像素矩阵
 * @param {Object} 图像形状特征向量
 */
function calculateShapeFeature(img) {
  const width = img.width()
  const height = img.height()
  let glcm = []
  // 图像灰度化
  for(let i=0; i<width; i++) {
    glcm[i] = []
    for(let j=0; j<height; j++) {
      // 获取图像矩阵 RGB，OpenCV 中，RGB 图像的通道顺序为 BGR
      let rgb = img.pixel(i, j)
      let r = rgb[2]
      let g = rgb[1]
      let b = rgb[0]
      glcm[i][j] = (0.3 * r + 0.59 * g + 0.11 * b)
    }
  }
  // 中值滤波算法对图像进行平滑滤波
  for(let i=1; i<5; i++) {
    for(let j=1; j<5; j++) {
      let arr = []
      arr[0] = glcm[i-1][j-1]
      arr[1] = glcm[i-1][j]
      arr[2] = glcm[i-1][j+1]
      arr[3] = glcm[i][j-1]
      arr[4] = glcm[i][j]
      arr[5] = glcm[i][j+1]
      arr[6] = glcm[i+1][j-1]
      arr[7] = glcm[i+1][j]
      arr[8] = glcm[i+1][j+1]
      // 3*3 窗口的像素值进行排序取中间值
      arr.sort(function(a, b) {
        return a - b
      })
      glcm[i][j] = arr[4]
    }
  }
  // sobel 算子对图像进行锐化
  for (let i = 1; i < width-1; i++) {
    for (let j = 1; j < height-1; j++) {
      let x = (-1)*glcm[i-1][j-1] + (-2)*glcm[i][j-1] + (-1)*glcm[i+1][j-1] + 
                glcm[i-1][j+1] + 2*glcm[i][j+1] + glcm[i+1][j+1]
      let y = (-1)*glcm[i-1][j-1] + (-2)*glcm[i-1][j] + (-1)*glcm[i-1][j+1] + 
                glcm[i+1][j-1] + 2*glcm[i+1][j] + glcm[i+1][j+1]
      let temp = Math.abs(x) + Math.abs(y)
      if (temp > 255) {
        temp = 255
      }
      glcm[i][j] = temp
    }
  }
  // 图像用迭代阈值法进行二值化
  let t1, t2 = 100, t0 = 1
  do {
    t1 = t2
    let G1 = G2 = G1Num = G2Num = 0
    for(let i=0; i<width; i++) {
      for(let j=0; j<height; j++) {
        if(glcm[i][j] <= t1) {
          G1 += glcm[i][j]
          G1Num++
        } else {
          G2 += glcm[i][j]
          G2Num++
        }
      }
    }
    let u1 = G1 / G1Num, u2 = G2 / G2Num
    t2 = (u1 + u2) / 2
  } while(Math.abs(t1 - t2) > t0)
  for(let i=0; i<width; i++) {
    for(let j=0; j<height; j++) {
      glcm[i][j] = glcm[i][j] >= t2 ? 1 : 0
    }
  }
  // 计算图像的 Hu 不变矩
  let m00=0, m11=0, m20=0,  m02=0, m30=0, m03=0, m12=0, m21=0 //中心矩
  let u20=0, u02=0, u11=0, u30=0, u03=0, u12=0, u21=0 //规范化后的中心矩
  let ht1=0, ht2=0, ht3=0, ht4=0, ht5=0 //临时变量
  let _x=0, _y=0 //重心

  // 获得图像的区域中心（普通矩）
  let s10 = 0, s01 = 0, s00 = 0 // 0阶矩和1阶矩
  for(let i=0; i<width; i++) {
    for(let j=0; j<height; j++) {
      if(glcm[i][j] === 0) {
        s00 += 1
        s01 += j
        s10 += 0
      } else {
        s00 += 1
        s01 += j
        s10 += i
      }
    }
  }
  _x = s10 / s00
  _y = s01 / s00
  // 计算二阶、三阶矩（中心矩）
  m00 = s00
  for(let i=0; i<width; i++) {
    for(let j=0; j<height; j++) {
      if(glcm[i][j] !== 0) {
        m11 += (i - _x) * (j - _y)
        m20 += (i - _x) * (i - _x)
        m02 += (j - _y) * (j - _y)
        m30 += Math.pow(i - _x, 3)
        m03 += Math.pow(j - _y, 3)
        m12 += (i - _x) * Math.pow(j - _y, 2)
        m21 += Math.pow(i - _x, 2) * (j - _y)
      }
    }
  }
  // 计算规范化后的中心矩
  u20 = (m20 / Math.pow(m00, 2))
  u02 = (m02 / Math.pow(m00, 2))
  u11 = (m11 / Math.pow(m00, 2))
  u30 = (m30 / Math.pow(m00, 2.5))
  u03 = (m03 / Math.pow(m00, 2.5))
  u12 = (m12 / Math.pow(m00, 2.5))
  u21 = (m21 / Math.pow(m00, 2.5))
  // 计算中间变量
  ht1 = (u20 - u02)
  ht2 = (u30 - 3*u12)
  ht3 = (3*u21 - u03)
  ht4 = (u30 + u12)
  ht5 = (u21 + u03)
  // 计算不变矩
  let M = []
  M[0]=(u20 + u02)
  M[1]=(ht1 * ht1 + 4 * u11 * u11)
  M[2]=(ht2 * ht2 + ht3 * ht3)
  M[3]=(ht4 * ht4 + ht5 * ht5)
  M[4]=(ht2 * ht4 * (ht4 * ht4 - 3 * ht5 * ht5) + ht3 * ht5 * (3 * ht4 * ht4 - ht5 * ht5))
  M[5]=(ht1 * (ht4 * ht4 - ht5 * ht5) + 4 * u11 * ht4 * ht5)
  M[6]=(ht3 * ht4 * (ht4 * ht4 - 3 * ht5 * ht5) - ht2 * ht5 * (3 * ht4 * ht4 - ht5 * ht5))
  return M
}

// 测试 DEMO
// cv.readImage(path.resolve(__dirname, '../public/images/riceBlast/50.jpg'), (err, img) => {
//   if(err) {
//     console.log(chalk.red(err))
//   } else {
//     console.log(calculateShapeFeature(img))
//   }
// })

module.exports = {
  color: calculateColorFeature,
  texture: calculateTextureFeature,
  shape: calculateShapeFeature
}