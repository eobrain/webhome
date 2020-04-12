const centerAverage = (a, b, c, d, e) => {
  if (a && b && c && d && e) {
    return (a + b + c + d + e) / 5
  }
  if (b && c && d) {
    return (b + c + d) / 3
  }
  if (a && b && !c && d && e) {
    return (a + b + d + e) / 4
  }
  if (b && !c && d) {
    return (b + d) / 2
  }
  return c
}

const centerMovingAverage = (xs) => {
  const ys = []
  for (let t = 0; t < xs.length; ++t) {
    ys.push(centerAverage(xs[t - 2], xs[t - 1], xs[t], xs[t + 1], xs[t + 2]))
  }
  return ys
}

const average = (xs) => {
  let sum = 0
  let n = 0
  for (const x of xs) {
    if (x) {
      sum += x
      ++n
    }
  }
  return sum / n
}

const movingAverage = (xs) => {
  const ys = []
  for (let t = 0; t < xs.length; ++t) {
    ys.push(average(xs.slice(Math.max(0, t - 2), t + 3)))
  }
  return ys
}

// ee https://www.mathsisfun.com/data/least-squares-regression.html
const leastSquares = (ys) => {
  const N = ys.length
  const x0 = (N - 1) / 2

  let sumXY = 0
  let sumX = 0
  let sumY = 0
  let sumXsq = 0
  for (let x = 0; x < N; ++x) {
    const y = ys[x]
    if (!y) {
      continue
    }
    sumXY += x * y
    sumX += x
    sumY += y
    sumXsq += x * x
  }
  const m = (N * sumXY - sumX * sumY) / (N * sumXsq - sumX * sumX)
  const b = (sumY - m * sumX) / N
  return m * x0 + b
}

const movingleastSquares = (xs) => {
  const ys = []
  for (let t = 0; t < xs.length; ++t) {
    ys.push(leastSquares([xs[t - 2], xs[t - 1], xs[t], xs[t + 1], xs[t + 2]]))
  }
  return ys
}

module.exports = { movingAverage, movingleastSquares, centerMovingAverage }
