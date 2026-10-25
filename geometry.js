/**
 * Parametric Envelope Geometry & SVG Template Generator
 * 
 * Folding Styles:
 * 1. classic: Classic Heirloom Flap Envelope (Straight perimeter cut, overlapping side flaps)
 * 2. petal: Interlocking 4-Petal Flower Pouch (100% Glue-Free pinwheel lock, looks like a flower bud)
 * 3. origami: Gardener's Diamond Pouch (100% Glue-Free, traditional diagonal cup fold)
 * 4. tuckslot: Interlocking Tuck-Slot Envelope (Deep bottom pocket with die-cut crescent slit)
 * 
 * Sheet Layouts:
 * - single: 1 Packet per Sheet (Maximized Page-Fill 3.7 × 5.6 in finished front)
 * - twin: 2 Packets per Sheet (Standard 3.0 × 3.9 in Twin Envelopes)
 */

const ENVELOPE_CONFIG = {
  foldingStyles: {
    classic: {
      name: "Classic Heirloom Flap",
      description: "Traditional commercial seed envelope. Side flaps fold behind and seal with glue stick, tape, or sticker."
    },
    petal: {
      name: "Interlocking 4-Petal Flower (100% Glue-Free)",
      description: "Four curved flower petal flaps that weave clockwise into a self-locking pinwheel. Stunning presentation, zero tape or glue."
    },
    origami: {
      name: "Gardener's Diamond Pouch (100% Glue-Free)",
      description: "Traditional gardener's cup pouch fold from a cut square. Never leaks fine seeds, zero tape or glue."
    },
    tuckslot: {
      name: "Interlocking Tuck-Slot (Glue-Free)",
      description: "Straight perimeter cut with a die-cut crescent slit on the back pocket for the closure tongue to tuck into."
    }
  },

  sheetLayouts: {
    single: {
      name: "1 Packet per Sheet (Max-Page 3.7 × 5.6 in)",
      packetsPerSheet: 1
    },
    twin: {
      name: "2 Packets per Sheet (Twin Packets)",
      packetsPerSheet: 2
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
 * Calculates font size in millimeters that strictly fits inside maxWidthMm.
 */
function calculateAutoFitFontSize(text, maxWidthMm, maxFontMm, minFontMm, fontFamily) {
  if (!text || text.trim() === '') return maxFontMm;
  const trimmed = text.trim();

  let widthFactor = 0.65;
  const fLower = (fontFamily || '').toLowerCase();
  if (fLower.includes('abril')) {
    widthFactor = 0.88;
  } else if (fLower.includes('rye')) {
    widthFactor = 0.82;
  } else if (fLower.includes('fell')) {
    widthFactor = 0.62;
  } else if (fLower.includes('caslon')) {
    widthFactor = 0.58;
  }

  const charCount = trimmed.length;
  const fitSizeMm = maxWidthMm / (charCount * widthFactor);
  return Math.max(minFontMm, Math.min(maxFontMm, Math.round(fitSizeMm * 10) / 10));
}

/**
 * Main SVG Generator function called by app.js.
 */
function generateSheetSVG(state) {
  const paper = ENVELOPE_CONFIG.papers[state.paperSize] || ENVELOPE_CONFIG.papers.letter;
  const layout = state.sheetLayout || 'single';
  const style = state.foldingStyle || 'classic';

  let contentSvg = `
    <!-- Paper Sheet Background with Safe Margins -->
    <rect x="0" y="0" width="${paper.width}" height="${paper.height}" fill="#ffffff" stroke="none" />
  `;

  if (layout === 'twin') {
    // =========================================================================
    // 2 PACKETS PER SHEET (TWIN PACKETS - MAXIMIZED ON EACH HALF)
    // =========================================================================
    const halfH = paper.height / 2;
    const packetMetrics = {
      W: 76,
      H: 100,
      Sw: 42,
      Ht: 18,
      Hb: 20,
      clipArtSize: 30,
      isSmall: true
    };

    // Packet 1 (Top Half)
    const p1OriginY = (halfH - (packetMetrics.H + packetMetrics.Ht + packetMetrics.Hb)) / 2;
    contentSvg += renderPacketByStyle(state, packetMetrics, paper.width / 2, p1OriginY, style, 1);

    // Center Division Cut Line
    contentSvg += `
      <!-- Horizontal Center Division Cut Line -->
      <line x1="8" y1="${halfH.toFixed(2)}" x2="${(paper.width - 8).toFixed(2)}" y2="${halfH.toFixed(2)}"
            stroke="#555555" stroke-width="0.36" stroke-dasharray="3 2" />
      <text x="${(paper.width / 2).toFixed(2)}" y="${(halfH - 2).toFixed(2)}"
            text-anchor="middle" font-family="'IM Fell English', serif" font-size="3.0" font-weight="bold" fill="#756254">
        ✂ ─ ─ ─ CUT SHEET IN HALF TO SEPARATE INTO TWO ENVELOPES ─ ─ ─ ✂
      </text>
    `;

    // Packet 2 (Bottom Half)
    const p2OriginY = halfH + p1OriginY;
    contentSvg += renderPacketByStyle(state, packetMetrics, paper.width / 2, p2OriginY, style, 2);

  } else {
    // =========================================================================
    // 1 PACKET PER SHEET (MAXIMIZED FULL PAGE UTILIZATION)
    // =========================================================================
    if (style === 'origami') {
      contentSvg += renderOrigamiDiamondSheet(state, paper);
    } else if (style === 'petal') {
      contentSvg += renderPetalFlowerSheet(state, paper);
    } else {
      // Classic or Tuck-Slot single large packet maximized to fill paper
      const packetMetrics = {
        W: 94,
        H: 142,
        Sw: 50,
        Ht: 42,
        Hb: 74,
        clipArtSize: 44,
        isSmall: false
      };
      // Center the net on the sheet (total width: 194 mm, total height: 258 mm)
      const originY = (paper.height - (packetMetrics.Ht + packetMetrics.H + packetMetrics.Hb)) / 2;
      contentSvg += renderPacketByStyle(state, packetMetrics, paper.width / 2, originY, style, 1);
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 ${paper.width} ${paper.height}"
         width="100%" height="100%"
         style="background-color: #ffffff; display: block;">
      <defs>
        <!-- Grayscale Filter for Uploaded Photos -->
        <filter id="vintage-monochrome">
          <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"/>
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.9" intercept="0.05"/>
            <feFuncG type="linear" slope="0.85" intercept="0.04"/>
            <feFuncB type="linear" slope="0.75" intercept="0.03"/>
          </feComponentTransfer>
        </filter>
      </defs>
      ${contentSvg}
    </svg>
  `;
}

/**
 * Router to render an envelope net by folding style.
 */
function renderPacketByStyle(state, geom, centerX, originY, style, packetIndex) {
  if (style === 'petal') {
    return renderPetalPacketNet(state, geom, centerX, originY, packetIndex);
  }
  return renderSinglePacketNet(state, geom, centerX, originY, style, packetIndex);
}

/**
 * Style 1 & 4: Classic Flap and Tuck-Slot Net
 */
function renderSinglePacketNet(state, geom, centerX, originY, style, packetIndex) {
  const { W, H, Sw, Ht, Hb, isSmall } = geom;
  const frontX = centerX - (W / 2);
  const frontY = originY + Ht;

  let netSvg = `<!-- Envelope Net ${packetIndex} (${style}) -->`;

  // Perimeter Cut Path
  const cutPath = generateCleanCutPath(frontX, frontY, W, H, Sw, Ht, Hb, style);
  netSvg += `<path d="${cutPath}" fill="none" stroke="#222222" stroke-width="0.38" stroke-linejoin="round" stroke-linecap="round" />`;

  // Dashed Fold Lines
  if (state.showFoldLines !== false) {
    // Vertical side creases (x = frontX and x = frontX + W)
    netSvg += `
      <line x1="${frontX.toFixed(2)}" y1="${frontY.toFixed(2)}" x2="${frontX.toFixed(2)}" y2="${(frontY + H).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.32" stroke-dasharray="3 2" />
      <line x1="${(frontX + W).toFixed(2)}" y1="${frontY.toFixed(2)}" x2="${(frontX + W).toFixed(2)}" y2="${(frontY + H).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.32" stroke-dasharray="3 2" />
      <!-- Horizontal top & bottom creases (y = frontY and y = frontY + H) -->
      <line x1="${frontX.toFixed(2)}" y1="${frontY.toFixed(2)}" x2="${(frontX + W).toFixed(2)}" y2="${frontY.toFixed(2)}"
            stroke="#8c7866" stroke-width="0.32" stroke-dasharray="3 2" />
      <line x1="${frontX.toFixed(2)}" y1="${(frontY + H).toFixed(2)}" x2="${(frontX + W).toFixed(2)}" y2="${(frontY + H).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.32" stroke-dasharray="3 2" />
    `;
  }

  // Tuck-Slot slit line if style === 'tuckslot'
  if (style === 'tuckslot') {
    const slitY = frontY + H + (Hb * 0.45);
    const slitHalfW = (W * 0.35);
    netSvg += `
      <!-- Closure Slit -->
      <line x1="${(centerX - slitHalfW).toFixed(2)}" y1="${slitY.toFixed(2)}" x2="${(centerX + slitHalfW).toFixed(2)}" y2="${slitY.toFixed(2)}"
            stroke="#b83b26" stroke-width="0.5" stroke-dasharray="2 1.5" />
      <text x="${centerX.toFixed(2)}" y="${(slitY - 1.8).toFixed(2)}"
            text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.4" font-weight="bold" fill="#b83b26">
        ✂ SLICE DIE-CUT SLIT FOR TONGUE ✂
      </text>
    `;
  }

  // Front Panel Artwork (Strictly contained inside frontX to frontX+W and frontY to frontY+H)
  netSvg += renderFrontPanelArtwork(state, frontX, frontY, W, H, geom.clipArtSize, isSmall);

  // Clear Flap Folding Guidance (Positioned deep in the flaps, far from any fold line)
  const leftFlapCenterX = frontX - Sw / 2;
  const rightFlapCenterX = frontX + W + Sw / 2;
  const flapCenterY = frontY + H / 2;
  const bottomFlapTextY = frontY + H + (Hb * 0.75);

  netSvg += `
    <!-- Back Flap Fold Instructions -->
    <text x="${centerX.toFixed(2)}" y="${bottomFlapTextY.toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.6" font-weight="bold" fill="#756254">
      ${style === 'tuckslot' ? '▲ FOLD UP & INSERT TONGUE INTO SLIT ▲' : '▲ FOLD UP OVER SIDE FLAPS & SEAL SEAM ▲'}
    </text>
    <text x="${leftFlapCenterX.toFixed(2)}" y="${flapCenterY.toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.4" font-weight="bold" fill="#8c7866"
          transform="rotate(-90 ${leftFlapCenterX.toFixed(2)} ${flapCenterY.toFixed(2)})">
      FOLD INWARD ➔
    </text>
    <text x="${rightFlapCenterX.toFixed(2)}" y="${flapCenterY.toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.4" font-weight="bold" fill="#8c7866"
          transform="rotate(90 ${rightFlapCenterX.toFixed(2)} ${flapCenterY.toFixed(2)})">
      🠔 FOLD INWARD
    </text>
  `;

  return netSvg;
}

/**
 * Generates straight, easily cut perimeter path for Classic and Tuck-slot.
 */
function generateCleanCutPath(x0, y0, W, H, Sw, Ht, Hb, style) {
  const p = [];
  const tongueW = style === 'tuckslot' ? W * 0.50 : W * 0.65;
  const tongueLeft = x0 + (W - tongueW) / 2;
  const tongueRight = x0 + (W + tongueW) / 2;

  // Top Closure Flap
  p.push(`M ${x0.toFixed(2)} ${y0.toFixed(2)}`);
  p.push(`L ${(x0 + 4).toFixed(2)} ${(y0 - Ht * 0.5).toFixed(2)}`);
  if (style === 'tuckslot') {
    // Pointed arrow tongue
    p.push(`L ${tongueLeft.toFixed(2)} ${(y0 - Ht * 0.7).toFixed(2)}`);
    p.push(`L ${(x0 + W / 2).toFixed(2)} ${(y0 - Ht).toFixed(2)}`);
    p.push(`L ${tongueRight.toFixed(2)} ${(y0 - Ht * 0.7).toFixed(2)}`);
  } else {
    // Rounded arch tongue
    p.push(`L ${tongueLeft.toFixed(2)} ${(y0 - Ht).toFixed(2)}`);
    p.push(`Q ${(x0 + W / 2).toFixed(2)} ${(y0 - Ht - 4).toFixed(2)} ${tongueRight.toFixed(2)} ${(y0 - Ht).toFixed(2)}`);
  }
  p.push(`L ${(x0 + W - 4).toFixed(2)} ${(y0 - Ht * 0.5).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${y0.toFixed(2)}`);

  // Right Side Flap
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + 10).toFixed(2)}`);
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + H - 10).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // Bottom Pocket Flap
  p.push(`L ${(x0 + W - 4).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  p.push(`L ${(x0 + 4).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  p.push(`L ${x0.toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // Left Side Flap
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + H - 10).toFixed(2)}`);
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + 10).toFixed(2)}`);
  p.push("Z");

  return p.join(" ");
}

/**
 * Style 2: Interlocking 4-Petal Flower Pouch (100% Glue-Free)
 * Maximized on the sheet with no stake marker.
 */
function renderPetalFlowerSheet(state, paper) {
  const S = 106; // Center square front size 106 × 106 mm
  const R = 47; // Petal radius depth 47 mm (total width 200 mm)
  const centerX = paper.width / 2;
  const centerY = paper.height / 2;
  const x0 = centerX - S / 2;
  const y0 = centerY - S / 2;

  let svg = `<!-- Interlocking 4-Petal Flower Pouch Net -->`;

  // Draw 4 curved petals around the central square
  const p = [];
  p.push(`M ${x0.toFixed(2)} ${y0.toFixed(2)}`);
  p.push(`C ${(x0 - 8).toFixed(2)} ${(y0 - R * 0.9).toFixed(2)}, ${(x0 + S + 8).toFixed(2)} ${(y0 - R * 0.9).toFixed(2)}, ${(x0 + S).toFixed(2)} ${y0.toFixed(2)}`);
  p.push(`C ${(x0 + S + R * 0.9).toFixed(2)} ${(y0 - 8).toFixed(2)}, ${(x0 + S + R * 0.9).toFixed(2)} ${(y0 + S + 8).toFixed(2)}, ${(x0 + S).toFixed(2)} ${(y0 + S).toFixed(2)}`);
  p.push(`C ${(x0 + S + 8).toFixed(2)} ${(y0 + S + R * 0.9).toFixed(2)}, ${(x0 - 8).toFixed(2)} ${(y0 + S + R * 0.9).toFixed(2)}, ${x0.toFixed(2)} ${(y0 + S).toFixed(2)}`);
  p.push(`C ${(x0 - R * 0.9).toFixed(2)} ${(y0 + S + 8).toFixed(2)}, ${(x0 - R * 0.9).toFixed(2)} ${(y0 - 8).toFixed(2)}, ${x0.toFixed(2)} ${y0.toFixed(2)}`);
  p.push("Z");

  svg += `<path d="${p.join(' ')}" fill="#ffffff" stroke="#222222" stroke-width="0.4" stroke-linejoin="round" />`;

  // Dashed fold lines for the center square
  if (state.showFoldLines !== false) {
    svg += `
      <rect x="${x0.toFixed(2)}" y="${y0.toFixed(2)}" width="${S}" height="${S}"
            fill="none" stroke="#8c7866" stroke-width="0.32" stroke-dasharray="3 2" />
    `;
  }

  // Front Panel Artwork inside the center square
  svg += renderFrontPanelArtwork(state, x0, y0, S, S, 36, false);

  // Petal fold instructions (safely out in the petals)
  svg += `
    <g font-family="'IM Fell English', serif" font-size="2.6" font-weight="bold" fill="#756254" text-anchor="middle">
      <text x="${centerX.toFixed(2)}" y="${(y0 - 14).toFixed(2)}">[1] FOLD DOWN</text>
      <text x="${(x0 + S + 18).toFixed(2)}" y="${centerY.toFixed(2)}" transform="rotate(90 ${(x0 + S + 18).toFixed(2)} ${centerY.toFixed(2)})">[2] FOLD LEFT</text>
      <text x="${centerX.toFixed(2)}" y="${(y0 + S + 22).toFixed(2)}">[3] FOLD UP</text>
      <text x="${(x0 - 18).toFixed(2)}" y="${centerY.toFixed(2)}" transform="rotate(-90 ${(x0 - 18).toFixed(2)} ${centerY.toFixed(2)})">[4] TUCK UNDER [1]</text>
    </g>
  `;

  return svg;
}

/**
 * Style 3: Gardener's Diamond Origami Seed Pouch (100% Glue-Free)
 * Maximized on the sheet with no stake marker.
 */
function renderOrigamiDiamondSheet(state, paper) {
  const sqSize = 196; // 196 mm square
  const originX = (paper.width - sqSize) / 2;
  const originY = 14;

  let svg = `<!-- Gardener's Diamond Origami Template -->`;

  // Outer Cut Square
  svg += `
    <rect x="${originX.toFixed(2)}" y="${originY.toFixed(2)}" width="${sqSize.toFixed(2)}" height="${sqSize.toFixed(2)}"
          fill="none" stroke="#222222" stroke-width="0.4" stroke-dasharray="none" />
    <text x="${(paper.width / 2).toFixed(2)}" y="${(originY - 4).toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="3.0" font-weight="bold" fill="#52443a">
      ✂ CUT OUT SQUARE ALONG SOLID PERIMETER • ZERO GLUE OR TAPE REQUIRED ✂
    </text>
  `;

  // Diagonal and cuff fold lines
  svg += `
    <!-- Diagonal Fold Line (Corner to Corner) -->
    <line x1="${originX.toFixed(2)}" y1="${originY.toFixed(2)}" x2="${(originX + sqSize).toFixed(2)}" y2="${(originY + sqSize).toFixed(2)}"
          stroke="#8c7866" stroke-width="0.32" stroke-dasharray="3 2" />
    <line x1="${(originX + sqSize).toFixed(2)}" y1="${originY.toFixed(2)}" x2="${originX.toFixed(2)}" y2="${(originY + sqSize).toFixed(2)}"
          stroke="#8c7866" stroke-width="0.32" stroke-dasharray="3 2" />
  `;

  // Front Panel Artwork oriented in the lower triangle
  const frontW = 88;
  const frontH = 80;
  const frontX = (paper.width - frontW) / 2;
  const frontY = originY + sqSize - frontH - 12;

  svg += renderFrontPanelArtwork(state, frontX, frontY, frontW, frontH, 30, true);

  // Step-by-Step Visual Folding Diagram in the lower margin
  const diagramY = originY + sqSize + 10;
  svg += `
    <g class="origami-instructions" transform="translate(0, ${diagramY.toFixed(2)})">
      <rect x="${originX.toFixed(2)}" y="0" width="${sqSize.toFixed(2)}" height="54"
            fill="#fcfaf5" stroke="#8c7866" stroke-width="0.4" rx="1" />
      <text x="${(paper.width / 2).toFixed(2)}" y="6"
            text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.8" font-weight="bold" fill="#3a3028">
        HOW TO FOLD THE GARDENER'S SEED POUCH (100% TAPELESS &amp; LEAK-PROOF)
      </text>

      <!-- Step 1 -->
      <g transform="translate(${(originX + 16).toFixed(2)}, 14)" font-family="'IM Fell English', serif" font-size="2.4" fill="#52443a">
        <text x="0" y="0" font-weight="bold">[1] Cut Square</text>
        <text x="0" y="5">Fold in half</text>
        <text x="0" y="9">corner to corner</text>
        <text x="0" y="13">into triangle ▼</text>
      </g>

      <!-- Step 2 -->
      <g transform="translate(${(originX + 58).toFixed(2)}, 14)" font-family="'IM Fell English', serif" font-size="2.4" fill="#52443a">
        <text x="0" y="0" font-weight="bold">[2] Left Point</text>
        <text x="0" y="5">Fold left tip</text>
        <text x="0" y="9">horizontally to</text>
        <text x="0" y="13">the right edge ➔</text>
      </g>

      <!-- Step 3 -->
      <g transform="translate(${(originX + 102).toFixed(2)}, 14)" font-family="'IM Fell English', serif" font-size="2.4" fill="#52443a">
        <text x="0" y="0" font-weight="bold">[3] Right Point</text>
        <text x="0" y="5">Fold right tip</text>
        <text x="0" y="9">across to the</text>
        <text x="0" y="13">left edge 🠔</text>
      </g>

      <!-- Step 4 -->
      <g transform="translate(${(originX + 144).toFixed(2)}, 14)" font-family="'IM Fell English', serif" font-size="2.4" fill="#52443a">
        <text x="0" y="0" font-weight="bold">[4] Tuck &amp; Seal</text>
        <text x="0" y="5">Tuck top flap</text>
        <text x="0" y="9">into front pocket.</text>
        <text x="0" y="13">Done! Leak-proof.</text>
      </g>
    </g>
  `;

  return svg;
}

/**
 * Formats the packaged / harvest date string as Month and Year (no time).
 */
function formatPackagedDate(state) {
  const month = state.packagedMonth || "October";
  const year = state.packagedYear || "2026";
  const prefix = state.datePrefix || "PACKAGED";
  return `${prefix}: ${month.toUpperCase()} ${year}`;
}

/**
 * Generates the Vintage Front Artwork SVG group for a packet.
 * Strict collision-free dynamic vertical rhythm algorithm with generous typography.
 * Order:
 * 1. Eyebrow Catalog Banner
 * 2. Plant / Seed Title
 * 3. Botanical Latin Name
 * 4. Cultivar / Variety
 * 5. Central Artwork
 * 6. Garden & Sowing Notes
 * 7. Packaging Information (directly UNDER notes, exact same font size)
 * 8. Trust Badges / Flourish Footer
 * 
 * All elements are strictly bounded within inner margins so text NEVER crosses fold lines.
 */
function renderFrontPanelArtwork(state, x0, y0, W, H, maxClipSize, isSmall) {
  const fontHeader = state.fontFamily || "'Abril Fatface', serif";
  const fontBody = "'IM Fell English', 'Libre Caslon Text', 'Georgia', serif";

  const margin = 4.5; // 4.5 mm inner safety buffer from all 4 fold lines
  const innerX = x0 + margin;
  const innerY = y0 + margin;
  const innerW = W - (margin * 2);
  const innerH = H - (margin * 2);
  const centerX = x0 + (W / 2);

  // Content Flags
  const seedName = state.seedName || "HEIRLOOM SEED";
  const hasLatinName = state.latinName && state.latinName.trim().length > 0;
  const hasVariety = state.variety && state.variety.trim().length > 0;
  const hasNotes = state.notes && state.notes.trim().length > 0;

  // Active Badges
  const activeBadges = [];
  if (state.badgeOpenPollinated) activeBadges.push("OPEN POLLINATED");
  if (state.badgeTestedGermination) activeBadges.push("TESTED GERMINATION");
  if (state.badgeHeirloom) activeBadges.push("HEIRLOOM");
  if (state.badgeOrganic) activeBadges.push("ORGANIC");

  // =========================================================================
  // TOP SECTION (Stacking DOWNWARDS from innerY)
  // =========================================================================
  let topY = innerY + (isSmall ? 4.5 : 6.0);

  // 1. Catalog Header Eyebrow
  const bannerFontSize = isSmall ? 3.0 : 3.8;
  const bannerY = topY + bannerFontSize;
  topY = bannerY + (isSmall ? 3.5 : 5.0);

  // 2. Hero Plant Title (Auto-fit to never cross left/right borders)
  const maxTitleFont = isSmall ? 10.0 : 13.5;
  const minTitleFont = isSmall ? 5.8 : 7.5;
  const titleFontSize = calculateAutoFitFontSize(seedName, innerW - 8, maxTitleFont, minTitleFont, fontHeader);
  const titleY = topY + titleFontSize;
  topY = titleY + (isSmall ? 3.5 : 5.0);

  // 3. Botanical Latin Name (Italic letterpress)
  let latinY = 0;
  const latinFontSize = isSmall ? 3.6 : 4.6;
  if (hasLatinName) {
    latinY = topY + latinFontSize;
    topY = latinY + (isSmall ? 3.2 : 4.5);
  }

  // 4. Cultivar / Variety
  let varietyY = 0;
  const varietyFontSize = isSmall ? 3.2 : 4.0;
  if (hasVariety) {
    varietyY = topY + varietyFontSize;
    topY = varietyY + (isSmall ? 3.5 : 5.0);
  }

  // =========================================================================
  // BOTTOM SECTION (Stacking UPWARDS from innerY + innerH)
  // Order: Notes -> Packaging Date (directly under notes, same size) -> Badges
  // =========================================================================
  let botY = innerY + innerH - (isSmall ? 4.5 : 6.0);

  // 8. Trust Badges / Tailpiece Footer
  const footerFontSize = isSmall ? 3.0 : 3.8;
  const footerY = botY;
  botY = footerY - footerFontSize - (isSmall ? 4.0 : 6.0);

  // 7. Packaging Information (Requirement 2: SAME FONT SIZE AS NOTES, directly under notes)
  const notesFontSize = isSmall ? 3.4 : 4.2;
  const dateFontSize = notesFontSize; // Exactly matching font size!
  const dateTextY = botY;
  const dateTopBound = dateTextY - dateFontSize;

  // 6. Garden & Sowing Notes (directly ABOVE Packaging Info)
  const notesLines = [];
  const notesLineSpacing = notesFontSize + (isSmall ? 2.0 : 2.6);
  let notesLine1Y = 0, notesLine2Y = 0;
  let notesTopBound = dateTopBound;

  if (hasNotes) {
    const maxChars = innerW > 70 ? 46 : 30;
    const lines = wrapTextIntoLines(state.notes.trim(), maxChars);
    if (lines.length > 1) {
      notesLines.push(lines[0], lines[1]);
      notesLine2Y = dateTopBound - (isSmall ? 4.5 : 6.5);
      notesLine1Y = notesLine2Y - notesLineSpacing;
      notesTopBound = notesLine1Y - notesFontSize;
    } else if (lines.length === 1) {
      notesLines.push(lines[0]);
      notesLine1Y = dateTopBound - (isSmall ? 4.5 : 6.5);
      notesTopBound = notesLine1Y - notesFontSize;
    }
  }

  // =========================================================================
  // CENTRAL ARTWORK (Centered in the open space between topY and notesTopBound)
  // =========================================================================
  const artAvailableH = Math.max(16, (notesTopBound - (isSmall ? 4.0 : 6.0)) - topY);
  const artSize = Math.min(maxClipSize || 46, artAvailableH, innerW * 0.58);
  const clipBoxX = centerX - (artSize / 2);
  const clipBoxY = topY + (artAvailableH - artSize) / 2;

  // =========================================================================
  // SVG RENDERING
  // =========================================================================
  let svg = `
    <g class="vintage-front-panel" fill="#2b231d" stroke="none">
      <!-- Outer Double Border with Corner Florets -->
      <rect x="${innerX.toFixed(2)}" y="${innerY.toFixed(2)}" width="${innerW.toFixed(2)}" height="${innerH.toFixed(2)}"
            fill="#fcfaf5" stroke="#2b231d" stroke-width="0.85" rx="0.5" />
      <rect x="${(innerX + 1.4).toFixed(2)}" y="${(innerY + 1.4).toFixed(2)}" width="${(innerW - 2.8).toFixed(2)}" height="${(innerH - 2.8).toFixed(2)}"
            fill="none" stroke="#2b231d" stroke-width="0.32" stroke-dasharray="2.8 1.4" />

      <!-- Corner Rosettes -->
      <g stroke="#2b231d" stroke-width="0.38" fill="none">
        <circle cx="${(innerX + 3.2).toFixed(2)}" cy="${(innerY + 3.2).toFixed(2)}" r="1.4" />
        <circle cx="${(innerX + innerW - 3.2).toFixed(2)}" cy="${(innerY + 3.2).toFixed(2)}" r="1.4" />
        <circle cx="${(innerX + 3.2).toFixed(2)}" cy="${(innerY + innerH - 3.2).toFixed(2)}" r="1.4" />
        <circle cx="${(innerX + innerW - 3.2).toFixed(2)}" cy="${(innerY + innerH - 3.2).toFixed(2)}" r="1.4" />
      </g>

      <!-- Vintage Catalog Banner Eyebrow -->
      <text x="${centerX.toFixed(2)}" y="${bannerY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${bannerFontSize.toFixed(2)}" font-weight="bold" letter-spacing="1.6" fill="#52443a">
        ✦ HEIRLOOM SEED COLLECTION ✦
      </text>

      <!-- Plant / Seed Display Name -->
      <text x="${centerX.toFixed(2)}" y="${titleY.toFixed(2)}"
            text-anchor="middle" font-family="${fontHeader}" font-size="${titleFontSize.toFixed(2)}" font-weight="bold"
            letter-spacing="0.6" fill="#140f0c">
        ${escapeXml(seedName.toUpperCase())}
      </text>
  `;

  // Latin Name
  if (hasLatinName) {
    const halfSpan = Math.min(innerW * 0.42, 26);
    svg += `
      <g class="latin-name-block">
        <line x1="${(centerX - halfSpan).toFixed(2)}" y1="${(latinY - 1.1).toFixed(2)}" x2="${(centerX - halfSpan + 6).toFixed(2)}" y2="${(latinY - 1.1).toFixed(2)}" stroke="#8c7866" stroke-width="0.35" />
        <text x="${centerX.toFixed(2)}" y="${latinY.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${latinFontSize.toFixed(2)}" font-style="italic"
              letter-spacing="0.4" fill="#3a2e25">
          ❦ ${escapeXml(state.latinName)} ❦
        </text>
        <line x1="${(centerX + halfSpan - 6).toFixed(2)}" y1="${(latinY - 1.1).toFixed(2)}" x2="${(centerX + halfSpan).toFixed(2)}" y2="${(latinY - 1.1).toFixed(2)}" stroke="#8c7866" stroke-width="0.35" />
      </g>
    `;
  }

  // Cultivar / Variety
  if (hasVariety) {
    svg += `
      <text x="${centerX.toFixed(2)}" y="${varietyY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${varietyFontSize.toFixed(2)}" font-style="italic" fill="#30261e">
        var. &#8220;${escapeXml(state.variety.trim())}&#8221;
      </text>
    `;
  }

  // Central Artwork: Custom Uploaded Picture OR Vector Engraving
  if (state.customImage) {
    const filterAttr = state.imageFilter === 'monochrome' ? 'filter="url(#vintage-monochrome)"' : '';
    svg += `
      <!-- User Uploaded Custom Picture -->
      <g class="custom-artwork-image" transform="translate(${clipBoxX.toFixed(2)}, ${clipBoxY.toFixed(2)})">
        <image href="${state.customImage}"
               x="0" y="0" width="${artSize.toFixed(2)}" height="${artSize.toFixed(2)}"
               preserveAspectRatio="xMidYMid meet"
               ${filterAttr} />
      </g>
    `;
  } else {
    const clipArt = CLIP_ART_MANIFEST.find(c => c.id === state.clipArtId) || CLIP_ART_MANIFEST[0];
    if (clipArt && clipArt.svg) {
      svg += `
        <!-- Botanical Engraving -->
        <g transform="translate(${clipBoxX.toFixed(2)}, ${clipBoxY.toFixed(2)})" class="botanical-art">
          <svg viewBox="0 0 100 100" width="${artSize.toFixed(2)}" height="${artSize.toFixed(2)}">
            ${clipArt.svg}
          </svg>
        </g>
      `;
    } else {
      svg += `
        <!-- Minimalist Flourish -->
        <g transform="translate(${centerX.toFixed(2)}, ${(clipBoxY + artSize / 2).toFixed(2)})" stroke="#8c7866" stroke-width="0.45" fill="none">
          <path d="M -20 0 C -12 -5 -5 5 0 0 C 5 -5 12 5 20 0" />
          <circle cx="0" cy="0" r="1.8" fill="#8c7866" />
        </g>
      `;
    }
  }

  // 6. Garden & Sowing Notes (Rendered directly ABOVE Packaging Info)
  if (notesLines.length > 0) {
    svg += `<g class="packet-notes">`;
    if (notesLines.length === 1) {
      svg += `
        <text x="${centerX.toFixed(2)}" y="${notesLine1Y.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${notesFontSize.toFixed(2)}" font-style="italic" fill="#3a2e24">
          ${escapeXml(notesLines[0])}
        </text>
      `;
    } else {
      svg += `
        <text x="${centerX.toFixed(2)}" y="${notesLine1Y.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${notesFontSize.toFixed(2)}" font-style="italic" fill="#3a2e24">
          ${escapeXml(notesLines[0])}
        </text>
        <text x="${centerX.toFixed(2)}" y="${notesLine2Y.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${notesFontSize.toFixed(2)}" font-style="italic" fill="#3a2e24">
          ${escapeXml(notesLines[1])}
        </text>
      `;
    }
    svg += `</g>`;
  }

  // 7. Packaging Information (Requirement 2: DIRECTLY UNDER Garden Notes, SAME FONT SIZE)
  const dateStr = formatPackagedDate(state);
  const ruleSpan = Math.min(innerW * 0.44, 28);
  svg += `
    <!-- Packaging Information Ribbon (Under Notes, Matching Size) -->
    <g class="harvest-meta">
      <line x1="${(centerX - ruleSpan).toFixed(2)}" y1="${(dateTextY - dateFontSize * 0.4).toFixed(2)}"
            x2="${(innerX + 5).toFixed(2)}" y2="${(dateTextY - dateFontSize * 0.4).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.32" />
      <text x="${centerX.toFixed(2)}" y="${dateTextY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${dateFontSize.toFixed(2)}" font-weight="600" letter-spacing="0.8" fill="#1e1814">
        ✦ ${escapeXml(dateStr)} ✦
      </text>
      <line x1="${(centerX + ruleSpan).toFixed(2)}" y1="${(dateTextY - dateFontSize * 0.4).toFixed(2)}"
            x2="${(innerX + innerW - 5).toFixed(2)}" y2="${(dateTextY - dateFontSize * 0.4).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.32" />
    </g>
  `;

  // 8. Trust Badges / Flourish Footer
  if (activeBadges.length > 0) {
    const badgeText = `★ ${activeBadges.join(" • ")} ★`;
    svg += `
      <text x="${centerX.toFixed(2)}" y="${footerY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${footerFontSize.toFixed(2)}" letter-spacing="1.0" fill="#52443a">
        ${escapeXml(badgeText)}
      </text>
    `;
  } else {
    svg += `
      <g transform="translate(${centerX.toFixed(2)}, ${(footerY - 0.8).toFixed(2)})" fill="#8c7866" font-family="${fontBody}" font-size="${(footerFontSize + 0.6).toFixed(2)}" text-anchor="middle">
        <text y="0">❦ ─── ✤ ─── ❦</text>
      </g>
    `;
  }

  svg += `</g>`;
  return svg;
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
