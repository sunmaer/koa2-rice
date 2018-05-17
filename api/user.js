const excuteQuery = require('../mysql/mysql')
const responseObj = require('../modules/responseObj')

const user = {
  /** 
   * 注册
   * 
   * @param {String} name 用户名
   * @param {String} password 密码
   * @param {String} telephone 手机号码
   * @param {String} email 邮箱
   * @return {Promise}
   */
  async register(name, password, telephone, email) {
    if(!name || !password || !telephone || !email) {
      return responseObj(0, '请填写完整信息', {})
    }
    return await excuteQuery(`INSERT INTO USER(NAME, PASSWORD, TELEPHONE, EMAIL) VALUES ('${name}', '${password}', '${telephone}', '${email}')`).then((result) => {
      if(result) {
        return responseObj(1, '注册成功', {})
      }
    }).catch((err) => {
      return responseObj(0, `注册失败 ${err}`, {})
    })
  },

  /**
   * 登录
   * 
   * @param {String} name 用户名
   * @param {String} password 密码
   * @return {Promsie}
   */
  async login(name, password) {
    if(!name || !password) {
      return responseObj(0, '用户名或密码不得为空', {})
    }
    return await excuteQuery(`SELECT * FROM USER WHERE NAME = '${name}' AND PASSWORD = '${password}'`).then((result) => {
      if(!result.length) {
        return responseObj(0, '密码错误', {})
      } else {
        return responseObj(1, '登录成功', {
          list: result
        })
      }
    }).catch((err) => {
      return responseObj(0, '登录失败' + err, {})
    })

  }
}

module.exports = user