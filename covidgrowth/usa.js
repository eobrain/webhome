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
const maximum = xs => xs.reduce((acc, x) => Math.max(acc, x), 0)

const roundUp = dx => x => dx * Math.ceil(x / dx)

const toId = s => s.replace(/\W+/g, '-')

const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

const drawSparkline = async (name, datasets) => {
  const shortName = name.slice(name.length - 2)
  const containerElement = document.createElement('A')
  containerElement.setAttribute('href', '#' + toId(name))
  containerElement.innerText = shortName
  containerElement.setAttribute('class', 'sparkline')
  spinnerElement.insertAdjacentElement('beforebegin', containerElement)

  const canvasElement = document.createElement('CANVAS')
  // canvasElement.setAttribute('class', 'sparkline')
  containerElement.appendChild(canvasElement)
  const ctx = canvasElement.getContext('2d')

  await nextTick()
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

const max = roundUp(0.1)(maximum(countyNames.map(name => maximum(smoothedCountyData[name]))))
const borderWidth = 2

const drawGraph = async (name, datasets) => {
  const canvasElement = document.createElement('CANVAS')
  canvasElement.setAttribute('id', toId(name))
  spinnerElement.insertAdjacentElement('beforebegin', canvasElement)
  const ctx = canvasElement.getContext('2d')

  await nextTick()
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

const promises = []

countyNames.forEach((name, i) => {
  promises.push(drawSparkline(name, [{
    fill: true,
    label: name + ' (weekly moving average)',
    backgroundColor: colors[i],
    borderColor: colors[i],
    pointRadius: 0,
    borderWidth,
    data: toPoints(smoothedCountyData[name], dates)
  }]))
})

countyNames.forEach((name, i) => {
  promises.push(drawGraph(name, [{
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
  }]))
})

promises.push(drawGraph('all', countyNames.map((name, i) => ({
  type: 'line',
  label: name.slice(name.length - 2),
  backgroundColor: colors[i] + '40',
  borderColor: colors[i],
  pointRadius: 0,
  borderWidth,
  data: toPoints(smoothedCountyData[name], dates)
}))))

Promise.all(promises).finally(() => { spinnerElement.style.display = 'none' })

updateTimeElement.innerHTML = new Date(updateTime).toLocaleString()
minTotalDeathsElement.innerHTML = minTotalDeaths
minMortalityRateElement.innerHTML = minMortalityRate
