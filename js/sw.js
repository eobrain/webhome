/* global importScripts, self, fetch */

importScripts('/js/cache-polyfill.js')

self.addEventListener('install', (e) => {
  e.waitUntil(
    self.caches.open('eamonn').then((cache) =>
      cache.addAll([
        '/',
        '/index.html'
      ])
    )
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    self.caches.open('eamonn').then((cache) =>
      cache.match(event.request).then((response) =>
        response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone())
          return response
        })
      )
    )
  )
})
