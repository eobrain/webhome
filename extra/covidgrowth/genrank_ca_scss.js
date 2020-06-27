import { colors, smoothedCountyData } from './web/data_ca.js'
import passprint from 'passprint'

const pp = passprint.pp

const names = pp(Object.keys(smoothedCountyData))

console.log(`---
---
`)

const n = smoothedCountyData[names[0]].length

const orderings = []
for (let t = 0; t < n; ++t) {
  const ordering = [...[...Array(names.length)].map((_, i) => i)].sort((a, b) =>
    smoothedCountyData[names[a]][t] - smoothedCountyData[names[b]][t])
  orderings.push(pp(ordering))
}

const quant = x => Math.round(x * 100) / 100

names.forEach((code, i) => {
  console.log(`/* ${code} */`)
  console.log(`@keyframes k${i} {`)
  const data = smoothedCountyData[code]
  data.forEach((x, t) => {
    const position = orderings[t][i]
    console.log(`${100 * t / (n - 1)}%{top:${position * 5}vmin;width:${quant((x - 1) * 50)}%;}`)
  })
  console.log('}')
})

colors.forEach((color, i) => {
  console.log(`#i${i}{animation-name: k${i};background-color:${color}}`)
})
