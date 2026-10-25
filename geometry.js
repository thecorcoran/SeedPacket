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
 * - single: 1 Packet per Sheet (Large 3.4 × 5.0 in + Cut-Out Garden Stake Plant Marker)
 * - twin: 2 Packets per Sheet (Standard 2.7 × 3.85 in Twin Envelopes)
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
      name: "1 Packet per Sheet (Large + Plant Stake Marker)",
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
    // 2 PACKETS PER SHEET (TWIN PACKETS)
    // =========================================================================
    const halfH = paper.height / 2;
    const packetMetrics = {
      W: 70,
      H: 98,
      Sw: 38,
      Ht: 22,
      Hb: 22,
      clipArtSize: 28,
      isSmall: true
    };

    // Packet 1 (Top Half)
    const p1OriginY = (halfH - (packetMetrics.H + packetMetrics.Ht + packetMetrics.Hb)) / 2;
    contentSvg += renderPacketByStyle(state, packetMetrics, paper.width / 2, p1OriginY, style, 1);

    // Center Division Cut Line
    contentSvg += `
      <!-- Horizontal Center Division Cut Line -->
      <line x1="10" y1="${halfH.toFixed(2)}" x2="${(paper.width - 10).toFixed(2)}" y2="${halfH.toFixed(2)}"
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
    // 1 PACKET PER SHEET (SINGLE PACKET)
    // =========================================================================
    if (style === 'origami') {
      contentSvg += renderOrigamiDiamondSheet(state, paper);
    } else if (style === 'petal') {
      contentSvg += renderPetalFlowerSheet(state, paper);
    } else {
      // Classic or Tuck-Slot single large packet
      const packetMetrics = {
        W: 86,
        H: 126,
        Sw: 46,
        Ht: 36,
        Hb: 44,
        clipArtSize: 36,
        isSmall: false
      };
      const originY = 22;
      contentSvg += renderPacketByStyle(state, packetMetrics, paper.width / 2, originY, style, 1);

      // Garden Stake Marker Bonus in lower area
      contentSvg += renderGardenStakeMarker(state, paper, originY + packetMetrics.Ht + packetMetrics.H + packetMetrics.Hb + 8);
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
    // Vertical side creases
    netSvg += `
      <line x1="${frontX.toFixed(2)}" y1="${frontY.toFixed(2)}" x2="${frontX.toFixed(2)}" y2="${(frontY + H).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.32" stroke-dasharray="3 2" />
      <line x1="${(frontX + W).toFixed(2)}" y1="${frontY.toFixed(2)}" x2="${(frontX + W).toFixed(2)}" y2="${(frontY + H).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.32" stroke-dasharray="3 2" />
      <!-- Horizontal top & bottom creases -->
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

  // Front Panel Artwork
  netSvg += renderFrontPanelArtwork(state, frontX, frontY, W, H, geom.clipArtSize, isSmall);

  // Clear Flap Folding Guidance
  netSvg += `
    <!-- Back Flap Fold Instructions -->
    <text x="${centerX.toFixed(2)}" y="${(frontY + H + Hb - 4).toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.6" font-weight="bold" fill="#756254">
      ${style === 'tuckslot' ? '▲ FOLD UP & INSERT TONGUE INTO SLIT ▲' : '▲ FOLD UP OVER SIDE FLAPS & SEAL SEAM ▲'}
    </text>
    <text x="${(frontX - Sw / 2).toFixed(2)}" y="${(frontY + H / 2).toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.4" font-weight="bold" fill="#8c7866"
          transform="rotate(-90 ${(frontX - Sw / 2).toFixed(2)} ${(frontY + H / 2).toFixed(2)})">
      FOLD INWARD ➔
    </text>
    <text x="${(frontX + W + Sw / 2).toFixed(2)}" y="${(frontY + H / 2).toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.4" font-weight="bold" fill="#8c7866"
          transform="rotate(90 ${(frontX + W + Sw / 2).toFixed(2)} ${(frontY + H / 2).toFixed(2)})">
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
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + 8).toFixed(2)}`);
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + H - 8).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // Bottom Pocket Flap
  p.push(`L ${(x0 + W - 3).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  p.push(`L ${(x0 + 3).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  p.push(`L ${x0.toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // Left Side Flap
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + H - 8).toFixed(2)}`);
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + 8).toFixed(2)}`);
  p.push("Z");

  return p.join(" ");
}

/**
 * Style 2: Interlocking 4-Petal Flower Pouch (100% Glue-Free)
 * Four curved petal flaps that fold clockwise into a pinwheel lock.
 */
function renderPetalFlowerSheet(state, paper) {
  const S = 94; // Center square front size 94 × 94 mm
  const R = 44; // Petal radius depth 44 mm
  const centerX = paper.width / 2;
  const centerY = 115;
  const x0 = centerX - S / 2;
  const y0 = centerY - S / 2;

  let svg = `<!-- Interlocking 4-Petal Flower Pouch Net -->`;

  // Draw 4 curved petals around the central square
  const p = [];
  // Top-left corner of center square
  p.push(`M ${x0.toFixed(2)} ${y0.toFixed(2)}`);
  // Top Petal Arc
  p.push(`C ${(x0 - 6).toFixed(2)} ${(y0 - R * 0.9).toFixed(2)}, ${(x0 + S + 6).toFixed(2)} ${(y0 - R * 0.9).toFixed(2)}, ${(x0 + S).toFixed(2)} ${y0.toFixed(2)}`);
  // Right Petal Arc
  p.push(`C ${(x0 + S + R * 0.9).toFixed(2)} ${(y0 - 6).toFixed(2)}, ${(x0 + S + R * 0.9).toFixed(2)} ${(y0 + S + 6).toFixed(2)}, ${(x0 + S).toFixed(2)} ${(y0 + S).toFixed(2)}`);
  // Bottom Petal Arc
  p.push(`C ${(x0 + S + 6).toFixed(2)} ${(y0 + S + R * 0.9).toFixed(2)}, ${(x0 - 6).toFixed(2)} ${(y0 + S + R * 0.9).toFixed(2)}, ${x0.toFixed(2)} ${(y0 + S).toFixed(2)}`);
  // Left Petal Arc
  p.push(`C ${(x0 - R * 0.9).toFixed(2)} ${(y0 + S + 6).toFixed(2)}, ${(x0 - R * 0.9).toFixed(2)} ${(y0 - 6).toFixed(2)}, ${x0.toFixed(2)} ${y0.toFixed(2)}`);
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
  svg += renderFrontPanelArtwork(state, x0, y0, S, S, 32, false);

  // Petal fold instructions
  svg += `
    <g font-family="'IM Fell English', serif" font-size="2.4" font-weight="bold" fill="#756254" text-anchor="middle">
      <text x="${centerX.toFixed(2)}" y="${(y0 - 10).toFixed(2)}">[1] FOLD DOWN</text>
      <text x="${(x0 + S + 14).toFixed(2)}" y="${centerY.toFixed(2)}" transform="rotate(90 ${(x0 + S + 14).toFixed(2)} ${centerY.toFixed(2)})">[2] FOLD LEFT</text>
      <text x="${centerX.toFixed(2)}" y="${(y0 + S + 16).toFixed(2)}">[3] FOLD UP</text>
      <text x="${(x0 - 14).toFixed(2)}" y="${centerY.toFixed(2)}" transform="rotate(-90 ${(x0 - 14).toFixed(2)} ${centerY.toFixed(2)})">[4] TUCK UNDER [1]</text>
    </g>
  `;

  // Cut-out Garden Stake Plant Marker below
  svg += renderGardenStakeMarker(state, paper, centerY + S / 2 + R + 10);

  return svg;
}

/**
 * Style 3: Gardener's Diamond Origami Seed Pouch (100% Glue-Free)
 */
function renderOrigamiDiamondSheet(state, paper) {
  const sqSize = 184; // 184 mm square
  const originX = (paper.width - sqSize) / 2;
  const originY = 16;

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
  const frontW = 82;
  const frontH = 76;
  const frontX = (paper.width - frontW) / 2;
  const frontY = originY + sqSize - frontH - 10;

  svg += renderFrontPanelArtwork(state, frontX, frontY, frontW, frontH, 26, true);

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
 * Bonus Cut-Out Garden Stake Plant Marker.
 */
function renderGardenStakeMarker(state, paper, startY) {
  const markerW = 164;
  const markerH = 36;
  const markerX = (paper.width - markerW) / 2;
  const markerY = Math.min(startY, paper.height - markerH - 6);

  const seedName = (state.seedName || "HEIRLOOM SEED").toUpperCase();
  const latin = state.latinName ? state.latinName : "";
  const variety = state.variety ? `var. “${state.variety}”` : "";
  const dateStr = formatPackagedDate(state);

  return `
    <!-- Bonus Garden Stake Plant Marker -->
    <g class="garden-stake-marker" transform="translate(${markerX.toFixed(2)}, ${markerY.toFixed(2)})">
      <rect x="0" y="0" width="${markerW}" height="${markerH}"
            fill="#fcfaf5" stroke="#2b231d" stroke-width="0.38" stroke-dasharray="3 2" rx="0.5" />
      <text x="4" y="-2" font-family="'IM Fell English', serif" font-size="2.4" font-weight="bold" fill="#756254">
        ✂ CUT-OUT GARDEN STAKE / PLANT MARKER (TAPE TO WOODEN STAKE OR POPSICLE STICK)
      </text>

      <!-- Content -->
      <text x="8" y="11" font-family="${state.fontFamily || "'Abril Fatface', serif"}" font-size="5.2" font-weight="bold" fill="#1e1814">
        ${escapeXml(seedName)}
      </text>
      <text x="8" y="19" font-family="'IM Fell English', serif" font-size="3.2" font-style="italic" fill="#52443a">
        ${escapeXml(latin)} ${escapeXml(variety)}
      </text>
      <text x="8" y="27" font-family="'IM Fell English', serif" font-size="3.0" font-weight="bold" fill="#2b231d">
        ${escapeXml(dateStr)}
      </text>

      <line x1="${markerW - 48}" y1="4" x2="${markerW - 48}" y2="${markerH - 4}" stroke="#8c7866" stroke-width="0.3" stroke-dasharray="2 1" />
      <text x="${markerW - 42}" y="13" font-family="'IM Fell English', serif" font-size="2.6" fill="#756254">Sown Date: ________</text>
      <text x="${markerW - 42}" y="22" font-family="'IM Fell English', serif" font-size="2.6" fill="#756254">Sprouted: _________</text>
      <text x="${markerW - 42}" y="31" font-family="'IM Fell English', serif" font-size="2.6" fill="#756254">Row / Bed: ________</text>
    </g>
  `;
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
 * Strict collision-free dynamic vertical rhythm algorithm:
 * Computes top-down headers, bottom-up footers, and centers the artwork in the remaining space.
 */
function renderFrontPanelArtwork(state, x0, y0, W, H, maxClipSize, isSmall) {
  const fontHeader = state.fontFamily || "'Abril Fatface', serif";
  const fontBody = "'IM Fell English', 'Libre Caslon Text', 'Georgia', serif";

  const margin = 3.5;
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
  // STRICT COLLISION-FREE VERTICAL STACKING CALCULATION
  // =========================================================================

  // --- TOP ELEMENTS (Stacking DOWNWARDS) ---
  let topY = innerY + (isSmall ? 4.0 : 5.0);

  // 1. Catalog Header Banner
  const bannerFontSize = isSmall ? 2.6 : 3.4;
  const bannerY = topY + bannerFontSize;
  topY = bannerY + (isSmall ? 3.0 : 4.5);

  // 2. Main Title (Plant / Seed Display Name)
  const maxTitleFont = isSmall ? 7.5 : 10.5;
  const minTitleFont = isSmall ? 4.6 : 5.8;
  const titleFontSize = calculateAutoFitFontSize(seedName, innerW - 8, maxTitleFont, minTitleFont, fontHeader);
  const titleY = topY + titleFontSize;
  topY = titleY + (isSmall ? 2.5 : 3.5);

  // 3. Latin Binomial Name
  let latinY = 0;
  const latinFontSize = isSmall ? 3.0 : 4.0;
  if (hasLatinName) {
    latinY = topY + latinFontSize;
    topY = latinY + (isSmall ? 2.2 : 3.0);
  }

  // 4. Cultivar / Variety
  let varietyY = 0;
  const varietyFontSize = isSmall ? 2.8 : 3.6;
  if (hasVariety) {
    varietyY = topY + varietyFontSize;
    topY = varietyY + (isSmall ? 2.5 : 3.5);
  }

  // --- BOTTOM ELEMENTS (Stacking UPWARDS) ---
  let botY = innerY + innerH - (isSmall ? 3.0 : 4.0);

  // 5. Trust Badges / Tailpiece
  const footerFontSize = isSmall ? 2.4 : 3.0;
  const footerY = botY;
  botY = footerY - footerFontSize - (isSmall ? 3.0 : 4.5);

  // 6. Notes (1 or 2 lines)
  const notesLines = [];
  const notesFontSize = isSmall ? 2.6 : 3.2;
  const notesLineSpacing = notesFontSize + 1.2;
  let notesLine1Y = 0, notesLine2Y = 0;

  if (hasNotes) {
    const maxChars = innerW > 70 ? 46 : 32;
    const lines = wrapTextIntoLines(state.notes.trim(), maxChars);
    if (lines.length > 1) {
      notesLines.push(lines[0], lines[1]);
      notesLine2Y = botY;
      notesLine1Y = notesLine2Y - notesLineSpacing;
      botY = notesLine1Y - notesFontSize - (isSmall ? 3.0 : 4.5);
    } else if (lines.length === 1) {
      notesLines.push(lines[0]);
      notesLine1Y = botY;
      botY = notesLine1Y - notesFontSize - (isSmall ? 3.0 : 4.5);
    }
  }

  // 7. Packaged Date Banner
  const dateFontSize = isSmall ? 2.8 : 3.4;
  const dateTextY = botY;
  const dateBoxTopY = dateTextY - dateFontSize - 1.2;
  const dateBoxBotY = dateTextY + 2.2;
  botY = dateBoxTopY - (isSmall ? 3.0 : 4.5);

  // --- ARTWORK CENTERING (In remaining space between topY and botY) ---
  const artAvailableH = Math.max(16, botY - topY);
  const artSize = Math.min(maxClipSize || 36, artAvailableH, innerW * 0.58);
  const clipBoxX = centerX - (artSize / 2);
  const clipBoxY = topY + (artAvailableH - artSize) / 2;

  // =========================================================================
  // SVG RENDERING
  // =========================================================================
  let svg = `
    <g class="vintage-front-panel" fill="#2b231d" stroke="none">
      <!-- Outer Double Border with Corner Florets -->
      <rect x="${innerX.toFixed(2)}" y="${innerY.toFixed(2)}" width="${innerW.toFixed(2)}" height="${innerH.toFixed(2)}"
            fill="#fcfaf5" stroke="#2b231d" stroke-width="0.75" rx="0.5" />
      <rect x="${(innerX + 1.2).toFixed(2)}" y="${(innerY + 1.2).toFixed(2)}" width="${(innerW - 2.4).toFixed(2)}" height="${(innerH - 2.4).toFixed(2)}"
            fill="none" stroke="#2b231d" stroke-width="0.3" stroke-dasharray="2.5 1.2" />

      <!-- Corner Rosettes -->
      <g stroke="#2b231d" stroke-width="0.35" fill="none">
        <circle cx="${(innerX + 3.0).toFixed(2)}" cy="${(innerY + 3.0).toFixed(2)}" r="1.3" />
        <circle cx="${(innerX + innerW - 3.0).toFixed(2)}" cy="${(innerY + 3.0).toFixed(2)}" r="1.3" />
        <circle cx="${(innerX + 3.0).toFixed(2)}" cy="${(innerY + innerH - 3.0).toFixed(2)}" r="1.3" />
        <circle cx="${(innerX + innerW - 3.0).toFixed(2)}" cy="${(innerY + innerH - 3.0).toFixed(2)}" r="1.3" />
      </g>

      <!-- Vintage Catalog Banner Header -->
      <text x="${centerX.toFixed(2)}" y="${bannerY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${bannerFontSize.toFixed(2)}" font-weight="bold" letter-spacing="1.4" fill="#52443a">
        ✦ HEIRLOOM SEED COLLECTION ✦
      </text>

      <!-- Plant / Seed Display Name -->
      <text x="${centerX.toFixed(2)}" y="${titleY.toFixed(2)}"
            text-anchor="middle" font-family="${fontHeader}" font-size="${titleFontSize.toFixed(2)}" font-weight="bold"
            letter-spacing="0.5" fill="#1e1814">
        ${escapeXml(seedName.toUpperCase())}
      </text>
  `;

  // Latin Name
  if (hasLatinName) {
    const halfSpan = Math.min(innerW * 0.40, 24);
    svg += `
      <g class="latin-name-block">
        <line x1="${(centerX - halfSpan).toFixed(2)}" y1="${(latinY - 0.9).toFixed(2)}" x2="${(centerX - halfSpan + 5).toFixed(2)}" y2="${(latinY - 0.9).toFixed(2)}" stroke="#8c7866" stroke-width="0.3" />
        <text x="${centerX.toFixed(2)}" y="${latinY.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${latinFontSize.toFixed(2)}" font-style="italic"
              letter-spacing="0.4" fill="#52443a">
          ❦ ${escapeXml(state.latinName)} ❦
        </text>
        <line x1="${(centerX + halfSpan - 5).toFixed(2)}" y1="${(latinY - 0.9).toFixed(2)}" x2="${(centerX + halfSpan).toFixed(2)}" y2="${(latinY - 0.9).toFixed(2)}" stroke="#8c7866" stroke-width="0.3" />
      </g>
    `;
  }

  // Cultivar / Variety
  if (hasVariety) {
    svg += `
      <text x="${centerX.toFixed(2)}" y="${varietyY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${varietyFontSize.toFixed(2)}" font-style="italic" fill="#3a3028">
        var. &#8220;${escapeXml(state.variety.trim())}&#8221;
      </text>
    `;
  }

  // Illustration / Artwork: Custom Uploaded Picture OR Vector Clip Art
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
    // Vector Clip Art
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
      // Minimalist Ornamental Flourish
      svg += `
        <g transform="translate(${centerX.toFixed(2)}, ${(clipBoxY + artSize / 2).toFixed(2)})" stroke="#8c7866" stroke-width="0.4" fill="none">
          <path d="M -18 0 C -10 -4 -4 4 0 0 C 4 -4 10 4 18 0" />
          <circle cx="0" cy="0" r="1.5" fill="#8c7866" />
        </g>
      `;
    }
  }

  // Packaged Date Banner
  const dateStr = formatPackagedDate(state);
  svg += `
    <g class="harvest-meta">
      <line x1="${(innerX + 4).toFixed(2)}" y1="${dateBoxTopY.toFixed(2)}" x2="${(innerX + innerW - 4).toFixed(2)}" y2="${dateBoxTopY.toFixed(2)}" stroke="#2b231d" stroke-width="0.4" />
      <line x1="${(innerX + 4).toFixed(2)}" y1="${(dateBoxTopY + 0.7).toFixed(2)}" x2="${(innerX + innerW - 4).toFixed(2)}" y2="${(dateBoxTopY + 0.7).toFixed(2)}" stroke="#2b231d" stroke-width="0.2" />
      <text x="${centerX.toFixed(2)}" y="${dateTextY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${dateFontSize.toFixed(2)}" font-weight="600" letter-spacing="0.6" fill="#2b231d">
        ${escapeXml(dateStr)}
      </text>
      <line x1="${(innerX + 4).toFixed(2)}" y1="${(dateBoxBotY - 0.7).toFixed(2)}" x2="${(innerX + innerW - 4).toFixed(2)}" y2="${(dateBoxBotY - 0.7).toFixed(2)}" stroke="#2b231d" stroke-width="0.2" />
      <line x1="${(innerX + 4).toFixed(2)}" y1="${dateBoxBotY.toFixed(2)}" x2="${(innerX + innerW - 4).toFixed(2)}" y2="${dateBoxBotY.toFixed(2)}" stroke="#2b231d" stroke-width="0.4" />
    </g>
  `;

  // Notes
  if (notesLines.length > 0) {
    svg += `<g class="packet-notes">`;
    if (notesLines.length === 1) {
      svg += `
        <text x="${centerX.toFixed(2)}" y="${notesLine1Y.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${notesFontSize.toFixed(2)}" font-style="italic" fill="#5c4d41">
          ${escapeXml(notesLines[0])}
        </text>
      `;
    } else {
      svg += `
        <text x="${centerX.toFixed(2)}" y="${notesLine1Y.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${notesFontSize.toFixed(2)}" font-style="italic" fill="#5c4d41">
          ${escapeXml(notesLines[0])}
        </text>
        <text x="${centerX.toFixed(2)}" y="${notesLine2Y.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${notesFontSize.toFixed(2)}" font-style="italic" fill="#5c4d41">
          ${escapeXml(notesLines[1])}
        </text>
      `;
    }
    svg += `</g>`;
  }

  // Trust Badges / Flourish Footer
  if (activeBadges.length > 0) {
    const badgeText = `★ ${activeBadges.join(" • ")} ★`;
    svg += `
      <text x="${centerX.toFixed(2)}" y="${footerY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="${footerFontSize.toFixed(2)}" letter-spacing="0.9" fill="#756254">
        ${escapeXml(badgeText)}
      </text>
    `;
  } else {
    svg += `
      <g transform="translate(${centerX.toFixed(2)}, ${(footerY - 0.8).toFixed(2)})" fill="#8c7866" font-family="${fontBody}" font-size="${(footerFontSize + 0.4).toFixed(2)}" text-anchor="middle">
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
