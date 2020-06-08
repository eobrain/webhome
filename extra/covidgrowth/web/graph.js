export const Graph = (
  colors
) => {
  /* global Chart
     spinnerElement
     updateTimeElement
     minTotalDeathsElement
     */

  const fontSize = 8

  const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

  const drawSparkline = async (shortName, max, datasets) => {
    const containerElement = document.createElement('A')
    containerElement.setAttribute('href', '#' + shortName)
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

  const borderWidth = 2

  const drawGraph = async (shortName, max, datasets) => {
    const canvasElement = document.createElement('CANVAS')
    canvasElement.setAttribute('id', shortName)
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

  const promises = []

  const sparkline = (i, shortName, max, data) => {
    promises.push(drawSparkline(shortName, max, [{
      fill: true,
      backgroundColor: colors[i],
      borderColor: colors[i],
      pointRadius: 0,
      borderWidth,
      data
    }]))
  }

  const individualGraph = (i, shortName, longName, max, smoothData, dailyData) => {
    promises.push(drawGraph(shortName, max, [{
      type: 'line',
      label: longName + ' (weekly moving average)',
      backgroundColor: 'transparent',
      borderColor: colors[i],
      pointRadius: 0,
      borderWidth,
      data: smoothData
    }, {
      label: longName + ' (daily)',
      backgroundColor: colors[i] + '40',
      borderColor: colors[i] + '40',
      data: dailyData
    }]))
  }

  const overlayedGraph = (names, max, labelOfI, dataOfName) => {
    promises.push(drawGraph('all', max, names.map((name, i) => ({
      type: 'line',
      label: labelOfI(i),
      backgroundColor: colors[i] + '40',
      borderColor: colors[i],
      pointRadius: 0,
      borderWidth,
      data: dataOfName(name)
    }))))
  }

  const finish = (updateTime, minTotalDeaths) => {
    Promise.all(promises).then(() => { spinnerElement.style.display = 'none' })

    updateTimeElement.innerHTML = new Date(updateTime).toLocaleString()
    minTotalDeathsElement.innerHTML = minTotalDeaths
  }

  return { sparkline, individualGraph, overlayedGraph, finish }
}

export const maximum = xs => xs.reduce((acc, x) => Math.max(acc, x), 0)

export const roundUp = dx => x => dx * Math.ceil(x / dx)
