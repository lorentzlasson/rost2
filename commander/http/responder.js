const SOURCE_CODES = {
  not_unique: 409,
  validation: 400,
  'parsing': 400
}

const error = (res, err) => {
  const code = SOURCE_CODES[err.source] || 500
  res.statusCode = code
  if(code === 500) return res.end()
  json(res, err)
}

const json = (res, body) => {
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify(body))
  res.end()
}

module.exports = {
  error,
  json
}
