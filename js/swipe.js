document.body.ontouchstart = (event) => {
  if (event.targetTouches.length === 1) {
    const touch0 = event.targetTouches[0]
    const x0 = touch0.pageX
    let x = x0

    document.body.ontouchmove = (event) => {
      if (event.targetTouches.length === 1) {
        const touch = event.targetTouches[0]
        x = touch.pageX
        const dx = x - x0
        document.body.style.transform = `translateX(${dx}px)`

        if (Math.abs(dx) > 50) {
          const dir = (dx < 0) ? 'next' : 'prev'
          const a = document.getElementById(dir)
          if (a) {
            document.body.className = `animate-${dir}`
            window.location = a.href
          }
        }
      }
    }
    document.body.ontouchend = (event) => {
      document.body.ontouchmove = null
      document.body.ontouchend = null
    }
  }
}
