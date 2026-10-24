/**
 * Parametric Envelope Geometry & SVG Template Generator
 * Defines all measurements in millimeters for tapeless interlocking seed envelopes.
 */

const ENVELOPE_CONFIG = {
  presets: {
    small: {
      name: "Small (Seeds & Herbs)",
      description: "64 × 90 mm finished front (compact seeds like carrot, poppy, thyme)",
      W: 64,                  // Finished width in mm
      H: 90,                  // Finished height in mm
      sideFlapWidth: 26,      // Width of side flaps
      bottomFlapHeight: 68,   // Height of bottom flap (forms back pocket)
      topFlapHeight: 40,      // Total height of top flap
      tuckDepth: 20,          // Depth of rounded tuck tongue
      tuckTongueWidth: 42,    // Width of tuck tongue
      lockingEarWidth: 10,    // Interlocking ear width on bottom flap
      lockingEarHeight: 18,   // Interlocking ear height on bottom flap
      notchOffset: 12,        // Locking notch position on side flaps
      clipArtSize: 32,        // Max size for center clip art
    },
    medium: {
      name: "Medium (Standard)",
      description: "74 × 105 mm finished front (classic seed catalog size)",
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
      clipArtSize: 38,
    },
    large: {
      name: "Large (Beans, Peas & Corn)",
      description: "84 × 120 mm finished front (spacious for large seeds)",
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
 * Calculates layout positions and bounding coordinates for an envelope on a paper sheet.
 */
function calculateEnvelopeMetrics(presetKey, paperKey) {
  const geom = ENVELOPE_CONFIG.presets[presetKey] || ENVELOPE_CONFIG.presets.medium;
  const paper = ENVELOPE_CONFIG.papers[paperKey] || ENVELOPE_CONFIG.papers.letter;

  // The total width of the unfolded net: left flap + front panel + right flap
  const totalNetWidth = geom.W + (geom.sideFlapWidth * 2);
  // The total height of the unfolded net: top flap + front panel + bottom flap
  const totalNetHeight = geom.H + geom.topFlapHeight + geom.bottomFlapHeight;

  // Center the envelope net on the paper sheet
  const netOriginX = (paper.width - totalNetWidth) / 2;
  const netOriginY = (paper.height - totalNetHeight) / 2;

  // Front panel top-left coordinates on sheet
  const frontX = netOriginX + geom.sideFlapWidth;
  const frontY = netOriginY + geom.topFlapHeight;

  return {
    geom,
    paper,
    totalNetWidth,
    totalNetHeight,
    netOriginX,
    netOriginY,
    frontX,
    frontY
  };
}

/**
 * Generates the SVG path for the solid cut outline of the envelope net.
 */
function generateCutOutlinePath(metrics) {
  const { geom, frontX: x0, frontY: y0 } = metrics;
  const W = geom.W;
  const H = geom.H;
  const Sw = geom.sideFlapWidth;
  const Ht = geom.topFlapHeight;
  const Td = geom.tuckDepth;
  const Tw = geom.tuckTongueWidth;
  const Hb = geom.bottomFlapHeight;
  const Ew = geom.lockingEarWidth;
  const Eh = geom.lockingEarHeight;

  const tongueLeft = x0 + (W - Tw) / 2;
  const tongueRight = x0 + (W + Tw) / 2;

  // Build continuous closed perimeter starting at top-left corner of front panel (x0, y0)
  const p = [];

  // 1. TOP FLAP (extends upwards to y0 - Ht)
  p.push(`M ${x0.toFixed(2)} ${y0.toFixed(2)}`);
  // Slight shoulder taper
  p.push(`L ${(x0 + 3).toFixed(2)} ${(y0 - 10).toFixed(2)}`);
  p.push(`L ${tongueLeft.toFixed(2)} ${(y0 - (Ht - Td)).toFixed(2)}`);
  // Rounded tuck tongue top
  p.push(`Q ${tongueLeft.toFixed(2)} ${(y0 - Ht).toFixed(2)} ${(tongueLeft + 6).toFixed(2)} ${(y0 - Ht).toFixed(2)}`);
  p.push(`L ${(tongueRight - 6).toFixed(2)} ${(y0 - Ht).toFixed(2)}`);
  p.push(`Q ${tongueRight.toFixed(2)} ${(y0 - Ht).toFixed(2)} ${tongueRight.toFixed(2)} ${(y0 - (Ht - Td)).toFixed(2)}`);
  p.push(`L ${(x0 + W - 3).toFixed(2)} ${(y0 - 10).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${y0.toFixed(2)}`);

  // 2. RIGHT SIDE FLAP (extends right to x0 + W + Sw)
  // Beveled top entry
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + Sw * 0.7).toFixed(2)}`);
  // Right edge down to locking notch area
  const rightNotchY = y0 + H - Hb + geom.notchOffset;
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(rightNotchY - 5).toFixed(2)}`);
  // Latching notch
  p.push(`L ${(x0 + W + Sw - 3.5).toFixed(2)} ${rightNotchY.toFixed(2)}`);
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(rightNotchY + 5).toFixed(2)}`);
  // Down to bottom bevel
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + H - 14).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${(y0 + H - 2).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // 3. BOTTOM FLAP (extends downwards to y0 + H + Hb)
  // Runs down right side towards locking ear
  p.push(`L ${(x0 + W - 0.5).toFixed(2)} ${(y0 + H + Hb - Eh).toFixed(2)}`);
  // Right Interlocking Ear (wing flaring right)
  p.push(`L ${(x0 + W + Ew).toFixed(2)} ${(y0 + H + Hb - Eh * 0.5).toFixed(2)}`);
  p.push(`L ${(x0 + W + Ew).toFixed(2)} ${(y0 + H + Hb - 4).toFixed(2)}`);
  p.push(`L ${(x0 + W - 4).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  // Bottom horizontal edge
  p.push(`L ${(x0 + 4).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  // Left Interlocking Ear (wing flaring left)
  p.push(`L ${(x0 - Ew).toFixed(2)} ${(y0 + H + Hb - 4).toFixed(2)}`);
  p.push(`L ${(x0 - Ew).toFixed(2)} ${(y0 + H + Hb - Eh * 0.5).toFixed(2)}`);
  p.push(`L ${(x0 + 0.5).toFixed(2)} ${(y0 + H + Hb - Eh).toFixed(2)}`);
  p.push(`L ${x0.toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // 4. LEFT SIDE FLAP (extends left to x0 - Sw)
  p.push(`L ${x0.toFixed(2)} ${(y0 + H - 2).toFixed(2)}`);
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + H - 14).toFixed(2)}`);
  // Left edge with matching latching notch
  const leftNotchY = y0 + H - Hb + geom.notchOffset;
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(leftNotchY + 5).toFixed(2)}`);
  p.push(`L ${(x0 - Sw + 3.5).toFixed(2)} ${leftNotchY.toFixed(2)}`);
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(leftNotchY - 5).toFixed(2)}`);
  // Beveled top exit back to (x0, y0)
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + Sw * 0.7).toFixed(2)}`);
  p.push("Z");

  return p.join(" ");
}

