// Adapted from https://bl.ocks.org/cmgiven/9d6bc46cf586738458c13dd2b5dadd84

import links from './state-cartogram-links.js'
import latlons from './state-cartogram-latlons.js'
import nodesWithoutLatlon from './state-cartogram-nodes.js'

/* global d3 */

const nodes = nodesWithoutLatlon.filter(n => latlons[n.state]).map(n => {
  const { state, population } = n
  const { lat, lon } = latlons[state]
  return { state, lat, lon, population }
})

const width = 600
const height = 600

// const interval = 2000
const interval = 200
const maxSize = 140

// const years = d3.range(1900, 2010 + 1, 10)
const years = d3.range(0, 290 + 1, 1)
let yearIndex = -1
let year = years[0]
const isYearFn = e => e.year === year

const projection = d3.geoAlbersUsa()
  .scale(width)
  .translate([width / 2, height / 2])

const size = d3.scaleSqrt().range([0, maxSize])

const svg = d3.select('figure').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')

const yearLabel = svg.append('text')
  .attr('class', 'year')
  .attr('x', width / 2)
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

const simulation = d3.forceSimulation()
  .force('center', d3.forceCenter(width / 2, (height - maxSize) / 2))
  .force('link', linkForce)
  .force('collision', collisionForce)
  .force('x', d3.forceX(d => d.xi).strength(0.0125))
  .force('y', d3.forceY(d => d.yi).strength(0.0125))

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
    .attr('dy', '.3em')
    .text(d => d.state)

  simulation.nodes(nodes)
  simulation.force('link').links(links)
  simulation.on('tick', ticked)

  update()
  d3.interval(update, interval)

  function update () {
    year = years[++yearIndex >= years.length ? yearIndex = 0 : yearIndex]

    yearLabel.text(year)

    if (yearIndex === 0) {
      nodes.forEach(d => {
        d.x = d.xi
        d.y = d.yi
      })
    }

    simulation.nodes(nodes).alpha(1).restart()
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
  }
}

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

  force.size = function (_) {
    if (arguments.length) {
      size = typeof _ === 'function' ? _ : constant(_)
      return force
    }
    return size
  }

  force.strength = function (_) {
    if (arguments.length) {
      strength = +_
      return force
    }
    return strength
  }

  force.iterations = function (_) {
    if (arguments.length) {
      iterations = +_
      return force
    }
    return iterations
  }

  return force
}

function constant (_) {
  return function () { return _ }
}
