import { Graph, maximum, roundUp } from './graph.js'
import {
  dayCount,
  minDay,
  stateData,
  smoothedStateData,
  updateTime,
  minTotalDeaths,
  colors
} from './data_state.js'

const { sparkline, individualGraph, overlayedGraph, finish } = Graph(colors)

const DAY_MS = 24 * 60 * 60 * 1000

const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))
const stateNames = Object.keys(stateData)
const max = roundUp(0.1)(maximum(stateNames.map(name => maximum(smoothedStateData[name]))))

const toPoints = (series, _dates) => series.map((y, i) => ({ t: _dates[i], y }))// .filter(p => p.y)

stateNames.forEach((name, i) => {
  sparkline(i, name, max,
    toPoints(smoothedStateData[name], dates))
})

stateNames.forEach((name, i) => {
  individualGraph(i, name, name, max,
    toPoints(smoothedStateData[name], dates),
    toPoints(stateData[name], dates))
})

overlayedGraph(stateNames, max,
  i => stateNames[i],
  name => toPoints(smoothedStateData[name], dates))

finish(updateTime, minTotalDeaths)