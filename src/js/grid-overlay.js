// Easter egg: hold R for a second to show the page grid — the six columns'
// edges and each column's sub-line (--sub), drawn behind the content — and
// again to hide it. Holding (not tapping) keeps it from firing by accident;
// it never fires while typing in a field. A short note says what's on.
// The homepage's project sheet has an opaque paper of its own, so it gets a
// second set of lines, between its paper and its content.
(function () {
  const HOLD = 1000;
  let overlays = [], note = null;
  let timer = null, noteTimer = null;

  function lines(extraClass) {
    const el = document.createElement('div');
    el.className = 'grid-overlay' + (extraClass ? ' ' + extraClass : '');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="grid-overlay-cols">' + '<span></span>'.repeat(6) + '</div>';
    overlays.push(el);
    return el;
  }
  function build() {
    document.body.append(lines());
    document.querySelectorAll('.case-slide').forEach(slide => slide.prepend(lines('in-sheet')));
    note = document.createElement('p');
    note.className = 'grid-note';
    note.setAttribute('aria-live', 'polite');
    document.body.append(note);
  }
  function toggle() {
    if (!overlays.length) build();
    const on = !overlays[0].classList.contains('is-on');
    overlays.forEach(el => el.classList.toggle('is-on', on));
    note.textContent = on ? 'grid on: 6 columns · 24px gutter · 32px sub-line' : 'grid off';
    note.classList.add('is-on');
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => note.classList.remove('is-on'), 2500);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'r' || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    clearTimeout(timer);
    timer = setTimeout(toggle, HOLD);
  });
  document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'r') clearTimeout(timer);
  });
  window.addEventListener('blur', () => clearTimeout(timer));
})();
