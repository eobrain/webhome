/* global DATA Chart
   articleElement
   updateTimeElement
   */

// Credit https://stackoverflow.com/a/46099731/978525
const DAYS_BEFORE_EPOCH = 70 * 365 + 19
const HOUR = 60 * 60 * 1000
const excelDate2js = excelDate =>
  new Date(Math.round((excelDate - DAYS_BEFORE_EPOCH) * 24 * HOUR) + 12 * HOUR)
const excelDates = DATA.rows[0]
const smoothedExcelDates = DATA.smoothedRows[0]
const serieses = DATA.rows.slice(1)
const smoothedSerieses = DATA.smoothedRows.slice(1)
const colors = DATA.colors

const dates = excelDates.map(x => excelDate2js(x))
const smoothedDates = smoothedExcelDates.map(x => excelDate2js(x))
const labels = DATA.columns.slice(1)

const maximum = (xs) => xs.reduce((acc, x) => Math.max(acc, x))

const roundUp = dx => x => dx * Math.ceil(x / dx)
const max = roundUp(0.1)(maximum(serieses.map(series => maximum(series))))
const borderWidth = 2

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
        position: 'bottom',
        labels: {
          fontSize: 10,
          boxWidth: borderWidth
        }
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
            labelString: 'annualized mortality rate'
          },
          ticks: {
            max,
            min: 0,
            callback: value => value + '%'
          }
        }]
      }
    }
  })
}

const toPoints = (series, _dates) => series.map((y, i) => ({ t: _dates[i], y }))// .filter(p => p.y)

drawGraph(smoothedSerieses.map((row, i) => ({
  type: 'line',
  label: labels[i],
  backgroundColor: colors[i] + '40',
  borderColor: colors[i],
  pointRadius: 0,
  borderWidth,
  data: toPoints(row, smoothedDates)
})))
serieses.forEach((series, i) => {
  drawGraph([{
    type: 'line',
    label: labels[i] + ' (weekly moving average)',
    backgroundColor: 'transparent',
    borderColor: colors[i],
    pointRadius: 0,
    borderWidth,
    data: toPoints(smoothedSerieses[i], smoothedDates)
  }, {
    label: labels[i] + ' (daily)',
    backgroundColor: colors[i] + '40',
    borderColor: colors[i] + '40',
    data: toPoints(series, dates)
  }])
})

updateTimeElement.innerHTML = new Date(DATA.updateTime).toLocaleString()
