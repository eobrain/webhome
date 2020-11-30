---
layout: page
permalink: /covidgrowth/cartogram/
title: COVID Death Cartogram (US)
---

<link rel="stylesheet" href="/covidgrowth/cartogram.css">
<script src="//d3js.org/d3.v4.min.js" defer></script>
<script src="/covidgrowth/state-cartogram.min.js" defer></script>

* [animation](/covidgrowth/rankca) [graphs](/covidgrowth/ca) California
* [animation](/covidgrowth/rankusa) [graphs](/covidgrowth/usa) USA (by county)
* [animation](/covidgrowth/rankstate) [graphs](/covidgrowth/state)  [cartogram](/covidgrowth/cartogram)  USA (by state)
* [animation](/covidgrowth/rankworld) [graphs](/covidgrowth/world) World

<div id="controls">
<input type="range" id="timeElement" name="speed" min="0">
</div>
<label for="runningElement">Running</label><input type="checkbox" id="runningElement" checked>
<figure id="figureElement"></figure>


This animation shows the deaths per day in each state.

Source: [Center for Systems Science and Engineering (CSSE) at Johns Hopkins University][1].

Code adapted from [Demers Cartogram][2] 

[1]: https://github.com/CSSEGISandData/COVID-19
[2]: https://bl.ocks.org/cmgiven/9d6bc46cf586738458c13dd2b5dadd84
