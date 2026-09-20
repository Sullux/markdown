const KATEX_HEAD = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />',
  '<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>',
  '<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body, { delimiters: [{left: \'$$\', right: \'$$\', display: true}, {left: \'$\', right: \'$\', display: false}], throwOnError: false });"></script>',
]

const MERMAID_HEAD = [
  `<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  const getTheme = () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default';
  mermaid.initialize({ startOnLoad: true, theme: getTheme() });
  window.addEventListener('@sullux/markdown:theme', (e) => {
    mermaid.initialize({ theme: e.detail?.mode === 'dark' ? 'dark' : 'default' });
  });
</script>`,
]

module.exports = { KATEX_HEAD, MERMAID_HEAD }
