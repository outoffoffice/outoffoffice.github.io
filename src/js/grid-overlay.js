// Easter egg: hold R for a second to see the page the way the grid does —
// the six columns' edges, numbered c1–c6, and each column's sub-line
// (--sub), drawn behind the content; plus a fine crosshair on the pointer
// (its x / y run in the corner readout).
// Hold R again to hide it all. Holding (not tapping) keeps it from firing
// by accident; it never fires while typing in a field. A short note says
// what's on. The homepage's project sheet has an opaque paper of its own,
// so it gets a second set of lines, between its paper and its content.
(function () {
  const HOLD = 1000;
  const COLS = 6;
  let overlays = [], note = null, cross = null;
  let on = false, timer = null, noteTimer = null;

  function lines(extraClass) {
    const el = document.createElement('div');
    el.className = 'grid-overlay' + (extraClass ? ' ' + extraClass : '');
    el.setAttribute('aria-hidden', 'true');
    let cols = '';
    for (let i = 1; i <= COLS; i++) cols += `<span><i>c${i}</i></span>`;
    el.innerHTML = '<div class="grid-overlay-cols">' + cols + '</div>';
    overlays.push(el);
    return el;
  }
  function build() {
    document.body.append(lines());
    document.querySelectorAll('.case-slide').forEach(slide => slide.prepend(lines('in-sheet')));
    note = document.createElement('p');
    note.className = 'grid-note';
    note.setAttribute('aria-live', 'polite');
    cross = document.createElement('div');
    cross.className = 'grid-cross';
    cross.setAttribute('aria-hidden', 'true');
    cross.innerHTML = '<span class="grid-cross-x"></span><span class="grid-cross-y"></span>';
    document.body.append(note, cross);
  }
  function toggle() {
    if (!overlays.length) build();
    on = !on;
    overlays.forEach(el => el.classList.toggle('is-on', on));
    cross.classList.toggle('is-on', on);
    note.textContent = on ? 'grid on: 6 columns · 24px gutter · 32px sub-line' : 'grid off';
    note.classList.add('is-on');
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => note.classList.remove('is-on'), 2500);
  }

  document.addEventListener('mousemove', (e) => {
    if (!on) return;
    cross.style.setProperty('--x', e.clientX + 'px');
    cross.style.setProperty('--y', e.clientY + 'px');
  });

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
