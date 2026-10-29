// Lightbox: any image inside a case-study article (on its own page or in
// the homepage's slide-in sheet) opens as large as the screen allows, with
// its caption if it has one. Clicking anywhere or Escape closes it.
(function () {
  const box = document.createElement('figure');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Enlarged image, click or press Escape to close');
  box.tabIndex = -1;
  box.innerHTML = '<img alt=""><figcaption></figcaption>';
  document.body.appendChild(box);
  const big = box.querySelector('img');
  const caption = box.querySelector('figcaption');
  let returnFocus = null;

  function open(img) {
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    const block = img.closest('.image-block');
    const text = block && block.querySelector('.ph-caption');
    caption.textContent = text ? text.textContent : '';
    caption.hidden = !caption.textContent;
    returnFocus = document.activeElement;
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('is-open'));
    box.focus({ preventScroll: true });
  }
  function close() {
    if (box.hidden) return;
    box.classList.remove('is-open');
    setTimeout(() => { box.hidden = true; big.removeAttribute('src'); }, 300);
    if (returnFocus) returnFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const img = e.target.closest('.case .hero-image img, .case .case-body img');
    if (img) { e.preventDefault(); open(img); }
  });
  box.addEventListener('click', close);
  // Escape closes the lightbox first; the sheet behind stays open.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !box.hidden) { e.stopImmediatePropagation(); close(); }
  }, true);
})();
