const fs = require('fs')
const maxichrome = require('maxichrome')
const Papa = require('papaparse')
const { fileTime } = require('./common.js')
const smoothish = require('smoothish')
const STATE_CODE = require('./statecode.js')

const MIN_DEATHS_PER_COUNTY = 500

const [,, csvFilePath, outPath] = process.argv
if (!csvFilePath && !outPath) {
  throw new Error(`Usage:\n\t${process.argv[0]} ${process.argv[1]} csvFile jsFile`)
}

// const tee = x => { console.warn(x); return x }

const parse = callback => new Promise(resolve => {
  const csvFile = fs.readFileSync(csvFilePath)
  const csvData = csvFile.toString()

  Papa.parse(csvData, {
    header: true,
    transformHeader: header => header.trim(),
    step: result => callback(result.data),
    complete: results => resolve()
  })
})

const DAY_MS = 24 * 60 * 60 * 1000

const isDate = s => s.match(/[0-9]+\/[0-9]+\/[0-9]+/)
const toTimeMs = s => {
  const [month, day, year] = s.split('/')
  return Date.UTC(+year + 2000, month - 1, +day)
}

;(async () => {
  let minTimeMs = Infinity
  let maxTimeMs = -Infinity
  await parse(record => {
    for (const key in record) {
      if (isDate(key)) {
        const ms = toTimeMs(key)
        minTimeMs = Math.min(minTimeMs, ms)
        maxTimeMs = Math.max(maxTimeMs, ms)
      }
    }
  })
  const minDay = minTimeMs / DAY_MS
  const maxDay = maxTimeMs / DAY_MS
  const countyData = []

  console.log('const DATA_US = {')
  console.log(`updateTime:${fileTime(csvFilePath)},`)
  console.log(`minDay:${minDay},`)
  console.log(`dayCount:${maxDay - minDay + 1},`)
  console.log('countyData:{')
  let seriesCount = 0
  await parse(record => {
    const { Admin2, Province_State, Population } = record
    const state = STATE_CODE[Province_State] || Province_State
    const population = +Population
    if (!population) {
      return
    }
    const county = `${Admin2} ${state}`.trim()
    const cumulative = []
    for (const key in record) {
      if (isDate(key)) {
        const dayIndex = toTimeMs(key) / DAY_MS - minDay
        cumulative[dayIndex] = record[key]
      }
    }
    if (+cumulative[cumulative.length - 1] < MIN_DEATHS_PER_COUNTY) {
      return
    }
    let prev = 0
    const daily = cumulative.map(c => {
      const result = (c - prev) * 365 * 100 / population // Annualized percent mortality
      prev = c
      return result
    })
    console.log(`"${county}":[${daily.join()}],`)
    countyData[county] = daily
    ++seriesCount
  })
  console.log('},')
  console.log('smoothedCountyData:{')
  for (const county in countyData) {
    const smoothed = smoothish(countyData[county], { radius: 3 })
    console.log(`"${county}":[${smoothed.join()}],`)
  }
  console.log('},')
  console.log(`colors:${JSON.stringify(await maxichrome(seriesCount, ['white', 'black']))},`)
  console.log('}')
})()
