# on-http-end
Allows to capture HTTP response content and headers on request end.
> Inspired by: https://github.com/kwhitley/apicache/blob/master/src/apicache.js

## Install
```bash
npm i on-http-end
```

## Usage
```js
const onEnd = require('on-http-end')
const http = require('http')

const server = http.createServer((req, res) => {
  onEnd(res, (payload) => {
    console.log(payload)
  })

  res.setHeader('my-header', 'value')
  res.end('Hello Word!', 'utf-8')
})

server.listen(3000)
```

Output:
```bash
{
  status: 200,
  headers: [Object: null prototype] { 'my-header': 'value' },
  data: 'Hello Word!',
  encoding: 'utf-8'
}
```

## Want to contribute?
This is your repo ;)

> Note: We aim to be 100% code coverage, please consider it on your pull requests.