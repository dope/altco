const baseDropdown   = document.getElementById('base')
const targetDropdown = document.getElementById('target')
const name           = document.getElementById('name')
const price          = document.getElementById('price')
const change         = document.getElementById('change')
const theme          = document.getElementById('theme')
const hideNews       = document.getElementById('hideNews')
const color          = document.getElementById('color')
const arrow          = document.getElementById('arrow')
const spinner        = document.getElementById('spinner')
const modalSpinner   = document.getElementById('modalSpinner')
const main           = document.getElementById('main')
const themeValue     = JSON.parse(localStorage.getItem('darkTheme'))
const newsValue      = JSON.parse(localStorage.getItem('hideNews'))
const colorValue     = localStorage.getItem('color')
const html           = document.documentElement
const newsBtn        = document.querySelector('.newsBtn')
const settingsBtn    = document.querySelector('.settingsBtn')
const news           = document.querySelector('.modal--news')
const settings       = document.querySelector('.modal--settings')
const newsExit       = document.querySelector('.modal__overlay--news')
const settingsExit   = document.querySelector('.modal__overlay--settings')
const newsUrl        = 'https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey='
const newsApiKey     = '9df70807854047a1b82ae13db6478880'
const posts          = document.getElementById('posts')
const mainPosts      = document.getElementById('mainPosts')

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
function openModal(modal) {
  html.classList.add('fixed')
  modal.classList.add('modal--open')
}

function closeModal(modal) {
  modal.classList.remove('modal--open');
  html.classList.remove('fixed')
}

newsExit.addEventListener('click', function(modal) {
  closeModal(news)
})

settingsExit.addEventListener('click', function(modal) {
  closeModal(settings)
})

newsBtn.addEventListener('click', function(modal) {
  openModal(news)
})

settingsBtn.addEventListener('click', function(modal) {
  openModal(settings)
})

document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key === "Escape") {
    closeModal(news) || closeModal(settings)
  }

  if (key === 's') {
    openModal(settings)
    closeModal(news)
  }

  if (key === 'n') {
    openModal(news)
    closeModal(settings)
  }
});

/**
* Dark/Light Theme
**/
themeValue === true ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')

theme.addEventListener('click', function () {
  localStorage.setItem('darkTheme', theme.checked)
  theme.checked ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
})

theme.checked = themeValue

/**
* Show News Button
*/
newsValue === true ? newsBtn.classList.add('hidden') : newsBtn.classList.remove('hidden')

hideNews.addEventListener('click', function () {
  localStorage.setItem('hideNews', hideNews.checked)

  hideNews.checked ? newsBtn.classList.add('hidden') : newsBtn.classList.remove('hidden')
})

hideNews.checked = newsValue


/**
* Colour Changer
**/
function updateColor(changedColor) {
  let accentBackgrounds = document.getElementsByClassName('bg-accent');
  let accentColors = document.getElementsByClassName('c-accent');

  for (let i = 0; i < accentBackgrounds.length; i++) {
      accentBackgrounds[i].style.backgroundColor = changedColor;
  }

  for (let i = 0; i < accentColors.length; i++) {
      accentColors[i].style.color = changedColor;
  }
}

color.addEventListener('change', function() {
  localStorage.setItem('color', color.value)
  updateColor(color.value)
});

color.value = colorValue || '#3F79F6'

updateColor(colorValue)


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
    modalName.innerHTML = data.ticker.base + ' to ' + data.ticker.target
    modalPrice.innerHTML = format(JSON.parse(data.ticker.price))
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

baseDropdown.value = localStorage.getItem('base') || 'BTC'
targetDropdown.value = localStorage.getItem('target') || 'USD'

baseDropdown.addEventListener('change', function () {
  localStorage.setItem('base', this.value)
})

targetDropdown.addEventListener('change', function () {
  localStorage.setItem('target', this.value)
})

setInterval(function () {
  getTicker(localStorage.getItem('base') || 'BTC', localStorage.getItem('target') || 'USD')
}, 500);
