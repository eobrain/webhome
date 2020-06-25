const fs = require('fs')
const smoothish = require('smoothish')
const maxichrome = require('maxichrome')

const fileTime = path => fs.statSync(path).mtime.getTime()

const smooth = row => smoothish(row, { radius: 3 })

const stringifyArray = xs => '[' + xs.map(x => JSON.stringify(x)).join(',\n') + ']'

const colors = async n => await maxichrome(n, ['#f5f1ef', '#111'])

module.exports = { fileTime, smooth, stringifyArray, colors }
