/* global DATA_US Chart
   spinnerElement
   updateTimeElement
   minMortalityRateElement
   minTotalDeathsElement
   */

const fontSize = 8
const DAY_MS = 24 * 60 * 60 * 1000

const {
  dayCount,
  minDay,
  countyData,
  smoothedCountyData,
  minTotalDeaths,
  minMortalityRate,
  updateTime,
  colors
} = DATA_US

const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))
const countyNames = Object.keys(countyData)
const maximum = xs => xs.reduce((acc, x) => Math.max(acc, x))

const roundUp = dx => x => dx * Math.ceil(x / dx)

const max = roundUp(0.1)(maximum(countyNames.map(name => maximum(smoothedCountyData[name]))))
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
            callback: value => value + '%',
            fontSize
          }
        }]
      }
    }
  })
}

const toPoints = (series, _dates) => series.map((y, i) => ({ t: _dates[i], y }))// .filter(p => p.y)

drawGraph(countyNames.map((name, i) => ({
  type: 'line',
  label: name.slice(name.length - 2),
  backgroundColor: colors[i] + '40',
  borderColor: colors[i],
  pointRadius: 0,
  borderWidth,
  data: toPoints(smoothedCountyData[name], dates)
})))

countyNames.forEach((name, i) => {
  drawGraph([{
    type: 'line',
    label: name + ' (weekly moving average)',
    backgroundColor: 'transparent',
    borderColor: colors[i],
    pointRadius: 0,
    borderWidth,
    data: toPoints(smoothedCountyData[name], dates)
  }, {
    label: name + ' (daily)',
    backgroundColor: colors[i] + '40',
    borderColor: colors[i] + '40',
    data: toPoints(countyData[name], dates)
  }])
})

spinnerElement.remove()

updateTimeElement.innerHTML = new Date(updateTime).toLocaleString()
minTotalDeathsElement.innerHTML = minTotalDeaths
minMortalityRateElement.innerHTML = minMortalityRate