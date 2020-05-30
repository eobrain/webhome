const fs = require('fs')
const smoothish = require('smoothish')

const fileTime = path => fs.statSync(path).mtime.getTime()

const smooth = row => smoothish(row, { radius: 3 })

const stringifyArray = xs => '[' + xs.map(x => JSON.stringify(x)).join(',\n') + ']'

module.exports = { fileTime, smooth, stringifyArray }
