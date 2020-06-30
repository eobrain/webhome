import { order, minDay, dayCount, updateTime, minTotalDeaths, minMortalityMultiplier } from './web/data_ca.js'
import generate from './genrank_md.js'

generate('ca', 'California', order, order, minDay, dayCount, updateTime, minTotalDeaths, minMortalityMultiplier)
