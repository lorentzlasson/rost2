const http = require('http')
const url = require('url')

const ROUTER = {
  command: {
    methods: {
      'GET':     require('./command/list'),
      'POST':    require('./command/create'),
      'DELETE':  require('./command/delete')
    }
  },
  methods: {
    'POST': require('./trigger'),
  }
}

const action = (pathname, method) => {
  const resources = pathname.split('/').filter(x => x) // no empty
  return _action(ROUTER, resources, method)
}

const _action = (router, resources, method) => {
  if(!router) return // invalid path
  if(resources.length == 0) return router.methods[method]

  const [head, ...tail] = resources
  return _action(router[head], tail, method)
}

const not_found = res => {
  res.statusCode = 404
  res.end()
}

module.exports = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname
  const method = req.method

  const a = action(pathname, method)
  if(!a) return not_found(res)

  a(req, res)
})
