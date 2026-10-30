// Lightbox: any image inside a case-study article (on its own page or in
// the homepage's slide-in sheet) opens as large as the screen allows, with
// its caption if it has one. Clicking anywhere or Escape closes it.
// On touch screens the image can be zoomed like in a photo app: pinch,
// double-tap to zoom in on a spot (and back), drag to look around; a single
// tap closes it while it isn't zoomed.
(function () {
  const box = document.createElement('figure');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Enlarged image, click or press Escape to close, pinch to zoom');
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
    pointers.clear();
    gesture = null;
    resetZoom();
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
  // mouse clicks close it; touch taps are handled with the zoom below
  box.addEventListener('click', () => { if (lastPointer !== 'touch') close(); });

  // ---- zoom on touch ----
  const MAX = 4, DOUBLE = 2.5;
  const pointers = new Map();
  let scale = 1, tx = 0, ty = 0;
  let gesture = null;            // what the fingers on screen are doing
  let lastPointer = 'mouse', lastTap = 0, tapTimer = null;

  function apply(animate) {
    big.style.transition = animate ? 'transform 0.25s ease' : 'none';
    big.style.transform = scale === 1 ? '' : `translate(${tx}px, ${ty}px) scale(${scale})`;
    box.classList.toggle('is-zoomed', scale > 1);
  }
  // keeps the image's edges from being pulled in past the screen's
  function clampPan() {
    const mx = Math.max(0, (big.offsetWidth * scale - innerWidth) / 2);
    const my = Math.max(0, (big.offsetHeight * scale - innerHeight) / 2);
    tx = Math.min(mx, Math.max(-mx, tx));
    ty = Math.min(my, Math.max(-my, ty));
  }
  function resetZoom(animate) {
    scale = 1; tx = 0; ty = 0;
    apply(animate);
  }
  // the image's untransformed center on screen (transform origin is center)
  function center() {
    const r = big.getBoundingClientRect();
    return { x: r.left + r.width / 2 - tx, y: r.top + r.height / 2 - ty };
  }
  // scale to `next`, keeping the image point under `from` (at the scale
  // and offset in `start`) under the screen point `to`
  function zoomAround(next, start, from, to) {
    const k = next / start.scale;
    scale = next;
    tx = (to.x - start.c.x) - k * (from.x - start.c.x - start.tx);
    ty = (to.y - start.c.y) - k * (from.y - start.c.y - start.ty);
    if (scale <= 1) { scale = 1; tx = 0; ty = 0; }
    clampPan();
  }
  const mid = () => {
    const [a, b] = pointers.values();
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) };
  };

  box.addEventListener('pointerdown', (e) => {
    lastPointer = e.pointerType;
    if (e.pointerType !== 'touch') return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const state = { scale, tx, ty, c: center() };
    if (pointers.size === 2) {
      gesture = { type: 'pinch', start: state, m: mid() };
    } else if (pointers.size === 1) {
      gesture = { type: 'pan', start: state, x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
    }
  });
  box.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId) || !gesture) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (gesture.type === 'pinch' && pointers.size === 2) {
      const m = mid();
      const next = Math.min(MAX, Math.max(1, gesture.start.scale * m.d / gesture.m.d));
      zoomAround(next, gesture.start, gesture.m, m);
      apply(false);
    } else if (gesture.type === 'pan') {
      const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
      if (Math.hypot(dx, dy) > 8) gesture.moved = true;
      if (scale > 1) {
        tx = gesture.start.tx + dx; ty = gesture.start.ty + dy;
        clampPan();
        apply(false);
      }
    }
  });
  function pointerEnd(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    const g = gesture;
    if (pointers.size === 1) {
      // one finger left after a pinch: carry on as a pan from here
      const [p] = pointers.values();
      gesture = { type: 'pan', start: { scale, tx, ty, c: center() }, x: p.x, y: p.y, t: 0, moved: true };
      return;
    }
    gesture = null;
    if (pointers.size || !g || g.type !== 'pan' || g.moved || Date.now() - g.t > 300) return;
    // a tap: a second one soon after zooms in (or back out), a single
    // one closes when nothing is zoomed
    const now = Date.now();
    if (now - lastTap < 300) {
      clearTimeout(tapTimer);
      lastTap = 0;
      if (scale > 1) resetZoom(true);
      else {
        const p = { x: e.clientX, y: e.clientY };
        zoomAround(DOUBLE, { scale: 1, tx: 0, ty: 0, c: center() }, p, p);
        apply(true);
      }
    } else {
      lastTap = now;
      tapTimer = setTimeout(() => { if (scale === 1) close(); }, 300);
    }
  }
  box.addEventListener('pointerup', pointerEnd);
  box.addEventListener('pointercancel', pointerEnd);
  // Escape closes the lightbox first; the sheet behind stays open.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !box.hidden) { e.stopImmediatePropagation(); close(); }
  }, true);
})();
