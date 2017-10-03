const read_json = require('../read_json')
const responder = require('../responder')
const data = require('../../data')

module.exports = (req, res) => {
  read_json(req)
    .then(([body, parse_err]) => {
      if(parse_err) return responder.error(res, parse_err)

      const [created, data_err] = data.create(body)
      if(data_err) return responder.error(res, data_err)

      responder.json(res, created)
    })
    .catch(e => {
      console.error(e)
      responder.error(res, e)
    })
}
