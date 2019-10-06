const slideIn = (cssClass) => {
  document.body.className = cssClass
  document.querySelector('.' + cssClass).addEventListener('animationend', () => {
    document.body.classList.remove(cssClass)
    document.body.onfinish = null
  })
}

if (window.location.hash) {
  const incoming = window.location.hash.slice(1)
  slideIn(`animate-${incoming}`)
} else {
  slideIn('animate-to-child')
}
