const router = require('koa-router')()
const user = require('../controllers/user/userController')
const rice = require('../controllers/rice/riceController')

/** 
 * 用户模块
 */
router.post('/register', user.register) // 注册
router.post('/login', user.login) // 登录

/** 
 * 水稻模块
 */
router.post('/recongnition', rice.recongnition) // 病害识别

module.exports = router