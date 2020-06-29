import { smoothedCountyData, minDay, dayCount, updateTime, minTotalDeaths, minMortalityMultiplier } from './web/data_usa.js'
import generate from './genrank_md.js'

const countyNames = Object.keys(smoothedCountyData)

generate('usa', 'USA by County', countyNames, minDay, dayCount, updateTime, minTotalDeaths, minMortalityMultiplier)
