import fs from 'fs'
import Papa from 'papaparse'
import { fileTime, smooth, stringifyArray, colors } from './common.js'
import STATE_CODE from './statecode.js'

const MIN_DEATHS_PER_COUNTY = 44
const MIN_MORTALITY_MULTIPLIER = 1.8
const LIVE_EXPECTANCY = 78.54 // of the USA

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

  console.log('export const updateTime=', fileTime(csvFilePath))
  console.log()
  console.log('export const minTotalDeaths=', MIN_DEATHS_PER_COUNTY)
  console.log()
  console.log('export const minMortalityMultiplier=', MIN_MORTALITY_MULTIPLIER)
  console.log()
  console.log('export const minDay=', minDay)
  console.log()
  console.log('export const dayCount=', maxDay - minDay + 1)
  console.log()
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
    countyData[county] = cumulative.map(c => {
      const result = 1 + (c - prev) * LIVE_EXPECTANCY * 365 / population // multiplier over normal mortality
      prev = c
      return result
    })
  })
  console.log('export const smoothedCountyData={')
  let seriesCount = 0
  for (const county in countyData) {
    const smoothed = smooth(countyData[county])
    const max = smoothed.reduce((acc, x) => Math.max(acc, x))
    if (max < MIN_MORTALITY_MULTIPLIER) {
      delete countyData[county]
      continue
    }
    ++seriesCount
    console.log(`"${county}":${stringifyArray(smoothed)},`)
  }
  console.log('}')
  console.log()
  console.log('export const countyData={')
  for (const county in countyData) {
    console.log(`"${county}":${stringifyArray(countyData[county])},`)
  }
  console.log('}')
  console.log()
  console.log('export const colors=', stringifyArray(await colors(seriesCount)))
  console.log()
})()
