/* global google, DATA */

const ANIMATION_DELAY_MS = 2000

// Credit https://stackoverflow.com/a/46099731/978525
const DAYS_BEFORE_EPOCH = 70 * 365 + 19
const HOUR = 60 * 60 * 1000
const excelDate2js = excelDate =>
  new Date(Math.round((excelDate - DAYS_BEFORE_EPOCH) * 24 * HOUR) + 12 * HOUR)

for (let i = 0; i < DATA.rows.length; ++i) {
  DATA.rows[i][0] = excelDate2js(DATA.rows[i][0])
}

const updated = new Date(DATA.updateTime).toLocaleString()

function drawChart () {
  const data = new google.visualization.DataTable()
  for (const column of DATA.columns) {
    data.addColumn(column === 'Date' ? 'date' : 'number', column)
  }
  data.addRows(DATA.rows)

  const options = {
    chart: {
      title: 'Deaths per million (outside China)',
      subtitle: `Five-point moving average. Updated ${updated}`
    },
    legend: {
      textStyle: { fontSize: 12 }
    },
    curveType: 'function',
    // height: 600,
    // fontSize: 12,
    vAxis: {
      viewWindowMode: 'maximized',
      scaleType: 'log'
    }
  }

  const chart = new google.charts.Line(document.getElementById('chart'))

  chart.draw(data, google.charts.Line.convertOptions(options))

  let column = 1
  setInterval(() => {
    chart.setSelection([{ row: null, column }])
    column = 1 + column % (DATA.columns.length - 1)
  }, ANIMATION_DELAY_MS)
}
google.charts.load('current', { packages: ['line'] })
google.charts.setOnLoadCallback(drawChart)
