export const Graph = (
  colors
) => {
  /* global Chart
     barChartsElement
     dateElement
     spinnerElement
     updateTimeElement
     minTotalDeathsElement
     */

  const fontSize = 9

  const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

  const animation = (names, max, labelOfI, dataOfName, dateOfI) => {
    const n = dataOfName(names[0]).length
    const setWidth = (barElement, data, index) => {
      const y = data[index].y
      const width = Math.max(0, 100 * (y - 1) / (max - 1))
      barElement.style.width = `${width}%`
    }
    dateElement.innerText = dateOfI(n - 1).toLocaleDateString()
    const barElements = names.map((name, i) => {
      const barElement = document.createElement('DIV')
      barElement.innerText = name
      barElement.style.backgroundColor = colors[i]
      setWidth(barElement, dataOfName(name), n - 1)
      barChartsElement.appendChild(barElement)
      return barElement
    })

    let count = 0
    setInterval(() => {
      const index = Math.min(n - 1, count % n * 2)
      dateElement.innerText = dateOfI(index).toLocaleDateString()
      names.forEach((name, i) => {
        setWidth(barElements[i], dataOfName(name), index)
      })
      ++count
    }, 100)
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

  return { animation, sparkline, individualGraph, overlayedGraph, finish }
}

export const maximum = xs => xs.reduce((acc, x) => Math.max(acc, x), 0)

export const last = a => a[a.length - 1]
export const maxLast = (names, data) => maximum(names.map(name => last(data[name])))

export const roundUp = dx => x => dx * Math.ceil(x / dx)
