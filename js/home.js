if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () { console.log('Service Worker Registered') })
}

/* global Stimulus */

const application = Stimulus.Application.start()

application.register('image', class extends Stimulus.Controller {
  defer () {
    if (isElementInViewport(this.element)) {
      this.element.src = this.data.get('src')
      this.element.removeAttribute('data-controller') // disable this controller
    }
  }

  connect () {
    this.defer()
  }
})

// Credit: Dan https://stackoverflow.com/a/7557433/978525
const isElementInViewport = el => {
  const rect = el.getBoundingClientRect()
  const { innerHeight, innerWidth } = window
  const { clientHeight, clientWidth } = document.documentElement

  return (
    rect.bottom >= 0 &&
      rect.left >= 0 &&
      rect.top <= (innerHeight || clientHeight) &&
      rect.right <= (innerWidth || clientWidth)
  )
}
