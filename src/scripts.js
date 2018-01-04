const baseDropdown   = document.getElementById('base')
const targetDropdown = document.getElementById('target')
const refreshButton  = document.getElementById('refresh')
const name           = document.getElementById('name')
const price          = document.getElementById('price')
const change         = document.getElementById('change')
const theme          = document.getElementById('theme')
const arrow          = document.getElementById('arrow')
const themeValue     = JSON.parse(localStorage.getItem('darkTheme'))

function makeCheck() {
  if (themeValue === true) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Init and check theme
theme.addEventListener('click', function () {
  localStorage.setItem('darkTheme', theme.checked)
  if (theme.checked) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

makeCheck()
theme.checked = themeValue

function format (num) {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

document.documentElement.style.opacity = 0

function getTicker(base, target) {
  fetch('https://api.cryptonator.com/api/full/' + base + '-' + target)
  .then(function(response) {
    return response.json();
  }).then(function(data) {
    price.innerHTML = format(JSON.parse(data.ticker.price))
    name.innerHTML = data.ticker.base + ' to ' + data.ticker.target

    document.documentElement.style.opacity = 1

    if (data.ticker.change.startsWith('-')) {
      change.innerHTML = '<span>▼</span>' + format(JSON.parse(data.ticker.change))
      change.classList.add('down')
    } else {
      change.innerHTML = '<span>▲</span>' + format(JSON.parse(data.ticker.change))
      change.classList.add('up')
    }
  }).catch(function(data) {
    console.log(data)
  })
}

if (localStorage.getItem('base')) {
  baseDropdown.value = localStorage.getItem('base')
}

if (localStorage.getItem('target')) {
  targetDropdown.value = localStorage.getItem('target')
}

baseDropdown.addEventListener('change', function () {
  localStorage.setItem('base', this.value)
  refreshButton.classList.add('refresh--show')
})

targetDropdown.addEventListener('change', function () {
  localStorage.setItem('target', this.value)
})

setInterval(function () {
  getTicker(localStorage.getItem('base') || 'btc', localStorage.getItem('target') || 'usd')
}, 500)
