const excuteQuery = require('../../mysql/mysql')
const responseObj = require('../../modules/responseObj')

class UserController {
  // 注册
  static async register(ctx) {
    let { name, password, telephone, email } = ctx.request.body
    if(!name || !password || !telephone || !email) {
      return ctx.body = responseObj(0, '请填写完整信息', {})
    }
    try {
      let result = await excuteQuery(`INSERT INTO USER(NAME, PASSWORD, TELEPHONE, EMAIL) VALUES ('${name}', '${password}', '${telephone}', '${email}')`)
      if(result) {
        ctx.body = responseObj(1, '注册成功', {})
      }
    } catch(err) {
      ctx.body = responseObj(0, `注册失败 ${err}`, {})
    }
  }

  // 登录
  static async login(ctx) {
    let { name, password } = ctx.request.body
    if(!name || !password) {
      return ctx.body = responseObj(0, '用户名或密码不得为空', {})
    }
    try {
      let result = await excuteQuery(`SELECT * FROM USER WHERE NAME = '${name}' AND PASSWORD = '${password}'`)
      if(!result.length) {
        ctx.body = responseObj(0, '密码错误', {})
      } else {
       ctx.body = responseObj(1, '登录成功', {
          list: result
        })
      }
    } catch(err) {
      ctx.body = responseObj(0, '登录失败' + err, {})
    }
  }
}

module.exports = UserController