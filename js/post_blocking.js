const slideIn = (cssClass) => {
  document.body.className = cssClass
  document.querySelector('.' + cssClass).addEventListener('animationend', () => {
    document.body.classList.remove(cssClass)
    document.body.onfinish = null
  })
}

if (window.location.hash) {
  const [incoming, scrollPosn] = window.location.hash.slice(1).split(',')
  slideIn(`animate-${incoming}`)
  document.body.onload = () => {
    window.scrollBy(0, parseFloat(scrollPosn) || 0)
  }
} else {
  slideIn('animate-to-child')
}
