const getScaleScript = () => `
  function fitCanvas() {
    var ratio = document.documentElement.getAttribute('data-ratio') || '16:9';
    var is43 = ratio === '4:3';
    var targetW = is43 ? 1440 : 1920;
    var targetH = 1080;
    var margin = 32;
    var availableW = Math.max(100, window.innerWidth - margin);
    var availableH = Math.max(100, window.innerHeight - margin);
    var scale = Math.min(availableW / targetW, availableH / targetH);
    document.documentElement.style.setProperty('--deck-scale', scale);
  }
  window.addEventListener('resize', fitCanvas);
  window.addEventListener('load', fitCanvas);
  fitCanvas();
`

module.exports = { getScaleScript }
