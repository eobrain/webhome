import {
  updateTime,
  minTotalDeaths,
  minMortalityRate,
  minPoints,
  columns,
  geoIds,
  colors,
  rows,
  smoothedRows
} from './data_world.js'
import { Graph, maximum, roundUp } from './graph.js'

/* global
   minMortalityRateElement
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

const max = roundUp(0.1)(maximum(smoothedSerieses.map(series => maximum(series))))

const { sparkline, individualGraph, overlayedGraph, finish } = Graph(colors)

const toPoints = (series, _dates) => series.map((y, i) => ({ t: _dates[i], y })).filter(p => !!p)

serieses.forEach((series, i) => {
  sparkline(i, countryCodes[i], max,
    toPoints(smoothedSerieses[i], smoothedDates))
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

minMortalityRateElement.innerHTML = minMortalityRate
minPointsElement.innerHTML = minPoints
