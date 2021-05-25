const onEnd = require('./../index')
const http = require('http')

const server = http.createServer((req, res) => {
  onEnd(res, (payload) => {
    console.log(payload)
  })

  res.setHeader('my-header', 'value')
  res.end('Hello Word!', 'utf-8')
})

server.listen(3000)
