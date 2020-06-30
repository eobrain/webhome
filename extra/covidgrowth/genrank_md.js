
export default (whichShort, whichLong, order, labels, minDay, dayCount, updateTime, minTotalDeaths, minMortalityMultiplier) => {
  const DAY_MS = 24 * 60 * 60 * 1000
  const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))

  console.log(`---
layout: page
permalink: /covidgrowth/rank${whichShort}/
title: COVID Ranking (${whichLong})
---

<link rel="stylesheet" href="/css/rank.css">
<link rel="stylesheet" href="/css/rank${whichShort}.css">

[California](/covidgrowth/rankca),
[USA](/covidgrowth/rankusa) (by county),
[USA](/covidgrowth/rankstate)  (by state),
[World](/covidgrowth/rankworld) 

See also [Detailed graphs for ${whichLong}](/covidgrowth/${whichShort})

<h4 id="dates">Daily per-capita death ranking on<br>`)

  dates.forEach((date, t) => {
    console.log(`<time id="t${t}">${date.toLocaleDateString()}</time>`)
  })

  console.log(`
</h4>
<div id="bars">
`)

  labels.forEach((label, i) => {
    console.log(`<div id="i${i}">${label}</div>`)
  })

  console.log(`
</div>

The above ranks the per-capita  mortality rate.

Source: [Center for Systems Science and Engineering (CSSE) at Johns Hopkins University][1],
updated at ${new Date(updateTime).toLocaleString()}, showing all counties with at least ${minTotalDeaths} total deaths
and where daily smoothed mortality multiplier exceeded ${minMortalityMultiplier}.

[1]: https://github.com/CSSEGISandData/COVID-19

`)
}
