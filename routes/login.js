const router = require('koa-router')()

router.get('/login', async(ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = '1'
})

module.exports = router