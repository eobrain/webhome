import { fullNames, minDay, dayCount, updateTime, minTotalDeaths } from './web/data_state.js'
import generate from './genrank_md.js'

const stateCodes = Object.keys(fullNames)
const order = stateCodes.map(code => fullNames[code])

generate({
  whichShort: 'state',
  whichLong: 'USA by State',
  units: 'states',
  order,
  labels: order,
  minDay,
  dayCount,
  updateTime,
  minTotalDeaths,
  dataSource: '[Center for Systems Science and Engineering (CSSE) at Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19)'
})
