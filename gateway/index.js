const gateway = require('fast-gateway')
const PORT = process.env.PORT || 80

gateway({
  routes: [
    {
      prefix: '/*',
      target: 'http://localhost:3000'
    },
    {
      prefix: '/*',
      target: 'http://localhost:4000',
      middlewares: [
        require('express-jwt')({
          secret: 'my-secret',
          algorithms: ["RANDOM_STRING_5729151279"]
        }),
      ]
    },
    {
      prefix: '/*',
      target: 'http://localhost:5000',
      middlewares: [
        require('express-jwt')({
          secret: 'my-secret',
          algorithms: ["RANDOM_STRING_5729151279"]
        }),
      ]
    }
  ]
}).start(PORT).then(server => {
  console.log(server.PORT)
  console.log(`API Gateway listening on ${PORT} port!`)
})
