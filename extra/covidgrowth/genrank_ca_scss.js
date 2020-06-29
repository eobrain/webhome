import { order, minDay, dayCount, colors, smoothedCountyData } from './web/data_ca.js'
import { maximum } from './web/graph.js'
import passprint from 'passprint'

const pp = passprint.pp

const DAY_MS = 24 * 60 * 60 * 1000
const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))

const max = maximum(order.map(name => maximum(smoothedCountyData[name])))
const n = order.length
const T = smoothedCountyData[order[0]].length

console.log(`---
---

#bars {
  height: ${5 * n}vmin;
}
`)

const orderings = []
for (let t = 0; t < T; ++t) {
  const sorted = [...Array(n)].map((_, i) => i).sort((a, b) =>
    smoothedCountyData[order[b]][t] - smoothedCountyData[order[a]][t])
  const ordering = [...Array(n)].map((_, i) => sorted.findIndex(x => x === i))
  orderings.push(pp(ordering))
}

const quant = x => Math.max(0, Math.round(x * 100) / 100)

order.forEach((name, i) => {
  console.log(`/* ${name} */`)
  console.log(`@keyframes k${i} {`)
  const data = smoothedCountyData[name]
  data.forEach((x, t) => {
    const position = orderings[t][i]
    console.log(`${100 * t / (T - 1)}%{top:${position * 5}vmin;width:${quant(100 * (x - 1) / (max - 1))}%;}`)
  })
  console.log('}')
})

colors.forEach((color, i) => {
  console.log(`#i${i}{animation-name: k${i};background-color:${color}}`)
})
dates.forEach((date, t) => {
  console.log(`@keyframes t${t} {
    0%{opacity: 0;}
    ${100 * (t - 1) / (T - 1)}%{opacity: 0;}
    ${100 * t / (T - 1)}%{opacity: 1;}
    ${100 * (t + 1) / (T - 1)}%{opacity: 0;}
    100%{opacity: 0;}
  }
  #t${t} {animation-name: t${t};opacity: 0;}
  `)
})
