if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () { console.log('Service Worker Registered') })
}

document.body.onload = () => {
  document.body.onscroll = () => {
    document.querySelectorAll('img[data-defer]').forEach((img) => {
      img.src = img.dataset.defer
    })
  }
}
