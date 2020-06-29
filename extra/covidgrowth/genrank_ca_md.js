import { order, minDay, dayCount, updateTime, minTotalDeaths, minMortalityMultiplier } from './web/data_ca.js'

const DAY_MS = 24 * 60 * 60 * 1000
const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))

console.log(`---
layout: page
permalink: /covidgrowth/rankca/
title: COVID Ranking (California)
---

<link rel="stylesheet" href="/css/rank.css">
<link rel="stylesheet" href="/css/rankca.css">

**[California](/covidgrowth/ca)**,
[USA](/covidgrowth/usa) (by county),
[USA](/covidgrowth/state)  (by state),
[World](/covidgrowth/world) 


<h4 id="dates">Daily death ranking on<br>`)

dates.forEach((date, t) => {
  console.log(`<time id="t${t}">${date.toLocaleDateString()}</time>`)
})

console.log(`
</h4>
<div id="bars">
`)

order.forEach((name, i) => {
  console.log(`<div id="i${i}">${name}</div>`)
})

console.log(`
</div>

The above ranks the per-capita  mortality rate.

Source: [Center for Systems Science and Engineering (CSSE) at Johns Hopkins University][1],
updated at ${new Date(updateTime).toLocaleString()}, showing all counties with at least ${minTotalDeaths} total deaths
and where daily smoothed mortality multiplier exceeded ${minMortalityMultiplier}.

[1]: https://github.com/CSSEGISandData/COVID-19

`)
