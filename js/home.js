if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () { console.log('Service Worker Registered') })
}

/* global Stimulus */

const application = Stimulus.Application.start()

application.register('image', class extends Stimulus.Controller {
  defer () {
    this.element.src = this.data.get('src')
    this.element.removeAttribute('data-controller') // disable this controller
  }
})
