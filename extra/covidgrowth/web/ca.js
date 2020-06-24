import { Graph, maxLast, maximum, roundUp } from './graph.js'
import {
  updateTime,
  minTotalDeaths,
  minMortalityMultiplier,
  minDay,
  dayCount,
  smoothedCountyData,
  countyData,
  order,
  colors
} from './data_ca.js'

/* global
   minMortalityMultiplierElement
   */

const { barChartRow, sparkline, individualGraph, overlayedGraph, finish } = Graph(colors)

const DAY_MS = 24 * 60 * 60 * 1000

const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))
const max = roundUp(0.25)(maximum(order.map(name => maximum(smoothedCountyData[name]))))
const maxToday = maxLast(order, smoothedCountyData)

const toPoints = (series, _dates) => series.map((y, i) => ({ t: _dates[i], y }))// .filter(p => p.y)

const stripState = s => s.slice(0, s.length - 3)

order.forEach((name, i) => {
  const shortName = stripState(name)
  const points = toPoints(smoothedCountyData[name], dates)
  barChartRow(i, shortName, maxToday, points)
  sparkline(i, shortName, max, points)
})

order.forEach((name, i) => {
  individualGraph(i, stripState(name), stripState(name), max,
    toPoints(smoothedCountyData[name], dates),
    toPoints(countyData[name], dates))
})

overlayedGraph(order, max,
  i => stripState(order[i]),
  name => toPoints(smoothedCountyData[name], dates))

finish(updateTime, minTotalDeaths)

minMortalityMultiplierElement.innerHTML = minMortalityMultiplier
