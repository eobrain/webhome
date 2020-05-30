// const fs = require('fs')
const { records } = require('./raw-data.json')
const maxichrome = require('maxichrome')
const { fileTime, smooth, stringifyArray } = require('./common.js')

// const tee = x => {console.warn(x);return x}

/* const writeCsv = (path, rows) => {
  fs.writeFileSync(path, rows.map(row => row.join(',')).join('\n'))
} */

const MIN_DEATHS = 10
const MIN_MORTALITY_RATE = 0.05
const MIN_POINTS = 30

const makeArray = (n, x) => [...Array(n)].map((_, i) => x)

const transpose = rows => {
  const m = rows.length
  const n = rows[0].length
  const cols = []
  for (let j = 0; j < n; ++j) {
    const colJ = []
    for (let i = 0; i < m; ++i) {
      colJ[i] = rows[i][j]
    }
    cols.push(colJ)
  }
  return cols
}

const [,, inPath, outPath] = process.argv
if (!inPath && !outPath) {
  throw new Error(`Usage:\n\t${process.argv[0]} ${process.argv[1]} jsonFile jsFile`)
}

const columnIndex = {}
const rowIndex = {}

const data = {
  updateTime: fileTime(inPath),
  columns: ['Date'],
  rows: []
}

const addCol = (countriesAndTerritories) => {
  let j = columnIndex[countriesAndTerritories]
  if (!j) {
    j = data.columns.length
    data.columns.push(countriesAndTerritories)
    columnIndex[countriesAndTerritories] = j
  }
}

const HOUR_MS = 60 * 60 * 1000

const add = (countriesAndTerritories, dateRep, value) => {
  const [day, month, year] = dateRep.split('/')
  const date = new Date(+year, month - 1, +day).getTime() / HOUR_MS
  const j = columnIndex[countriesAndTerritories]
  let i = rowIndex[date]
  if (!i && i !== 0) {
    i = data.rows.length
    const row = makeArray(data.columns.length, undefined)
    row[0] = date
    data.rows.push(row)
    rowIndex[date] = i
  }
  data.rows[i][j] = 365 * 100 * value // Annualized percent mortality
}

records.forEach(row => {
  const {
    deaths,
    countriesAndTerritories,
    geoId
  } = row
  if (!deaths || geoId.length !== 2) {
    return
  }
  addCol(countriesAndTerritories)
})
records.forEach(row => {
  const {
    dateRep,
    deaths,
    countriesAndTerritories,
    geoId,
    popData2018
  } = row
  if (!deaths || deaths < MIN_DEATHS || geoId.length !== 2) {
    return
  }
  add(countriesAndTerritories, dateRep, deaths / popData2018)
})

data.rows.sort((a, b) => a[0] - b[0])

// writeCsv('raw.csv', [data.columns, ...data.rows])

let timeSeriesRows = transpose(data.rows)

let smoothedTimeSeriesRows = timeSeriesRows.map((row, i) => {
  if (i === 0) {
    return row
  }
  return smooth(row)
})
const countsPerCountry = timeSeriesRows.map(row => row.map(x => !!x).reduce((acc, x) => acc + x))
const maxPerCountry = smoothedTimeSeriesRows.map(row => row.map(x => x || 0).reduce((acc, x) => Math.max(acc, x)))
const filter = (x, i) => countsPerCountry[i] >= MIN_POINTS && maxPerCountry[i] >= MIN_MORTALITY_RATE
data.columns = data.columns.filter(filter)
timeSeriesRows = timeSeriesRows.filter(filter)
smoothedTimeSeriesRows = smoothedTimeSeriesRows.filter(filter)
data.rows = transpose(transpose(timeSeriesRows).filter(row => row.slice(1).some(x => x)))
data.smoothedRows = transpose(transpose(smoothedTimeSeriesRows).filter(row => row.slice(1).some(x => x)))
data.columns = data.columns.map(s => s.replace(/_/g, ' '))

const countReducer = (acc, x) => acc + !!x
data.rows = data.rows.filter(row => row.slice(1).reduce(countReducer, 0) > 1)

// writeCsv('smooth.csv', [data.columns, ...data.rows])

;(async () => {
  console.log('const DATA={')
  console.log(`updateTime:${data.updateTime},`)
  console.log(`minDeaths:${MIN_DEATHS},`)
  console.log(`minMortalityRate:${MIN_MORTALITY_RATE},`)
  console.log(`minPoints:${MIN_POINTS},`)
  console.log(`columns:${stringifyArray(data.columns)},`)
  console.log(`colors:${stringifyArray(await maxichrome(data.columns.length - 1, ['white', 'black']))},`)
  console.log('rows:[')
  for (const row of data.rows) {
    console.log(`${stringifyArray(row)},`)
  }
  console.log('],')
  console.log('smoothedRows:[')
  for (const row of data.smoothedRows) {
    console.log(`${stringifyArray(row)},`)
  }
  console.log(']')
  console.log('}')
})()
