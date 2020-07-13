/* global gtag */

const stripTrailingSlash = url => url.replace(/\/$/, '')

document.addEventListener('DOMContentLoaded', () => {
  const thisUrl = stripTrailingSlash(document.baseURI)
  document.querySelectorAll('a[href]').forEach(aElement => {
    if (stripTrailingSlash(aElement.href) === thisUrl) {
      aElement.removeAttribute('href')
      aElement.classList.add('current')
    }
  })
  document.querySelectorAll('a.tweet').forEach(aElement => {
    aElement.addEventListener('click', () => {
      const params = new URL(aElement.href).searchParams
      const path = new URL(params.get('url')).pathname
      console.log('path=', path)
      console.log('text=', params.get('text'))
      gtag('event', 'share', {
        method: 'Twitter',
        content_id: path,
        description: params.get('text')
      })
    }, false)
  })
})
