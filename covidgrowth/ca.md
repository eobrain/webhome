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
  <table id="barChartsElement"></table>
  <img id="spinnerElement" src="/img/spinner32.gif">
</section>

The graphs above show the how many times higher the daily mortality rate is compared to the expected normal rate (using a very rough approximation for the normal rate: that one 1/79th of the population dies every year, evenly spread throughout the year).

Source: [Center for Systems Science and Engineering (CSSE) at Johns Hopkins University][1],
updated at <span id="updateTimeElement"></span>, showing all counties with at least <span id="minTotalDeathsElement"></span> total deaths and where daily smoothed mortality multiplier exceeded <span id="minMortalityMultiplierElement"></span>.

[1]: https://github.com/CSSEGISandData/COVID-19
