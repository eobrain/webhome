import { fullNames, colors, minDay, dayCount, smoothedStateData } from './web/data_state.js'

import generate from './genrank_scss.js'

const stateCodes = Object.keys(fullNames)
const order = stateCodes.map(code => fullNames[code])

generate(order, stateCodes, minDay, dayCount, colors, smoothedStateData)
