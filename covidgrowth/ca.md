---
layout: page
permalink: /covidgrowth/ca/
title: COVID (California)
---

<link rel="stylesheet" href="/covidgrowth/graph.css">
<script src="https://cdn.jsdelivr.net/npm/moment@2.24.0" defer></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0" defer></script>
<script src="/covidgrowth/ca.min.js" defer></script>

**California**, [USA](/covidgrowth/usa) (by county), [USA](/covidgrowth/state)  (by state), [World](/covidgrowth/world) 

### Per-Capita COVID-19 Death Rates

<section>
  <img id="spinnerElement" src="/img/spinner32.gif">
</section>

The graphs above show the annualized mortality rates of the COVID deaths, so for example a value of 1% is the percentage of the county's population that would die of COVID if that daily death rate were to be sustained for a year.


Source: [Center for Systems Science and Engineering (CSSE) at Johns Hopkins University][1],
updated at <span id="updateTimeElement"></span>, showing all counties with at least <span id="minTotalDeathsElement"></span> total deaths and where daily smoothed mortality rate exceeded <span id="minMortalityRateElement"></span>% annualized.

[1]: https://github.com/CSSEGISandData/COVID-19
