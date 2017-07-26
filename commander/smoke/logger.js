const separate = () => console.log('\n=================')

const pretty_assert_error = e => {
  const msg = e.message
  const op = e.operator
  const exp = JSON.stringify(e.expected)
  const act = JSON.stringify(e.actual)

  return `${msg} should ${op} "${exp}", but ${op} "${act}"`
}

const error = e => {
  separate()
  if(e.name == 'AssertionError') {
    delete e.stack
    delete e.generatedMessage

    console.error('Test run failed:')
    console.error(pretty_assert_error(e))
  }
  else {
    console.error('Unexpected failure:')
    console.error(e)
  }
}

const success = () => {
  separate()
  console.log('Test run succeeded\n')
}

const step = (m, p) => {
  console.log(`[${m}\t${p}]`)
}

const flow = name => {
  console.log(`### ${name} ###`)
}

module.exports = {
  error,
  success,
  step,
  flow
}
