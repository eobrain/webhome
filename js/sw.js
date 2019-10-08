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
    fetch(event.request).catch(() => self.caches.match(event.request))
  )
})
