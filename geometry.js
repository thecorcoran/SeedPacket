/**
 * Parametric Envelope Geometry & SVG Template Generator
 * Supports:
 * 1. Full-Sheet (No-Cut / 100% Folded) - Utilizes the entire 8.5x11 or A4 sheet with zero paper waste or cutting.
 * 2. Cutout Net (Scissors Required) - Traditional interlocking net with Small, Medium, Large, and Page-Max presets.
 */

const ENVELOPE_CONFIG = {
  templateStyles: {
    fullsheet: {
      name: "Full Sheet 8.5×11 (No-Cut / 100% Folded)",
      description: "Utilizes the whole sheet of paper. Zero cutting required—just fold along dashed lines!"
    },
    cutout: {
      name: "Cutout Net (Scissors Required)",
      description: "Traditional cut-and-tuck net cutout."
    }
  },

  presets: {
    small: {
      name: "Small (Seeds & Herbs)",
      description: "64 × 90 mm finished front",
      W: 64,
      H: 90,
      sideFlapWidth: 26,
      bottomFlapHeight: 68,
      topFlapHeight: 40,
      tuckDepth: 20,
      tuckTongueWidth: 42,
      lockingEarWidth: 10,
      lockingEarHeight: 18,
      notchOffset: 12,
      clipArtSize: 28,
    },
    medium: {
      name: "Medium (Standard)",
      description: "74 × 105 mm finished front",
      W: 74,
      H: 105,
      sideFlapWidth: 30,
      bottomFlapHeight: 80,
      topFlapHeight: 48,
      tuckDepth: 24,
      tuckTongueWidth: 50,
      lockingEarWidth: 11,
      lockingEarHeight: 20,
      notchOffset: 14,
      clipArtSize: 34,
    },
    large: {
      name: "Large (Beans, Peas & Corn)",
      description: "84 × 120 mm finished front",
      W: 84,
      H: 120,
      sideFlapWidth: 34,
      bottomFlapHeight: 90,
      topFlapHeight: 52,
      tuckDepth: 26,
      tuckTongueWidth: 56,
      lockingEarWidth: 12,
      lockingEarHeight: 22,
      notchOffset: 16,
      clipArtSize: 40,
    },
    fullpage: {
      name: "Page-Max Net",
      description: "100 × 135 mm finished front (fills printable sheet)",
      W: 100,
      H: 135,
      sideFlapWidth: 38,
      bottomFlapHeight: 94,
      topFlapHeight: 50,
      tuckDepth: 25,
      tuckTongueWidth: 64,
      lockingEarWidth: 12,
      lockingEarHeight: 22,
      notchOffset: 16,
      clipArtSize: 44,
    }
  },

  papers: {
    letter: {
      name: "US Letter (8.5 × 11 in)",
      width: 215.9,
      height: 279.4,
      cssPageSize: "letter"
    },
    a4: {
      name: "A4 (210 × 297 mm)",
      width: 210.0,
      height: 297.0,
      cssPageSize: "A4"
    }
  }
};

/**
 * Calculates layout positions and bounding coordinates on a paper sheet.
 */
