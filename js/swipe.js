
/* global Hammer */

const mc = new Hammer(document.body)

mc.on('swipe', (ev) => {
  const dir = (ev.deltaX < 0) ? 'next' : 'prev'
  document.body.classList.add('move-' + dir)
  const a = document.getElementById(dir)
  if (a) {
    window.location = a.href
  }
})
