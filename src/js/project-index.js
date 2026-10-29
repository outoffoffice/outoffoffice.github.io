// Homepage index: the list view of every project, folded away above the
// gallery and opened with the "index" toggle. Its state — open, type
// filter, search — lives in the URL hash (#view=list&type=client&q=nfc), so
// a view can be shared; closed it's just #work. Entries are rendered at
// build time (collections.index in .eleventy.js); this only shows, hides and
// counts.
(function () {
  const panel = document.getElementById('idxPanel');
  if (!panel) return;
  const section = document.getElementById('work');
  const toggle = document.querySelector('.idx-toggle');
  const typeButtons = panel.querySelectorAll('[data-idx-type]');
  const search = document.getElementById('idxSearch');  // only with many entries
  const rows = Array.from(panel.querySelectorAll('li[data-type]'));
  const total = document.getElementById('idxTotal');
  const empty = document.getElementById('idxEmpty');
  const types = Array.from(typeButtons, b => b.dataset.idxType);

  let state = { open: false, type: 'all', q: '' };

  function render() {
    panel.classList.toggle('is-open', state.open);
    toggle.setAttribute('aria-expanded', String(state.open));
    const q = state.q.trim().toLowerCase();
    let n = 0;
    rows.forEach(li => {
      const show = (state.type === 'all' || li.dataset.type === state.type)
        && (!q || li.textContent.toLowerCase().includes(q));
      li.hidden = !show;
      if (show) n++;
    });
    total.textContent = n;
    empty.hidden = n > 0;
    typeButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.idxType === state.type)));
    if (search && search.value !== state.q) search.value = state.q;
  }

  function writeHash() {
    if (!state.open) return history.replaceState(history.state, '', '#work');
    const params = new URLSearchParams({ view: 'list' });
    if (state.type !== 'all') params.set('type', state.type);
    if (state.q) params.set('q', state.q);
    history.replaceState(history.state, '', '#' + params.toString());
  }

  // Reads the state from the hash; returns false when the hash isn't about
  // the index (e.g. #about), leaving the state alone.
  function readHash() {
    const hash = location.hash.slice(1);
    if (!/(^|&)view=list(&|$)/.test(hash)) return false;
    const params = new URLSearchParams(hash);
    state = {
      open: true,
      type: types.includes(params.get('type')) ? params.get('type') : 'all',
      q: search ? params.get('q') || '' : '',
    };
    return true;
  }

  toggle.addEventListener('click', () => {
    state.open = !state.open;
    render();
    writeHash();
  });
  typeButtons.forEach(b => b.addEventListener('click', () => {
    state.type = b.dataset.idxType;
    render();
    writeHash();
  }));
  if (search) search.addEventListener('input', () => {
    state.q = search.value;
    render();
    writeHash();
  });
  window.addEventListener('hashchange', () => { if (readHash()) render(); });

  // A shared link like /#view=list lands on the work section, index open.
  const deepLink = readHash();
  render();
  if (deepLink) section.scrollIntoView();
})();
