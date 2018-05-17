/**
 * 水稻病害图片爬取
 * 根据 URL 获取图片然后保存到本地
 */
const fs = require('fs')
const request = require('request')

let url = 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E6%B0%B4%E7%A8%BB%E7%A8%BB%E7%98%9F%E7%97%85&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&word=%E6%B0%B4%E7%A8%BB%E7%A8%BB%E7%98%9F%E7%97%85&s=&se=&tab=&width=&height=&face=&istype=&qc=&nc=&fr=&pn=0&rn=120&gsm=3c&1526561321549='

request(url, (err, res, body) => {
  try {
    // 获取图片 JSON 数据
    let data = JSON.parse(body).data
    console.log(data[data.length-2])
    data.forEach((item) => {
      // 获取图片 URL 请求保存到本地
      if(item.middleURL) {
        // request(item.middleURL).pipe(fs.createWriteStream(`/Users/sunmaer/sunmaer/项目/koa2-rice/public/images/riceBlast/${item.pageNum + 10}.jpg`))
      }
    })
  } catch(err) {
    console.log(err)
  }
})