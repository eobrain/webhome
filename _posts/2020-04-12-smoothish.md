---
layout: post
title:  Smoothish library for smoothing time series data
categories: Programming
---

I just published a new npm module called [smoothish][2] that smooths out time-series data without some of the drawbacks of the usual moving-point average.

When working on the [visualization of per-capita COVID-19 death rates][1] I needed a way to smooth out the curves of some noisy and incomplete data, and I wanted the data to extend up to the most recent day.

Standard moving-average did not meet those requirements, so I ended up writing my own smoothing function which you can use like a moving average, but it does not drop the points at the beginning or (more importantly) at the end.

It works by, at every point, doing a least-squares linear interpolation of other points nearby. It is flexible enough to handle missing points or points at the boundaries.

It's easy to use. In your JavaScript project install it with:

```sh
npm install smoothish
```

Then using it is as simple as:

```js
const { fullSmooth } = require('smoothish')

const daysPerMonth = [
    31, 28, undefined, 30, 31, null, 31, 31, null, 31, 30, 31]

fullSmooth(daysPerMonth)
// --> [ 31.0, 29.7, 30.0, 30.0, 30.6, 30.8, 31.0, 31.0, 30.8, 30.8, 30.7, 30.7 ]
```

By default the function uses a *radius* of 2, equivalent to a five-point moving average, but unlike moving average the output has the same number of points as the input.

Also included in the library is a standard moving average function, though also robust to missing data points.

[1]: https://eamonn.org/covidgrowth/
[2]: https://www.npmjs.com/package/smoothish