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
    count.textContent = filtered ? 'Найдено: ' + found + ' из ' + cards.length : cards.length + ' материалов'
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
