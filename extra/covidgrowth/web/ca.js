import { Graph, maximum, roundUp } from './graph.js'
import {
  updateTime,
  minTotalDeaths,
  minMortalityRate,
  minDay,
  dayCount,
  smoothedCountyData,
  countyData,
  colors
} from './data_ca.js'

/* global
   minMortalityRateElement
   */

const { sparkline, individualGraph, overlayedGraph, finish } = Graph(colors)

const DAY_MS = 24 * 60 * 60 * 1000

const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))
const countyNames = Object.keys(countyData)
const max = roundUp(0.1)(maximum(countyNames.map(name => maximum(smoothedCountyData[name]))))

const toPoints = (series, _dates) => series.map((y, i) => ({ t: _dates[i], y }))// .filter(p => p.y)

const stripState = s => s.slice(0, s.length - 3)

countyNames.forEach((name, i) => {
  sparkline(i, stripState(name), max,
    toPoints(smoothedCountyData[name], dates))
})

countyNames.forEach((name, i) => {
  individualGraph(i, stripState(name), stripState(name), max,
    toPoints(smoothedCountyData[name], dates),
    toPoints(countyData[name], dates))
})

overlayedGraph(countyNames, max,
  i => stripState(countyNames[i]),
  name => toPoints(smoothedCountyData[name], dates))

finish(updateTime, minTotalDeaths)

minMortalityRateElement.innerHTML = minMortalityRate
