const excuteQuery = require('../../mysql/mysql')
const Busboy = require('busboy')
const responseObj = require('../../modules/responseObj')
const cv = require('opencv')
const gm = require('gm')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const feature = require('../../recongnition/getFeature')
const getAverageColorVector = require('../../recongnition/getVector')

class RiceController {
  // 病害识别
  static async recongnition(ctx) {
    let req = ctx.req
    let busboy = new Busboy({headers: req.headers})
    var p = new Promise((resolve, reject) => {
      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        let filePath = path.resolve(__dirname, `../../public/${filename}`)
        // 暂存临时文件
        file.pipe(fs.createWriteStream(filePath))
        file.on('end', () => {
          // 根据颜色特征识别图片
          getAverageColorVector().then((res) => {
            gm(filePath)
            .resize(200, 200, '!')
            .write(filePath, (err) => {
              if(err) {
                console.log(err)
              } else {
                // OpenCV 读取图像，获取图像像素矩阵
                cv.readImage(filePath, (err, img) => {
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
                    resolve(type)
                    // 删除临时文件
                    fs.unlink(path.resolve(__dirname, `../../public/${filename}`), () => {})
                  }
                })
              }
            })
          })
        })
      })
      req.pipe(busboy)
    })
    let type = await p
    ctx.body = ctx.body = responseObj(1, '识别成功', { type: type })
  }
}

module.exports = RiceController