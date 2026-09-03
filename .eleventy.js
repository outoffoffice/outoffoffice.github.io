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

  // {% imagePair "a.jpg", "b.jpg" %} — two images side by side
  eleventyConfig.addShortcode("imagePair", function (a, b) {
    return renderBlock("pair", [{ src: a }, { src: b }]);
  });

  // {% imageTrio "a.jpg", "b.jpg", "c.jpg" %} — three images side by side
  eleventyConfig.addShortcode("imageTrio", function (a, b, c) {
    return renderBlock("trio", [{ src: a }, { src: b }, { src: c }]);
  });

  // Homepage work-strip carousel: every work/lab entry, pulled straight
  // from the same tag collections the /work/ and /lab/ index pages use —
  // no manual "featured" flag to keep in sync — shuffled at build time so
  // it isn't always just the most recently added ones in a fixed order.
  eleventyConfig.addCollection("showcase", function (collectionApi) {
    const items = [
      ...collectionApi.getFilteredByTag("work"),
      ...collectionApi.getFilteredByTag("lab"),
    ];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  });

  // "Next project" links on a case-study page: the next entry in whatever
  // tag collection (work/lab) the current page belongs to, wrapping back
  // to the first. Derived from the collection instead of hand-typed
  // front matter, so it can never point at a project that doesn't exist.
  eleventyConfig.addFilter("nextInCollection", function (collections, tag, currentUrl) {
    const tagName = Array.isArray(tag) ? tag[0] : tag;
    const items = (collections && collections[tagName]) || [];
    if (items.length < 2) return null;
    const index = items.findIndex((item) => item.url === currentUrl);
    if (index === -1) return null;
    return items[(index + 1) % items.length];
  });

  // Reuse the real site CSS and images directly, no duplicated copies.
  // Passthrough of a directory always copies it verbatim (Eleventy's glob
  // remapping flattens subfolders, so per-extension globs aren't an option
  // here) — content/'s per-project subfolder structure is preserved as-is.
  eleventyConfig.addPassthroughCopy({ "shared.css": "css/shared.css" });
  eleventyConfig.addPassthroughCopy({ "content": "images" });
  eleventyConfig.addPassthroughCopy("src/css");

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
