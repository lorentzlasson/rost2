const http = require('http')

const ROUTES = {
  'GET'    :  require('./list'),
  'POST'   :  require('./create'),
  'DELETE' :  require('./delete')
}
const METHODS = Object.keys(ROUTES)

const available = method => METHODS.includes(method)

const not_found = res => {
  res.statusCode = 404
  res.end()
}

module.exports = http.createServer((req, res) => {
  if(!available(req.method)) not_found(res)
  else ROUTES[req.method](req, res)
})
