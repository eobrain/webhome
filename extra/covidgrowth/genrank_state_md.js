import { fullNames, minDay, dayCount, updateTime, minTotalDeaths } from './web/data_state.js'
import generate from './genrank_md.js'

const stateCodes = Object.keys(fullNames)
const order = stateCodes.map(code => fullNames[code])

generate('state', 'USA by State', order, minDay, dayCount, updateTime, minTotalDeaths)
