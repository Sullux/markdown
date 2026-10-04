const { getPresenterHtml } = require('../presenter')

const getPresenterScript = (title, themeCss) => {
  const html = JSON.stringify(getPresenterHtml(title, themeCss))

  return `function initPresenter(api) {
  var pWin = null, startTime = Date.now(), timerId = null;
  var bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('md-slides') : null;

  function pad(n) { return String(n).padStart(2, '0'); }
  function formatTime(ms) {
    var s = Math.floor(ms / 1000);
    return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
  }

  function sync() {
    if (bc) bc.postMessage({ type: 'sync', current: api.getCurrent() });
    if (!pWin || pWin.closed) return;
    var doc = pWin.document;
    var cur = api.getCurrent(), tot = api.getTotal(), slides = api.getSlides();
    var s = slides[cur];
    var currEl = doc.getElementById('p-curr-content');
    if (currEl && s) {
      currEl.innerHTML = s.innerHTML;
      var sn = currEl.querySelector('.speaker-notes'); if (sn) sn.remove();
    }
    var nextEl = doc.getElementById('p-next-content');
    if (nextEl) {
      if (cur + 1 < tot) {
        nextEl.innerHTML = slides[cur + 1].innerHTML;
        var nsn = nextEl.querySelector('.speaker-notes'); if (nsn) nsn.remove();
      } else {
        nextEl.innerHTML = '<div style="color:#64748b;font-style:italic;text-align:center;padding:2rem;">End of presentation</div>';
      }
    }
    var countEl = doc.getElementById('p-count');
    if (countEl) countEl.textContent = (cur + 1) + ' / ' + tot;
    var currNum = doc.getElementById('p-curr-num');
    if (currNum) currNum.textContent = cur + 1;
    var nextNum = doc.getElementById('p-next-num');
    if (nextNum) nextNum.textContent = cur + 1 < tot ? cur + 2 : '-';
    var notesEl = doc.getElementById('p-notes');
    if (notesEl && s) {
      var n = s.querySelector('.speaker-notes');
      notesEl.innerHTML = n ? n.innerHTML : '<p class="p-empty">No notes for this slide.</p>';
    }
  }

  function open() {
    if (pWin && !pWin.closed) { pWin.focus(); return; }
    pWin = window.open('', 'slides-presenter', 'width=1100,height=720,menubar=no,toolbar=no');
    if (!pWin) return;
    pWin.document.write(${html});
    pWin.document.close();

    pWin.document.addEventListener('keydown', function (e) {
      if (['ArrowRight', ' ', 'PageDown', 'l'].includes(e.key)) { e.preventDefault(); api.next(); }
      else if (['ArrowLeft', 'PageUp', 'h'].includes(e.key)) { e.preventDefault(); api.prev(); }
      else if (e.key === 'Home') { e.preventDefault(); api.goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); api.goTo(api.getTotal() - 1); }
      else if (e.key === 'Escape') { pWin.close(); }
    });

    var resetBtn = pWin.document.getElementById('p-btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', function () { startTime = Date.now(); });

    if (!timerId) {
      timerId = setInterval(function () {
        if (!pWin || pWin.closed) { clearInterval(timerId); timerId = null; return; }
        var elEl = pWin.document.getElementById('p-elapsed');
        if (elEl) elEl.textContent = formatTime(Date.now() - startTime);
        var clkEl = pWin.document.getElementById('p-clock');
        if (clkEl) {
          var now = new Date();
          clkEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
        }
      }, 1000);
    }
    sync();
  }

  if (bc) {
    bc.onmessage = function (e) {
      if (e.data && e.data.type === 'nav') api.goTo(e.data.index);
    };
  }

  return { open: open, sync: sync };
}`
}

module.exports = { getPresenterScript }
