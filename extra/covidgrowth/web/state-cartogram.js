// Adapted from https://bl.ocks.org/cmgiven/9d6bc46cf586738458c13dd2b5dadd84

import links from './state-cartogram-links.js'
import latlons from './state-cartogram-latlons.js'
import nodesWithoutLatlon from './state-cartogram-nodes.js'

const lastYear = 413 // TODO(eob) pass this in data

/* global d3, timeElement, runningElement */

const FIRST_DAY_MS = Date.UTC(2020, 0, 22, 12) // Noon UTC, Jan 22, 2020
const MS_PER_DAY = 24 * 60 * 60 * 1000

const dayOffsetToString = dayOffset => new Date(FIRST_DAY_MS + dayOffset * MS_PER_DAY)

const nodes = nodesWithoutLatlon.filter(n => latlons[n.state]).map(n => {
  const { state, population } = n
  const { lat, lon } = latlons[state]
  return { state, lat, lon, population }
})

const WIDTH = 600
const HEIGHT = 600

// const interval = 2000
const interval = 50
const MAX_SIZE = 140

// const years = d3.range(1900, 2010 + 1, 10)
const years = d3.range(0, lastYear + 1, 1)
timeElement.setAttribute('max', lastYear + 1)
let yearIndex = -1
timeElement.value = years[0]
const isYearFn = e => e.year === timeElement.valueAsNumber

const projection = d3.geoAlbersUsa()
  .scale(WIDTH)
  .translate([WIDTH / 2, HEIGHT / 2])

const size = d3.scaleSqrt().range([0, MAX_SIZE])

const svg = d3.select('figure').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g')

const yearLabel = svg.append('text')
  .attr('class', 'year')
  .attr('x', WIDTH / 2)
  .attr('y', 30)
  .attr('text-anchor', 'middle')

const linkForce = d3.forceLink()
  .id(d => d.state)
  .distance(d =>
    (
      size(d.source.population.find(isYearFn).pop) +
            size(d.target.population.find(isYearFn).pop)
    ) / 2
  )
  .strength(0.6)

const collisionForce = rectCollide()
  .size(d => {
    const l = size(d.population.find(isYearFn).pop)
    return [l, l]
  })
  .iterations(12)

const XY_STRENGTH = 0.0125

const simulation = d3.forceSimulation()
  .force('center', d3.forceCenter(WIDTH / 2, (HEIGHT - MAX_SIZE) / 2))
  .force('link', linkForce)
  .force('collision', collisionForce)
  .force('x', d3.forceX(d => d.xi).strength(XY_STRENGTH))
  .force('y', d3.forceY(d => d.yi).strength(XY_STRENGTH))

initialize()

function initialize () {
  size.domain([0, d3.max(nodes, d =>
    d3.max(d.population, e => e.pop)
  )])

  nodes.forEach(d => {
    const coords = projection([d.lon, d.lat])
    d.x = d.xi = coords[0]
    d.y = d.yi = coords[1]
  })

  const states = svg.selectAll('.state')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'state')

  states.append('rect')
  states.append('text')
    .attr('text-anchor', 'middle')
    .attr('lengthAdjust', 'spacingAndGlyphs')
    .attr('dy', '.3em')
    .text(d => d.state)

  simulation.nodes(nodes)
  simulation.force('link').links(links)
  simulation.on('tick', ticked)

  update()
  const timer = d3.interval(update, interval)

  function update () {
    yearIndex = (yearIndex + 1) % years.length
    timeElement.valueAsNumber = years[yearIndex]

    yearLabel.text(dayOffsetToString(timeElement.valueAsNumber).toLocaleDateString())

    simulation.nodes(nodes).alpha(1).restart()
    if (yearIndex === years.length - 1) {
      timer.stop()
      runningElement.checked = false
    }
  }

  runningElement.onchange = () => {
    if (runningElement.checked) {
      timer.restart(update, interval)
    } else {
      timer.stop()
    }
  }

  timeElement.onchange = () => {
    if (runningElement.checked) {
      timer.stop()
      runningElement.checked = false
    }
    d3.timeout(() => {
      for (let i = 0; i < years.length; ++i) {
        if (timeElement.valueAsNumber === years[i]) {
          yearIndex = i
          break
        }
      }
      timer.restart(update, interval)
      runningElement.checked = true
    }, interval * 2)
  }

  function ticked () {
    const sizes = d3.local()

    states
      .property(sizes, d => size(d.population.find(isYearFn).pop))
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')

    states.selectAll('rect')
      .attr('x', function (d) { return sizes.get(this) / -2 })
      .attr('y', function (d) { return sizes.get(this) / -2 })
      .attr('width', function (d) { return sizes.get(this) })
      .attr('height', function (d) { return sizes.get(this) })
    states.selectAll('text')
      .attr('textLength', function (d) { return 2 * sizes.get(this) / 3 })
  }
}

const constant = arg => arg

function rectCollide () {
  let nodes
  let sizes
  let masses
  let size = constant([0, 0])
  let strength = 1
  let iterations = 1

  function force () {
    let node, size, mass, xi, yi
    let i = -1
    while (++i < iterations) { iterate() }

    function iterate () {
      let j = -1
      const tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

      while (++j < nodes.length) {
        node = nodes[j]
        size = sizes[j]
        mass = masses[j]
        xi = xCenter(node)
        yi = yCenter(node)

        tree.visit(apply)
      }
    }

    function apply (quad, x0, y0, x1, y1) {
      const data = quad.data
      const xSize = (size[0] + quad.size[0]) / 2
      const ySize = (size[1] + quad.size[1]) / 2
      if (data) {
        if (data.index <= node.index) { return }

        let x = xi - xCenter(data)
        let y = yi - yCenter(data)
        const xd = Math.abs(x) - xSize
        const yd = Math.abs(y) - ySize

        if (xd < 0 && yd < 0) {
          const l = Math.sqrt(x * x + y * y)
          const m = masses[data.index] / (mass + masses[data.index])

          if (Math.abs(xd) < Math.abs(yd)) {
            node.vx -= (x *= xd / l * strength) * m
            data.vx += x * (1 - m)
          } else {
            node.vy -= (y *= yd / l * strength) * m
            data.vy += y * (1 - m)
          }
        }
      }

      return x0 > xi + xSize || y0 > yi + ySize ||
                   x1 < xi - xSize || y1 < yi - ySize
    }

    function prepare (quad) {
      if (quad.data) {
        quad.size = sizes[quad.data.index]
      } else {
        quad.size = [0, 0]
        let i = -1
        while (++i < 4) {
          if (quad[i] && quad[i].size) {
            quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
            quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
          }
        }
      }
    }
  }

  const xCenter = d => d.x + d.vx
  const yCenter = d => d.y + d.vy

  force.initialize = function (_) {
    sizes = (nodes = _).map(size)
    masses = sizes.map(d => d[0] * d[1])
  }

  force.size = function (arg) {
    if (arg) {
      size = typeof arg === 'function' ? arg : constant(arg)
      return force
    }
    return size
  }

  force.strength = function (arg) {
    if (arg) {
      strength = +arg
      return force
    }
    return strength
  }

  force.iterations = function (arg) {
    if (arg) {
      iterations = +arg
      return force
    }
    return iterations
  }

  return force
}
