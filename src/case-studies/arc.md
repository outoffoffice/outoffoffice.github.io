---
layout: layouts/casestudy.njk
permalink: /work/arc/
tags: work
title: Arc
kicker: case study — arc
dek: A color-coded music system — physical NFC tokens trained on your own listening habits, tapped to a phone without ever opening an app. Choosing what to hear by feeling instead of a search term.
role: Concept, Product & Interaction Design
timeframe: 2026
stack: Figma / 3D Print / Blender
heroImage: arc_vibe/arc_hero.png
heroImageAlt: An Arc Vibe token next to the current-vibe screen on a phone
year: 2026
---

## 1. The Seeding Idea

Choosing music today means: searching, typing, trying to remember what the playlist was actually called. Streaming gave us unlimited libraries. But it assumes we always know exactly what we want to hear. Taste, however, is rarely that precise. It's more of a state than a song title — a feeling that doesn't translate immediately into a search term.

arc flips the question around: What if music weren't accessed through knowledge, but through a feeling — as immediate as a color? And what if that moment of choosing didn't need a screen at all?

## 2. Color as a Learned Feeling, Not a Category

The original idea was to fix each color's mood through set categories. Over the course of the process, that shifted: color becomes a personal definition. arc suggests a baseline meaning. Whether red ultimately means anger or good mood for you is something you decide by sorting songs into it in everyday life. That's how the Arc Vibes come about: four colors that aren't predefined but trained with your own music library. The nuances within a color represent additional layers of intensity — mildly reflective to genuinely melancholic, both blue, but not the same blue.

{% imageSingle "arc_vibe/training-screen.png", "Training screen with the four color fields and intensity slider" %}

**Curate on screen, listen screen-free.** The simplest solution would have been to keep everything inside the app. Instead, arc deliberately separates two moments: sorting your own music (deliberate, willingly invested screen time, similar to sorting a record collection) and the actual listening, which happens via the physical Arc Vibe and a Dynamic Island interaction — without ever opening the app. Whoever picks up the token isn't making a new decision anymore: they're recalling one already made.

{% imageSingle "arc_vibe/arc_scan_row.png", "Tap moment — Arc Vibe token against the phone, Scan Here rendering" %}

**A symbol that travels with you instead of just displaying.** What looks at first glance like an icon is, in arc, a dynamic element: the arc symbol — the arc-shaped constant derived from the rainbow — that runs through the entire app. Its main job is to show the current vibe. When you tap an Arc Vibe, it takes on that color directly. During curation, its function changes: the symbol becomes an active conversation partner in dialogue, or passive feedback during training, while the color fields and sliders do the actual work. Rather than inventing a separate visual language for every moment, its role shifts with the situation, while always remaining the app's one visual anchor.

{% imageSingle "arc_vibe/arc_screens.png", "The three states of the arc symbol — current vibe, scan, and training" %}

## 3. The Arc Vibe as an Object

Each Arc Vibe is 3D-printed, with a concentric groove structure that recalls the vinyl heritage without copying it: the shape a squircle, deliberately friendly and rounded rather than strictly geometric. At the center sits the NFC chip itself: a black, matte surface, visible rather than hidden inside the material. The technology reveals itself and, through that, becomes tangible too: replaceable if defective, separable for recycling at end of life.

{% imageSingle "arc_vibe/nfc-detail.png", "Close-up of the NFC surface" %}

**How the vibe comes to be.** What actually shapes the displayed vibe goes beyond simple color choice. Schedule and weather flank the symbol throughout as visible context sources in the interface, but they stand in for a larger set of possible factors: step count or movement data, current time of day, the next calendar entry, even ambient noise or location could feed in similarly. A history graph shows how the vibe shifts over the day: not as a fixed value, but as a curve that responds to context. Exactly how these factors are weighted — how strongly weather, appointments, or other signals actually factor in — is a question I haven't answered yet.

{% imageSingle "arc_vibe/conversation-screen.png", "Conversation screen, showing the context query in concrete form" %}

**The scan moment, without the app.** The actual listening moment is deliberately placed outside the app: tapping the Arc Vibe to the phone triggers a Dynamic Island interaction, directly from the lock screen. No opening the app, no interface. The cognitive work at this point has been fully front-loaded — into training and conversation — not eliminated, but shifted to a place where it's welcome to happen.

{% imageSingle "arc_vibe/dynamic-island.png", "Dynamic Island mockup — still to be designed" %}

## 4. Result

The questions from the challenge (can color be more accessible than text search, can listening stay low on screen time) are answered by arc through a subjective concept, not through an objectively predetermined application. What remains individual is the translation of color, context, and personal disposition into a music selection.

Open questions remain: Are four colors enough for a clear sorting system? What exactly does the intensity scale mean — how finely does it sort, does it need more or fewer gradations, and how does that actually affect the music selection? And: what would discovery of new music look like in a system trained on what's already known? How do you suggest new music without simply forcing it into the color grid? These aren't gaps that weaken the idea — they're the actual next phase of the project.
