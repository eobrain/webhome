importScripts('/js/cache-polyfill.js')

/* global self, caches */

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('airhorner').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html'
      ])
    })
  )
})
