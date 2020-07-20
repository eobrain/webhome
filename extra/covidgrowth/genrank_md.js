
export default ({
  whichShort,
  whichLong,
  units,
  order,
  labels,
  minDay,
  dayCount,
  updateTime,
  minTotalDeaths,
  minMortalityMultiplier,
  dataSource
}) => {
  const DAY_MS = 24 * 60 * 60 * 1000
  const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))

  console.log(`---
layout: page
permalink: /covidgrowth/rank${whichShort}/
title: COVID Ranking (${whichLong})
---

<link rel="stylesheet" href="/covidgrowth/graph.css">
<link rel="stylesheet" href="/css/rank.css">
<link rel="stylesheet" href="/css/rank${whichShort}.css">

* [animation](/covidgrowth/rankca) [graphs](/covidgrowth/ca) California
* [animation](/covidgrowth/rankusa) [graphs](/covidgrowth/usa) USA (by county)
* [animation](/covidgrowth/rankstate) [graphs](/covidgrowth/state) USA (by state)
* [animation](/covidgrowth/rankworld) [graphs](/covidgrowth/world) World

<div id="animation">
<input type="checkbox" id="pause-checkbox" />
<h4 id="dates">Daily per-capita death ranking on<br>`)

  dates.forEach((date, t) => {
    console.log(`<time id="t${t}" class="animated">${date.toLocaleDateString()}</time>`)
  })

  console.log(`
  <a href="javascript:location=location.href.replace(/#.*$/,'')" id="restart" class="button animated">⏮️</a>
  <label for="pause-checkbox" id="pause" class="button animated">⏸️</label>
  <span id="continue" class="button animated">▶️</span>
  </h4>
<div id="timebar" class="animated"></div>
<div id="bars">
`)

  labels.forEach((_, i) => {
    console.log(`<input type="checkbox" id="c${i}" />`)
  })
  labels.forEach((label, i) => {
    console.log(`<label class="animated" for="c${i}" id="i${i}">${label}</label>`)
  })
  console.log(`
</div>
</div>

The above ranks the per-capita  mortality rate.

Source: ${dataSource},
updated at ${new Date(updateTime).toLocaleString()}, showing all ${units} with at least ${minTotalDeaths} total deaths`)
  if (minMortalityMultiplier && minMortalityMultiplier > 1) {
    console.log(`
and where daily smoothed mortality multiplier exceeded ${minMortalityMultiplier}.
`)
  }
}
