// NOT LOADED ANYWHERE right now — kept for a hidden easter egg later.
// To use it, mark images' containers with class "pixel-tile" (data-mono to
// keep them blue) and include <script src="/js/pixelate.js" defer>; the
// matching styles are in git history (index.html, ".pixel-tile").
//
// Pixel-resolve tiles: every .pixel-tile image rests as a blue duotone pixel
// version of itself (drawn on a canvas laid over the image). Hovering
// resolves it smoothly — block size shrinking step by step down to a sharp
// blue image — and a second later the real colors fade in. Leaving runs it
// backwards. Tiles marked data-mono stay blue all the way (no color reveal).
// Analog intention → digital response, as a hover.
//
// Block sizes are in CSS pixels, so every tile, whatever its width, shows
// the same pixel grain. Only on devices that can hover; touch screens just
// show the real images.
(function () {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BLOCKS = [14, 11, 8, 6, 4, 3, 2, 0];  // block size in px, coarse → fine; 0 = sharp
  const STEP_MS = 55;          // time per step
  const COLOR_DELAY_MS = 1000; // sharp blue holds this long before the colors come in

  // The site blue, read from the CSS token, as 0–1 RGB.
  const hex = getComputedStyle(document.documentElement).getPropertyValue('--blue').trim() || '#2b4eff';
  const blue = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);

  document.querySelectorAll('.pixel-tile').forEach(tile => {
    const img = tile.querySelector('img');
    if (!img) return;
    const mono = tile.hasAttribute('data-mono');
    tile.classList.add('is-pixel');

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    tile.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let level = 0;
    let stepTimer = null;
    let colorTimer = null;
    let cache = new Map();  // block size → finished duotone canvas at that grain

    // Duotone version of the image at one grain: cropped like
    // object-fit:cover, shrunk to (tile width / block) pixels across (or the
    // canvas's full resolution for block 0), each pixel's grey value
    // screened with the blue.
    function frame(block) {
      if (cache.has(block)) return cache.get(block);
      const w = tile.clientWidth, h = tile.clientHeight;
      const sw = block ? Math.max(1, Math.round(w / block)) : canvas.width;
      const sh = block ? Math.max(1, Math.round(h / block)) : canvas.height;
      const small = document.createElement('canvas');
      small.width = sw; small.height = sh;
      const sctx = small.getContext('2d', { willReadFrequently: true });

      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const cw = w / scale, ch = h / scale;
      sctx.drawImage(img, (img.naturalWidth - cw) / 2, (img.naturalHeight - ch) / 2, cw, ch, 0, 0, sw, sh);

      const data = sctx.getImageData(0, 0, sw, sh);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        const g = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
        px[i]     = 255 * (1 - (1 - g) * (1 - blue[0]));
        px[i + 1] = 255 * (1 - (1 - g) * (1 - blue[1]));
        px[i + 2] = 255 * (1 - (1 - g) * (1 - blue[2]));
      }
      sctx.putImageData(data, 0, 0);
      cache.set(block, small);
      return small;
    }

    function render() {
      const w = tile.clientWidth, h = tile.clientHeight;
      if (!w || !h || !img.naturalWidth) return;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        cache = new Map();
      }
      const block = BLOCKS[level];
      ctx.imageSmoothingEnabled = block === 0;
      ctx.drawImage(frame(block), 0, 0, canvas.width, canvas.height);
    }

    // Steps one level at a time towards `target`; arriving at the sharp end
    // starts the countdown to the color reveal.
    function goTo(target) {
      clearInterval(stepTimer);
      if (reduceMotion) { level = target; render(); return arrived(); }
      stepTimer = setInterval(() => {
        if (level === target) { clearInterval(stepTimer); return arrived(); }
        level += target > level ? 1 : -1;
        render();
      }, STEP_MS);
    }
    function arrived() {
      if (!mono && level === BLOCKS.length - 1) {
        colorTimer = setTimeout(() => tile.classList.add('is-open'), reduceMotion ? 0 : COLOR_DELAY_MS);
      }
    }
    function enter() {
      clearTimeout(colorTimer);
      goTo(BLOCKS.length - 1);
    }
    function leave() {
      clearTimeout(colorTimer);
      tile.classList.remove('is-open');
      goTo(0);
    }

    const ready = () => { level = 0; render(); };
    if (img.complete && img.naturalWidth) ready();
    else img.addEventListener('load', ready, { once: true });

    const hoverTarget = tile.closest('a') || tile;
    hoverTarget.addEventListener('mouseenter', enter);
    hoverTarget.addEventListener('mouseleave', leave);
    hoverTarget.addEventListener('focus', enter);
    hoverTarget.addEventListener('blur', leave);
    window.addEventListener('resize', render);
  });
})();
