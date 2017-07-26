const http = require('http')
const log = require('./logger')

http.ClientRequest.prototype.try_write = function(body) {
  if(body) {
    this.setHeader('Content-Type', 'application/json')
    this.write(JSON.stringify(body))
  }
  return this
}

const result = statusCode => {
  let data = null
  return {
    add_chunk: chunk => {
      data = data ? data + chunk : chunk
    },
    collect: () => {
      return {
        statusCode,
        body: JSON.parse(data)
      }
    }
  }
}

const requester = (hostname, port, api_path) => {
  return (method, path, body) => {
    log.step(method, path)

    return new Promise((resolve, reject) => {
      http.request({
        hostname,
        port,
        path: api_path + path,
        method
      }, res => {
        const r = result(res.statusCode)

        res.on('data', chunk => {
          r.add_chunk(chunk)
        }).on('end', () => {
          resolve(r.collect())
        })
      }).on('error', e => reject(e))
        .try_write(body)
        .end()
    })
  }
}

module.exports = requester
