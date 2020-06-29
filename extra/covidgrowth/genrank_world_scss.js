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
import generate from './genrank_scss.js'

const stateCodes = Object.keys(fullNames)
const order = stateCodes.map(code => fullNames[code])

generate(order, stateCodes, minDay, dayCount, colors, smoothedStateData)
