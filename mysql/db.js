const chalk = require('chalk')
const mysql = require('mysql')

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'sunmaer',
  database: 'rice'
})

let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        console.log(chalk.red('数据库连接失败 ' + err))
        reject(err)
      } else {
        console.log(chalk.green('数据库连接成功'))
        connection.query(sql, values, (err, rows) => {
          if(err) {
            console.log(chalk.red('查询失败 ' + err))
            reject(err)
          } else {
            console.log(chalk.green('查询成功'))
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = query