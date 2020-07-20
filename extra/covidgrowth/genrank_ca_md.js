import { order, minDay, dayCount, updateTime, minTotalDeaths, minMortalityMultiplier } from './web/data_ca.js'
import generate from './genrank_md.js'

generate({
  whichShort: 'ca',
  whichLong: 'California',
  units: 'counties',
  order,
  labels: order,
  minDay,
  dayCount,
  updateTime,
  minTotalDeaths,
  minMortalityMultiplier,
  dataSource: '[Center for Systems Science and Engineering (CSSE) at Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19)'
})