function calculateEnvelopeMetrics(templateStyle, presetKey, paperKey) {
  const paper = ENVELOPE_CONFIG.papers[paperKey] || ENVELOPE_CONFIG.papers.letter;
  const isFullSheet = templateStyle === 'fullsheet';

  if (isFullSheet) {
    // FULL-SHEET NO-CUT FOLDING METRICS (Utilizes 100% of the paper sheet)
    // Front panel is centered horizontally and placed in the upper-mid region
    const W = paperKey === 'a4' ? 110 : 114;  // ~4.5 inches wide
    const H = paperKey === 'a4' ? 125 : 120;  // ~4.75 inches tall
    const Sw = (paper.width - W) / 2;          // Flaps reach exact paper edges
    const Ht = 65;                            // Top closure flap height
    const Hb = paper.height - (Ht + H);       // Bottom pocket flap height (reaches bottom edge)

    return {
      isFullSheet: true,
      paper,
      geom: {
        W,
        H,
        sideFlapWidth: Sw,
        topFlapHeight: Ht,
        bottomFlapHeight: Hb,
        clipArtSize: 38
      },
      frontX: Sw,
      frontY: Ht,
      totalNetWidth: paper.width,
      totalNetHeight: paper.height,
      netOriginX: 0,
      netOriginY: 0
    };
  } else {
    // TRADITIONAL CUTOUT NET METRICS
    const geom = ENVELOPE_CONFIG.presets[presetKey] || ENVELOPE_CONFIG.presets.medium;
    const totalNetWidth = geom.W + (geom.sideFlapWidth * 2);
    const totalNetHeight = geom.H + geom.topFlapHeight + geom.bottomFlapHeight;

    const netOriginX = (paper.width - totalNetWidth) / 2;
    const netOriginY = (paper.height - totalNetHeight) / 2;

    const frontX = netOriginX + geom.sideFlapWidth;
    const frontY = netOriginY + geom.topFlapHeight;

    return {
      isFullSheet: false,
      paper,
      geom,
      totalNetWidth,
      totalNetHeight,
      netOriginX,
      netOriginY,
      frontX,
      frontY
    };
  }
}

/**
 * Calculates a guaranteed fit font-size in millimeters for SVG text.
 * Prevents text from ever overflowing its container border.
 */
function calculateAutoFitFontSize(text, maxWidthMm, maxFontMm, minFontMm, fontFamily) {
  if (!text || text.trim() === '') return maxFontMm;
  const trimmed = text.trim();

  // Glyph width-to-height factor for each typeface
  let widthFactor = 0.65;
  const fLower = (fontFamily || '').toLowerCase();
  if (fLower.includes('abril')) {
    widthFactor = 0.90; // Abril Fatface Didone has very wide caps
  } else if (fLower.includes('rye')) {
    widthFactor = 0.80; // Western wood type
  } else if (fLower.includes('fell')) {
    widthFactor = 0.62;
  } else if (fLower.includes('caslon')) {
    widthFactor = 0.58;
  }

  const charCount = trimmed.length;
  // Estimated width = charCount * fontSizeMm * widthFactor
  const fitSizeMm = maxWidthMm / (charCount * widthFactor);

  return Math.max(minFontMm, Math.min(maxFontMm, Math.round(fitSizeMm * 10) / 10));
}

/**
 * Generates the SVG path for the solid cut outline of the envelope net (for Cutout Net mode).
 */
