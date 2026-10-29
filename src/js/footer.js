// Footer: email link + paper/dark color-mode toggle, shared by every page.
(function () {
  // The address is assembled here at runtime instead of sitting in the HTML,
  // which keeps it away from scrapers that only read raw markup.
  const email = ['derekmilai', 'icloud.com'].join('@');
  // data-email="show" also writes the address out as the link text (Impressum).
  document.querySelectorAll('a[data-email]').forEach(a => {
    a.href = 'mailto:' + email;
    if (a.dataset.email === 'show') a.textContent = email;
  });

  // Color-mode toggle, synced with the anti-flash script in each page's
  // <head> and persisted in localStorage.
  const themeButtons = document.querySelectorAll('.theme-toggle button');
  function applyTheme(mode, persist) {
    if (mode === 'paper') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', mode);
    themeButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.mode === mode)));
    if (persist) {
      try { localStorage.setItem('theme', mode); } catch (e) {}
    }
  }
  applyTheme(document.documentElement.getAttribute('data-theme') || 'paper', false);
  themeButtons.forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.mode, true)));
})();
