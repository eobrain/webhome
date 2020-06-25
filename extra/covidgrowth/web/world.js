import {
  updateTime,
  minTotalDeaths,
  minMortalityMultiplier,
  minPoints,
  columns,
  geoIds,
  colors,
  rows,
  smoothedRows
} from './data_world.js'
import { Graph, maximum, roundUp, last } from './graph.js'
// import { pp } from './passprint.js'

/* global
   minMortalityMultiplierElement
   minPointsElement
   */

const HOUR_MS = 60 * 60 * 1000
const hour2js = hour => new Date(hour * HOUR_MS)
const hours = rows[0]
const smoothedExcelDates = smoothedRows[0]
const serieses = rows.slice(1)
const smoothedSerieses = smoothedRows.slice(1)

const dates = hours.map(x => hour2js(x))
const smoothedDates = smoothedExcelDates.map(x => hour2js(x))
const labels = columns.slice(1)
const countryCodes = geoIds.slice(1)

const max = roundUp(0.25)(maximum(smoothedSerieses.map(series => maximum(series))))
// const maxToday = maximum(smoothedSerieses.map(series => last(series)))

const { animation, sparkline, individualGraph, overlayedGraph, finish } = Graph(colors)

const toPoints = (series, _dates) => series.map((y, i) => ({ t: _dates[i], y })).filter(p => !!p)

const iOfName = {}
countryCodes.forEach((name, i) => {
  iOfName[name] = i
})

animation(countryCodes, max,
  i => labels[i],
  name => toPoints(smoothedSerieses[iOfName[name]], smoothedDates),
  i => smoothedDates[i])

serieses.forEach((series, i) => {
  const points = toPoints(smoothedSerieses[i], smoothedDates)
  // barChartRow(i, countryCodes[i], maxToday, points)
  sparkline(i, countryCodes[i], max, points)
})

serieses.forEach((series, i) => {
  individualGraph(i, countryCodes[i], labels[i], max,
    toPoints(smoothedSerieses[i], smoothedDates),
    toPoints(series, dates))
})

overlayedGraph(smoothedSerieses, max,
  i => countryCodes[i],
  row => toPoints(row, smoothedDates))

finish(updateTime, minTotalDeaths)

minMortalityMultiplierElement.innerHTML = minMortalityMultiplier
minPointsElement.innerHTML = minPoints
