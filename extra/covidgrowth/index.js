/* global DATA Chart
   articleElement */

(async () => {
  // Credit https://stackoverflow.com/a/46099731/978525
  const DAYS_BEFORE_EPOCH = 70 * 365 + 19
  const HOUR = 60 * 60 * 1000
  const excelDate2js = excelDate =>
    new Date(Math.round((excelDate - DAYS_BEFORE_EPOCH) * 24 * HOUR) + 12 * HOUR)
  const excelDates = DATA.rows[0]
  const serieses = DATA.rows.slice(1)
  const colors = DATA.colors

  const labels = excelDates.map(x => excelDate2js(x).toLocaleDateString())

  const drawGraph = datasets => {
    const canvasElement = document.createElement('CANVAS')
    articleElement.appendChild(canvasElement)
    const ctx = canvasElement.getContext('2d')

    return new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {}
    })
  }

  drawGraph(serieses.map((row, i) => ({
    label: DATA.columns[i + 1],
    backgroundColor: colors[i] + '40',
    borderColor: colors[i],
    data: row
  })))
  serieses.forEach((series, i) => {
    drawGraph([{
      label: DATA.columns[i + 1],
      backgroundColor: colors[i] + '40',
      borderColor: colors[i],
      data: series
    }])
  })
})()
