# Vintage Heirloom Seed Envelope Maker

A lightweight, dependency-free web application (plain HTML, CSS, and vanilla JS with zero build steps) that generates and prints heirloom-style seed packets on standard Letter (8.5 × 11 in) or A4 paper.

## Features

- **Folding Schemes & Cut Patterns**:
  - **Classic Heirloom Flap**: Clean perimeter cut with straight side flaps that overlap down the center back, sealed with a glue stick, double-sided tape, or washi tape.
  - **Gardener's Diamond Pouch (100% Glue-Free & Tapeless)**: The traditional gardener's cup pouch fold from a cut square sheet. Impossible for fine seeds to leak; unfolds completely flat in the garden.
  - **Interlocking Tuck-Slot**: Straight perimeter cut with a simple slit on the back pocket so the closure tongue tucks in cleanly without adhesives.
- **Sheet Layouts**:
  - **1 Packet per Sheet**: Maximized page-fill seed packet (3.7 × 5.6 in finished front) that utilizes the full sheet of paper with zero waste.
  - **2 Packets per Sheet**: Two standard catalog seed envelopes (3.0 × 3.9 in each) printed side-by-side on a single sheet of paper.
- **Built-in Botanical Taxonomic Database & Lookup**:
  - Offline lookup covering 80+ popular garden vegetables, herbs, and flowers.
  - Type a common name or partial typo (e.g. `Zinna` or `Zinnia`) to auto-populate the botanical Latin binomial (*Zinnia elegans*), plant family, and suggested varieties.
- **Packaged Date Formatting**:
  - Clean Month and Year format (`PACKAGED: OCTOBER 2026` or `HARVESTED: OCTOBER 2026`) without unnecessary time-of-day clutter.
- **Optional Trust Marks & Badges**:
  - Checkboxes for `Open Pollinated`, `Tested Germination`, `Heirloom Variety`, and `Certified Organic`.
  - When unchecked, displays an ornamental vintage tailpiece flourish rather than false or untested claims.
- **Artwork System**:
  - **Refined Universal Botanical Sprig**: An authentic engraved botanical sprig designed to complement any vegetable, herb, or flower.
  - **Custom Picture Upload**: Upload your own garden photos or custom illustrations (PNG, JPG, SVG, WebP) with options for Vintage Engraving (B&W) or Original Color.
  - **Minimalist Typographic**: Pure Victorian typography with ornamental borders and corner rosettes.
- **Audited Typography & Printer Margins**:
  - Safe printer margin of at least 8–10 mm (0.35 in) from all page edges to guarantee inkjet and laser printers never clip borders or fold lines.
  - All body text scaled for optimal print legibility (>= 2.6–3.2 mm / ~8–10 pt).
  - Dynamic vertical stacking preventing any collision between titles, Latin names, varieties, and notes.
- **100% Dependency-Free & Offline**:
  - All fonts (`.woff2`) are bundled locally in `/fonts`. No node, npm, build tools, or CDNs required.

## Quick Start

Simply open `index.html` in any modern web browser:
```bash
xdg-open index.html
```

## Folding Guide

Click the **Folding Guide** button in the header toolbar to view dynamic step-by-step folding instructions and diagrams tailored to your selected folding pattern (Classic Flap, Gardener's Origami Pouch, or Interlocking Tuck-Slot).
