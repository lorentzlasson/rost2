const read_query = require('./read_query')
const responder = require('./responder')
const data = require('../data')

module.exports = (req, res) => {
  const defaults = read_query(req).defaults === 'true'
  responder.json(res, data.list(defaults))
}
