const getSearchScript = () => `
<script>
(function() {
  var searchInput = document.getElementById('doc-search');
  var resultsContainer = document.getElementById('search-results');
  if (!searchInput || !resultsContainer) return;

  var index = [];
  fetch('search-index.json')
    .then(function(res) { return res.json(); })
    .then(function(data) { index = data; })
    .catch(function() {});

  searchInput.addEventListener('input', function(e) {
    var query = e.target.value.toLowerCase().trim();
    if (!query) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      return;
    }

    var matches = index.filter(function(item) {
      return item.title.toLowerCase().indexOf(query) !== -1 ||
             item.content.toLowerCase().indexOf(query) !== -1;
    }).slice(0, 8);

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<div class="search-item">No results found</div>';
    } else {
      resultsContainer.innerHTML = matches.map(function(item) {
        return '<a href="' + item.href + '" class="search-item"><strong>' + item.title + '</strong></a>';
      }).join('');
    }
    resultsContainer.style.display = 'block';
  });
})();
</script>
`

module.exports = { getSearchScript }
