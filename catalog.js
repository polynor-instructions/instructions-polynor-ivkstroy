(function () {
  var tools = document.getElementById('catalog-tools')
  var search = document.getElementById('catalog-search')
  var count = document.getElementById('catalog-count')
  var empty = document.getElementById('catalog-empty')
  var reset = document.getElementById('catalog-reset')
  var cards = Array.prototype.slice.call(document.querySelectorAll('#catalog-grid .card'))
  var filters = Array.prototype.slice.call(tools.querySelectorAll('[data-filter]'))
  var selection = 'all'

  function normalize(text) {
    return text.toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9]+/g, ' ').trim()
  }

  var termsByCard = cards.map(function (card) {
    return normalize(card.getAttribute('data-search') + ' ' + card.textContent)
  })

  function update() {
    var query = normalize(search.value)
    var terms = query ? query.split(' ') : []
    var found = 0

    cards.forEach(function (card, index) {
      var matchesType = selection === 'all' || card.getAttribute('data-type') === selection
      var matchesTerms = terms.every(function (term) {
        return termsByCard[index].indexOf(term) !== -1
      })
      var visible = matchesType && matchesTerms
      card.hidden = !visible
      if (visible) found += 1
    })

    empty.hidden = found > 0
    var filtered = query || selection !== 'all'
    count.textContent = filtered ? 'Найдено: ' + found + ' из ' + cards.length : cards.length + ' позиций'
  }

  function selectFilter(value) {
    selection = value
    filters.forEach(function (filter) {
      filter.setAttribute('aria-pressed', String(filter.getAttribute('data-filter') === value))
    })
    update()
  }

  filters.forEach(function (filter) {
    filter.addEventListener('click', function () {
      selectFilter(filter.getAttribute('data-filter'))
    })
  })

  search.addEventListener('input', update)
  search.addEventListener('search', update)
  reset.addEventListener('click', function () {
    search.value = ''
    selectFilter('all')
    search.focus()
  })

  update()
  tools.hidden = false
}())

;(function () {
  var posters = document.querySelectorAll('.video-poster[data-embed]')
  var active = null

  Array.prototype.forEach.call(posters, function (poster) {
    poster.addEventListener('click', function (event) {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      event.preventDefault()

      if (active) active.frame.parentNode.replaceChild(active.poster, active.frame)
      var frame = document.createElement('iframe')
      var url = poster.getAttribute('data-embed')
      frame.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1'
      frame.title = poster.getAttribute('data-title')
      frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen')
      frame.setAttribute('allowfullscreen', '')
      frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
      poster.parentNode.replaceChild(frame, poster)
      active = { frame: frame, poster: poster }
      frame.focus()
    })
  })
}())