/**
 * Generates the dashed fold lines for the envelope net.
 */
function generateFoldLines(metrics) {
  const { geom, frontX: x0, frontY: y0 } = metrics;
  const W = geom.W;
  const H = geom.H;

  return [
    // Top flap fold (horizontal)
    { x1: x0, y1: y0, x2: x0 + W, y2: y0, label: "Top Flap Fold" },
    // Bottom flap fold (horizontal)
    { x1: x0, y1: y0 + H, x2: x0 + W, y2: y0 + H, label: "Bottom Flap Fold" },
    // Left flap fold (vertical)
    { x1: x0, y1: y0, x2: x0, y2: y0 + H, label: "Left Flap Fold" },
    // Right flap fold (vertical)
    { x1: x0 + W, y1: y0, x2: x0 + W, y2: y0 + H, label: "Right Flap Fold" }
  ];
}

/**
 * Mirrors a path horizontally around the paper center line (X = paperWidth / 2).
 * Used for duplex (two-sided) inside sheet printing.
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
 * Calculates dynamic font size in points / mm for auto-fitting text into a target width.
 */
function calculateAutoFitFontSize(text, maxWidthMm, initialSizePt, minSizePt = 9) {
  if (!text || text.trim() === '') return initialSizePt;
  const trimmed = text.trim();
  // Average serif character width is roughly ~0.55 of font size in points (1 pt ≈ 0.3528 mm)
  // Approximate width in mm: chars * fontSizePt * 0.55 * 0.3528 = chars * fontSizePt * 0.194
  const estWidthAtInitial = trimmed.length * initialSizePt * 0.194;
  if (estWidthAtInitial <= maxWidthMm) {
    return initialSizePt;
  }
  const scaledSize = initialSizePt * (maxWidthMm / estWidthAtInitial);
  return Math.max(minSizePt, Math.round(scaledSize * 10) / 10);
}

