const assert = require('assert')

const delete_element = (arr, i) => arr.slice(0, i).concat(arr.slice(i+1))
const arr_empty = arr => arr.length === 0

const deep_equal = (a, b) => {
  try{
    assert.deepEqual(a, b)
    return true
  }
  catch(_e){
    return false
  }
}

const equals_arrays = (a, b) => {
  if(arr_empty(a) && arr_empty(b)) return true
  if(arr_empty(a) || arr_empty(b)) return false

  const [a_head, ...a_tail] = a
  const match_i = b.findIndex(x => deep_equal(x, a_head))
  if(match_i === -1) return false

  const b_rest = delete_element(b, match_i)
  return equals_arrays(a_tail, b_rest)
}

const body_keys = res => Object.keys(res.body)

const assert_members_equal = (a, b, msg) => {
  if (!equals_arrays(a, b)) {
    const actual = a
    const expected = b
    const operator = 'have members'
    const message = msg

    throw new assert.AssertionError({
      message, actual, expected, operator
    })
  }
}

const asserter = res => {
  const a = {
    status: code => {
      assert.equal(res.statusCode, code, 'status code')
      return a
    },
    body_length: n => {
      const length = Array.isArray(res.body) ? res.body.length : Object.keys(res.body).length
      assert.equal(length, n, 'length of body')
      return a
    },
    body_equals: body => {
      assert.deepEqual(res.body, body, 'body')
      return a
    },
    keys_equal: keys => {
      const actual_keys = body_keys(res)
      assert_members_equal(actual_keys, keys, 'keys in body')
      return a
    },
    members_equal: array => {
      assert_members_equal(res.body, array, 'array')
      return a
    }
  }
  return a
}

module.exports = asserter
