import { fullNames } from './web/data_state.js'

const stateCodes = Object.keys(fullNames)

console.log(`---
layout: page
permalink: /covidgrowth/rankstate/
title: COVID State Ranking
---

<link rel="stylesheet" href="/css/rankstate.css">

<div>
`)

stateCodes.forEach((code, i) => {
  console.log(`<div id="i${i}">${fullNames[code]}</div>`)
})

console.log(`
</div>
`)
