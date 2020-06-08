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

[USA](/covidgrowth/usa)  (by county), [USA](/covidgrowth/state)  (by state), **World**

<section>
  <img id="spinnerElement" src="/img/spinner32.gif">
</section>

The graphs above show the annualized mortality rates of the COVID deaths, so for example a value of 1% is the percentage of the country's population that would die of COVID if that daily death rate were to be sustained for a year.

Source: [European Centre for Disease Prevention and Control][1],
updated at <span id="updateTimeElement"></span>, showing all days with at least <span id="minTotalDeathsElement"></span> deaths in countries where the daily smoothed mortality rate exceeded <span id="minMortalityRateElement"></span>% annualized, and where there are at least <span id="minPointsElement"></span> data points.


[1]: https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide
