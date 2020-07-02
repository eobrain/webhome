import { maximum } from './web/graph.js'
// import passprint from 'passprint'
// const pp = passprint.pp

const BAR_STRIDE = 10

export default (order, keys, minDay, dayCount, colors, smoothedData) => {
  /** What percent of cycle is animation running before pausing. */
  const ANIMATION_PERCENT = 80

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
  const keyFrame = (percent, t, position, x) =>
  `${percent}%{top:${position * BAR_STRIDE}vmin;width:${quant(100 * (x - 1) / (max - 1))}%;}`

  const PAUSE_PERCENT = (100 - ANIMATION_PERCENT) / 2
  keys.forEach((name, i) => {
    console.log(`/* ${name} */`)
    console.log(`@keyframes k${i} {`)
    const data = smoothedData[name]
    console.log(keyFrame(0, T - 1, orderings[T - 1][i], data[T - 1]))
    console.log(keyFrame(PAUSE_PERCENT * 0.9, T - 1, orderings[T - 1][i], data[T - 1]))
    data.forEach((x, t) => {
      const position = orderings[t][i]
      console.log(keyFrame(PAUSE_PERCENT + ANIMATION_PERCENT * t / (T - 1), t, position, x))
    })
    console.log(keyFrame(100, T - 1, orderings[T - 1][i], data[T - 1]))
    console.log('}')
  })

  colors.forEach((color, i) => {
    console.log(`#i${i}{animation-name: k${i};background-color:${color}}`)
  })
  dates.forEach((date, t) => {
    console.log(`@keyframes t${t} {
    0%{opacity: ${t === T - 1 ? 1 : 0};}
    ${PAUSE_PERCENT * 0.9}%{opacity: ${t === T - 1 ? 1 : 0};}
    ${PAUSE_PERCENT}%{opacity: 0;}
    ${PAUSE_PERCENT + ANIMATION_PERCENT * (t - 1) / (T - 1)}%{opacity: 0;}
    ${PAUSE_PERCENT + ANIMATION_PERCENT * t / (T - 1)}%{opacity: 1;}
    ${PAUSE_PERCENT + ANIMATION_PERCENT * (t + 1) / (T - 1)}%{opacity: ${t === T - 1 ? 1 : 0};}
    100%{opacity: ${t === T - 1 ? 1 : 0};}
  }
  #t${t} {animation-name: t${t};opacity: 0;}
  `)
  })
}
