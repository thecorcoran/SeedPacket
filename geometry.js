/**
 * Parametric Envelope Geometry & SVG Template Generator
 * Supports:
 * 1. Classic Heirloom Flap Envelope (Straight perimeter cut with overlapping side flaps)
 * 2. Gardener's Diamond Origami Pouch (100% Glue-Free, traditional cup fold)
 * 3. Interlocking Tuck-Slot Envelope (Self-sealing back slit)
 * 4. 1-Packet per Sheet (Large 3.3 × 4.8 in + Cut-Out Garden Stake Marker)
 * 5. 2-Packets per Sheet (Standard 2.7 × 3.85 in Twin Packets)
 */

const ENVELOPE_CONFIG = {
  foldingStyles: {
    classic: {
      name: "Classic Heirloom Flap",
      description: "Straight perimeter cut; side flaps fold behind and seal with glue stick, tape, or sticker."
    },
    origami: {
      name: "Gardener's Diamond Pouch (100% Glue-Free)",
      description: "Traditional gardener's cup pouch fold from a cut square. Never leaks, zero tape or glue."
    },
    tuckslot: {
      name: "Interlocking Tuck-Slot (Glue-Free)",
      description: "Straight cut with a slit on the back pocket for the closure tongue to tuck into."
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
 * Generates the complete SVG string for the sheet.
 */
function generateSheetSVG(state) {
  const paper = ENVELOPE_CONFIG.papers[state.paperSize] || ENVELOPE_CONFIG.papers.letter;
  const layout = state.sheetLayout || 'single';
  const style = state.foldingStyle || 'classic';

  let contentSvg = `
    <!-- Paper Background with Safe Margin Boundary -->
    <rect x="0" y="0" width="${paper.width}" height="${paper.height}" fill="#ffffff" stroke="none" />
  `;

  if (layout === 'twin') {
    // =========================================================================
    // 2 PACKETS PER SHEET (TWIN PACKETS)
    // =========================================================================
    const halfH = paper.height / 2;
    const packetMetrics = {
      W: 68,
      H: 96,
      Sw: 36,
      Ht: 18,
      Hb: 20,
      clipArtSize: 26
    };

    // Packet 1 (Top Half)
    const p1OriginY = (halfH - (packetMetrics.H + packetMetrics.Ht + packetMetrics.Hb)) / 2;
    contentSvg += renderSinglePacketNet(state, packetMetrics, paper.width / 2, p1OriginY, style, 1);

    // Center Division Line
    contentSvg += `
      <!-- Horizontal Center Division Cut Line -->
      <line x1="8" y1="${halfH.toFixed(2)}" x2="${(paper.width - 8).toFixed(2)}" y2="${halfH.toFixed(2)}"
            stroke="#666666" stroke-width="0.32" stroke-dasharray="3 2" />
      <text x="${(paper.width / 2).toFixed(2)}" y="${(halfH - 1.5).toFixed(2)}"
            text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.6" fill="#756254">
        ✂ ─ ─ ─ CUT SHEET IN HALF TO SEPARATE INTO TWO ENVELOPES ─ ─ ─ ✂
      </text>
    `;

    // Packet 2 (Bottom Half)
    const p2OriginY = halfH + p1OriginY;
    contentSvg += renderSinglePacketNet(state, packetMetrics, paper.width / 2, p2OriginY, style, 2);

  } else {
    // =========================================================================
    // 1 PACKET PER SHEET (SINGLE PACKET)
    // =========================================================================
    if (style === 'origami') {
      contentSvg += renderOrigamiDiamondSheet(state, paper);
    } else {
      // Classic or Tuck-Slot single large packet
      const packetMetrics = {
        W: 82,
        H: 122,
        Sw: 44,
        Ht: 34,
        Hb: 42,
        clipArtSize: 34
      };
      const originY = 24;
      contentSvg += renderSinglePacketNet(state, packetMetrics, paper.width / 2, originY, style, 1);

      // Garden Stake Marker Bonus in lower area
      contentSvg += renderGardenStakeMarker(state, paper, originY + packetMetrics.Ht + packetMetrics.H + packetMetrics.Hb + 10);
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
 * Renders a single envelope net (Classic Flap or Tuck-Slot).
 */
function renderSinglePacketNet(state, geom, centerX, originY, style, packetIndex) {
  const { W, H, Sw, Ht, Hb } = geom;
  const frontX = centerX - (W / 2);
  const frontY = originY + Ht;

  let netSvg = `<!-- Envelope Net ${packetIndex} -->`;

  // Perimeter Cut Path (Straight lines with tapered tabs)
  const cutPath = generateCleanCutPath(frontX, frontY, W, H, Sw, Ht, Hb, style);
  netSvg += `<path d="${cutPath}" fill="none" stroke="#222222" stroke-width="0.36" stroke-linejoin="round" stroke-linecap="round" />`;

  // Dashed Fold Lines
  if (state.showFoldLines !== false) {
    // Vertical left & right creases
    netSvg += `
      <line x1="${frontX.toFixed(2)}" y1="${frontY.toFixed(2)}" x2="${frontX.toFixed(2)}" y2="${(frontY + H).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.30" stroke-dasharray="3 2" />
      <line x1="${(frontX + W).toFixed(2)}" y1="${frontY.toFixed(2)}" x2="${(frontX + W).toFixed(2)}" y2="${(frontY + H).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.30" stroke-dasharray="3 2" />
      <!-- Horizontal top & bottom creases -->
      <line x1="${frontX.toFixed(2)}" y1="${frontY.toFixed(2)}" x2="${(frontX + W).toFixed(2)}" y2="${frontY.toFixed(2)}"
            stroke="#8c7866" stroke-width="0.30" stroke-dasharray="3 2" />
      <line x1="${frontX.toFixed(2)}" y1="${(frontY + H).toFixed(2)}" x2="${(frontX + W).toFixed(2)}" y2="${(frontY + H).toFixed(2)}"
            stroke="#8c7866" stroke-width="0.30" stroke-dasharray="3 2" />
    `;
  }

  // Tuck-Slot slit line if style === 'tuckslot'
  if (style === 'tuckslot') {
    const slitY = frontY + H + (Hb * 0.55);
    const slitHalfW = (W * 0.32);
    netSvg += `
      <!-- Closure Slit -->
      <line x1="${(centerX - slitHalfW).toFixed(2)}" y1="${slitY.toFixed(2)}" x2="${(centerX + slitHalfW).toFixed(2)}" y2="${slitY.toFixed(2)}"
            stroke="#b83b26" stroke-width="0.45" stroke-dasharray="2 1.5" />
      <text x="${centerX.toFixed(2)}" y="${(slitY - 1.5).toFixed(2)}"
            text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.0" fill="#b83b26">
        ✂ SLICE SLIT FOR TUCK FLAP ✂
      </text>
    `;
  }

  // Front Panel Artwork
  netSvg += renderFrontPanelArtwork(state, frontX, frontY, W, H, geom.clipArtSize);

  // Folding Guidance Notes on Flaps
  netSvg += `
    <!-- Back Flap Fold Instructions -->
    <text x="${centerX.toFixed(2)}" y="${(frontY + H + Hb - 4).toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.2" fill="#8c7866">
      ${style === 'tuckslot' ? '▲ FOLD UP & INSERT TONGUE INTO SLIT' : '▲ FOLD UP OVER SIDE FLAPS & SECURE'}
    </text>
    <text x="${(frontX - Sw / 2).toFixed(2)}" y="${(frontY + H / 2).toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.0" fill="#a6998d"
          transform="rotate(-90 ${(frontX - Sw / 2).toFixed(2)} ${(frontY + H / 2).toFixed(2)})">
      FOLD INWARD ➔
    </text>
    <text x="${(frontX + W + Sw / 2).toFixed(2)}" y="${(frontY + H / 2).toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.0" fill="#a6998d"
          transform="rotate(90 ${(frontX + W + Sw / 2).toFixed(2)} ${(frontY + H / 2).toFixed(2)})">
      🠔 FOLD INWARD
    </text>
  `;

  return netSvg;
}

/**
 * Generates straight, easily cut perimeter path for envelopes.
 */
function generateCleanCutPath(x0, y0, W, H, Sw, Ht, Hb, style) {
  const p = [];
  const tongueW = W * 0.65;
  const tongueLeft = x0 + (W - tongueW) / 2;
  const tongueRight = x0 + (W + tongueW) / 2;

  // Top Closure Flap (with tapered shoulders and rounded tongue)
  p.push(`M ${x0.toFixed(2)} ${y0.toFixed(2)}`);
  p.push(`L ${(x0 + 4).toFixed(2)} ${(y0 - Ht * 0.6).toFixed(2)}`);
  p.push(`L ${tongueLeft.toFixed(2)} ${(y0 - Ht).toFixed(2)}`);
  p.push(`Q ${(x0 + W / 2).toFixed(2)} ${(y0 - Ht - 3).toFixed(2)} ${tongueRight.toFixed(2)} ${(y0 - Ht).toFixed(2)}`);
  p.push(`L ${(x0 + W - 4).toFixed(2)} ${(y0 - Ht * 0.6).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${y0.toFixed(2)}`);

  // Right Side Flap (tapered top and bottom)
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + 8).toFixed(2)}`);
  p.push(`L ${(x0 + W + Sw).toFixed(2)} ${(y0 + H - 8).toFixed(2)}`);
  p.push(`L ${(x0 + W).toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // Bottom Pocket Flap (slightly tapered)
  p.push(`L ${(x0 + W - 3).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  p.push(`L ${(x0 + 3).toFixed(2)} ${(y0 + H + Hb).toFixed(2)}`);
  p.push(`L ${x0.toFixed(2)} ${(y0 + H).toFixed(2)}`);

  // Left Side Flap (tapered bottom and top)
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + H - 8).toFixed(2)}`);
  p.push(`L ${(x0 - Sw).toFixed(2)} ${(y0 + 8).toFixed(2)}`);
  p.push("Z");

  return p.join(" ");
}

/**
 * Renders the Gardener's Diamond Origami Seed Pouch (100% Glue-Free).
 */
function renderOrigamiDiamondSheet(state, paper) {
  const sqSize = 184; // 184 mm square fits well inside Letter/A4 with ample margins
  const originX = (paper.width - sqSize) / 2;
  const originY = 16;

  let svg = `<!-- Gardener's Diamond Origami Template -->`;

  // Outer Cut Square
  svg += `
    <rect x="${originX.toFixed(2)}" y="${originY.toFixed(2)}" width="${sqSize.toFixed(2)}" height="${sqSize.toFixed(2)}"
          fill="none" stroke="#222222" stroke-width="0.36" stroke-dasharray="none" />
    <text x="${(paper.width / 2).toFixed(2)}" y="${(originY - 4).toFixed(2)}"
          text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.8" fill="#52443a">
      ✂ CUT OUT SQUARE ALONG SOLID PERIMETER • ZERO GLUE OR TAPE REQUIRED ✂
    </text>
  `;

  // Diagonal and cuff fold lines
  svg += `
    <!-- Diagonal Fold Line (Corner to Corner) -->
    <line x1="${originX.toFixed(2)}" y1="${originY.toFixed(2)}" x2="${(originX + sqSize).toFixed(2)}" y2="${(originY + sqSize).toFixed(2)}"
          stroke="#8c7866" stroke-width="0.30" stroke-dasharray="3 2" />
    <line x1="${(originX + sqSize).toFixed(2)}" y1="${originY.toFixed(2)}" x2="${originX.toFixed(2)}" y2="${(originY + sqSize).toFixed(2)}"
          stroke="#8c7866" stroke-width="0.30" stroke-dasharray="3 2" />
  `;

  // Front Panel Artwork oriented in the lower triangle
  const frontW = 76;
  const frontH = 68;
  const frontX = (paper.width - frontW) / 2;
  const frontY = originY + sqSize - frontH - 12;

  svg += renderFrontPanelArtwork(state, frontX, frontY, frontW, frontH, 24);

  // Step-by-Step Visual Folding Diagram in the lower margin
  const diagramY = originY + sqSize + 12;
  svg += `
    <g class="origami-instructions" transform="translate(0, ${diagramY.toFixed(2)})">
      <rect x="${originX.toFixed(2)}" y="0" width="${sqSize.toFixed(2)}" height="54"
            fill="#fcfaf5" stroke="#8c7866" stroke-width="0.4" rx="1" />
      <text x="${(paper.width / 2).toFixed(2)}" y="6"
            text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.6" font-weight="bold" fill="#3a3028">
        HOW TO FOLD THE GARDENER'S SEED POUCH (100% TAPLESS &amp; LEAK-PROOF)
      </text>

      <!-- Step 1 -->
      <g transform="translate(${(originX + 16).toFixed(2)}, 14)" font-family="'IM Fell English', serif" font-size="2.1" fill="#52443a">
        <text x="0" y="0" font-weight="bold">[1] Cut Square</text>
        <text x="0" y="5">Fold in half</text>
        <text x="0" y="9">corner to corner</text>
        <text x="0" y="13">into triangle ▼</text>
      </g>

      <!-- Step 2 -->
      <g transform="translate(${(originX + 58).toFixed(2)}, 14)" font-family="'IM Fell English', serif" font-size="2.1" fill="#52443a">
        <text x="0" y="0" font-weight="bold">[2] Left Point</text>
        <text x="0" y="5">Fold left tip</text>
        <text x="0" y="9">horizontally to</text>
        <text x="0" y="13">the right edge ➔</text>
      </g>

      <!-- Step 3 -->
      <g transform="translate(${(originX + 102).toFixed(2)}, 14)" font-family="'IM Fell English', serif" font-size="2.1" fill="#52443a">
        <text x="0" y="0" font-weight="bold">[3] Right Point</text>
        <text x="0" y="5">Fold right tip</text>
        <text x="0" y="9">across to the</text>
        <text x="0" y="13">left edge 🠔</text>
      </g>

      <!-- Step 4 -->
      <g transform="translate(${(originX + 144).toFixed(2)}, 14)" font-family="'IM Fell English', serif" font-size="2.1" fill="#52443a">
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
 * Renders the Cut-Out Garden Stake Plant Marker bonus in empty sheet space.
 */
function renderGardenStakeMarker(state, paper, startY) {
  const markerW = 160;
  const markerH = 34;
  const markerX = (paper.width - markerW) / 2;
  const markerY = Math.min(startY, paper.height - markerH - 8);

  const seedName = (state.seedName || "HEIRLOOM SEED").toUpperCase();
  const latin = state.latinName ? state.latinName : "";
  const variety = state.variety ? `var. “${state.variety}”` : "";
  const dateStr = formatPackagedDate(state);

  return `
    <!-- Bonus Garden Stake Plant Marker -->
    <g class="garden-stake-marker" transform="translate(${markerX.toFixed(2)}, ${markerY.toFixed(2)})">
      <rect x="0" y="0" width="${markerW}" height="${markerH}"
            fill="#fcfaf5" stroke="#2b231d" stroke-width="0.35" stroke-dasharray="3 2" rx="0.5" />
      <text x="4" y="-2" font-family="'IM Fell English', serif" font-size="2.2" fill="#756254">
        ✂ CUT-OUT GARDEN STAKE / PLANT MARKER (TAPE TO WOODEN STAKE OR POPSICLE STICK)
      </text>

      <!-- Content -->
      <text x="8" y="10" font-family="${state.fontFamily || "'Abril Fatface', serif"}" font-size="4.4" font-weight="bold" fill="#1e1814">
        ${escapeXml(seedName)}
      </text>
      <text x="8" y="17" font-family="'IM Fell English', serif" font-size="2.8" font-style="italic" fill="#52443a">
        ${escapeXml(latin)} ${escapeXml(variety)}
      </text>
      <text x="8" y="24" font-family="'IM Fell English', serif" font-size="2.6" font-weight="bold" fill="#2b231d">
        ${escapeXml(dateStr)}
      </text>

      <line x1="${markerW - 46}" y1="4" x2="${markerW - 46}" y2="${markerH - 4}" stroke="#8c7866" stroke-width="0.3" stroke-dasharray="2 1" />
      <text x="${markerW - 40}" y="12" font-family="'IM Fell English', serif" font-size="2.2" fill="#756254">Sown Date: ________</text>
      <text x="${markerW - 40}" y="20" font-family="'IM Fell English', serif" font-size="2.2" fill="#756254">Sprouted: _________</text>
      <text x="${markerW - 40}" y="28" font-family="'IM Fell English', serif" font-size="2.2" fill="#756254">Row / Bed: ________</text>
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
 * Strict dynamic vertical layout ensuring no overlapping elements.
 */
function renderFrontPanelArtwork(state, x0, y0, W, H, maxClipSize) {
  const fontHeader = state.fontFamily || "'Abril Fatface', serif";
  const fontBody = "'IM Fell English', 'Libre Caslon Text', 'Georgia', serif";

  const margin = 3.5;
  const innerX = x0 + margin;
  const innerY = y0 + margin;
  const innerW = W - (margin * 2);
  const innerH = H - (margin * 2);

  const centerX = x0 + (W / 2);

  // Auto-fit Display Title
  const seedName = state.seedName || "HEIRLOOM SEED";
  const maxTitleWidth = innerW - 8;
  const maxFontMm = innerH > 80 ? 6.8 : 5.4;
  const titleFontSize = calculateAutoFitFontSize(seedName, maxTitleWidth, maxFontMm, 3.8, fontHeader);

  // Latin Name
  const hasLatinName = state.latinName && state.latinName.trim().length > 0;
  const latinFontSize = hasLatinName
    ? calculateAutoFitFontSize(state.latinName, innerW - 10, 3.2, 2.4, 'fell')
    : 0;

  // Cultivar / Variety
  const hasVariety = state.variety && state.variety.trim().length > 0;

  // Dynamic Vertical Stacking Calculations
  const bannerY = innerY + 3.8;
  const titleY = bannerY + 6.8;

  let nextY = titleY + 2.0;

  let latinY = 0;
  if (hasLatinName) {
    latinY = nextY + 3.4;
    nextY = latinY + 1.0;
  }

  let varietyY = 0;
  if (hasVariety) {
    varietyY = nextY + 3.4;
    nextY = varietyY + 1.0;
  }

  // Artwork box position and sizing
  const availableArtH = Math.max(18, innerH - (nextY - innerY) - 34);
  const artSize = Math.min(maxClipSize || 32, availableArtH, innerW * 0.58);
  const clipBoxX = centerX - (artSize / 2);
  const clipBoxY = nextY + 2.0;

  const afterArtY = clipBoxY + artSize;

  // Harvest / Packaged Date
  const dateY = afterArtY + 3.5;
  const dateStr = formatPackagedDate(state);

  // Notes Y
  const notesY = dateY + 6.2;

  // Badges / Trust Marks
  const footerY = innerY + innerH - 3.0;

  // Render SVG Elements
  let svg = `
    <g class="vintage-front-panel" fill="#2b231d" stroke="none">
      <!-- Outer Double Border with Corner Florets -->
      <rect x="${innerX.toFixed(2)}" y="${innerY.toFixed(2)}" width="${innerW.toFixed(2)}" height="${innerH.toFixed(2)}"
            fill="#fcfaf5" stroke="#2b231d" stroke-width="0.65" rx="0.5" />
      <rect x="${(innerX + 1.0).toFixed(2)}" y="${(innerY + 1.0).toFixed(2)}" width="${(innerW - 2.0).toFixed(2)}" height="${(innerH - 2.0).toFixed(2)}"
            fill="none" stroke="#2b231d" stroke-width="0.25" stroke-dasharray="2 1" />

      <!-- Corner Rosettes -->
      <g stroke="#2b231d" stroke-width="0.3" fill="none">
        <circle cx="${(innerX + 2.5).toFixed(2)}" cy="${(innerY + 2.5).toFixed(2)}" r="1.1" />
        <circle cx="${(innerX + innerW - 2.5).toFixed(2)}" cy="${(innerY + 2.5).toFixed(2)}" r="1.1" />
        <circle cx="${(innerX + 2.5).toFixed(2)}" cy="${(innerY + innerH - 2.5).toFixed(2)}" r="1.1" />
        <circle cx="${(innerX + innerW - 2.5).toFixed(2)}" cy="${(innerY + innerH - 2.5).toFixed(2)}" r="1.1" />
      </g>

      <!-- Vintage Catalog Banner Header -->
      <text x="${centerX.toFixed(2)}" y="${bannerY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="2.4" font-weight="bold" letter-spacing="1.2" fill="#52443a">
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
    const halfSpan = Math.min(innerW * 0.38, 22);
    svg += `
      <g class="latin-name-block">
        <line x1="${(centerX - halfSpan).toFixed(2)}" y1="${(latinY - 0.7).toFixed(2)}" x2="${(centerX - halfSpan + 4).toFixed(2)}" y2="${(latinY - 0.7).toFixed(2)}" stroke="#8c7866" stroke-width="0.25" />
        <text x="${centerX.toFixed(2)}" y="${latinY.toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="${latinFontSize.toFixed(2)}" font-style="italic"
              letter-spacing="0.3" fill="#52443a">
          ❦ ${escapeXml(state.latinName)} ❦
        </text>
        <line x1="${(centerX + halfSpan - 4).toFixed(2)}" y1="${(latinY - 0.7).toFixed(2)}" x2="${(centerX + halfSpan).toFixed(2)}" y2="${(latinY - 0.7).toFixed(2)}" stroke="#8c7866" stroke-width="0.25" />
      </g>
    `;
  }

  // Cultivar / Variety
  if (hasVariety) {
    svg += `
      <text x="${centerX.toFixed(2)}" y="${varietyY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="2.8" font-style="italic" fill="#3a3028">
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
  svg += `
    <g class="harvest-meta" transform="translate(0, ${dateY.toFixed(2)})">
      <line x1="${(innerX + 4).toFixed(2)}" y1="0" x2="${(innerX + innerW - 4).toFixed(2)}" y2="0" stroke="#2b231d" stroke-width="0.35" />
      <line x1="${(innerX + 4).toFixed(2)}" y1="0.6" x2="${(innerX + innerW - 4).toFixed(2)}" y2="0.6" stroke="#2b231d" stroke-width="0.15" />
      <text x="${centerX.toFixed(2)}" y="3.4"
            text-anchor="middle" font-family="${fontBody}" font-size="2.6" font-weight="600" letter-spacing="0.5" fill="#2b231d">
        ${escapeXml(dateStr)}
      </text>
      <line x1="${(innerX + 4).toFixed(2)}" y1="4.5" x2="${(innerX + innerW - 4).toFixed(2)}" y2="4.5" stroke="#2b231d" stroke-width="0.15" />
      <line x1="${(innerX + 4).toFixed(2)}" y1="5.1" x2="${(innerX + innerW - 4).toFixed(2)}" y2="5.1" stroke="#2b231d" stroke-width="0.35" />
    </g>
  `;

  // Extra Notes (1-2 lines)
  if (state.notes && state.notes.trim()) {
    const rawNotes = state.notes.trim();
    const maxChars = innerW > 70 ? 46 : 34;
    const lines = wrapTextIntoLines(rawNotes, maxChars);
    svg += `
      <g class="packet-notes" transform="translate(0, ${notesY.toFixed(2)})">
    `;
    lines.slice(0, 2).forEach((line, idx) => {
      svg += `
        <text x="${centerX.toFixed(2)}" y="${(idx * 3.2).toFixed(2)}"
              text-anchor="middle" font-family="${fontBody}" font-size="2.6" font-style="italic" fill="#5c4d41">
          ${escapeXml(line)}
        </text>
      `;
    });
    svg += `</g>`;
  }

  // Optional Badges Section (Item 6: Removed hardcoded Open Pollinated / Germination; now toggleable options)
  const activeBadges = [];
  if (state.badgeOpenPollinated) activeBadges.push("OPEN POLLINATED");
  if (state.badgeTestedGermination) activeBadges.push("TESTED GERMINATION");
  if (state.badgeHeirloom) activeBadges.push("HEIRLOOM");
  if (state.badgeOrganic) activeBadges.push("ORGANIC");

  if (activeBadges.length > 0) {
    const badgeText = `★ ${activeBadges.join(" • ")} ★`;
    svg += `
      <!-- User-Selected Trust Badges -->
      <text x="${centerX.toFixed(2)}" y="${footerY.toFixed(2)}"
            text-anchor="middle" font-family="${fontBody}" font-size="2.2" letter-spacing="0.8" fill="#756254">
        ${escapeXml(badgeText)}
      </text>
    `;
  } else {
    // Elegant tailpiece flourish when no badges are selected
    svg += `
      <g transform="translate(${centerX.toFixed(2)}, ${(footerY - 0.8).toFixed(2)})" fill="#8c7866" font-family="${fontBody}" font-size="2.4" text-anchor="middle">
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
