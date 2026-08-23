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

  // Reuse the real site CSS and images directly, no duplicated copies.
  eleventyConfig.addPassthroughCopy({ "shared.css": "css/shared.css" });
  eleventyConfig.addPassthroughCopy({ "content": "images" });
  eleventyConfig.addPassthroughCopy("src/css");

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
