import {
  columns,
  updateTime,
  minTotalDeaths,
  // minMortalityMultiplier,
  // minPoints,
  // columns,
  geoIds,
  // rows,
  smoothedRows
} from './web/data_world.js'
import generate from './genrank_md.js'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS
const hour2js = hour => new Date(hour * HOUR_MS)
const smoothedExcelDates = smoothedRows[0]

const smoothedDates = smoothedExcelDates.map(x => hour2js(x))
const minDay = smoothedDates[0].getTime() / DAY_MS
const dayCount = smoothedDates.length
const labels = columns.slice(1)
const countryCodes = geoIds.slice(1)

generate('world', 'World', countryCodes, labels, minDay, dayCount, updateTime, minTotalDeaths)