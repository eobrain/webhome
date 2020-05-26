---
layout: page
permalink: /covidgrowth/usa/
title: COVID (USA)
---

<script src="https://cdn.jsdelivr.net/npm/moment@2.24.0" defer></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0" defer></script>
<script src="/covidgrowth/data_us.js" defer></script>
<script src="/covidgrowth/usa.js" defer></script>

Per-Capita COVID-19 Death Rates

**USA** (by county), [USA](/covidgrowth/state)  (by state), [World](/covidgrowth/world) 

The first graph below shows all the high-death counties superimposed, followed by one graph per county, all at the same scale.

<section>
  <img id="spinnerElement" src="/img/spinner32.gif">
</section>

The graphs above show the annualized mortality rates of the COVID deaths, so for example a value of 1% is the percentage of the county's population that would die of COVID if that daily death rate were to be sustained for a year.


Source: [Center for Systems Science and Engineering (CSSE) at Johns Hopkins University][1],
updated at <span id="updateTimeElement"></span>, showing all counties with at least <span id="minTotalDeathsElement"></span> total deaths.

[1]: https://github.com/CSSEGISandData/COVID-19
