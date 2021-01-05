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
            window.location = `${a.href},${window.scrollY}`
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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('p > img[alt]').forEach(imgElement => {
    if (imgElement.previousElementSibling || imgElement.nextElementSibling) {
      return // not lone <img> in a <p>
    }
    const pElement = imgElement.parentNode
    if (pElement.innerText.trim().length > 0) {
      return // <p> has some text
    }
    const figureElement = document.createElement('figure')
    pElement.replaceWith(figureElement)

    imgElement.remove()
    figureElement.appendChild(imgElement)

    const figcaptionElement = document.createElement('figcaption')
    figcaptionElement.innerText = imgElement.getAttribute('alt')
    figureElement.appendChild(figcaptionElement)
  })
  document.querySelectorAll('p >  a > img[alt]').forEach(imgElement => {
    if (imgElement.previousElementSibling || imgElement.nextElementSibling) {
      return // not lone <img> in a <p>
    }
    const aElement = imgElement.parentNode
    if (aElement.previousElementSibling || aElement.nextElementSibling) {
      return // not lone <a> in a <p>
    }
    const pElement = aElement.parentElement
    if (pElement.innerText.trim().length > 0) {
      return // <p> has some text
    }
    const figureElement = document.createElement('figure')
    pElement.replaceWith(figureElement)

    aElement.remove()
    figureElement.appendChild(aElement)

    const figcaptionElement = document.createElement('figcaption')
    figcaptionElement.innerText = imgElement.getAttribute('alt')
    figureElement.appendChild(figcaptionElement)
  })
})
