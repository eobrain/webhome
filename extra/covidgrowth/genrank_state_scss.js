import { colors, smoothedStateData } from './web/data_state.js'
import passprint from 'passprint'

const pp = passprint.pp

const stateCodes = pp(Object.keys(smoothedStateData))

console.log(`---
---
`)

// const dataOf = t => i => smoothedStateData[stateCodes[i]][t]

const n = smoothedStateData[stateCodes[0]].length

const orderings = []
for (let t = 0; t < n; ++t) {
  // const dataOfT = dataOf(t)
  const sorted = [...Array(stateCodes.length)].map((_, i) => i).sort((a, b) =>
    smoothedStateData[stateCodes[b]][t] - smoothedStateData[stateCodes[a]][t])
  // const ordering = [...stateCodes)].sort((a, b) => )
  const ordering = [...Array(stateCodes.length)].map((_, i) => sorted.findIndex(x => x === i))
  orderings.push(pp(ordering))
}

const quant = x => Math.round(x * 100) / 100

stateCodes.forEach((code, i) => {
  console.log(`@keyframes k${i} {`)
  const data = smoothedStateData[code]
  data.forEach((x, t) => {
    const position = orderings[t][i]
    console.log(`${100 * t / (n - 1)}%{top:${position * 5}vmin;width:${quant((x - 1) * 50)}%;}`)
  })
  console.log('}')
})

colors.forEach((color, i) => {
  console.log(`#i${i}{animation-name: k${i};background-color:${color}}`)
})