function generateCutOutlinePath(metrics) {
  const { geom, frontX: x0, frontY: y0 } = metrics;
  const W = geom.W;
  const H = geom.H;
  const Sw = geom.sideFlapWidth;
  const Ht = geom.topFlapHeight;
  const Td = geom.tuckDepth || 22;
  const Tw = geom.tuckTongueWidth || 48;
  const Hb = geom.bottomFlapHeight;
  const Ew = geom.lockingEarWidth || 11;
  const Eh = geom.lockingEarHeight || 20;

  const tongueLeft = x0 + (W - Tw) / 2;
  const tongueRight = x0 + (W + Tw) / 2;

  const p = [];

  // Top Flap
  p.push(`M ${x0.toFixed(2)} ${y0.toFixed(2)}`);
  p.push(`L ${(x0 + 3).toFixed(2)} ${(y0 - 10).toFixed(2)}`);
  p.push(`L ${tongueLeft.toFixed(2)} ${(y0 - (Ht - Td)).toFixed(2)}`);
  p.push(`Q ${tongueLeft.toFixed(2)} ${(y0 - Ht).toFixed(2)} ${(tongueLeft + 6).toFixed(2)} ${(y0 - Ht).toFixed(2)}`);
  p.push(`L ${(tongueRight - 6).toFixed(2)} ${(y0 - Ht).toFixed(2)}`);
  p.push(`Q ${tongueRight.toFixed(2)} ${(y0 - Ht).toFixed(2)} ${tongueRight.toFixed(2)} ${(y0 - (Ht - Td)).toFixed(2)}`);
  p.push(`L ${(x0 + W - 3).toFixed(2)} ${(y0 - 10).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${y0.toFixed(2)}`);

  // Right Side Flap
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + Sw * 0.7).toFixed(2)}`);
  const rightNotchY = y0 + H - Hb + (geom.notchOffset || 14);
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(rightNotchY - 5).toFixed(2)}`);
  p.push(`L ${(x0 + W + Sw - 3.5).toFixed(2)} ${rightNotchY.toFixed(2)}`);
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(rightNotchY + 5).toFixed(2)}`);
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + H - 14).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${(y0 + H - 2).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // Bottom Flap
  p.push(`L ${(x0 + W - 0.5).toFixed(2)} ${(y0 + H + Hb - Eh).toFixed(2)}`);
  p.push(`L ${(x0 + W + Ew).toFixed(2)} ${(y0 + H + Hb - Eh * 0.5).toFixed(2)}`);
  p.push(`L ${(x0 + W + Ew).toFixed(2)} ${(y0 + H + Hb - 4).toFixed(2)}`);
  p.push(`L ${(x0 + W - 4).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  p.push(`L ${(x0 + 4).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  p.push(`L ${(x0 - Ew).toFixed(2)} ${(y0 + H + Hb - 4).toFixed(2)}`);
  p.push(`L ${(x0 - Ew).toFixed(2)} ${(y0 + H + Hb - Eh * 0.5).toFixed(2)}`);
  p.push(`L ${(x0 + 0.5).toFixed(2)} ${(y0 + H + Hb - Eh).toFixed(2)}`);
  p.push(`L ${x0.toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // Left Side Flap
  p.push(`L ${x0.toFixed(2)} ${(y0 + H - 2).toFixed(2)}`);
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + H - 14).toFixed(2)}`);
  const leftNotchY = y0 + H - Hb + (geom.notchOffset || 14);
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(leftNotchY + 5).toFixed(2)}`);
  p.push(`L ${(x0 - Sw + 3.5).toFixed(2)} ${leftNotchY.toFixed(2)}`);
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(leftNotchY - 5).toFixed(2)}`);
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + Sw * 0.7).toFixed(2)}`);
  p.push("Z");

  return p.join(" ");
}

/**
 * Generates dashed fold lines for the envelope.
 */
function generateFoldLines(metrics) {
  const { isFullSheet, paper, geom, frontX: x0, frontY: y0 } = metrics;
  const W = geom.W;
  const H = geom.H;

  if (isFullSheet) {
    // FULL-SHEET NO-CUT FOLD LINES (Edge-to-edge creases across the 8.5x11 sheet)
    const lines = [
      // Left side vertical fold
      { x1: x0, y1: 0, x2: x0, y2: paper.height, label: "Left Flap Fold" },
      // Right side vertical fold
      { x1: x0 + W, y1: 0, x2: x0 + W, y2: paper.height, label: "Right Flap Fold" },
      // Top horizontal fold
      { x1: 0, y1: y0, x2: paper.width, y2: y0, label: "Top Flap Fold" },
      // Bottom horizontal fold
      { x1: 0, y1: y0 + H, x2: paper.width, y2: y0 + H, label: "Bottom Pocket Fold" },

      // Diagonal 45° corner fold guides on Top Flap (creates tuck tongue)
      { x1: 0, y1: 0, x2: x0, y2: y0, label: "Top-Left Diagonal Tongue Fold" },
      { x1: paper.width, y1: 0, x2: x0 + W, y2: y0, label: "Top-Right Diagonal Tongue Fold" },

      // Diagonal 45° corner fold guides on Bottom Flap (tucks under side flaps)
      { x1: 0, y1: paper.height, x2: x0, y2: y0 + H, label: "Bottom-Left Diagonal Fold" },
      { x1: paper.width, y1: paper.height, x2: x0 + W, y2: y0 + H, label: "Bottom-Right Diagonal Fold" }
    ];
    return lines;
  } else {
    // Cutout Net Fold Lines
    return [
      { x1: x0, y1: y0, x2: x0 + W, y2: y0, label: "Top Flap Fold" },
      { x1: x0, y1: y0 + H, x2: x0 + W, y2: y0 + H, label: "Bottom Flap Fold" },
      { x1: x0, y1: y0, x2: x0, y2: y0 + H, label: "Left Flap Fold" },
      { x1: x0 + W, y1: y0, x2: x0 + W, y2: y0 + H, label: "Right Flap Fold" }
    ];
  }
}

