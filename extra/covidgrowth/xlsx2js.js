const fs = require('fs')
const XLSX = require('xlsx')
const { fullSmooth } = require('smoothish')

const writeCsv = (path, rows) => {
  fs.writeFileSync(path, rows.map(row => row.join(',')).join('\n'))
}

const MIN_DEATHS = 10
const MIN_DEATHS_PER_MILLION = 1
const MIN_POINTS = 12

const makeArray = (n, x) => [...Array(n)].map((_, i) => x)

const fileTime = path => fs.statSync(path).mtime.getTime()

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
  throw new Error(`Usage:\n\t${process.argv[0]} ${process.argv[1]} xlsxFile jsFile`)
}

const workbook = XLSX.readFile(inPath)
const sheet = workbook.Sheets[workbook.SheetNames[0]]

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

const add = (countriesAndTerritories, dateRep, value) => {
  const j = columnIndex[countriesAndTerritories]
  let i = rowIndex[dateRep]
  if (!i && i !== 0) {
    i = data.rows.length
    const row = makeArray(data.columns.length, undefined)
    row[0] = dateRep
    data.rows.push(row)
    rowIndex[dateRep] = i
  }
  data.rows[i][j] = 1000000 * value
}

XLSX.utils.sheet_to_json(sheet).forEach(row => {
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
XLSX.utils.sheet_to_json(sheet).forEach(row => {
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

writeCsv('raw.csv', [data.columns, ...data.rows])

let timeSeriesRows = transpose(data.rows)

const threshold = x => x > MIN_DEATHS_PER_MILLION ? x : null

timeSeriesRows = timeSeriesRows.map((row, i) => {
  if (i === 0) {
    return row
  }
  return fullSmooth(row).map(x => threshold(x))
})
const countsPerCountry = timeSeriesRows.map(row => row.map(x => !!x).reduce((acc, x) => acc + x))
const filter = (x, i) => countsPerCountry[i] >= MIN_POINTS
data.columns = data.columns.filter(filter)
timeSeriesRows = timeSeriesRows.filter(filter)
data.rows = /*transpose( */timeSeriesRows // )
data.columns = data.columns.map(s => s.replace(/_/g, ' '))

const countReducer = (acc, x) => acc + !!x
data.rows = data.rows.filter(row => row.slice(1).reduce(countReducer, 0) > 1)

writeCsv('smooth.csv', [data.columns, ...data.rows])

// console.log(`const DATA=${JSON.stringify(data)}`)
console.log('const DATA={')
console.log(`updateTime:${data.updateTime},`)
console.log(`columns:${JSON.stringify(data.columns)},`)
console.log('rows:[')
for (const row of data.rows) {
  // console.log(`${JSON.stringify(Array.from(row).map(cell => cell || 0))},`)
  console.log(`${JSON.stringify(row)},`)
}
console.log(']')
console.log('}')
