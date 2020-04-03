const XLSX = require('xlsx')

const MIN_DEATHS = 10
const MIN_POINTS = 6

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
  throw new Error(`Usage:\n\t${process.argv[0]} ${process.argv[1]} xlsxFile jsFile`)
}

const workbook = XLSX.readFile(inPath)
const sheet = workbook.Sheets[workbook.SheetNames[0]]

const columnIndex = {}
const rowIndex = {}

const data = {
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
  if (!deaths || deaths < MIN_DEATHS || geoId === 'CN' || geoId.length !== 2) {
    return
  }
  add(countriesAndTerritories, dateRep, deaths / popData2018)
})

data.rows.sort((a, b) => a[0] - b[0])

data.rows = transpose(data.rows)

const threshold = x => x > 1 ? x : null

const n = data.rows[0].length
data.rows = data.rows.map((row, i) => {
  if (i === 0) {
    return row
  }
  const outRow = [threshold(row[0]), threshold(row[1])]
  for (let j = 1; j < n - 1; ++j) {
    const [a, b, c, d, e] = [row[j - 2], row[j - 1], row[j], row[j + 1], row[j + 2]]
    let value = c
    if (a && b && c && d && e) {
      value = (a + b + c + d + e) / 5
    } else if (b && c && d) {
      value = (b + c + d) / 3
    } else if (a && b && !c && d && e) {
      value = (a + b + d + e) / 4
    } else if (b && !c && d) {
      value = (b + d) / 2
    }
    outRow.push(threshold(value))
  }
  outRow.push(row[n - 1])
  return outRow
})
const counts = data.rows.map(row => row.map(x => !!x).reduce((acc, x) => acc + x))
const filter = (x, i) => counts[i] >= MIN_POINTS
data.columns = data.columns.filter(filter)
data.rows = data.rows.filter(filter)
/* data.rows = data.rows.map((row, i) => {
  if (i === 0) {
    return row
  }
  const outRow = [null]
  for (let j = 1; j < row.length; ++j) {
    outRow.push(row[j - 1] ? row[j] - row[j - 1] : null)
  }
  return outRow
}) */
data.rows = transpose(data.rows)
data.columns = data.columns.map(s => s.replace(/_/g, ' '))

// console.log(`const DATA=${JSON.stringify(data)}`)
console.log('const DATA={')
console.log(`columns:${JSON.stringify(data.columns)},`)
console.log('rows:[')
for (const row of data.rows) {
  // console.log(`${JSON.stringify(Array.from(row).map(cell => cell || 0))},`)
  console.log(`${JSON.stringify(row)},`)
}
console.log(']')
console.log('}')
