const fs = require("fs");
const path = require("path");

// Case-study images live in the project's /content folder — reused via
// passthrough copy below, so there is exactly one copy of every image on
// disk, not a duplicate.
const CONTENT_DIR = path.join(__dirname, "content");

function fileExists(relPath) {
  try {
    return fs.existsSync(path.join(CONTENT_DIR, relPath));
  } catch (e) {
    return false;
  }
}

// Renders one image tile: a real <img> if the file exists in /content,
// otherwise the existing diagonal-gradient placeholder with a mono label —
// same visual language as beyond-the-engine.html's .ph / .ph-label pair.
function renderTile(src, alt) {
  if (!src) return "";
  if (fileExists(src)) {
    return `<div class="ph"><img src="/images/${src}" alt="${alt || ""}" loading="lazy"></div>`;
  }
  return `<div class="ph"><span class="ph-label">[ ${src} ]</span></div>`;
}

function renderBlock(variant, tiles, caption) {
  const grid = tiles.map(t => renderTile(t.src, t.alt)).join("\n    ");
  const captionHtml = caption ? `\n  <div class="ph-caption">${caption}</div>` : "";
  return `<div class="image-block ${variant}">
  <div class="ph-grid">
    ${grid}
  </div>${captionHtml}
</div>`;
}

module.exports = function (eleventyConfig) {
  // {% imageSingle "pfad.jpg", "Bildunterschrift" %} — one image, full width
  eleventyConfig.addShortcode("imageSingle", function (src, caption) {
    return renderBlock("single", [{ src, alt: caption }], caption);
  });

  // {% imagePortrait "pfad.jpg", "Bildunterschrift" %} — one image, 4:5
  // portrait, capped narrower than the full content width so a tall image
  // doesn't blow up to an enormous size.
  eleventyConfig.addShortcode("imagePortrait", function (src, caption) {
    return renderBlock("portrait", [{ src, alt: caption }], caption);
  });

  // {% imagePair "a.jpg", "b.jpg" %} — two images side by side
  eleventyConfig.addShortcode("imagePair", function (a, b) {
    return renderBlock("pair", [{ src: a }, { src: b }]);
  });

  // {% imageTrio "a.jpg", "b.jpg", "c.jpg" %} — three images side by side
  eleventyConfig.addShortcode("imageTrio", function (a, b, c) {
    return renderBlock("trio", [{ src: a }, { src: b }, { src: c }]);
  });

  // Homepage project gallery: every case study tagged "work" or "lab", in
  // one list — dropping a new .md into src/case-studies/ with one of those
  // tags is all it takes to show up. Newest first, by the latest year in
  // its `timeframe` ("04/2021 – today" counts as ongoing, i.e. newest).
  function latestYear(item) {
    const timeframe = String(item.data.timeframe || "");
    if (/today|now|heute/i.test(timeframe)) return Infinity;
    const years = timeframe.match(/\d{4}/g);
    return years ? Math.max(...years.map(Number)) : 0;
  }
  function caseStudies(collectionApi) {
    return collectionApi
      .getAll()
      .filter((item) => (item.data.tags || []).some((t) => t === "work" || t === "lab"))
      .sort((a, b) => latestYear(b) - latestYear(a) || 0);
  }
  eleventyConfig.addCollection("projects", caseStudies);

  // Homepage index (the fold-out list in the work & lab section): every case
  // study automatically, plus the entries in src/data/projects.json — things
  // without a case study, like talks or workshops. Newest first.
  //   case study front matter:  type, summary (both optional; summary falls
  //                             back to the dek, type to client / experiment
  //                             for work / lab)
  //   projects.json entries:    { year, title, type, role, summary, link? }
  //                             (without a link the entry isn't clickable)
  // type is one of INDEX_TYPES; only the types that occur get a filter
  // button, and the search field appears from INDEX_SEARCH_FROM entries on.
  const INDEX_TYPES = ["client", "personal", "experiment", "workshop", "talk"];
  const INDEX_SEARCH_FROM = 8;
  eleventyConfig.addCollection("index", function (collectionApi) {
    const fromCases = caseStudies(collectionApi).map((item) => ({
      year: item.data.year || item.data.timeframe,
      sortYear: latestYear(item),
      title: item.data.title,
      type: item.data.type || ((item.data.tags || []).includes("lab") ? "experiment" : "client"),
      role: item.data.role,
      summary: item.data.summary || item.data.dek,
      link: item.url,
    }));
    const extras = JSON.parse(fs.readFileSync(path.join(__dirname, "src", "data", "projects.json"), "utf8"))
      .map((e) => ({ ...e, sortYear: Number(e.year) || 0 }));
    const entries = [...fromCases, ...extras].sort((a, b) => b.sortYear - a.sortYear || 0);
    entries.forEach((e) => {
      if (!INDEX_TYPES.includes(e.type)) console.warn(`[index] "${e.title}": unknown type "${e.type}"`);
    });
    return entries;
  });
  eleventyConfig.addFilter("indexTypes", (entries) => INDEX_TYPES.filter((t) => entries.some((e) => e.type === t)));
  eleventyConfig.addGlobalData("indexSearchFrom", INDEX_SEARCH_FROM);

  // Reuse the real site CSS and images directly, no duplicated copies.
  // Passthrough of a directory always copies it verbatim (Eleventy's glob
  // remapping flattens subfolders, so per-extension globs aren't an option
  // here) — content/'s per-project subfolder structure is preserved as-is.
  eleventyConfig.addPassthroughCopy({ "shared.css": "css/shared.css" });
  eleventyConfig.addPassthroughCopy({ "content": "images" });
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/favicon");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // The homepage index and vita read src/data/*.json; rebuild while serving
  // when they change.
  eleventyConfig.addWatchTarget("./src/data/");

  // content/ also holds .psd source files (36-38MB each, gitignored) that
  // must never ship on the deployed site — strip them back out of the
  // output after the directory copy above lands them there.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const imagesDir = path.join(dir.output, "images");
    function stripPsd(currentDir) {
      if (!fs.existsSync(currentDir)) return;
      for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
        const entryPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) stripPsd(entryPath);
        else if (entry.name.toLowerCase().endsWith(".psd")) fs.unlinkSync(entryPath);
      }
    }
    stripPsd(imagesDir);
  });

  // Let {% imageSingle %} etc. be used inside .md files.
  eleventyConfig.setLibrary("md", require("markdown-it")({ html: true }));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
