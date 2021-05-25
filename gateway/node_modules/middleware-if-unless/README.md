# middleware-if-unless
Invokes connect-like middleware if / unless routing criteria matches. Inspired on [express-unless](https://www.npmjs.com/package/express-unless) module.  

## Main features
- Advanced routes matching capabilities. Uses [find-my-way](https://www.npmjs.com/package/find-my-way) or any compatible router to match the routes. 
- `iff`: execute middleware only if the routes matches. Ideal use case: API gateways (see: [k-fastify-gateway](https://www.npmjs.com/package/k-fastify-gateway))
- `unless`: execute middleware always unless the routes matches.
- Arbitraty chaining of iff -> unless of vice-versa.
- Low overhead, crazy fast implementation. 


# Usage example
How to extend any connect-like middleware:
```js 
const iu = require('middleware-if-unless')()

const middleware = function (req, res, next) {
  res.body = 'hit'

  return next()
}

// extend middleware with iff/unless capabilities
iu(middleware)
```
## unless
Execute middleware unless routing restrictions matches:
```js
const app = require('express')()
app.use(middleware.unless([
  '/not/allowed/to/hit'
]))

...
```
In this example, all requests except `[GET] /not/allowed/to/hit` will cause the middleware to be executed.

## if
Execute middleware only if routing restrictions matches:
```js
const app = require('express')()
app.use(middleware.iff([
  {
    methods: ['POST', 'DELETE', 'PUT', 'PATCH'],
    url: '/tasks/:id'
  }
]))

...
```
In this example, only a `[POST|DELETE|PUT|PATCH] /tasks/:id` request will cause the middleware to be executed.
### Chaining
You can optionally chain iff -> unless or vice-versa:
```js
app.use(middleware
  .iff(req => req.url.startsWith('/pets'))  // 4 check
  .iff([                                    // 3 check
    '/pets/*',
    '/pets/:id/*'
  ]).unless([                               // 2 check
    '/pets/:id/owners',
    {
      url: '/pets/:id', methods: ['DELETE'] 
    }
  ]).unless(req => req.url.endsWith('.js')) // 1 check
)
```
# Configuration
## module
```js
const iu = require('middleware-if-unless')(
  // optional router configuration: 
  // https://www.npmjs.com/package/find-my-way#findmywayoptions
  {
  }
  , 
  // optional router factory:
  // allows to override find-my-way as default router
  function(opts){}
)
```
### Known compatible routers:
- https://www.npmjs.com/package/find-my-way
- https://www.npmjs.com/package/anumargak

## iff / unless
Both methods share the same configuration format:

### - routing criteria is a function 
```js
middleware.iff(req => req.url.startsWith('/pets'))
```
### - routing criteria is an array of routes
```js
middleware.iff([
  '/login', // if string is passed, the GET method is inferred
  {
    methods: ['DELETE', 'POST', '...'],
    url: '/tasks/:id/*'
  }
])
```
### - routing criteria is an object
```js
middleware.unless({ endpoints: [
  '/login', // if string is passed, the GET method is inferred
  {
    methods: ['DELETE', 'POST', '...'],
    url: '/tasks/:id/*'
  }
]})
```
#### Supporting Accept-Version header
Optionally, you can also restrict your middleware execution to specific versions using the `Accept-Version` header:
> The `version` value should follow the [semver](https://semver.org/) specification.
```js
middleware.iff({ endpoints: [
  {
    methods: ['GET'],
    url: '/tasks/:id',
    version: '2.0.0'
  }
]})
```
In the example, a `GET /tasks/:id` request will only execute the middleware if the `Accept-Version` header matches `2.0.0`. For example:
- Accept-Version=2.0.0
- Accept-Version=2.x
- Accept-Version=2.0.x

#### Updatings requests params object
Optionally, you can override the `req.params` object with the parameters of the matching route defined on your configs:
```js
middleware.iff({ endpoints: [
  {
    methods: ['GET'],
    url: '/tasks/:id',
    version: '2.0.0',
    updateParams: true  // enabling this config will result in req.params = {id: ...}
  }
]})
```
> This feature can be really useful for business specific middlewares using the `iff` matching type.