/**
 * 水稻病害图片爬取
 * 根据 URL 获取图片然后保存到本地
 */
const fs = require('fs')
const request = require('request')

// 稻瘟病
// let url = 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E6%B0%B4%E7%A8%BB%E7%A8%BB%E7%98%9F%E7%97%85&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&word=%E6%B0%B4%E7%A8%BB%E7%A8%BB%E7%98%9F%E7%97%85&s=&se=&tab=&width=&height=&face=&istype=&qc=&nc=&fr=&pn=0&rn=600&gsm=3c&1526561321549='
// let path = 'riceBlast'

// 白叶枯
// let url = 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E6%B0%B4%E7%A8%BB%E7%99%BD%E5%8F%B6%E6%9E%AF%E7%97%85&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=%E6%B0%B4%E7%A8%BB%E7%99%BD%E5%8F%B6%E6%9E%AF%E7%97%85&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=0&rn=60&gsm=3c&1526567835700=' 
// let path = 'bacterialBlight'

// 纹枯病
let url = 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E6%B0%B4%E7%A8%BB%E7%BA%B9%E6%9E%AF%E7%97%85&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=%E6%B0%B4%E7%A8%BB%E7%BA%B9%E6%9E%AF%E7%97%85&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=0&rn=60&gsm=1e&1526567909422='
let path = 'sclerotialBlight'

request(url, (err, res, body) => {
  try {
    // 获取图片 JSON 数据
    let data = JSON.parse(body).data
    data.forEach((item) => {
      // 获取图片 URL 请求保存到本地
      if(item.middleURL) {
        request(item.middleURL).pipe(fs.createWriteStream(`/Users/sunmaer/sunmaer/项目/koa2-rice/public/images/${path}/${item.pageNum + 9}.jpg`))
      }
    })
  } catch(err) {
    console.log(err)
  }
})