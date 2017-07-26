module.exports = req => new Promise(resolve => {
  let body = []
  req.on('data', chunk => {
    body.push(chunk)
  }).on('end', () => {
    try {
      resolve([JSON.parse(Buffer.concat(body)), null])
    }
    catch(e){
      // console.error(e)
      resolve([
        null,
        {
          source: 'parsing'
        }
      ])
    }
  })
})
