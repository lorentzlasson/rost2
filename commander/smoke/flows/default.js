const asserter = require('../assert')
const requester = require('../requester')
const log = require('../logger')
const config = require('../config')

const r = requester(
  config.hostname,
  config.port,
  config.api_path
)

log.flow('Default')

// cheat
require('../../script/clear_db')

module.exports =
r('GET', '/')
  .then(res => {
    asserter(res)
      .status(200)
      .body_length(0)

    // post invalid json
    return r('POST', '/', '')
  })
  .then(res => {
    asserter(res)
      .status(400)
      .body_length(1)
      .body_equals({
        source: 'parsing'
      })

    // post invalid body
    return r('POST', '/', {})
  })
  .then(res => {
    asserter(res)
      .status(400)
      .body_equals({
        source: 'validation',
        errors: [
          {
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/required',
            params: {
              missingProperty: 'phrase'
            },
            message: 'should have required property \'phrase\''
          }
        ]
      })

    // post valid body
    return r('POST', '/', {
      phrase: 'do stuff',
      http: {
        url: 'www.stuff.do.it'
      }
    })
  })
  .then(res => {
    asserter(res)
      .status(200)
      .body_equals({
        phrase: 'do stuff',
        http: {
          url: 'www.stuff.do.it'
        }
      })

    // get with defaults
    return r('GET', '/?defaults=true')
  })
  .then(res => {
    asserter(res)
      .status(200)
      .body_length(1)
      .members_equal([
        {
          phrase: 'do stuff',
          http: {
            url: 'www.stuff.do.it',
            method: 'POST',
            port: '80',
            protocol: 'https'
          }
        }
      ])

    // get without defaults
    return r('GET', '/')
  })
  .then(res => {
    asserter(res)
      .status(200)
      .body_length(1)
      .members_equal([
        {
          phrase: 'do stuff',
          http: {
            url: 'www.stuff.do.it'
          }
        }
      ])

    // post non-unique phrase
    return r('POST', '/', {
      phrase: 'do stuff',
      http: {
        url: 'www.things.do.it'
      }
    })
  })
  .then(res => {
    asserter(res)
      .status(409)
      .body_equals({
        source: 'not_unique',
        message: 'phrase already taken'
      })

    // post another valid body
    return r('POST', '/', {
      phrase: 'do thing',
      http: {
        url: 'www.things.do.it'
      }
    })
  })
  .then(res => {
    asserter(res)
      .status(200)
      .body_equals({
        phrase: 'do thing',
        http: {
          url: 'www.things.do.it'
        }
      })

    return r('GET', '/')
  })
  .then(res => {
    asserter(res)
      .status(200)
      .body_length(2)

    // delete a phrase
    return r('DELETE', '/?id=do%20stuff')
  })
  .then(res => {
    asserter(res)
      .status(200)
      .body_equals({
        phrase: 'do stuff',
        http: {
          url: 'www.stuff.do.it'
        }
      })

    return r('GET', '/')
  })
  .then(res => {
    asserter(res)
      .status(200)
      .body_length(1)
  })
  .then(log.success)
  .catch(log.error)
