/* global fetch */

const xxxx = async () => {
  const table = document.getElementById('table')
  const response = await fetch('https://ipapi.co/json/')
  const data = await response.json()
  for (const key in data) {
    const tr = table.appendChild(document.createElement('tr'))
    tr.innerHTML = `<th>${key}</th><td>${data[key]}</td>`
  }
}

xxxx()
