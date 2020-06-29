import { order, minDay, dayCount, colors, smoothedCountyData } from './web/data_ca.js'
import generate from './genrank_scss.js'

generate(order, order, minDay, dayCount, colors, smoothedCountyData)
