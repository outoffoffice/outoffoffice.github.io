const fs = require("fs");
const path = require("path");

// Images: originals go into the project's /content folder (in subfolders
// per project) and are referenced by their path in there, e.g.
// "vlp/vlp_hero_1.png". They are never published as they are: the image
// plugin (see below) turns every <img> into compressed AVIF/WebP copies in
// several widths under /img/, with width/height set so nothing jumps while
// loading.
const CONTENT_DIR = path.join(__dirname, "content");

// The src to write for a /content image. The image plugin resolves an
// absolute src against the input folder (src/), so "/../content/…" points
// it at /content; the plugin replaces it with the /img/ copies in the
// output, so this path never reaches a browser.
function contentImage(relPath) {
  return `/../content/${relPath}`;
}

// sizes per image layout: how wide each image is shown, so a browser picks
// the smallest copy that is still sharp (the lightbox takes the largest)
const SIZES = {
  single: "(max-width: 640px) 100vw, 780px",
  portrait: "(max-width: 640px) 100vw, 440px",
  natural: "(max-width: 640px) 100vw, 640px",
  pair: "(max-width: 560px) 100vw, 390px",
  trio: "(max-width: 560px) 100vw, 260px",
  posters: "(max-width: 720px) 50vw, 260px",
};

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
function renderTile(src, alt, sizes) {
  if (!src) return "";
  if (fileExists(src)) {
    return `<div class="ph"><img src="${contentImage(src)}" alt="${alt || ""}" sizes="${sizes}" loading="lazy"></div>`;
  }
  return `<div class="ph"><span class="ph-label">[ ${src} ]</span></div>`;
}

function renderBlock(variant, tiles, caption) {
  const grid = tiles.map(t => renderTile(t.src, t.alt, SIZES[variant])).join("\n    ");
  const captionHtml = caption ? `\n  <div class="ph-caption">${caption}</div>` : "";
  return `<div class="image-block ${variant}">
  <div class="ph-grid">
    ${grid}
  </div>${captionHtml}
</div>`;
}

module.exports = async function (eleventyConfig) {
  // the image plugin is an ES module, so it's imported here
  const { default: Image, eleventyImageTransformPlugin } = await import("@11ty/eleventy-img");

  // Every <img> in the output becomes a <picture> of compressed copies:
  // AVIF and WebP, plus JPEG as a fallback for old browsers (left out for
  // images with transparency, which keep AVIF/WebP), in up to four widths
  // (never upscaled), written to /img/ and reused between builds.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: [480, 960, 1600, 2400],
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
    },
  });

  // {{ "vlp/hero.png" | contentImage }} — the src for a /content image
  eleventyConfig.addFilter("contentImage", contentImage);

  // {% shareImage "vlp/hero.png" %} — absolute URL of a 1200px JPEG copy for
  // link previews (og:image), which can't be a <picture>
  eleventyConfig.addAsyncShortcode("shareImage", async function (relPath) {
    const stats = await Image(path.join(CONTENT_DIR, relPath), {
      widths: [1200],
      formats: ["jpeg"],
      outputDir: path.join(__dirname, "_site", "img"),
      urlPath: "/img/",
    });
    return "https://outoffoffice.github.io" + stats.jpeg[0].url;
  });

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

  // {% imageNatural "pfad.jpg", "Bildunterschrift" %} — one image in its own
  // proportions, uncropped (a square stays square), capped like imagePortrait
  eleventyConfig.addShortcode("imageNatural", function (src, caption) {
    return renderBlock("natural", [{ src, alt: caption }], caption);
  });

  // {% imagePair "a.jpg", "b.jpg" %} — two images side by side
  eleventyConfig.addShortcode("imagePair", function (a, b) {
    return renderBlock("pair", [{ src: a }, { src: b }]);
  });

  // {% imageTrio "a.jpg", "b.jpg", "c.jpg" %} — three images side by side
  eleventyConfig.addShortcode("imageTrio", function (a, b, c) {
    return renderBlock("trio", [{ src: a }, { src: b }, { src: c }]);
  });

  // {% imagePosters "a.jpg", "b.jpg", … %} — any number of A4 portrait
  // images (posters, prints) in an uncropped grid: three across, two on phones
  eleventyConfig.addShortcode("imagePosters", function (...srcs) {
    return renderBlock("posters", srcs.map((src) => ({ src })));
  });

  // Case-study facts: a list in the front matter, or a string split on
  // ", " or " / " ("Figma / Blender" → ["Figma", "Blender"]); "NFC/RFID"
  // without spaces stays one item.
  eleventyConfig.addFilter("asList", (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value).split(/\s*,\s*|\s+\/\s+/).filter(Boolean);
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

  // the copy-me template for new projects is never built
  eleventyConfig.ignores.add("src/case-studies/_template.md");

  // Static files, copied as they are (images go through the plugin above).
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/favicon");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // The homepage index and vita read src/data/*.json; rebuild while serving
  // when they change.
  eleventyConfig.addWatchTarget("./src/data/");

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