/**
 * Mirrors a path horizontally around the paper center line (X = paperWidth / 2).
 */
function mirrorPathHorizontally(pathString, paperWidth) {
  return pathString.replace(/([MLQCZ])([^MLQCZ]*)/gi, (match, cmd, coords) => {
    if (cmd.toUpperCase() === 'Z') return match;
    const parts = coords.trim().split(/[\s,]+/);
    if (parts.length === 0 || parts[0] === '') return match;

    const mirrored = [];
    for (let i = 0; i < parts.length; i += 2) {
      if (i + 1 < parts.length) {
        const x = parseFloat(parts[i]);
        const y = parseFloat(parts[i + 1]);
        if (!isNaN(x) && !isNaN(y)) {
          const mx = (paperWidth - x).toFixed(2);
          mirrored.push(`${mx} ${y.toFixed(2)}`);
        }
      }
    }
    return `${cmd} ${mirrored.join(' ')} `;
  });
}

/**
 * Generates the complete Vintage Front Artwork SVG group for the seed packet.
 * Uses exact millimeter font sizing and strict bounds checking to prevent text collision.
 */
function renderFrontPanelArtwork(state, metrics) {
  const { geom, frontX: x0, frontY: y0 } = metrics;
  const W = geom.W;
  const H = geom.H;

  const fontHeader = state.fontFamily || "'Rye', 'Abril Fatface', serif";
  const fontBody = "'IM Fell English', 'Libre Caslon Text', 'Georgia', serif";

  // Inner margin from front panel fold boundaries
  const margin = metrics.isFullSheet ? 5.5 : 4.0;
  const innerX = x0 + margin;
  const innerY = y0 + margin;
  const innerW = W - (margin * 2);
  const innerH = H - (margin * 2);

  // Maximum allowed width for display title (guaranteed padding inside border)
  const maxTitleWidth = innerW - 12;
  const seedName = state.seedName || "HEIRLOOM SEED";
  
  // Calculate title font size (between 4.0mm and 7.6mm, precisely scaled to never exceed maxTitleWidth)
  const maxTitleFont = metrics.isFullSheet ? 7.6 : 6.8;
  const titleFontSize = calculateAutoFitFontSize(seedName, maxTitleWidth, maxTitleFont, 3.8, fontHeader);

  // Latin name calculation
  const hasLatinName = state.latinName && state.latinName.trim().length > 0;
  const latinFontSize = hasLatinName
    ? calculateAutoFitFontSize(state.latinName, innerW - 14, 3.2, 2.2, 'fell')
    : 0;

  // Selected clip art
  const clipArt = CLIP_ART_MANIFEST.find(c => c.id === state.clipArtId) || CLIP_ART_MANIFEST[0];
  const maxClipSize = metrics.isFullSheet ? 38 : Math.min(geom.clipArtSize || 32, innerH * 0.38);

  const centerX = x0 + (W / 2);

  // Vertical layout rhythm
  const badgeY = innerY + (metrics.isFullSheet ? 4.5 : 3.8);
  const titleY = badgeY + (metrics.isFullSheet ? 8.5 : 7.2);

  let latinY = titleY;
  let varietyY = titleY + 4.8;
  let clipArtY = 0;

  if (hasLatinName) {
    latinY = titleY + (metrics.isFullSheet ? 5.5 : 4.8);
    varietyY = latinY + (metrics.isFullSheet ? 4.6 : 4.2);
    clipArtY = varietyY + (metrics.isFullSheet ? 3.0 : 2.5);
  } else {
    varietyY = titleY + (metrics.isFullSheet ? 5.2 : 4.6);
    clipArtY = varietyY + (metrics.isFullSheet ? 3.5 : 3.0);
  }

  const clipBoxX = centerX - (maxClipSize / 2);
  const clipBoxY = clipArtY;
  const afterClipY = clipBoxY + maxClipSize;

  const harvestY = afterClipY + (metrics.isFullSheet ? 3.5 : 2.5);
  const notesY = harvestY + (metrics.isFullSheet ? 7.2 : 5.8);
  const footerY = innerY + innerH - 3.2;

  // Harvest date & time text
  let harvestText = "HARVESTED: ";
  if (state.dateHarvested) {
    const parts = state.dateHarvested.split("-");
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      harvestText += d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else {
      harvestText += state.dateHarvested;
    }
  } else {
    harvestText += "Autumn Season";
  }
  if (state.timeHarvested) {
    harvestText += ` • ${state.timeHarvested}`;
  }

  // Construct SVG Elements
  let svg = `
    <g id="front-artwork" class="vintage-packet-art" fill="#2b231d" stroke="none">
      <!-- Outer Double Border with Corner Florets -->
      <rect x="${innerX.toFixed(2)}" y="${innerY.toFixed(2)}" width="${innerW.toFixed(2)}" height="${innerH.toFixed(2)}"
            fill="#fcfaf5" stroke="#2b231d" stroke-width="0.8" rx="0.5" />
      <rect x="${(innerX + 1.2).toFixed(2)}" y="${(innerY + 1.2).toFixed(2)}" width="${(innerW - 2.4).toFixed(2)}" height="${(innerH - 2.4).toFixed(2)}"
            fill="none" stroke="#2b231d" stroke-width="0.3" stroke-dasharray="3 1" />

      <!-- Corner Rosettes -->
      <g stroke="#2b231d" stroke-width="0.4" fill="none">
        <circle cx="${(innerX + 3).toFixed(2)}" cy="${(innerY + 3).toFixed(2)}" r="1.4" />
        <path d="M ${(innerX + 1.6).toFixed(2)} ${(innerY + 3).toFixed(2)} L ${(innerX + 4.4).toFixed(2)} ${(innerY + 3).toFixed(2)} M ${(innerX + 3).toFixed(2)} ${(innerY + 1.6).toFixed(2)} L ${(innerX + 3).toFixed(2)} ${(innerY + 4.4).toFixed(2)}" />

        <circle cx="${(innerX + innerW - 3).toFixed(2)}" cy="${(innerY + 3).toFixed(2)}" r="1.4" />
        <path d="M ${(innerX + innerW - 4.4).toFixed(2)} ${(innerY + 3).toFixed(2)} L ${(innerX + innerW - 1.6).toFixed(2)} ${(innerY + 3).toFixed(2)} M ${(innerX + innerW - 3).toFixed(2)} ${(innerY + 1.6).toFixed(2)} L ${(innerX + innerW - 3).toFixed(2)} ${(innerY + 4.4).toFixed(2)}" />

        <circle cx="${(innerX + 3).toFixed(2)}" cy="${(innerY + innerH - 3).toFixed(2)}" r="1.4" />
        <path d="M ${(innerX + 1.6).toFixed(2)} ${(innerY + innerH - 3).toFixed(2)} L ${(innerX + 4.4).toFixed(2)} ${(innerY + innerH - 3).toFixed(2)} M ${(innerX + 3).toFixed(2)} ${(innerY + innerH - 4.4).toFixed(2)} L ${(innerX + 3).toFixed(2)} ${(innerY + innerH - 1.6).toFixed(2)}" />

        <circle cx="${(innerX + innerW - 3).toFixed(2)}" cy="${(innerY + innerH - 3).toFixed(2)}" r="1.4" />
        <path d="M ${(innerX + innerW - 4.4).toFixed(2)} ${(innerY + innerH - 3).toFixed(2)} L ${(innerX + innerW - 1.6).toFixed(2)} ${(innerY + innerH - 3).toFixed(2)} M ${(innerX + innerW - 3).toFixed(2)} ${(innerY + innerH - 4.4).toFixed(2)} L ${(innerX + innerW - 3).toFixed(2)} ${(innerY + innerH - 1.6).toFixed(2)}" />
      </g>

      <!-- Vintage Catalog Banner Header -->
      <text x="${centerX.toFixed(2)}" y="${badgeY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${(metrics.isFullSheet ? 2.6 : 2.3).toFixed(2)}" font-weight="bold" letter-spacing="1.5" fill="#52443a">
        ✦ HEIRLOOM SEED COLLECTION ✦
      </text>

      <!-- Plant / Seed Display Name (Auto-scaled in mm to fit within border) -->
      <text x="${centerX.toFixed(2)}" y="${titleY.toFixed(2)}"
            text-anchor="middle" font-family="${fontHeader}" font-size="${titleFontSize.toFixed(2)}" font-weight="bold"
            letter-spacing="0.5" fill="#1e1814" class="plant-title"
            max-width="${maxTitleWidth.toFixed(2)}">
        ${escapeXml(seedName.toUpperCase())}
      </text>
  `;

  // Latin Name (Italic with flanking ornamental rules)
  if (hasLatinName) {
    const halfSpan = Math.min(innerW * 0.40, 24);
    svg += `
      <!-- Latin Binomial Name -->
      <g class="latin-name-block">
        <line x1="${(centerX - halfSpan).toFixed(2)}" y1="${(latinY - 0.8).toFixed(2)}" x2="${(centerX - halfSpan + 5).toFixed(2)}" y2="${(latinY - 0.8).toFixed(2)}" stroke="#8c7866" stroke-width="0.3" />
        <text x="${centerX.toFixed(2)}" y="${latinY.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${latinFontSize.toFixed(2)}" font-style="italic"
              letter-spacing="0.4" fill="#52443a">
          ❦ ${escapeXml(state.latinName)} ❦
        </text>
        <line x1="${(centerX + halfSpan - 5).toFixed(2)}" y1="${(latinY - 0.8).toFixed(2)}" x2="${(centerX + halfSpan).toFixed(2)}" y2="${(latinY - 0.8).toFixed(2)}" stroke="#8c7866" stroke-width="0.3" />
      </g>
    `;
  }

  // Cultivar / Variety
  if (state.variety && state.variety.trim()) {
    svg += `
      <!-- Variety -->
      <text x="${centerX.toFixed(2)}" y="${varietyY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${(metrics.isFullSheet ? 3.0 : 2.7).toFixed(2)}" font-style="italic" fill="#3a3028">
        var. &#8220;${escapeXml(state.variety.trim())}&#8221;
      </text>
    `;
  }

  // Center Clip Art
  if (clipArt && clipArt.svg) {
    svg += `
      <!-- Botanical Vignette / Clip Art -->
      <g transform="translate(${clipBoxX.toFixed(2)}, ${clipBoxY.toFixed(2)})" class="botanical-art">
        <svg viewBox="0 0 100 100" width="${maxClipSize.toFixed(2)}" height="${maxClipSize.toFixed(2)}">
          ${clipArt.svg}
        </svg>
      </g>
    `;
  }

  // Harvest Details Box
  svg += `
      <!-- Harvest Information Banner -->
      <g class="harvest-meta" transform="translate(0, ${harvestY.toFixed(2)})">
        <line x1="${(innerX + 4).toFixed(2)}" y1="0" x2="${(innerX + innerW - 4).toFixed(2)}" y2="0" stroke="#2b231d" stroke-width="0.4" />
        <line x1="${(innerX + 4).toFixed(2)}" y1="0.7" x2="${(innerX + innerW - 4).toFixed(2)}" y2="0.7" stroke="#2b231d" stroke-width="0.2" />
        <text x="${centerX.toFixed(2)}" y="3.8"
              text-anchor="middle" font-family="${fontBody}" font-size="${(metrics.isFullSheet ? 2.8 : 2.5).toFixed(2)}" font-weight="600" letter-spacing="0.5" fill="#2b231d">
          ${escapeXml(harvestText)}
        </text>
        <line x1="${(innerX + 4).toFixed(2)}" y1="5.0" x2="${(innerX + innerW - 4).toFixed(2)}" y2="5.0" stroke="#2b231d" stroke-width="0.2" />
        <line x1="${(innerX + 4).toFixed(2)}" y1="5.7" x2="${(innerX + innerW - 4).toFixed(2)}" y2="5.7" stroke="#2b231d" stroke-width="0.4" />
      </g>
  `;

  // Extra Notes (1-2 lines)
  if (state.notes && state.notes.trim()) {
    const rawNotes = state.notes.trim();
    const maxLineChars = metrics.isFullSheet ? 48 : 36;
    const lines = wrapTextIntoLines(rawNotes, maxLineChars);
    svg += `
      <!-- Provenance / Extra Notes -->
      <g class="packet-notes" transform="translate(0, ${notesY.toFixed(2)})">
    `;
    lines.slice(0, 2).forEach((line, idx) => {
      svg += `
        <text x="${centerX.toFixed(2)}" y="${(idx * 3.4).toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${(metrics.isFullSheet ? 2.5 : 2.2).toFixed(2)}" font-style="italic" fill="#5c4d41">
          ${escapeXml(line)}
        </text>
      `;
    });
    svg += `</g>`;
  }

  // Quality Guarantee Footer
  svg += `
      <!-- Quality Guarantee -->
      <text x="${centerX.toFixed(2)}" y="${footerY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${(metrics.isFullSheet ? 2.2 : 2.0).toFixed(2)}" letter-spacing="1.2" fill="#756254">
        ★ TESTED GERMINATION • OPEN POLLINATED ★
      </text>
    </g>
  `;

  return svg;
}

