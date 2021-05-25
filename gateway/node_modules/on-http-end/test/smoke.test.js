/* global describe, it, beforeEach */

const onFinished = require('../index')
const expect = require('chai').expect

describe('on-http-end', () => {
  let data
  let res

  beforeEach((done) => {
    data = ''
    res = {
      statusCode: 200,
      getHeaders: () => {
        return {}
      },
      write: function (content) {
        if (content) data += content
      },
      end: function (content, encoding) {
        if (content) data += content
      }
    }

    done()
  })

  it('should accumulate string content', function (done) {
    onFinished(res, (payload) => {
      expect(payload.data).to.equal('hello world')
      expect(data).to.equal('hello world')
      done()
    })

    res.write(undefined)
    res.write('h')
    res.write(Buffer.from('ello'))
    res.write(' ')
    res.end('world')
  })

  it('should accumulate content and encoding', function (done) {
    onFinished(res, (payload) => {
      expect(payload.encoding).to.equal('utf-8')
      done()
    })

    res.end('Hello', 'utf-8')
  })

  it('should accumulate non-string content', function (done) {
    onFinished(res, (payload) => {
      expect(payload.data).to.equal(true)
      done()
    })

    res.end(true)

    // checks recursiveness is prevented
    res.end(true)
  })

  it('should accumulate buffer content', function (done) {
    onFinished(res, (payload) => {
      expect(payload.data.toString()).to.equal(Buffer.from('Hello World!').toString())
      done()
    })

    res.write(Buffer.from('Hello '))
    res.write(Buffer.from('World!'))

    res.end()
  })
})
