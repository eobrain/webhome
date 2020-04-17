/* global DATA, Chart, culori */

const rgb = culori.formatter('rgb')

const makeArray = n => x => [...Array(n)].map((_, i) => x(i))

const grays = culori.interpolate(['#f00', '#0f8', '#00f'], 'lab')
const colors = makeArray(DATA.rows.length)(i => grays(i / (DATA.rows.length - 1))).map(lab => rgb(lab))

const ctx = document.getElementById('chart').getContext('2d')

// Credit https://stackoverflow.com/a/46099731/978525
const DAYS_BEFORE_EPOCH = 70 * 365 + 19
const HOUR = 60 * 60 * 1000
const excelDate2js = excelDate =>
  new Date(Math.round((excelDate - DAYS_BEFORE_EPOCH) * 24 * HOUR) + 12 * HOUR)

new Chart(ctx, {
  type: 'line',

  // The data for our dataset
  data: {
    labels: DATA.rows[0].map(x => excelDate2js(x).toLocaleDateString()),
    datasets: DATA.rows.slice(1).map((row, i) => ({
      label: DATA.columns[i],
      // backgroundColor: 'rgb(255, 99, 132)',
      borderColor: colors[i],
      data: row
    }))
  },

  // Configuration options go here
  options: {}
})
