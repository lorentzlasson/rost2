const first_key = obj => Object.keys(obj)[0]
const first_value = obj => obj[first_key(obj)]
const concat_keys = (obj, keys) => Object.keys(obj).concat(keys)

module.exports = {
  first_key,
  first_value,
  concat_keys
}
