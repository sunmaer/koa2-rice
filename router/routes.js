const router = require('koa-router')()
const user = require('../api/user')

// 登录
router.post('/login', async(ctx, next) => {
  let userObj = ctx.request.body
  ctx.body = await user.login(userObj.name, userObj.password)
})

module.exports = router