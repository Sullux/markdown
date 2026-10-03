const getClientScript = () => `(function () {
  var slides = Array.from(document.querySelectorAll('.slide'));
  var total = slides.length, current = 0;
  var counter = document.querySelector('.slide-counter');
  var progress = document.querySelector('.deck-progress');
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
  }

  function next() {
    var s = slides[current], steps = initSteps(s);
    if (s._stepIdx < steps.length) { steps[s._stepIdx++].classList.add('visible'); }
    else { goTo(current + 1, 'next'); }
  }

  function prev() {
    var s = slides[current], steps = initSteps(s);
    if (s._stepIdx > 0) { steps[--s._stepIdx].classList.remove('visible'); }
    else { goTo(current - 1, 'prev'); }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {});
    else document.exitFullscreen().catch(function () {});
  }

  function toggleNotes() { document.body.classList.toggle('show-notes'); }

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (['ArrowRight', ' ', 'PageDown', 'l'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'h'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
    else if (e.key === 'f') { e.preventDefault(); toggleFullscreen(); }
    else if (e.key === 's') { e.preventDefault(); toggleNotes(); }
    else if (e.key === 'Escape' && document.body.classList.contains('show-notes')) { toggleNotes(); }
  });

  var bind = function (sel, fn) { var el = document.querySelector(sel); if (el) el.addEventListener('click', fn); };
  bind('.btn-next', next); bind('.btn-prev', prev); bind('.btn-fullscreen', toggleFullscreen);
  bind('.btn-notes', toggleNotes); bind('.notes-close-btn', toggleNotes);

  window.addEventListener('hashchange', function () {
    var m = window.location.hash.match(/^#slide-(\\d+)$/);
    var h = m ? parseInt(m[1], 10) - 1 : 0;
    if (h !== current) goTo(h);
  });

  goTo(window.location.hash ? (parseInt((window.location.hash.match(/^#slide-(\\d+)$/) || [])[1], 10) - 1 || 0) : 0);
})();`

module.exports = { getClientScript }
