import { maximum } from './web/graph.js'
// import passprint from 'passprint'
// const pp = passprint.pp

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
  height: ${5 * n}vmin;
}
`)

  const orderings = []
  for (let t = 0; t < T; ++t) {
    const sorted = [...Array(n)].map((_, i) => i).sort((a, b) =>
      smoothedData[keys[b]][t] - smoothedData[keys[a]][t])
    const ordering = [...Array(n)].map((_, i) => sorted.findIndex(x => x === i))
    orderings.push(ordering)
  }

  const quant = x => Math.max(0, Math.round(x * 100) / 100)
  const keyFrame = (percent, t, position, x) =>
  `${percent}%{top:${position * 5}vmin;width:${quant(100 * (x - 1) / (max - 1))}%;}`

  keys.forEach((name, i) => {
    console.log(`/* ${name} */`)
    console.log(`@keyframes k${i} {`)
    const data = smoothedData[name]
    data.forEach((x, t) => {
      const position = orderings[t][i]
      // console.log(`${100 * t / (T - 1)}%{top:${position * 5}vmin;width:${quant(100 * (x - 1) / (max - 1))}%;}`)
      console.log(keyFrame(ANIMATION_PERCENT * t / (T - 1), t, position, x))
    })
    console.log(keyFrame(100, T - 1, orderings[T - 1][i], data[T - 1]))
    console.log('}')
  })

  colors.forEach((color, i) => {
    console.log(`#i${i}{animation-name: k${i};background-color:${color}}`)
  })
  dates.forEach((date, t) => {
    console.log(`@keyframes t${t} {
    0%{opacity: 0;}
    ${ANIMATION_PERCENT * (t - 1) / (T - 1)}%{opacity: 0;}
    ${ANIMATION_PERCENT * t / (T - 1)}%{opacity: 1;}
    ${ANIMATION_PERCENT * (t + 1) / (T - 1)}%{opacity: ${t === T - 1 ? 1 : 0};}
    100%{opacity: ${t === T - 1 ? 1 : 0};}
  }
  #t${t} {animation-name: t${t};opacity: 0;}
  `)
  })
}
