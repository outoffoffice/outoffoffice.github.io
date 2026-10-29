// Global site data — used for canonical/OG URLs (which must be absolute)
// and as the fallback description/preview image on pages that don't have
// their own (case studies use their own dek/heroImage instead, see
// layouts/casestudy.njk).
module.exports = {
  url: "https://outoffoffice.github.io",
  description:
    "OutOff — Derek Milai, creative technologist and designer working at the seam between human and machine. A collection of case studies in interaction design, prototyping, and applied technology.",
  image: "images/liqpix/liqpix_hero.png",
  // Date of the build that produced the page (YYYY-MM-DD) — shown in the
  // footer's status line, so it updates itself on every deploy.
  built: new Date().toISOString().slice(0, 10),
};
