import Chart from 'chart.js'
import 'chartjs-adapter-date-fns'

/* global DATA_STATE
   spinnerElement
   updateTimeElement
   minTotalDeathsElement
   */

const DAY_MS = 24 * 60 * 60 * 1000

const {
  dayCount,
  minDay,
  stateData,
  smoothedStateData,
  updateTime,
  minTotalDeaths,
  colors
} = DATA_STATE

const fontSize = 8

const dates = [...new Array(dayCount)].map((_, i) => new Date(DAY_MS * (i + minDay)))
const countyNames = Object.keys(stateData)
const maximum = xs => xs.reduce((acc, x) => Math.max(acc, x), 0)

const roundUp = dx => x => dx * Math.ceil(x / dx)

const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

const drawSparkline = async (name, datasets) => {
  const containerElement = document.createElement('A')
  containerElement.setAttribute('href', '#' + name)
  containerElement.innerText = name
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
        x: {
          display: false,
          type: 'time'
        },
        y: {
          display: false,
          max,
          min: 0
        }
      }
    }
  })
}

const max = roundUp(0.1)(maximum(countyNames.map(name => maximum(smoothedStateData[name]))))
const borderWidth = 2

const drawGraph = async (name, datasets) => {
  const canvasElement = document.createElement('CANVAS')
  canvasElement.setAttribute('id', name)
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
        x: {
          type: 'time',
          time: {
            unit: 'week'
          },
          ticks: {
            fontSize
          }
        },
        y: {
          scaleLabel: {
            display: true,
            labelString: 'annualized mortality rate'
          },
          max,
          min: 0,
          ticks: {
            callback: value => value + '%',
            fontSize
          }
        }
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
    data: toPoints(smoothedStateData[name], dates)
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
    data: toPoints(smoothedStateData[name], dates)
  }, {
    label: name + ' (daily)',
    backgroundColor: colors[i] + '40',
    borderColor: colors[i] + '40',
    data: toPoints(stateData[name], dates)
  }]))
})

promises.push(drawGraph('all', countyNames.map((name, i) => ({
  type: 'line',
  label: name.slice(name.length - 2),
  backgroundColor: colors[i] + '40',
  borderColor: colors[i],
  pointRadius: 0,
  borderWidth,
  data: toPoints(smoothedStateData[name], dates)
}))))

Promise.all(promises).then(() => { spinnerElement.style.display = 'none' })

updateTimeElement.innerHTML = new Date(updateTime).toLocaleString()
minTotalDeathsElement.innerHTML = minTotalDeaths
