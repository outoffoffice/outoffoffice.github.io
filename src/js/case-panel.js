// Case-study sheet: projects open in place instead of as separate pages. A
// sheet slides in from the right, as wide as four (smaller screens: five)
// columns of the page grid; the homepage stays visible (dimmed and slightly
// blurred) in the strip it leaves.
//
// The sheet shows the <article class="case"> of the real case-study page,
// fetched on demand. The URL follows (/work/arc/), so back/forward and shared
// links work; a case-study page opened directly hands its path over via
// sessionStorage (see layouts/casestudy.njk) and opens here.
(function () {
  const panel = document.getElementById('casePanel');
  if (!panel) return;
  const sheet = panel.querySelector('.case-sheet');
  const content = panel.querySelector('.case-content');

  const CASE_PATH = /^\/(work|lab)\/[^/]+\/$/;
  const homeTitle = document.title;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isOpen = false;
  let returnFocus = null;
  let homeUrl = location.pathname + location.hash;

  // ---- loading a case into the sheet ----
  // The sheet opens right away and shows a pulsing lime dot while the case
  // loads (.is-loading); the article goes in once it's there. `loadId`
  // tracks the newest request, so a slower earlier one, or one for a sheet
  // closed in the meantime, is dropped.
  let loadId = 0;
  async function fetchCase(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(res.status);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const article = doc.querySelector('article.case');
    if (!article) throw new Error('no article');
    article.classList.remove('content-col');
    return { article, title: doc.title };
  }
  function setLoading(on) {
    panel.classList.toggle('is-loading', on);
    sheet.setAttribute('aria-busy', String(on));
  }

  async function open(path, { push = true } = {}) {
    const id = ++loadId;
    setLoading(true);
    if (!isOpen) {
      isOpen = true;
      returnFocus = document.activeElement;
      panel.hidden = false;
      sheet.scrollTop = 0;
      document.documentElement.classList.add('case-open');
      requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add('is-open')));
      // focus goes to the sheet itself (no ring), Tab then reaches the close
      // button; focusing the button directly made Safari draw its focus ring
      sheet.focus({ preventScroll: true });
    }
    let loaded;
    try {
      loaded = await fetchCase(path);
    } catch (e) {
      if (id === loadId) location.href = path + '?solo';  // fall back to the plain page
      return;
    }
    if (id !== loadId || !isOpen) return;
    content.replaceChildren(document.importNode(loaded.article, true));
    document.title = loaded.title || homeTitle;
    sheet.scrollTop = 0;
    setLoading(false);
    if (push) history.pushState({ case: path }, '', path);
  }

  // Closing steps back through history when the sheet put an entry there
  // (popstate then finishes the close), so back/forward stay clean.
  function requestClose() {
    if (history.state && history.state.case) history.back();
    else close();
  }
  function close({ pop = false } = {}) {
    if (!isOpen) return;
    isOpen = false;
    loadId++;  // a case still loading won't open anymore
    setLoading(false);
    if (!pop) history.replaceState(null, '', homeUrl);
    panel.classList.remove('is-open');
    document.title = homeTitle;
    setTimeout(() => {
      if (isOpen) return;
      // back to the top while it can still scroll: a hidden (display:none)
      // sheet ignores scrollTop, so the next project would open where this
      // one was left
      sheet.scrollTop = 0;
      panel.hidden = true;
      document.documentElement.classList.remove('case-open');
      content.replaceChildren();
    }, reduceMotion ? 0 : 700);
    if (returnFocus) returnFocus.focus({ preventScroll: true });
  }

  // Project tiles, and any case link inside the sheet, open
  // here instead of navigating away. Modifier clicks keep their usual job.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !CASE_PATH.test(url.pathname)) return;
    e.preventDefault();
    if (!isOpen) homeUrl = location.pathname + location.hash;
    open(url.pathname);
  });
  panel.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', requestClose));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) requestClose(); });
  window.addEventListener('popstate', () => {
    if (CASE_PATH.test(location.pathname)) open(location.pathname, { push: false });
    else close({ pop: true });
  });

  // A case-study page opened directly sent us its path: open it here, with
  // the homepage (scrolled to the gallery) as the entry "back" returns to.
  let handoff = null;
  try {
    handoff = sessionStorage.getItem('openCase');
    sessionStorage.removeItem('openCase');
  } catch (e) {}
  if (handoff && CASE_PATH.test(handoff)) {
    homeUrl = '/#work';
    open(handoff);
  }
})();
