const router = require('koa-router')()
const user = require('../controllers/user/userController')

/** 
 * 用户模块
 */
router.post('/register', user.register) // 注册
router.post('/login', user.login) // 登录

module.exports = router