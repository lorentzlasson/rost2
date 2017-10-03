const read_query = require('../read_query')
const responder = require('../responder')
const data = require('../../data')

module.exports = (req, res) => {
  const id = read_query(req).id
  responder.json(res, data.del(id))
}
