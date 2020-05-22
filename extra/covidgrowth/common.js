const fs = require('fs')
const smoothish = require('smoothish')

const fileTime = path => fs.statSync(path).mtime.getTime()

const smooth = row => smoothish(row, { radius: 3 })

module.exports = { fileTime, smooth }
