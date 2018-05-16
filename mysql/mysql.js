const chalk = require('chalk')
const mysql = require('mysql')
const mysqlConfig = require('./config')

const pool = mysql.createPool(mysqlConfig)

/** 
 * 执行 SQL 语句
 * 
 * @param {String} queryString SQL语句
 * @return {Promise}
 */
function excuteQuery( queryString, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if(err) {
        console.log(chalk.red('数据库连接失败'))
        reject(err)
      } else {
        connection.query(queryString, (err, results) => {
          if(err) {
            console.log(chalk.red('执行SQL语句失败 ' + err))
            reject(err)
          } else {
            console.log(chalk.green('执行SQL语句成功 ' + queryString))
            resolve(results)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = excuteQuery