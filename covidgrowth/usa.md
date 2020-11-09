---
layout: page
permalink: /covidgrowth/usa/
title: COVID (USA)
---

<link rel="stylesheet" href="/covidgrowth/graph.css">
<script src="https://cdn.jsdelivr.net/npm/moment@2.24.0" defer></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0" defer></script>
<script src="/covidgrowth/usa-graph.min.js" defer></script>

* [animation](/covidgrowth/rankca) [graphs](/covidgrowth/ca) California
* [animation](/covidgrowth/rankusa) [graphs](/covidgrowth/usa) USA (by county)
* [animation](/covidgrowth/rankstate) [graphs](/covidgrowth/state) USA (by state)
* [animation](/covidgrowth/rankworld) [graphs](/covidgrowth/world) World

<section>
  <h4>Overview of death rates over time</h4>
  <img id="sparkSpinnerElement" src="/img/spinner32.gif">

  <h4>Details of the death rates</h4>
  <img id="detailsSpinnerElement" src="/img/spinner32.gif">

  <h4>Death rates superimposed</h4>
  <img id="superimposedSpinnerElement" src="/img/spinner32.gif">
</section>

The graphs above show the how many times higher the daily mortality rate is compared to the expected normal rate (using a very rough approximation for the normal rate: that one 1/79th of the population dies every year, evenly spread throughout the year).

Source: [Center for Systems Science and Engineering (CSSE) at Johns Hopkins University][1],
updated at <span id="updateTimeElement"></span>, showing all counties with at least <span id="minTotalDeathsElement"></span> total deaths and where daily smoothed mortality multiplier exceeded <span id="minMortalityMultiplierElement"></span>.

[1]: https://github.com/CSSEGISandData/COVID-19
