import {
  columns,
  geoIds,
  colors,
  smoothedRows
} from './web/data_world.js'
import generate from './genrank_scss.js'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS
const hour2js = hour => new Date(hour * HOUR_MS)
const smoothedExcelDates = smoothedRows[0]
const smoothedSerieses = smoothedRows.slice(1)

const smoothedDates = smoothedExcelDates.map(x => hour2js(x))
const minDay = smoothedDates[0].getTime() / DAY_MS
const dayCount = smoothedDates.length
const labels = columns.slice(1)
const countryCodes = geoIds.slice(1)

const dataAsObject = {}
countryCodes.forEach((code, i) => {
  dataAsObject[code] = smoothedSerieses[i]
})

generate(labels, countryCodes, minDay, dayCount, colors, dataAsObject)
