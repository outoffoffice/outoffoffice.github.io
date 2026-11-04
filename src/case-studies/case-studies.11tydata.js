// Defaults for every project in this folder, so a project's front matter
// only needs what is its own. Each of these can still be set in a project
// to override the default.
//   layout     the case-study layout
//   permalink  /work/<file name>/ or /lab/<file name>/, by its tag
//   kicker     "case study — <file name>" or "lab — <file name>"
//   year       for the index, from timeframe ("04/2021 – today" → "2021 – today")
function section(data) {
  return (data.tags || []).includes("lab") ? "lab" : "work";
}

module.exports = {
  layout: "layouts/casestudy.njk",
  eleventyComputed: {
    permalink: (data) => data.permalink || `/${section(data)}/${data.page.fileSlug}/`,
    kicker: (data) => data.kicker
      || `${section(data) === "lab" ? "lab" : "case study"} — ${data.page.fileSlug.replace(/-/g, " ")}`,
    year: (data) => data.year
      || String(data.timeframe || "").replace(/\b\d{1,2}\//g, "").replace(/^[^\d]*/, ""),
  },
};
