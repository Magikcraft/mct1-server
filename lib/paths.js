const { homedir } = require('os')
const path = require('path')
const home = homedir()

const cwd = process.cwd()

module.exports = { smaPath: p => path.join(home, '.sma', p) }
