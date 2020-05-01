/* global DATA Chart
   articleElement */

// Credit https://stackoverflow.com/a/46099731/978525
const DAYS_BEFORE_EPOCH = 70 * 365 + 19
const HOUR = 60 * 60 * 1000
const excelDate2js = excelDate =>
  new Date(Math.round((excelDate - DAYS_BEFORE_EPOCH) * 24 * HOUR) + 12 * HOUR)
const excelDates = DATA.rows[0]
const serieses = DATA.rows.slice(1)
const smoothedSerieses = DATA.smoothedRows.slice(1)
const colors = DATA.colors

const dates = excelDates.map(x => excelDate2js(x))
const labels = DATA.columns.slice(1)

const maximum = (xs) => xs.reduce((acc, x) => Math.max(acc, x))

const roundUp = x => 10 * (Math.ceil(x / 10))
const max = roundUp(maximum(serieses.map(series => maximum(series))))

const drawGraph = datasets => {
  const canvasElement = document.createElement('CANVAS')
  articleElement.appendChild(canvasElement)
  const ctx = canvasElement.getContext('2d')

  return new Chart(ctx, {
    type: 'bar',
    data: { datasets },
    options: {
      aspectRatio: 1,
      legend: {
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'week'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'deaths per million per day'
          },
          ticks: {
            max
          }
        }]
      }
    }
  })
}

const toPoints = (y, i) => ({ t: dates[i], y })

drawGraph(smoothedSerieses.map((row, i) => ({
  type: 'line',
  label: labels[i],
  backgroundColor: colors[i] + '40',
  borderColor: colors[i],
  pointRadius: 0,
  borderWidth: 2,
  data: row.map(toPoints)
})))
serieses.forEach((series, i) => {
  drawGraph([{
    type: 'line',
    label: '5-day moving average',
    backgroundColor: 'transparent',
    borderColor: 'black',
    pointRadius: 0,
    borderWidth: 2,
    data: smoothedSerieses[i].map(toPoints)
  }, {
    label: labels[i],
    backgroundColor: colors[i],
    borderColor: colors[i],
    data: series.map(toPoints)
  }])
})
