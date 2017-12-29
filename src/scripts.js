const baseDropdown = document.getElementById('base')
const targetDropdown = document.getElementById('target')
const refreshButton = document.getElementById('refresh')
const price = document.getElementById('price');

function getTicker(base, target) {
  fetch('https://api.cryptonator.com/api/ticker/' + base + '-' + target).then(function(response) {
    return response.json();
  }).then(function(data) {
    price.innerHTML = Math.floor(data.ticker.price).toLocaleString()
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
  });
}

if (localStorage.getItem('base')) {
  baseDropdown.value = localStorage.getItem('base')
}

if (localStorage.getItem('target')) {
  targetDropdown.value = localStorage.getItem('target')
}

baseDropdown.addEventListener('change', function() {
  localStorage.setItem('base', this.value)
  refreshButton.classList.add('refresh--show')
});

targetDropdown.addEventListener('change', function() {
  localStorage.setItem('target', this.value)
  refreshButton.classList.add('refresh--show')
});

refreshButton.addEventListener('click', function(base, target) {
  getTicker(localStorage.getItem('base'), localStorage.getItem('target'))
  refreshButton.classList.remove('refresh--show')
})

setInterval(function () {
  getTicker(localStorage.getItem('base') || 'btc', localStorage.getItem('target') || 'usd')
}, 500);
