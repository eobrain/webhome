import { colors, smoothedStateData } from './web/data_state.js'

const stateCodes = Object.keys(smoothedStateData)

console.log(`---
---

.post-content > div {
    position: relative;
    height: 60vmin;
}

.post-content > div > div {
    position: absolute;
    height: 5vmin;
    width: 50%;
    animation-timing-function: linear;
    animation-duration: 10s;
    animation-iteration-count: infinite;
    background-color: red;
}
`)

stateCodes.forEach((code, i) => {
  console.log(`@keyframes k${i} {`)
  const data = smoothedStateData[code]
  const n = data.length
  data.forEach((x, j) => {
    console.log(`${100 * j / n}%{top:${i * 5}vmin;width:${(x - 1) * 50}%}`)
  })
  console.log('}')
})

colors.forEach((color, i) => {
  console.log(`#i${i}{animation-name: k${i};background-color:${color}}`)
})