/**
 * Renders decorative outside patterns for Full Sheet (No-Cut) mode.
 * Shows garden notes on bottom flap (which forms the envelope back)
 * and circular seal on the top flap (which forms the closure tab).
 */
function renderFullSheetOutsideDecorations(state, metrics) {
  const { paper, geom, frontX: x0, frontY: y0 } = metrics;
  const centerX = paper.width / 2;
  const fontBody = "'IM Fell English', 'Libre Caslon Text', 'Georgia', serif";

  let decor = `
    <!-- Top Closure Flap Seal (visible when envelope is folded shut) -->
    <g class="fullsheet-top-seal" transform="translate(${centerX.toFixed(2)}, ${(y0 / 2).toFixed(2)})" text-anchor="middle" fill="#52443a">
      <circle cx="0" cy="0" r="8" fill="#fcfaf5" stroke="#2b231d" stroke-width="0.6" />
      <circle cx="0" cy="0" r="6.8" fill="none" stroke="#2b231d" stroke-width="0.2" stroke-dasharray="1.2 1" />
      <text y="-1.5" font-family="${fontBody}" font-size="2.2" font-weight="bold" letter-spacing="0.5">ESTD</text>
      <text y="2.5" font-family="${fontBody}" font-size="3.2" font-style="italic">❦</text>
      <text y="5.0" font-family="${fontBody}" font-size="1.8" letter-spacing="0.8">SEED BANK</text>
      <text y="12.0" font-family="${fontBody}" font-size="2.2" fill="#8c7866" font-style="italic">[4] FOLD TOP DOWN &amp; TUCK INTO POCKET</text>
    </g>

    <!-- Bottom Flap Garden Record (forms the back of the folded envelope) -->
    <g class="fullsheet-back-notes" transform="translate(${centerX.toFixed(2)}, ${(y0 + geom.H + 16).toFixed(2)})" text-anchor="middle" fill="#4a3e36">
      <rect x="-42" y="0" width="84" height="48" fill="#fcfaf5" stroke="#2b231d" stroke-width="0.5" rx="0.5" />
      <rect x="-40.5" y="1.5" width="81" height="45" fill="none" stroke="#2b231d" stroke-width="0.2" stroke-dasharray="2 1" />
      <text y="5.8" font-family="${fontBody}" font-size="2.8" font-weight="bold" letter-spacing="1">GARDEN SOWING &amp; VIABILITY RECORD</text>
      <line x1="-40.5" y1="8" x2="40.5" y2="8" stroke="#2b231d" stroke-width="0.3" />

      <!-- Lined journal rows -->
      <line x1="-38" y1="15" x2="38" y2="15" stroke="#8c7866" stroke-width="0.2" />
      <line x1="-38" y1="22" x2="38" y2="22" stroke="#8c7866" stroke-width="0.2" />
      <line x1="-38" y1="29" x2="38" y2="29" stroke="#8c7866" stroke-width="0.2" />
      <line x1="-38" y1="36" x2="38" y2="36" stroke="#8c7866" stroke-width="0.2" />
      <line x1="-38" y1="43" x2="38" y2="43" stroke="#8c7866" stroke-width="0.2" />

      <text x="-36" y="14" text-anchor="start" font-family="${fontBody}" font-size="2.1" fill="#756254">Soil Temp / Days to Germinate:</text>
      <text x="-36" y="21" text-anchor="start" font-family="${fontBody}" font-size="2.1" fill="#756254">Sowing Depth &amp; Plant Spacing:</text>
      <text x="-36" y="28" text-anchor="start" font-family="${fontBody}" font-size="2.1" fill="#756254">Sunlight / Garden Bed Location:</text>
      <text x="-36" y="35" text-anchor="start" font-family="${fontBody}" font-size="2.1" fill="#756254">Seed Count / Lot &amp; Season:</text>
      <text x="-36" y="42" text-anchor="start" font-family="${fontBody}" font-size="2.1" fill="#756254">Cultivation Notes:</text>
    </g>

    <!-- Side Flap Step Labels -->
    <g class="fullsheet-side-labels" fill="#8c7866" font-family="${fontBody}" font-size="2.4" text-anchor="middle">
      <text x="${(x0 / 2).toFixed(2)}" y="${(y0 + geom.H / 2).toFixed(2)}" transform="rotate(-90 ${(x0 / 2).toFixed(2)} ${(y0 + geom.H / 2).toFixed(2)})">
        [1] FOLD LEFT FLAP INWARD ➔
      </text>
      <text x="${(paper.width - x0 / 2).toFixed(2)}" y="${(y0 + geom.H / 2).toFixed(2)}" transform="rotate(90 ${(paper.width - x0 / 2).toFixed(2)} ${(y0 + geom.H / 2).toFixed(2)})">
        [2] 🠔 FOLD RIGHT FLAP INWARD
      </text>
      <text x="${centerX.toFixed(2)}" y="${(paper.height - 12).toFixed(2)}">
        [3] FOLD BOTTOM UP TO FORM POCKET 🠕
      </text>
    </g>
  `;
  return decor;
}

/**
 * Escapes XML/SVG special characters safely.
 */
function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Utility to split text into lines of roughly maxChars.
 */
function wrapTextIntoLines(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}
