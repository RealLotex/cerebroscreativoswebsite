(() => {
  const BRAND_RE = /Cerebros\s*Creativos|CerebrosCreativos/i;

  function directText(el) {
    return Array.from(el.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function addBrandMark(root) {
    if (!root || root.querySelector('.cc-navbar-mark')) return;

    const candidates = Array.from(root.querySelectorAll('div, a, span, h1, h2, h3'));
    const target = candidates.find(el => BRAND_RE.test(directText(el)));

    if (!target) return;

    target.classList.add('cc-brand-lockup');

    const img = document.createElement('img');
    img.src = './cc-favicon.png';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.className = 'cc-navbar-mark';
    target.prepend(img);
  }

  function applyBranding() {
    document.querySelectorAll('nav').forEach(addBrandMark);

    // Legal/utility pages use a header as their navigation bar.
    document.querySelectorAll('header').forEach(header => {
      if (!header.closest('nav')) addBrandMark(header);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBranding);
  } else {
    applyBranding();
  }
})();