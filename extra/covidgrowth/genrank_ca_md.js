import { order } from './web/data_ca.js'

console.log(`---
layout: page
permalink: /covidgrowth/rankca/
title: COVID California State Ranking
---

<link rel="stylesheet" href="/css/rank.css">
<link rel="stylesheet" href="/css/rankca.css">

<div>
`)

order.forEach((name, i) => {
  console.log(`<div id="i${i}">${name}</div>`)
})

console.log(`
</div>
`)
