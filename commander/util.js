const l = x => console.log(x)
const pl = x => l(JSON.stringify(x, null, 4))

module.exports = {
  l,
  pl
}
