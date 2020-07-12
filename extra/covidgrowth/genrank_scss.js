import { maximum } from './web/graph.js'
// import passprint from 'passprint'
// const pp = passprint.pp

const BAR_STRIDE = 10
const BOUNCY_EASE_OUT = 'cubic-bezier(0, 0, 0.6, 1.3)'

export default (order, keys, minDay, dayCount, colors, smoothedData) => {
  const DAY_MS = 24 * 60 * 60 * 1000
  const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))

  const max = maximum(keys.map(name => maximum(smoothedData[name])))
  const n = order.length
  const T = smoothedData[keys[0]].length

  console.log(`---
---

#bars {
  height: ${BAR_STRIDE * n}vmin;
}
`)

  const orderings = []
  for (let t = 0; t < T; ++t) {
    const sorted = [...Array(n)].map((_, i) => i).sort((a, b) =>
      smoothedData[keys[b]][t] - smoothedData[keys[a]][t])
    const ordering = [...Array(n)].map((_, i) => sorted.findIndex(x => x === i))
    orderings.push(ordering)
  }

  keys.forEach((name, i) => {
    console.log(`#c${i}:checked ~ label {mix-blend-mode:luminosity;font-weight:100}`)
    console.log(`#c${i}:checked ~ #i${i} {mix-blend-mode:normal;font-weight:900}`)
  })

  const quant = x => Math.max(0, Math.round(x * 100) / 100)
  const keyFramePosition = (percent, position) =>
  `${percent}%{top:${position * BAR_STRIDE}vmin;}`
  const keyFrameWidth = (percent, x) =>
  `${percent}%{width:${quant(100 * (x - 1) / (max - 1))}%;}`

  keys.forEach((name, i) => {
    console.log(`/* ${name} */`)
    console.log(`@keyframes p${i} {`)
    const data = smoothedData[name]
    data.forEach((_, t) => {
      const position = orderings[t][i]
      console.log(keyFramePosition(100 * t / (T - 1), position))
    })
    console.log('}')
  })

  keys.forEach((name, i) => {
    console.log(`/* ${name} */`)
    console.log(`@keyframes w${i} {`)
    const data = smoothedData[name]
    data.forEach((x, t) => {
      console.log(keyFrameWidth(100 * t / (T - 1), x))
    })
    console.log('}')
  })

  colors.forEach((color, i) => {
    console.log(`#i${i}{animation: p${i} ${BOUNCY_EASE_OUT}, w${i} linear;color:${color};background-color:${color}}`)
  })
  dates.forEach((date, t) => {
    console.log(`@keyframes t${t} {
      ${100 * (t - 1) / (T - 1)}%{opacity: 0;}
      ${100 * t / (T - 1)}%{opacity: 1;}
      ${100 * (t + 1) / (T - 1)}%{opacity: 0;}
    }
    #t${t} {animation-name: t${t};opacity: 0;}
  `)
  })
}
