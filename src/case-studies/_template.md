---
# ─────────────────────────────────────────────────────────────────────────
# Template for a new project. Never built as a page itself.
#
# 1. Copy this file in this folder and name it after the project:
#    src/case-studies/my-project.md
# 2. Put the images into a folder of their own: content/my-project/
# 3. Fill in the fields below, delete what you don't need, write the text
#    under the second ---. `npm start` shows it at http://localhost:8080
#
# Set automatically (see case-studies.11tydata.js), only write them to
# override: the page address (/work/my-project/ or /lab/my-project/, from
# the file name and tag), the kicker ("case study — my project") and the
# year in the index (from timeframe).
# ─────────────────────────────────────────────────────────────────────────
tags: work                        # work | lab   (gallery filter, address)
title: My Project
dek: One or two sentences on what it is and why it matters.
summary: "One line for the index list."   # optional, else the dek is used
type: client                      # client | personal | experiment | workshop | talk
size: m                           # tile width on the homepage: s | m | l

# ── facts (right of the title; each shows only when it's set) ──
client: "Studio XY"               # or { name: "Studio XY", url: "https://…" }
role: Concept & Interaction Design
timeframe: 2026                   # e.g. 2019 · Mid 2020 · 04/2021 – today (also sorts the gallery)
team:
  - { name: "Jane Doe", role: "Sound", url: "https://…" }
stack: Figma / Blender            # separated by " / " or ", "
links:
  - { label: "Live prototype", url: "https://…" }
facts:
  - { label: "Awards", value: "…" }

# ── images (paths inside content/) ──
heroImage: my-project/hero.png    # big image under the head, also the tile
heroImageAlt: What the image shows, in a sentence
# cardImage: my-project/tile.png  # only if there's no hero image
---

## A first heading

Text in Markdown. **Bold**, *italic*, [links](https://…).

{% imageSingle "my-project/image.png", "Caption" %}
{% imagePair "my-project/a.png", "my-project/b.png" %}
{% imageTrio "my-project/a.png", "my-project/b.png", "my-project/c.png" %}
{% imagePortrait "my-project/tall.png", "Caption" %}
{% imageNatural "my-project/square.png", "Caption" %}
{% imagePosters "my-project/01.png", "my-project/02.png", "my-project/03.png" %}
