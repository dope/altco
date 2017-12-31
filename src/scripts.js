const baseDropdown   = document.getElementById('base')
const targetDropdown = document.getElementById('target')
const refreshButton  = document.getElementById('refresh')
const name           = document.getElementById('name')
const price          = document.getElementById('price')
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

function getTicker(base, target) {
  fetch('https://api.cryptonator.com/api/ticker/' + base + '-' + target)
  .then(function(response) {
    return response.json();
  }).then(function(data) {
    price.innerHTML = Math.floor(data.ticker.price).toLocaleString()

    if (data.ticker.base === 'BTC') {
      name.innerHTML = 'Bitcoin'
    }

    if (data.ticker.base === 'ETH') {
      name.innerHTML = 'Ethereum'
    }

    if (data.ticker.base === 'LTC') {
      name.innerHTML = 'Litecoin'
    }

    if (data.ticker.target === 'EUR') {
      currency.innerHTML = '€'
    }

    if (data.ticker.target === 'USD') {
      currency.innerHTML = '$'
    }

    if (data.ticker.target === 'GBP') {
      currency.innerHTML = '£'
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
