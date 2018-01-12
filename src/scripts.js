const baseDropdown   = document.getElementById('base')
const targetDropdown = document.getElementById('target')
const name           = document.getElementById('name')
const price          = document.getElementById('price')
const change         = document.getElementById('change')
const theme          = document.getElementById('theme')
const arrow          = document.getElementById('arrow')
const spinner        = document.getElementById('spinner')
const modalSpinner        = document.getElementById('modalSpinner')
const main           = document.getElementById('main')
const themeValue     = JSON.parse(localStorage.getItem('darkTheme'))
const html           = document.documentElement
const newsBtn        = document.querySelector('.newsBtn')
const modal          = document.querySelector('.modal')
const modalExit      = document.querySelector('.modalExit')
const newsUrl        = 'https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey='
const newsApiKey     = '9df70807854047a1b82ae13db6478880'
const posts          = document.getElementById('posts')
const mainPosts          = document.getElementById('mainPosts')

var dateToString = function dateToString(toConvert) {
  var date = new Date(toConvert);
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
};

fetch(newsUrl + newsApiKey)
.then(function(response) {
  return response.json();
}).then(function(data) {
  let articles = data.articles

  articles.forEach( function (item) {
    let title = item.title
    let time = new Date(item.publishedAt).toLocaleDateString('en')
    let desc = item.description
    let link = item.url

    let postInner = document.createElement('article');
    postInner.innerHTML = [
      '<a href="' + link + '" target="_blank" class="article">',
        '<h2 class="article__title">' + title + '</h2>',
        '<time class="article__time timeago" datetime="' + time + '">' + time + '</time>',
        '<p class="article__desc">' + desc + '</p>',
      '</a>'
    ].join("\n");
    posts.appendChild(postInner)
  });
}).catch(function(data) {
  console.error(data)
})

/**
* Modal
*/
function openModal() {
  html.classList.add('fixed')
  modal.classList.add('modal--open')
  localStorage.setItem('modal', true)
}

function closeModal() {
  modal.classList.remove('modal--open');
  html.classList.remove('fixed')
  localStorage.setItem('modal', false)
}

if (JSON.parse(localStorage.getItem('modal')) === true) {
  openModal()
}

modalExit.addEventListener('click', closeModal);
newsBtn.addEventListener('click', function() {
  openModal()
})

document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key === "Escape") {
    closeModal()
  }
});

/**
* Dark/Light Theme
**/
if (themeValue === true) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

theme.addEventListener('click', function () {
  localStorage.setItem('darkTheme', theme.checked)
  if (theme.checked) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

theme.checked = themeValue


/**
* Format Numbers
**/
function format (num) {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

modalPrice.style.opacity = 0;
modalName.style.opacity = 0;
mainPosts.style.opacity = 0;

/**
* API call for ticker
**/
function getTicker(base, target) {
  fetch('https://api.cryptonator.com/api/full/' + base + '-' + target)
  .then(function(response) {
    return response.json();
  }).then(function(data) {
    if (!data.success) {
      change.classList.add('hide')
      main.classList.add('show')
      spinner.classList.add('hide')
      modalSpinner.classList.add('hide')
      name.classList.add('hide')
      price.innerHTML = 'No matches.'
      mainPosts.style.opacity = 1;
    } else {
      change.classList.remove('hide')
      main.classList.remove('show')
      spinner.classList.remove('hide')
      modalSpinner.classList.remove('hide')
      name.classList.remove('hide')
      mainPosts.style.opacity = 0;
    }

    main.classList.add('show')
    spinner.classList.add('hide')
    modalSpinner.classList.add('hide')
    mainPosts.style.opacity = 1;
    price.innerHTML = format(JSON.parse(data.ticker.price))
    name.innerHTML = data.ticker.base + ' to ' + data.ticker.target
    modalPrice.innerHTML = format(JSON.parse(data.ticker.price))
    modalName.innerHTML = data.ticker.base + ' to ' + data.ticker.target
    modalPrice.style.opacity = 1;
    modalName.style.opacity = 1;

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
})

targetDropdown.addEventListener('change', function () {
  localStorage.setItem('target', this.value)
})

if (!navigator.onLine) {
  main.classList.add('show')
  spinner.classList.add('hide')
  name.classList.add('hide')
  change.classList.add('hide')
  price.innerHTML = 'No Connection'
} else {
  change.classList.remove('hide')
  main.classList.remove('show')
  spinner.classList.remove('hide')
  name.classList.remove('hide')
}

setInterval(function () {
  getTicker(localStorage.getItem('base') || 'BTC', localStorage.getItem('target') || 'USD')
}, 500);
