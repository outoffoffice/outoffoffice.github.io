# OutOff Portfolio

Portfolio-Site von Derek Milai, gebaut mit [Eleventy](https://www.11ty.dev/).

## Lokal starten

```bash
npm install
npm start        # Dev-Server mit Live-Reload, http://localhost:8080
npm run build     # Build nach _site/
```

## Struktur

```
.eleventy.js                         Config + die 3 Bild-Shortcodes
src/
  index.html                         Startseite
  _includes/layouts/casestudy.njk    Case-Study-Layout: Header, Hero, Meta-Strip,
                                      Footer, Magnet-Button — 1:1 aus beyond-the-engine.html
  css/image-blocks.css               Styles für die 3 Shortcode-Bildlayouts
  case-studies/beyond-the-engine.md  Case-Study im freien Markdown-Format
shared.css                           Globales Stylesheet (per Passthrough nach /css/ kopiert)
content/                             Bild-Assets der Case-Studies (per Passthrough nach /images/ kopiert)
```

`shared.css` und `content/` werden nicht dupliziert, sondern per Passthrough-Copy
direkt aus dem Projekt-Root eingebunden (`shared.css` → `css/shared.css`,
`content/` → `images/`).

Noch nicht migriert (liegen weiter als statische HTML-Dateien im Root, bis sie
nach und nach ins gleiche Eleventy-Schema wie `src/index.html` überführt werden):
`work.html`, `styleguide.html`, `template.html`, `contact-preview.html`,
`beyond-the-engine.html` (Vorgänger der migrierten `src/case-studies/beyond-the-engine.md`).

## Front Matter einer Case-Study

```yaml
---
layout: layouts/casestudy.njk
permalink: /work/mein-projekt/
title: Projekt-Titel
kicker: case study — 02 / 05
dek: Kurzer Subtitle-Absatz unter dem H1.
role: Rolle
timeframe: MM/YYYY – MM/YYYY
stack: Tools
heroImage: hero.jpg          # Dateiname relativ zu /content
heroImageAlt: Alt-Text
nextProjectLabel: Nächstes Projekt →
nextProjectHref: /work/naechstes-projekt/
---
```

Danach folgt frei formatierter Markdown-Body — beliebig viele `##`-Überschriften,
jede bekommt automatisch eine dezente `--grid`-Trennlinie darüber (keine feste
01/03-Nummerierung mehr, kein Label-Spalten-Grid).

## Die drei Bild-Shortcodes

Direkt im Markdown-Fließtext platzierbar:

```
{% imageSingle "hero-detail.jpg", "Bildunterschrift" %}

{% imagePair "prozess-a.jpg", "prozess-b.jpg" %}

{% imageTrio "schritt-1.jpg", "schritt-2.jpg", "schritt-3.jpg" %}
```

Jeder Dateiname wird zur Build-Zeit gegen den echten `content/`-Ordner geprüft
(`fs.existsSync`). Existiert die Datei → echtes `<img>`. Existiert sie noch
nicht → derselbe diagonale Platzhalter-Gradient (`#e9e8ef → #c0c0c4`),
abgerundete Ecken (14px) und Schatten wie die aktuellen `.image-pair .ph`-Kacheln,
mit dem Dateinamen als Mono-Label statt Bild. So lässt sich eine Case-Study
schon mit Platzhaltern durchschreiben, bevor die echten Bilder da sind.
