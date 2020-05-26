/* global DATA Chart
   spinnerElement
   updateTimeElement
   minDeathsElement
   minMortalityRateElement
   minPointsElement
   */

const fontSize = 8
const HOUR_MS = 60 * 60 * 1000
const hour2js = hour => new Date(hour * HOUR_MS)
const hours = DATA.rows[0]
const smoothedExcelDates = DATA.smoothedRows[0]
const serieses = DATA.rows.slice(1)
const smoothedSerieses = DATA.smoothedRows.slice(1)
const colors = DATA.colors

const dates = hours.map(x => hour2js(x))
const smoothedDates = smoothedExcelDates.map(x => hour2js(x))
const labels = DATA.columns.slice(1)

const maximum = (xs) => xs.reduce((acc, x) => Math.max(acc, x))

const roundUp = dx => x => dx * Math.ceil(x / dx)
const max = roundUp(0.1)(maximum(smoothedSerieses.map(series => maximum(series))))
const borderWidth = 2

const drawGraph = datasets => {
  const canvasElement = document.createElement('CANVAS')
  spinnerElement.insertAdjacentElement('beforebegin', canvasElement)
  const ctx = canvasElement.getContext('2d')

  return new Chart(ctx, {
    type: 'bar',
    data: { datasets },
    options: {
      aspectRatio: 1,
      legend: {
        position: 'bottom',
        labels: {
          fontSize,
          boxWidth: borderWidth
        }
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'week'
          },
          ticks: {
            fontSize
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
            fontSize,
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
spinnerElement.remove()

updateTimeElement.innerHTML = new Date(DATA.updateTime).toLocaleString()
minDeathsElement.innerHTML = DATA.minDeaths
minMortalityRateElement.innerHTML = DATA.minMortalityRate
minPointsElement.innerHTML = DATA.minPoints

