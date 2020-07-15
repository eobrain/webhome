import fs from 'fs'
import smoothish from 'smoothish'
import maxichrome from 'maxichrome'

export const fileTime = path => fs.statSync(path).mtime.getTime()

export const smooth = row => smoothish(row, { radius: 5 })

export const stringifyArray = xs => '[' + xs.map(x => JSON.stringify(x)).join(',\n') + ']'

export const colors = async n => await maxichrome(n, ['#f5f1ef', '#111'])

export default { fileTime, smooth, stringifyArray, colors }
