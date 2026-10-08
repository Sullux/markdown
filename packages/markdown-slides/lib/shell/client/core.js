const getCoreScript = () => `
  var slides = Array.from(document.querySelectorAll('.slide'));
  var total = slides.length, current = 0, presenter = null;
  var counter = document.querySelector('.slide-counter'), progress = document.querySelector('.deck-progress');
  var notesContent = document.querySelector('.notes-content');

  function initSteps(slide) {
    if (slide._steps) return slide._steps;
    if (slide.hasAttribute('data-steps')) {
      slide.querySelectorAll('.slide-body li, .slide-columns .slide-col').forEach(function (el) { el.classList.add('step'); });
    }
    var trans = slide.getAttribute('data-transitions');
    if (trans) {
      try {
        JSON.parse(trans).forEach(function (sel) { var el = slide.querySelector(sel); if (el) el.classList.add('step'); });
      } catch (e) {}
    }
    slide._steps = Array.from(slide.querySelectorAll('.step'));
    slide._stepIdx = 0;
    return slide._steps;
  }

  function updateNotes(slide) {
    if (!notesContent) return;
    var n = slide.querySelector('.speaker-notes');
    notesContent.innerHTML = n ? n.innerHTML : '<p class="notes-empty">No notes for this slide.</p>';
  }

  function goTo(index, fromDir) {
    current = Math.max(0, Math.min(index, total - 1));
    slides.forEach(function (s, i) {
      s.classList.toggle('active', i === current);
      if (i === current) {
        var steps = initSteps(s);
        s._stepIdx = fromDir === 'prev' ? steps.length : 0;
        steps.forEach(function (st, idx) { st.classList.toggle('visible', idx < s._stepIdx); });
        updateNotes(s);
      }
    });
    if (counter) counter.textContent = (current + 1) + ' / ' + total;
    if (progress) progress.style.width = ((current + 1) / total * 100) + '%';
    window.location.hash = 'slide-' + (current + 1);
    if (presenter) presenter.sync();
  }

  function next() {
    var s = slides[current], steps = initSteps(s);
    if (s._stepIdx < steps.length) steps[s._stepIdx++].classList.add('visible');
    else if (current < total - 1) goTo(current + 1, 'next');
  }

  function prev() {
    var s = slides[current], steps = initSteps(s);
    if (s._stepIdx > 0) steps[--s._stepIdx].classList.remove('visible');
    else if (current > 0) goTo(current - 1, 'prev');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {});
    else document.exitFullscreen().catch(function () {});
  }
  document.addEventListener('fullscreenchange', function () { document.body.classList.toggle('is-fullscreen', Boolean(document.fullscreenElement)); });

  function toggleNotes() { document.body.classList.toggle('show-notes'); }

  var api = { getCurrent: function () { return current; }, getTotal: function () { return total; }, getSlides: function () { return slides; }, goTo: goTo, next: next, prev: prev };
  presenter = initPresenter(api);

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    var k = e.key;
    if (['ArrowRight', ' ', 'PageDown', 'l'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'h'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); goTo(0); }
    else if (k === 'End') { e.preventDefault(); goTo(total - 1); }
    else if (k === 'f') { e.preventDefault(); toggleFullscreen(); }
    else if (k === 's') { e.preventDefault(); toggleNotes(); }
    else if (k === 'p') { e.preventDefault(); presenter.open(); }
    else if (k === 'Escape' && document.body.classList.contains('show-notes')) toggleNotes();
  });

  [['.btn-next', next], ['.btn-prev', prev], ['.btn-fullscreen', toggleFullscreen],
   ['.btn-notes', toggleNotes], ['.notes-close-btn', toggleNotes],
   ['.btn-presenter', presenter.open], ['.notes-popout-btn', presenter.open]
  ].forEach(function (p) {
    var el = document.querySelector(p[0]); if (el) el.addEventListener('click', p[1]);
  });

  window.addEventListener('hashchange', function () {
    var m = window.location.hash.match(/^#slide-(\\d+)$/);
    var h = m ? parseInt(m[1], 10) - 1 : 0;
    if (h !== current) goTo(h);
  });
  goTo(window.location.hash ? (parseInt((window.location.hash.match(/^#slide-(\\d+)$/) || [])[1], 10) - 1 || 0) : 0);`

module.exports = { getCoreScript }
