const ANIMATION_MS = 200

export const Graph = (
  colors
) => {
  /* global Chart
     barChartsElement
     dateElement
     sparkSpinnerElement
     detailsSpinnerElement
     superimposedSpinnerElement
     updateTimeElement
     minTotalDeathsElement
     */

  const fontSize = 9

  const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

  const animation = (names, max, labelOfI, dataOfName, dateOfI) => {
    const T = dataOfName(names[0]).length
    const setWidth = (barElement, data, index) => {
      const y = data[index].y
      const width = Math.max(0, 100 * (y - 1) / (max - 1))
      barElement.style.width = `${width}%`
    }
    dateElement.innerText = dateOfI(T - 1).toLocaleDateString()
    const barElements = names.map((name, i) => {
      const barElement = document.createElement('DIV')
      barElement.innerText = labelOfI(i)
      barElement.style.backgroundColor = colors[i]
      setWidth(barElement, dataOfName(name), T - 1)
      barChartsElement.appendChild(barElement)
      return barElement
    })

    let count = 0
    setInterval(() => {
      const index = Math.min(T - 1, Math.round(count % T * 1.2))
      dateElement.innerText = dateOfI(index).toLocaleDateString()
      names.forEach((name, i) => {
        setWidth(barElements[i], dataOfName(name), index)
      })
      ++count
    }, ANIMATION_MS)
  }

  const drawSparkline = async (i, shortName, max, datasets) => {
    const containerElement = document.createElement('A')
    containerElement.setAttribute('href', '#g' + i)
    containerElement.innerText = shortName
    containerElement.setAttribute('class', 'sparkline')
    sparkSpinnerElement.insertAdjacentElement('beforebegin', containerElement)

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

  const drawGraph = async (i, shortName, max, datasets, spinnerElement) => {
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

  const sparkline = (i, shortName, max, data) => {
    drawSparkline(i, shortName, max, [{
      fill: true,
      backgroundColor: colors[i],
      borderColor: colors[i],
      pointRadius: 0,
      borderWidth,
      data
    }])
    sparkSpinnerElement.style.display = 'none'
  }

  const promises = []
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
    }], detailsSpinnerElement))
  }
  Promise.all(promises).then(() => { detailsSpinnerElement.style.display = 'none' })

  const overlayedGraph = (names, max, labelOfI, dataOfName) => {
    drawGraph(names.length, 'all', max, names.map((name, i) => ({
      type: 'line',
      label: labelOfI(i),
      backgroundColor: colors[i] + '40',
      borderColor: colors[i],
      pointRadius: 0,
      borderWidth,
      data: dataOfName(name)
    })), superimposedSpinnerElement)
    superimposedSpinnerElement.style.display = 'none'
  }

  const finish = (updateTime, minTotalDeaths) => {
    updateTimeElement.innerHTML = new Date(updateTime).toLocaleString()
    minTotalDeathsElement.innerHTML = minTotalDeaths
  }

  return { animation, sparkline, individualGraph, overlayedGraph, finish }
}

export const maximum = xs => xs.reduce((acc, x) => Math.max(acc, x), 0)

export const last = a => a[a.length - 1]

export const roundUp = dx => x => dx * Math.ceil(x / dx)
