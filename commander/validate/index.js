const fs = require('fs')
const yaml = require('js-yaml')
const Ajv = require('ajv')

const schema = yaml.load(
  fs.readFileSync('./validate/command.schema.yml')
)

const [validator, defaulter] = [ false, true ]
  .map(x => new Ajv({ useDefaults: x }).compile(schema))

// public

const defaulted = x => {
  if(!defaulter(x)) throw new Error(defaulter.errors)
  return x
}

const validated = x => !validator(x) ? validator.errors : null

module.exports = {
  defaulted,
  validated
}
