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
const geoIds = DATA.geoIds.slice(1)

const maximum = xs => xs.reduce((acc, x) => Math.max(acc, x), 0)

const roundUp = dx => x => dx * Math.ceil(x / dx)
const max = roundUp(0.1)(maximum(smoothedSerieses.map(series => maximum(series))))
const borderWidth = 2

const drawSparkline = (name, datasets) => {
  const containerElement = document.createElement('A')
  containerElement.setAttribute('href', '#' + name)
  containerElement.innerText = name
  containerElement.setAttribute('class', 'sparkline')
  spinnerElement.insertAdjacentElement('beforebegin', containerElement)

  const canvasElement = document.createElement('CANVAS')
  // canvasElement.setAttribute('class', 'sparkline')
  containerElement.appendChild(canvasElement)
  const ctx = canvasElement.getContext('2d')

  return new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      // responsive: false,
      aspectRatio: 1,
      legend: {
        display: false
      },
      plugins: {
        filler: {
          propagate: false
        }
      },
      scales: {
        xAxes: [{
          display: false,
          type: 'time'
        }],
        yAxes: [{
          display: false,
          ticks: {
            max,
            min: 0
          }
        }]
      }
    }
  })
}

const drawGraph = (name, datasets) => {
  const canvasElement = document.createElement('CANVAS')
  canvasElement.setAttribute('id', name)
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

const toPoints = (series, _dates) => series.map((y, i) => ({ t: _dates[i], y })).filter(p => !!p)

serieses.forEach((series, i) => {
  drawSparkline(geoIds[i], [{
    fill: true,
    label: labels[i] + ' (weekly moving average)',
    backgroundColor: colors[i],
    borderColor: colors[i],
    pointRadius: 0,
    borderWidth,
    data: toPoints(smoothedSerieses[i], smoothedDates)
  }])
})

serieses.forEach((series, i) => {
  drawGraph(geoIds[i], [{
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

drawGraph('All', smoothedSerieses.map((row, i) => ({
  type: 'line',
  label: labels[i],
  backgroundColor: colors[i] + '40',
  borderColor: colors[i],
  pointRadius: 0,
  borderWidth,
  data: toPoints(row, smoothedDates)
})))

spinnerElement.remove()

updateTimeElement.innerHTML = new Date(DATA.updateTime).toLocaleString()
minDeathsElement.innerHTML = DATA.minDeaths
minMortalityRateElement.innerHTML = DATA.minMortalityRate
minPointsElement.innerHTML = DATA.minPoints
