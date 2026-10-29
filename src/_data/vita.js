// Homepage vita, read from src/data/vita.json:
//   intro     the longer text about Derek, one string per paragraph
//   groups    one column each (work, jobs, studies, …):
//             { title, entries: [{ years, role, place?, url?, current? }] }
//             with a url, the place links there (new tab)
// Entries with "current": true are listed first under "current", the rest
// under "previous"; a group with only one kind gets no sub-labels.
const fs = require("fs");
const path = require("path");

module.exports = function () {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "vita.json"), "utf8"));
};
