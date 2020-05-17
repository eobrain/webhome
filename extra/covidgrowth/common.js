const fs = require('fs')

const fileTime = path => fs.statSync(path).mtime.getTime()

module.exports = {fileTime}