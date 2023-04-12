process.stdin.setEncoding('utf8')
const readline = require('readline')

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
module.exports = r1
