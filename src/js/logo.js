// Logo: every now and then the blue cursor backspaces "OutOff" and types
// "Derek Milai" in its place, holds it, then types its way back.
// OutOff_ == Derek Milai_ — same person, two names. Skipped entirely under
// "reduce motion"; screen readers get both names from the link's label.
(function () {
  const logos = document.querySelectorAll('.logo');
  if (!logos.length) return;
  logos.forEach(a => a.setAttribute('aria-label', 'OutOff — Derek Milai, home'));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const NAMES = ['OutOff', 'Derek Milai'];
  const HOLD_BRAND = 9000;   // how long "OutOff" stays
  const HOLD_NAME = 4200;    // how long "Derek Milai" stays
  const FIRST = 5000;        // first switch after page load
  const ERASE = 55;          // ms per deleted character
  const TYPE = 85;           // ms per typed character (plus a little jitter)

  const brands = Array.from(logos, a => a.querySelector('.brand')).filter(Boolean);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const set = text => brands.forEach(b => { b.textContent = text; });
  const typing = on => logos.forEach(a => a.classList.toggle('is-typing', on));

  async function swap(from, to) {
    typing(true);
    for (let i = from.length - 1; i >= 0; i--) { set(from.slice(0, i)); await wait(ERASE); }
    await wait(260);
    for (let i = 1; i <= to.length; i++) { set(to.slice(0, i)); await wait(TYPE + Math.random() * 60); }
    typing(false);
  }

  async function loop() {
    await wait(FIRST);
    let i = 0;
    for (;;) {
      // don't play to an empty room: wait until the tab is visible again
      while (document.hidden) await wait(1000);
      const next = (i + 1) % NAMES.length;
      await swap(NAMES[i], NAMES[next]);
      i = next;
      await wait(i === 0 ? HOLD_BRAND : HOLD_NAME);
    }
  }
  loop();
})();
