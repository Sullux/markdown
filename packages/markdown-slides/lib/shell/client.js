const getClientScript = () => `(function () {
  var slides = Array.from(document.querySelectorAll('.slide'));
  var total = slides.length;
  var current = 0;
  var counter = document.querySelector('.slide-counter');
  var progress = document.querySelector('.deck-progress');

  function getSlideFromHash() {
    var match = window.location.hash.match(/^#slide-(\\d+)$/);
    if (match) {
      var idx = parseInt(match[1], 10) - 1;
      if (idx >= 0 && idx < total) return idx;
    }
    return 0;
  }

  function goTo(index) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    current = index;
    slides.forEach(function (s, i) {
      if (i === current) s.classList.add('active');
      else s.classList.remove('active');
    });
    if (counter) counter.textContent = (current + 1) + ' / ' + total;
    if (progress) progress.style.width = ((current + 1) / total * 100) + '%';
    window.location.hash = 'slide-' + (current + 1);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen().catch(function () {});
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'l') {
      e.preventDefault(); next();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'h') {
      e.preventDefault(); prev();
    } else if (e.key === 'Home') {
      e.preventDefault(); goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault(); goTo(total - 1);
    } else if (e.key === 'f') {
      e.preventDefault(); toggleFullscreen();
    }
  });

  var nextBtn = document.querySelector('.btn-next');
  var prevBtn = document.querySelector('.btn-prev');
  var fsBtn = document.querySelector('.btn-fullscreen');
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

  window.addEventListener('hashchange', function () {
    var h = getSlideFromHash();
    if (h !== current) goTo(h);
  });

  goTo(getSlideFromHash());
})();`

module.exports = { getClientScript }
