
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

document.body.ontouchstart = (event) => {
  if (event.targetTouches.length === 1) {
    const touch0 = event.targetTouches[0]
    const x0 = touch0.pageX
    let x = x0

    document.body.ontouchmove = (event) => {
      if (event.targetTouches.length === 1) {
        const touch = event.targetTouches[0]
        x = touch.pageX
        const dx = Math.max(-20, Math.min(20, x - x0))
        document.body.style.transform = `translateX(${dx}px)`
      }
    }
    document.body.ontouchend = (event) => {
      document.body.style.transform = ''
      document.body.ontouchmove = null
      document.body.ontouchend = null
    }
  }
}
