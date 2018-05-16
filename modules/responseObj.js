/**
 * HTTP 请求返回对象
 * 
 * @param {Number} code 返回码
 * @param {String} msg 返回信息
 * @param {Object} data 返回对象
 * @return {Object}
 */

function resposeObj(code, msg, data) {
  return {
    status: code,
    msg: msg,
    data: data
  }
}

module.exports = resposeObj