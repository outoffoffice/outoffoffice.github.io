// Header menu: a lime circle that expands into the about / work / lab tab
// bar. Opens on hover or tap, collapses again on its own after a few
// seconds of inactivity (sooner right after a tab was picked), on outside
// click, or on Escape.
//
// The dark selector pill is moved with OutOffTabs.select(name) — the
// homepage calls it while scrolling. On other pages (404) the tabs are
// plain links back into the homepage.
(function () {
  const nav = document.getElementById('tabs');
  if (!nav) return;
  const toggle = nav.querySelector('.tabs-toggle');
  const links = Array.from(nav.querySelectorAll('a'));

  const IDLE_MS = 4000;    // collapse after this long without interaction
  const PICKED_MS = 1200;  // ...or this long after a tab was picked
  let timer = null;

  function arm(ms) {
    clearTimeout(timer);
    timer = setTimeout(close, ms);
  }
  function open() {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    arm(IDLE_MS);
  }
  function close() {
    clearTimeout(timer);
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    open();
    const active = nav.querySelector('a.active') || links[0];
    active.focus({ preventScroll: true });
  });
  if (window.matchMedia('(hover: hover)').matches) {
    nav.addEventListener('mouseenter', open);
  }
  nav.addEventListener('mouseleave', () => { if (nav.classList.contains('open')) arm(IDLE_MS); });
  nav.addEventListener('focusin', () => clearTimeout(timer));
  links.forEach(a => a.addEventListener('click', () => arm(PICKED_MS)));
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Marks the active tab and slides the selector pill to it (via --i).
  // "all" stands for the gallery unfiltered: the pill stretches over both
  // work and lab. While work, lab or all is selected, the lighter group
  // pill around those two shows as well.
  function select(name) {
    const names = name === 'all' ? ['work', 'lab'] : [name];
    links.forEach(a => {
      const on = names.includes(a.dataset.tab);
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    // Nothing to mark (e.g. "home", the intro above all tabs): no pill.
    const first = links.findIndex(a => a.dataset.tab === names[0]);
    nav.classList.toggle('has-pill', first !== -1);
    if (first === -1) { nav.classList.remove('in-group'); return; }
    nav.style.setProperty('--i', first);
    nav.style.setProperty('--span', names.length);
    nav.classList.toggle('in-group', ['work', 'lab', 'all'].includes(name));
  }

  window.OutOffTabs = { select };
})();
