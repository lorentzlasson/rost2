const read_json = require('./read_json')
const responder = require('./responder')

const data = require('../data')

module.exports = (req, res) => {
  read_json(req)
    .then(([body, parse_err]) => {
      if(parse_err) return responder.error(res, parse_err)
      const commands = data.list(true)

      responder.json(res, {
        commands,
        trigger: body
      })
    })
    .catch(e => {
      console.error(e)
      responder.error(res, e)
    })
}
