
/* global Hammer */

const mc = new Hammer(document.body)

mc.on('swipe', (ev) => {
  const dir = (ev.deltaX < 0) ? 'next' : 'prev'
  const a = document.getElementById(dir)
  if (a) {
    document.body.classList.add('animate-' + dir)
    window.location = a.href
  }
})
