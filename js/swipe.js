const mc = new Hammer(document.body)

mc.on('swipe', (ev) => {
  const dir = (ev.deltaX < 0) ? 'next' : 'prev'
  const href = document.getElementById(dir).href
  document.body.classList.add('move-' + dir)
  window.location = href
})
