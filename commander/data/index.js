const fs = require('fs')
const yaml = require('js-yaml')

const DB_PATH = './data/db.yml'
const SEED_PATH = './data/seed.yml'

const validate = require('../validate')

const read = path => yaml.load(fs.readFileSync(path))
const write = (path, data) => fs.writeFileSync(path, yaml.dump(data))

const read_db = () => read(DB_PATH)
const read_seed = () => read(SEED_PATH)
const write_db = data => write(DB_PATH, data)

const unique = attempt => {
  const existing = read_db().find(x => x.phrase === attempt.phrase)
  return !existing
}

// public
const clear = () => write_db([])

const create = x => {
  const validation_err = validate.validated(x)
  if(validation_err) {
    return [
      null,
      {
        source: 'validation',
        errors: validation_err
      }
    ]
  }
  if(!unique(x)) {
    return [
      null,
      {
        source: 'not_unique',
        message: 'phrase already taken'
      }
    ]
  }

  write_db(read_db().concat(x))
  return [x, null]
}

const del = id => {
  const data = read_db()
  const del_x = data.find(x => x.phrase === id)
  write_db(data.filter(x => x != del_x))
  return del_x || {}
}

const list = defaults => {
  const data = read_db()
  return defaults ? data.map(x => validate.defaulted(x)) : data
}

const reset = () => write_db(read_seed())

module.exports = {
  clear,
  create,
  del,
  list,
  reset
}
