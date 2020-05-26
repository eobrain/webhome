---
layout: page
permalink: /covidgrowth/state/
title: COVID (USA)
---

<script src="https://cdn.jsdelivr.net/npm/moment@2.24.0" defer></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0" defer></script>
<script src="/covidgrowth/data_state.js" defer></script>
<script src="/covidgrowth/state.js" defer></script>

Per-Capita COVID-19 Death Rates

[USA](/covidgrowth/usa) (by county), **USA**  (by state), [World](/covidgrowth/world) 

The first graph below shows all the states superimposed, followed by one graph per state, all at the same scale.

<nav id="navElement"></nav>
<section>
  <img id="spinnerElement" src="/img/spinner32.gif">
</section>


The graphs above show the annualized mortality rates of the COVID deaths, so for example a value of 1% is the percentage of the state's population that would die of COVID if that daily death rate were to be sustained for a year.


Source: [Center for Systems Science and Engineering (CSSE) at Johns Hopkins University][1],
updated at <span id="updateTimeElement"></span>, showing all states and territories with at least <span id="minTotalDeathsElement"></span> total deaths.

[1]: https://github.com/CSSEGISandData/COVID-19
