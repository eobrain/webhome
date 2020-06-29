import { order, minDay, dayCount } from './web/data_ca.js'

const DAY_MS = 24 * 60 * 60 * 1000
const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))

console.log(`---
layout: page
permalink: /covidgrowth/rankca/
title: COVID California State Ranking
---

<link rel="stylesheet" href="/css/rank.css">
<link rel="stylesheet" href="/css/rankca.css">

<div id="dates">
`)

dates.forEach((date, t) => {
  console.log(`<div id="t${t}">${date.toLocaleDateString()}</div>`)
})

console.log(`
</div>
<div id="bars">
`)

order.forEach((name, i) => {
  console.log(`<div id="i${i}">${name}</div>`)
})

console.log(`
</div>
`)
