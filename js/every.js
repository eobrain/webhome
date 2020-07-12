const stripTrailingSlash = url => url.replace(/\/$/, '')

document.addEventListener('DOMContentLoaded', () => {
  const thisUrl = stripTrailingSlash(document.baseURI)
  document.querySelectorAll('a[href]').forEach(aElement => {
    if (stripTrailingSlash(aElement.href) === thisUrl) {
      aElement.removeAttribute('href')
      aElement.classList.add('current')
    }
  })
})
