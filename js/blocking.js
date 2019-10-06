const slideIn = (cssClass) => {
  document.body.className = cssClass
  document.querySelector('.' + cssClass).addEventListener('animationend', () => {
    document.body.classList.remove(cssClass)
    document.body.onfinish = null
  })
}

if (window.location.hash) {
  const dir = window.location.hash.slice(1)
  slideIn(`animate-load-${dir}`)
} else {
  slideIn('animate-load-child')
}
