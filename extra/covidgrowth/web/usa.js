import { Graph, maximum, roundUp } from './graph.js'
import {
  updateTime,
  minTotalDeaths,
  minMortalityMultiplier,
  minDay,
  dayCount,
  smoothedCountyData,
  countyData,
  colors
} from './data_usa.js'

/* global
   minMortalityMultiplierElement
   */

const { animation, sparkline, individualGraph, overlayedGraph, finish } = Graph(colors)

const DAY_MS = 24 * 60 * 60 * 1000

const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))
const countyNames = Object.keys(countyData)
const max = roundUp(0.1)(maximum(countyNames.map(name => maximum(smoothedCountyData[name]))))

const toPoints = (series, _dates) => series.map((y, i) => ({ t: _dates[i], y }))// .filter(p => p.y)

animation(countyNames, max,
  i => countyNames[i],
  name => toPoints(smoothedCountyData[name], dates),
  i => dates[i])

countyNames.forEach((name, i) => {
  const points = toPoints(smoothedCountyData[name], dates)
  sparkline(i, name, max, points)
})

countyNames.forEach((name, i) => {
  individualGraph(i, name, name, max,
    toPoints(smoothedCountyData[name], dates),
    toPoints(countyData[name], dates))
})

const lastTwo = s => s.slice(s.length - 2)

overlayedGraph(countyNames, max,
  i => lastTwo(countyNames[i]),
  name => toPoints(smoothedCountyData[name], dates))

finish(updateTime, minTotalDeaths)

minMortalityMultiplierElement.innerHTML = minMortalityMultiplier
