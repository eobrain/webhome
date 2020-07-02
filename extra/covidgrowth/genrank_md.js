
export default (whichShort, whichLong, order, labels, minDay, dayCount, updateTime, minTotalDeaths, minMortalityMultiplier) => {
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

* [[animation](/covidgrowth/rankca)] [[graphs](/covidgrowth/ca)] California
* [[animation](/covidgrowth/rankusa)] [[graphs](/covidgrowth/usa)] USA (by county)
* [[animation](/covidgrowth/rankstate)] [[graphs](/covidgrowth/state)] USA (by state)
* [[animation](/covidgrowth/rankworld)] [[graphs](/covidgrowth/world)] World

<div id="animation">
<input type="checkbox" id="pause-checkbox" />
<label for="pause-checkbox" id="pause" class="button">⏸️</label>
<span id="continue" class="button">▶️</span>
<h4 id="dates">Daily per-capita death ranking on<br>`)

  dates.forEach((date, t) => {
    console.log(`<time id="t${t}">${date.toLocaleDateString()}</time>`)
  })

  console.log(`
</h4>
<div id="bars">
`)

  labels.forEach((_, i) => {
    console.log(`<input type="checkbox" id="c${i}" />`)
  })
  labels.forEach((label, i) => {
    console.log(`<label for="c${i}" id="i${i}">${label}</label>`)
  })
  console.log(`
</div>
</div>

The above ranks the per-capita  mortality rate.

Source: [Center for Systems Science and Engineering (CSSE) at Johns Hopkins University][1],
updated at ${new Date(updateTime).toLocaleString()}, showing all counties with at least ${minTotalDeaths} total deaths
and where daily smoothed mortality multiplier exceeded ${minMortalityMultiplier}.

[1]: https://github.com/CSSEGISandData/COVID-19

`)
}
