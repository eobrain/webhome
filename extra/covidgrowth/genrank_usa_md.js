import { smoothedCountyData, minDay, dayCount, updateTime, minTotalDeaths, minMortalityMultiplier } from './web/data_usa.js'
import generate from './genrank_md.js'

const countyNames = Object.keys(smoothedCountyData)

generate({
  whichShort: 'usa',
  whichLong: 'USA by County',
  units: 'counties',
  order: countyNames,
  labels: countyNames,
  minDay,
  dayCount,
  updateTime,
  minTotalDeaths,
  minMortalityMultiplier,
  dataSource: '[Center for Systems Science and Engineering (CSSE) at Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19)'
})
