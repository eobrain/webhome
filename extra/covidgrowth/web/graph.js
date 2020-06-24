export const Graph = (
  colors
) => {
  /* global Chart
     barChartsElement
     spinnerElement
     updateTimeElement
     minTotalDeathsElement
     */

  const fontSize = 9

  const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

  const barChartRow = (i, shortName, maxToday, datasets) => {
    const n = datasets.length - 1
    const todayY = datasets[n - 1].y
    const lastWeekY = datasets[n - 8].y
    const delta = (todayY - lastWeekY) / maxToday
    const arrow = delta > 0 ? '⟶' : '⟵'

    const rowElement = document.createElement('TR')

    const nameCellElement = document.createElement('TH')
    nameCellElement.innerText = shortName
    rowElement.appendChild(nameCellElement)

    // const arrowCellElement = document.createElement('TH')
    // arrowCellElement.innerText = arrow
    // arrowCellElement.style.fontSize = `${100 * Math.abs(delta)}vw`
    // rowElement.appendChild(arrowCellElement)

    const barCellElement = document.createElement('TD')
    const barElement = document.createElement('DIV')
    barElement.style.backgroundColor = colors[i]
    barElement.style.width = `${50 * (todayY - 1) / (maxToday - 1)}vw`
    barCellElement.appendChild(barElement)
    const arrowElement = document.createElement('DIV')
    arrowElement.innerText = arrow
    arrowElement.style.fontSize = `${50 * Math.abs(delta)}vw`
    barCellElement.appendChild(arrowElement)
    rowElement.appendChild(barCellElement)

    barChartsElement.appendChild(rowElement)
  }

  const drawSparkline = async (i, shortName, max, datasets) => {
    const containerElement = document.createElement('A')
    containerElement.setAttribute('href', '#g' + i)
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
              min: 1
            }
          }]
        }
      }
    })
  }

  const borderWidth = 2

  const drawGraph = async (i, shortName, max, datasets) => {
    const canvasElement = document.createElement('CANVAS')
    canvasElement.setAttribute('id', 'g' + i)
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
              labelString: 'approx multiple of normal mortality'
            },
            ticks: {
              max,
              min: 1,
              callback: value => value + 'x',
              fontSize
            }
          }]
        }
      }
    })
  }

  const promises = []

  const sparkline = (i, shortName, max, data) => {
    promises.push(drawSparkline(i, shortName, max, [{
      fill: true,
      backgroundColor: colors[i],
      borderColor: colors[i],
      pointRadius: 0,
      borderWidth,
      data
    }]))
  }

  const individualGraph = (i, shortName, longName, max, smoothData, dailyData) => {
    promises.push(drawGraph(i, shortName, max, [{
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
    promises.push(drawGraph(names.length, 'all', max, names.map((name, i) => ({
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

  return { barChartRow, sparkline, individualGraph, overlayedGraph, finish }
}

export const maximum = xs => xs.reduce((acc, x) => Math.max(acc, x), 0)

export const last = a => a[a.length - 1]
export const maxLast = (names, data) => maximum(names.map(name => last(data[name])))

export const roundUp = dx => x => dx * Math.ceil(x / dx)
