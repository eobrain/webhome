import { order, colors, smoothedCountyData } from './web/data_ca.js'
import passprint from 'passprint'

const pp = passprint.pp

console.log(`---
---
`)

const n = smoothedCountyData[order[0]].length

const orderings = []
for (let t = 0; t < n; ++t) {
  const sorted = [...Array(order.length)].map((_, i) => i).sort((a, b) =>
    smoothedCountyData[order[b]][t] - smoothedCountyData[order[a]][t])
  const ordering = [...Array(order.length)].map((_, i) => sorted.findIndex(x => x === i))
  orderings.push(pp(ordering))
}

const quant = x => Math.round(x * 100) / 100

order.forEach((name, i) => {
  console.log(`/* ${name} */`)
  console.log(`@keyframes k${i} {`)
  const data = smoothedCountyData[name]
  data.forEach((x, t) => {
    const position = orderings[t][i]
    console.log(`${100 * t / (n - 1)}%{top:${position * 5}vmin;width:${quant((x - 1) * 50)}%;}`)
  })
  console.log('}')
})

colors.forEach((color, i) => {
  console.log(`#i${i}{animation-name: k${i};background-color:${color}}`)
})
