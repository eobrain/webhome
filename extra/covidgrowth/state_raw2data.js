const fs = require('fs')
const maxichrome = require('maxichrome')
const Papa = require('papaparse')
const { fileTime, smooth, stringifyArray } = require('./common.js')
const STATE_CODE = require('./statecode.js')

const MIN_DEATHS_PER_STATE = 20

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
  const stateCumulative = {}
  const statePopulations = {}

  await parse(record => {
    const { Province_State, Population } = record
    const population = Number(Population)
    const state = STATE_CODE[Province_State] || Province_State
    const cumulative = []
    for (const key in record) {
      if (isDate(key)) {
        const dayIndex = toTimeMs(key) / DAY_MS - minDay
        cumulative[dayIndex] = record[key]
      }
    }
    if (!statePopulations[state]) {
      statePopulations[state] = population
      stateCumulative[state] = cumulative.map(x => Number(x))
    } else {
      statePopulations[state] += population
      stateCumulative[state] = stateCumulative[state].map((x, i) => x + Number(cumulative[i]))
    }
  })

  const stateData = {}
  console.log('const DATA_STATE={')
  console.log(`updateTime:${fileTime(csvFilePath)},`)
  console.log(`minTotalDeaths:${MIN_DEATHS_PER_STATE},`)
  console.log(`minDay:${minDay},`)
  console.log(`dayCount:${maxDay - minDay + 1},`)
  console.log('stateData:{')
  let seriesCount = 0
  for (const state in statePopulations) {
    const population = Number(statePopulations[state])
    if (!population) {
      console.log(`// ${state} has no population`)
      continue
    }
    const cumulative = stateCumulative[state]
    if (+cumulative[cumulative.length - 1] < MIN_DEATHS_PER_STATE) {
      console.log(`// ${state} has only ${cumulative[cumulative.length - 1]} deaths`)
      continue
    }
    let prev = 0
    const daily = cumulative.map(c => {
      const result = (c - prev) * 365 * 100 / population // Annualized percent mortality
      prev = c
      return result
    })
    console.log(`"${state}":${stringifyArray(daily)},`)
    stateData[state] = daily
    ++seriesCount
  }
  console.log('},')
  console.log('smoothedStateData:{')
  for (const state in stateData) {
    const smoothed = smooth(stateData[state])
    console.log(`"${state}":${stringifyArray(smoothed)},`)
  }
  console.log('},')
  console.log(`colors:${stringifyArray(await maxichrome(seriesCount, ['white', 'black']))},`)
  console.log('}')
})()
