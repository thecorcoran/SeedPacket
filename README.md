# Vintage Tapeless Seed Envelope Maker

A lightweight, dependency-free web app (plain HTML, CSS, and vanilla JS with zero build steps) that generates and prints heirloom-style tapeless pocket seed envelopes on standard Letter or A4 sheets of paper.

## Features

- **Tapeless Interlocking Pocket Envelope Net**: Parametric papercraft net designed to fold and hold seeds without glue or tape. Solid outer cut line with scissors, dashed fold lines, interlocking side ears that lock the bottom flap, and a rounded tongue flap that tucks into the pocket.
- **Antique Seed Catalog Aesthetic**: Authentic 19th-century seed catalog typography, ornamental borders, corner rosettes, and hand-cut botanical woodcut illustrations.
- **Interactive Live Preview**: Instant real-time preview of the printed sheet with zoom and fit controls.
- **Botanical Name Formatting**: Automatically capitalizes the genus and lowercases the species and infraspecific epithets on blur, preserving taxonomic markers (`var.`, `subsp.`, `ssp.`, `cv.`) and cultivar quotation marks.
- **16 Vintage Botanical Clip Arts**: Woodcut vector engravings for Tomato, Carrot, Sunflower, Bell Pepper, Garden Pea, Pole Bean, Sweet Basil, Lavender, Pumpkin, Honeybee & Blossom, Alpine Strawberry, French Radish, Breadseed Poppy, French Marigold, Heritage Beet, plus "None".
- **Dynamic Text Auto-Fit**: Headings dynamically scale down to fit the printable front width, preventing clipping or distortion. Empty Latin names automatically collapse to rebalance spacing.
- **Printing Modes**:
  1. **One-sided (Default)**: Prints everything on a single sheet, with dashed fold lines rendered in subtle gray so the finished envelope looks clean when folded outward.
  2. **Two-sided (Duplex)**: Page 1 prints the outside face (front art + top flap seal + back garden notes ledger). Page 2 prints the mirrored cut outline and dashed fold lines on the inside of the sheet for long-edge duplex printers.
- **Standard Paper Presets**: US Letter (8.5 × 11 in) and A4 (210 × 297 mm), with exact `@page` print rules.
- **Finished Envelope Size Presets**:
  - **Small (64 × 90 mm)**: Compact for herbs and fine seeds (poppy, thyme, carrot, lettuce).
  - **Medium (74 × 105 mm)**: Standard catalog seed envelope.
  - **Large (84 × 120 mm)**: Spacious for large seeds (beans, peas, squash, corn, sunflowers).
- **100% Dependency-Free & Offline**: All fonts (`.woff2`) are bundled locally in `/fonts`. No npm, no node, no build tools, no CDNs required.

## Quick Start

Simply open `index.html` in any modern web browser:
```bash
# Example with Chrome, Firefox, or file manager:
xdg-open index.html
```

## How to Fold the Envelope

1. **Cut**: Cut along the solid outer perimeter with scissors. (No interior hole cuts needed!)
2. **Side Flaps**: Fold the left and right flaps inward along the dashed vertical lines.
3. **Bottom Pocket & Lock**: Fold the bottom flap up along the dashed horizontal crease over the side flaps. Slip the two corner locking ears behind the folded side flaps into the side creases. This locks the back flat and forms the seed pocket.
4. **Fill & Seal**: Place seeds inside the pouch. Fold the top flap down and tuck the rounded tongue deep into the pocket opening.

## Parametric Geometry

All envelope dimensions are defined in millimeters in `geometry.js` under `ENVELOPE_CONFIG.presets`. You can adjust:
- `W`: Finished front width (mm)
- `H`: Finished front height (mm)
- `sideFlapWidth`: Width of left and right flaps (mm)
- `bottomFlapHeight`: Depth of bottom pocket flap (mm)
- `topFlapHeight`: Height of top closure flap (mm)
- `tuckDepth`: Length of tuck tongue (mm)
- `lockingEarWidth`: Width of interlocking wings (mm)

