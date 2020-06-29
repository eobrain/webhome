import { minDay, dayCount, colors, smoothedCountyData } from './web/data_usa.js'
import generate from './genrank_scss.js'

const countyNames = Object.keys(smoothedCountyData)

generate(countyNames, countyNames, minDay, dayCount, colors, smoothedCountyData)