/**
 * Generates the complete Vintage Front Artwork SVG group for the seed packet.
 */
function renderFrontPanelArtwork(state, metrics) {
  const { geom, frontX: x0, frontY: y0 } = metrics;
  const W = geom.W;
  const H = geom.H;

  const fontHeader = state.fontFamily || "'Rye', 'Playfair Display SC', 'Georgia', serif";
  const fontBody = "'IM Fell English', 'Libre Caslon Text', 'Georgia', serif";

  // Calculate inner printable dimensions with 4mm border margin
  const margin = 4.2;
  const innerX = x0 + margin;
  const innerY = y0 + margin;
  const innerW = W - (margin * 2);
  const innerH = H - (margin * 2);

  // Auto-fit font sizes
  const seedName = state.seedName || "HEIRLOOM SEED";
  const maxTitleWidth = innerW - 6;
  const titleFontSize = calculateAutoFitFontSize(seedName, maxTitleWidth, 18, 10);

  const hasLatinName = state.latinName && state.latinName.trim().length > 0;
  const latinFontSize = hasLatinName ? calculateAutoFitFontSize(state.latinName, innerW - 10, 11, 7.5) : 0;

  // Selected clip art
  const clipArt = CLIP_ART_MANIFEST.find(c => c.id === state.clipArtId) || CLIP_ART_MANIFEST[0];
  const clipArtSize = geom.clipArtSize || 36;

  // Layout spacing coordinates
  const centerX = x0 + (W / 2);
  
  // Header badge top
  const badgeY = innerY + 3.8;
  const titleY = badgeY + 8.5;
  
  // Dynamic Y positions based on presence of Latin name
  let latinY = titleY;
  let varietyY = titleY + 5.5;
  let clipArtY = 0;

  if (hasLatinName) {
    latinY = titleY + 5.5;
    varietyY = latinY + 5.0;
    clipArtY = varietyY + 4;
  } else {
    // Collapse Latin name space
    varietyY = titleY + 5.5;
    clipArtY = varietyY + 4.5;
  }

  // Clip art box coordinates
  const clipBoxX = centerX - (clipArtSize / 2);
  const clipBoxY = clipArtY;
  const afterClipY = clipBoxY + clipArtSize + 4;

  // Harvest date & time banner
  const harvestY = afterClipY + 2;
  
  // Extra notes area
  const notesY = harvestY + 6.5;

  // Date formatting
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
      <g stroke="#2b231d" stroke-width="0.5" fill="none">
        <!-- Top Left -->
        <circle cx="${(innerX + 3).toFixed(2)}" cy="${(innerY + 3).toFixed(2)}" r="1.5" />
        <path d="M ${(innerX + 1.5).toFixed(2)} ${(innerY + 3).toFixed(2)} L ${(innerX + 4.5).toFixed(2)} ${(innerY + 3).toFixed(2)} M ${(innerX + 3).toFixed(2)} ${(innerY + 1.5).toFixed(2)} L ${(innerX + 3).toFixed(2)} ${(innerY + 4.5).toFixed(2)}" />
        <!-- Top Right -->
        <circle cx="${(innerX + innerW - 3).toFixed(2)}" cy="${(innerY + 3).toFixed(2)}" r="1.5" />
        <path d="M ${(innerX + innerW - 4.5).toFixed(2)} ${(innerY + 3).toFixed(2)} L ${(innerX + innerW - 1.5).toFixed(2)} ${(innerY + 3).toFixed(2)} M ${(innerX + innerW - 3).toFixed(2)} ${(innerY + 1.5).toFixed(2)} L ${(innerX + innerW - 3).toFixed(2)} ${(innerY + 4.5).toFixed(2)}" />
        <!-- Bottom Left -->
        <circle cx="${(innerX + 3).toFixed(2)}" cy="${(innerY + innerH - 3).toFixed(2)}" r="1.5" />
        <path d="M ${(innerX + 1.5).toFixed(2)} ${(innerY + innerH - 3).toFixed(2)} L ${(innerX + 4.5).toFixed(2)} ${(innerY + innerH - 3).toFixed(2)} M ${(innerX + 3).toFixed(2)} ${(innerY + innerH - 4.5).toFixed(2)} L ${(innerX + 3).toFixed(2)} ${(innerY + innerH - 1.5).toFixed(2)}" />
        <!-- Bottom Right -->
        <circle cx="${(innerX + innerW - 3).toFixed(2)}" cy="${(innerY + innerH - 3).toFixed(2)}" r="1.5" />
        <path d="M ${(innerX + innerW - 4.5).toFixed(2)} ${(innerY + innerH - 3).toFixed(2)} L ${(innerX + innerW - 1.5).toFixed(2)} ${(innerY + innerH - 3).toFixed(2)} M ${(innerX + innerW - 3).toFixed(2)} ${(innerY + innerH - 4.5).toFixed(2)} L ${(innerX + innerW - 3).toFixed(2)} ${(innerY + innerH - 1.5).toFixed(2)}" />
      </g>

      <!-- Vintage Catalog Banner Header -->
      <text x="${centerX.toFixed(2)}" y="${badgeY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="3.2" font-weight="bold" letter-spacing="1.5" fill="#4a3e36">
        ✦ HEIRLOOM SEED COLLECTION ✦
      </text>

      <!-- Plant / Seed Display Name -->
      <text x="${centerX.toFixed(2)}" y="${titleY.toFixed(2)}"
            text-anchor="middle" font-family="${fontHeader}" font-size="${titleFontSize}" font-weight="bold"
            letter-spacing="0.5" fill="#1e1814" class="plant-title">
        ${escapeXml(seedName.toUpperCase())}
      </text>
  `;

  // Latin Name (Italic with flanking ornamental rules)
  if (hasLatinName) {
    const halfSpan = Math.min(innerW * 0.42, 26);
    svg += `
      <!-- Latin Binomial Name -->
      <g class="latin-name-block">
        <line x1="${(centerX - halfSpan).toFixed(2)}" y1="${(latinY - 1).toFixed(2)}" x2="${(centerX - halfSpan + 6).toFixed(2)}" y2="${(latinY - 1).toFixed(2)}" stroke="#8c7866" stroke-width="0.3" />
        <text x="${centerX.toFixed(2)}" y="${latinY.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${latinFontSize}" font-style="italic"
              letter-spacing="0.4" fill="#52443a">
          ❦ ${escapeXml(state.latinName)} ❦
        </text>
        <line x1="${(centerX + halfSpan - 6).toFixed(2)}" y1="${(latinY - 1).toFixed(2)}" x2="${(centerX + halfSpan).toFixed(2)}" y2="${(latinY - 1).toFixed(2)}" stroke="#8c7866" stroke-width="0.3" />
      </g>
    `;
  }

  // Variety
  if (state.variety && state.variety.trim()) {
    svg += `
      <!-- Variety -->
      <text x="${centerX.toFixed(2)}" y="${varietyY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="3.6" font-style="italic" fill="#3a3028">
        var. &#8220;${escapeXml(state.variety.trim())}&#8221;
      </text>
    `;
  }

  // Center Clip Art
  if (clipArt && clipArt.svg) {
    svg += `
      <!-- Botanical Vignette / Clip Art -->
      <g transform="translate(${clipBoxX.toFixed(2)}, ${clipBoxY.toFixed(2)})" class="botanical-art">
        <svg viewBox="0 0 100 100" width="${clipArtSize}" height="${clipArtSize}">
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
        <line x1="${(innerX + 4).toFixed(2)}" y1="0.8" x2="${(innerX + innerW - 4).toFixed(2)}" y2="0.8" stroke="#2b231d" stroke-width="0.2" />
        <text x="${centerX.toFixed(2)}" y="4.2"
              text-anchor="middle" font-family="${fontBody}" font-size="3.3" font-weight="600" letter-spacing="0.5" fill="#2b231d">
          ${escapeXml(harvestText)}
        </text>
        <line x1="${(innerX + 4).toFixed(2)}" y1="5.6" x2="${(innerX + innerW - 4).toFixed(2)}" y2="5.6" stroke="#2b231d" stroke-width="0.2" />
        <line x1="${(innerX + 4).toFixed(2)}" y1="6.4" x2="${(innerX + innerW - 4).toFixed(2)}" y2="6.4" stroke="#2b231d" stroke-width="0.4" />
      </g>
  `;

  // Extra Notes (1-2 lines)
  if (state.notes && state.notes.trim()) {
    const rawNotes = state.notes.trim();
    // Split into 2 lines if longer than 36 chars
    const lines = wrapTextIntoLines(rawNotes, 38);
    svg += `
      <!-- Provenance / Extra Notes -->
      <g class="packet-notes" transform="translate(0, ${notesY.toFixed(2)})">
    `;
    lines.slice(0, 2).forEach((line, idx) => {
      svg += `
        <text x="${centerX.toFixed(2)}" y="${(idx * 3.6).toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="2.9" font-style="italic" fill="#5c4d41">
          ${escapeXml(line)}
        </text>
      `;
    });
    svg += `</g>`;
  }

  // Packet Seal / Viability Promise at Bottom
  const bottomFooterY = innerY + innerH - 3.5;
  svg += `
      <!-- Quality Guarantee -->
      <text x="${centerX.toFixed(2)}" y="${bottomFooterY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="2.5" letter-spacing="1.2" fill="#756254">
        ★ TESTED GERMINATION • OPEN POLLINATED ★
      </text>
    </g>
  `;

  return svg;
}

/**
 * Generates Top Flap Outside Artwork (e.g. vintage seal) and Bottom Flap Outside Artwork
 * for Duplex printing Page 1.
 */
function renderDuplexPage1Decorations(state, metrics) {
  const { geom, frontX: x0, frontY: y0 } = metrics;
  const centerX = x0 + (geom.W / 2);
  const fontBody = "'IM Fell English', 'Libre Caslon Text', 'Georgia', serif";

  let decor = `
    <!-- Top Flap Outside Seal (visible when closed) -->
    <g class="duplex-seal" transform="translate(${centerX.toFixed(2)}, ${(y0 - 18).toFixed(2)})" text-anchor="middle" fill="#52443a">
      <circle cx="0" cy="0" r="7.5" fill="#fcfaf5" stroke="#2b231d" stroke-width="0.6" />
      <circle cx="0" cy="0" r="6.2" fill="none" stroke="#2b231d" stroke-width="0.2" stroke-dasharray="1 1" />
      <text y="-1.5" font-family="${fontBody}" font-size="2.2" font-weight="bold" letter-spacing="0.5">ESTD</text>
      <text y="2.5" font-family="${fontBody}" font-size="3.2" font-style="italic">❦</text>
      <text y="4.8" font-family="${fontBody}" font-size="1.8" letter-spacing="0.8">SEED BANK</text>
    </g>

    <!-- Bottom Flap Outside Note Table (forms back of packet) -->
    <g class="duplex-back-notes" transform="translate(${centerX.toFixed(2)}, ${(y0 + geom.H + 18).toFixed(2)})" text-anchor="middle" fill="#4a3e36">
      <rect x="-30" y="0" width="60" height="42" fill="#fcfaf5" stroke="#2b231d" stroke-width="0.4" />
      <rect x="-28.5" y="1.5" width="57" height="39" fill="none" stroke="#2b231d" stroke-width="0.2" stroke-dasharray="2 1" />
      <text y="6" font-family="${fontBody}" font-size="2.8" font-weight="bold" letter-spacing="1">GARDEN RECORD &amp; SOWING NOTES</text>
      <line x1="-28.5" y1="8" x2="28.5" y2="8" stroke="#2b231d" stroke-width="0.3" />
      <!-- Lined journal rows -->
      <line x1="-26" y1="14" x2="26" y2="14" stroke="#8c7866" stroke-width="0.2" />
      <line x1="-26" y1="20" x2="26" y2="20" stroke="#8c7866" stroke-width="0.2" />
      <line x1="-26" y1="26" x2="26" y2="26" stroke="#8c7866" stroke-width="0.2" />
      <line x1="-26" y1="32" x2="26" y2="32" stroke="#8c7866" stroke-width="0.2" />
      <line x1="-26" y1="38" x2="26" y2="38" stroke="#8c7866" stroke-width="0.2" />
      <text x="-25" y="13" text-anchor="start" font-family="${fontBody}" font-size="2" fill="#756254">Soil Temp / Days to Sprout:</text>
      <text x="-25" y="19" text-anchor="start" font-family="${fontBody}" font-size="2" fill="#756254">Sow Depth &amp; Spacing:</text>
      <text x="-25" y="25" text-anchor="start" font-family="${fontBody}" font-size="2" fill="#756254">Location / Sun Exposure:</text>
      <text x="-25" y="31" text-anchor="start" font-family="${fontBody}" font-size="2" fill="#756254">Purity / Seed Count:</text>
      <text x="-25" y="37" text-anchor="start" font-family="${fontBody}" font-size="2" fill="#756254">Notes:</text>
    </g>
  `;
  return decor;
}

/**
 * Generates Folding Step Guides & Labels on the Inside Sheet (Page 2 for duplex).
 */
function renderInsideFoldingGuides(metrics, isMirrored = false) {
  const { geom, paper, frontX, frontY } = metrics;
  const W = geom.W;
  const H = geom.H;
  const fontBody = "'IM Fell English', 'Libre Caslon Text', 'Georgia', serif";

  // Calculate coordinates, accounting for mirror if enabled
  const getX = (x) => isMirrored ? (paper.width - x) : x;

  const leftFlapCenter = getX(frontX - (geom.sideFlapWidth / 2));
  const rightFlapCenter = getX(frontX + W + (geom.sideFlapWidth / 2));
  const bottomCenter = getX(frontX + (W / 2));
  const topCenter = getX(frontX + (W / 2));

  return `
    <g class="folding-guides" fill="#706053" font-family="${fontBody}" text-anchor="middle">
      <!-- Flap 1 (Left Flap) -->
      <g transform="translate(${leftFlapCenter.toFixed(2)}, ${(frontY + H / 2).toFixed(2)})">
        <text y="-4" font-size="3.2" font-weight="bold">[ 1 ]</text>
        <text y="0" font-size="2.6">FOLD INWARD</text>
        <text y="4" font-size="2.2" font-style="italic">along crease</text>
      </g>

      <!-- Flap 2 (Right Flap) -->
      <g transform="translate(${rightFlapCenter.toFixed(2)}, ${(frontY + H / 2).toFixed(2)})">
        <text y="-4" font-size="3.2" font-weight="bold">[ 2 ]</text>
        <text y="0" font-size="2.6">FOLD INWARD</text>
        <text y="4" font-size="2.2" font-style="italic">along crease</text>
      </g>

      <!-- Flap 3 (Bottom Flap & Locking Ears) -->
      <g transform="translate(${bottomCenter.toFixed(2)}, ${(frontY + H + geom.bottomFlapHeight / 2).toFixed(2)})">
        <text y="-4" font-size="3.4" font-weight="bold">[ 3 ]</text>
        <text y="0" font-size="2.8" font-weight="bold">FOLD UP OVER SIDES</text>
        <text y="4" font-size="2.4" font-style="italic">Tuck side ears behind flaps to lock!</text>
      </g>

      <!-- Flap 4 (Top Tuck Flap) -->
      <g transform="translate(${topCenter.toFixed(2)}, ${(frontY - geom.topFlapHeight / 2).toFixed(2)})">
        <text y="-3" font-size="3.2" font-weight="bold">[ 4 ]</text>
        <text y="1" font-size="2.6">FOLD DOWN &amp; TUCK</text>
        <text y="4.5" font-size="2.2" font-style="italic">into pocket opening</text>
      </g>
    </g>
  `;
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
