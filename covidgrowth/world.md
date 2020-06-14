---
layout: page
permalink: /covidgrowth/world/
title: COVID (World)
---

<link rel="stylesheet" href="/covidgrowth/graph.css">
<script src="https://cdn.jsdelivr.net/npm/moment@2.24.0" defer></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0" defer></script>
<script src="/covidgrowth/world.min.js" defer></script>

### Per-Capita COVID-19 Death Rates

[California](/covidgrowth/ca), [USA](/covidgrowth/usa)  (by county), [USA](/covidgrowth/state)  (by state), **World**

<section>
  <img id="spinnerElement" src="/img/spinner32.gif">
</section>

The graphs above show the how many times higher the daily mortality rate is compared to the expected normal rate (using a very rough approximation for the normal rate: that one 1/71th of the population dies every year, evenly spread throughout the year).

Source: [European Centre for Disease Prevention and Control][1],
updated at <span id="updateTimeElement"></span>, showing all days with at least <span id="minTotalDeathsElement"></span> deaths in countries where the daily smoothed mortality multiplier exceeded <span id="minMortalityMultiplierElement"></span>, and where there are at least <span id="minPointsElement"></span> data points.


[1]: https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide
