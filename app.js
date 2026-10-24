/**
 * Tapeless Seed Envelope Maker - Application Controller
 */

(function () {
  'use strict';

  // Application State
  const state = {
    seedName: "Sunflower",
    latinName: "Helianthus annuus",
    variety: "Mammoth Russian",
    dateHarvested: "",
    timeHarvested: "",
    notes: "Giant golden heads up to 14 inches across. Birds and pollinators adore.",
    clipArtId: "sunflower",
    fontFamily: "'Abril Fatface', serif",
    templateStyle: "fullsheet", // 'fullsheet' (No-Cut, 100% paper utilized) or 'cutout'
    paperSize: "letter",
    envelopeSize: "medium",
    printMode: "onesided",
    showFoldLines: true,
    activeDuplexPage: 1, // 1 or 2
    zoom: 'fit'
  };

  // DOM Elements
  const elements = {
    inputSeedName: document.getElementById('input-seed-name'),
    inputLatinName: document.getElementById('input-latin-name'),
    inputVariety: document.getElementById('input-variety'),
    inputDate: document.getElementById('input-date'),
    inputTime: document.getElementById('input-time'),
    inputNotes: document.getElementById('input-notes'),
    clipArtGrid: document.getElementById('clip-art-grid'),
    selectFont: document.getElementById('select-font'),
    selectTemplateStyle: document.getElementById('select-template-style'),
    templateStyleHint: document.getElementById('template-style-hint'),
    groupFinishedSize: document.getElementById('group-finished-size'),
    selectPaperSize: document.getElementById('select-paper-size'),
    selectEnvelopeSize: document.getElementById('select-envelope-size'),
    selectPrintMode: document.getElementById('select-print-mode'),
    toggleFoldLines: document.getElementById('toggle-fold-lines'),
    duplexNote: document.getElementById('duplex-note'),
    duplexTabs: document.getElementById('duplex-tabs'),
    tabPage1: document.getElementById('tab-page-1'),
    tabPage2: document.getElementById('tab-page-2'),
    previewModeTag: document.getElementById('preview-mode-tag'),
    paperSheet: document.getElementById('paper-sheet'),
    previewStage: document.getElementById('preview-stage'),
    printRoot: document.getElementById('print-root'),
    dynamicPageStyle: document.getElementById('dynamic-page-style'),
    btnPrint: document.getElementById('btn-print'),
    btnGuide: document.getElementById('btn-guide'),
    guideModal: document.getElementById('guide-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    btnGuideGotIt: document.getElementById('btn-guide-got-it'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),
    zoomLevelText: document.getElementById('zoom-level-text')
  };

  /**
   * Initializes the application.
   */
  function init() {
    // Set default harvest date to today's local date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    state.dateHarvested = `${yyyy}-${mm}-${dd}`;
    if (elements.inputDate) {
      elements.inputDate.value = state.dateHarvested;
    }

    // Populate clip art thumbnail selector
    renderClipArtGrid();

    // Attach event listeners
    bindEvents();

    // Initial render
    updatePageStyle();
    renderPreview();
    updateZoom();

    // Adjust preview on window resize
    window.addEventListener('resize', () => {
      if (state.zoom === 'fit') {
        updateZoom();
      }
    });
  }

  /**
   * Botanical Latin name auto-formatter.
   * Capitalizes Genus, lowercases species and infraspecific epithets,
   * while safely preserving "var.", "subsp.", "ssp.", "cv." and cultivar quotes.
   */
  function formatLatinName(input) {
    if (!input) return "";
    let str = input.trim().replace(/\s+/g, " ");
    const tokens = str.split(" ");
    if (tokens.length === 0) return "";

    const rankKeywords = new Set(["var.", "subsp.", "ssp.", "cv.", "f.", "x", "group", "hybrid"]);
    let inCultivar = false;

    const formatted = tokens.map((tok, idx) => {
      const lower = tok.toLowerCase();
      if (idx === 0) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }
      if (rankKeywords.has(lower)) {
        if (lower === "cv.") inCultivar = true;
        return lower;
      }
      if (inCultivar || tok.startsWith("'") || tok.startsWith('"')) {
        return tok.charAt(0).toUpperCase() + tok.slice(1);
      }
      return lower;
    });

    return formatted.join(" ");
  }

  /**
   * Populates the thumbnail grid for clip art.
   */
  function renderClipArtGrid() {
    if (!elements.clipArtGrid) return;
    elements.clipArtGrid.innerHTML = '';

    CLIP_ART_MANIFEST.forEach(art => {
      const item = document.createElement('div');
      item.className = `clip-item ${art.id === state.clipArtId ? 'active' : ''}`;
      item.dataset.id = art.id;
      item.title = art.name;

      const thumb = document.createElement('div');
      thumb.className = 'clip-thumb';

      if (art.svg) {
        thumb.innerHTML = `<svg viewBox="0 0 100 100" fill="none" stroke="#382c23">${art.svg}</svg>`;
      } else {
        thumb.innerHTML = `<span style="font-size: 1.4rem; color: #8c7866;">∅</span>`;
      }

      const label = document.createElement('div');
      label.className = 'clip-label';
      label.textContent = art.name;

      item.appendChild(thumb);
      item.appendChild(label);

      item.addEventListener('click', () => {
        selectClipArt(art);
      });

      elements.clipArtGrid.appendChild(item);
    });
  }

  /**
   * Handles clip art selection and metadata autofill.
   */
  function selectClipArt(art) {
    state.clipArtId = art.id;

    // Update active class in grid
    const allItems = elements.clipArtGrid.querySelectorAll('.clip-item');
    allItems.forEach(el => {
      el.classList.toggle('active', el.dataset.id === art.id);
    });

    // Auto-fill form fields if art provides them
    if (art.id !== "none") {
      if (art.commonName) {
        state.seedName = art.commonName;
        elements.inputSeedName.value = art.commonName;
      }
      if (art.latinName) {
        state.latinName = art.latinName;
        elements.inputLatinName.value = art.latinName;
      }
      if (art.variety) {
        state.variety = art.variety;
        elements.inputVariety.value = art.variety;
      }
      if (art.notes) {
        state.notes = art.notes;
        elements.inputNotes.value = art.notes;
      }
    }

    renderPreview();
  }

  /**
   * Updates dynamic @page size rules for printer dialog.
   */
  function updatePageStyle() {
    const paper = ENVELOPE_CONFIG.papers[state.paperSize] || ENVELOPE_CONFIG.papers.letter;
    elements.dynamicPageStyle.textContent = `@page { size: ${paper.cssPageSize} portrait; margin: 0; }`;
  }

  /**
   * Binds UI event listeners.
   */
  function bindEvents() {
    // Form Inputs
    elements.inputSeedName.addEventListener('input', (e) => {
      state.seedName = e.target.value;
      renderPreview();
    });

    elements.inputLatinName.addEventListener('input', (e) => {
      state.latinName = e.target.value;
      renderPreview();
    });

    elements.inputLatinName.addEventListener('blur', (e) => {
      const formatted = formatLatinName(e.target.value);
      state.latinName = formatted;
      e.target.value = formatted;
      renderPreview();
    });

    elements.inputVariety.addEventListener('input', (e) => {
      state.variety = e.target.value;
      renderPreview();
    });

    elements.inputDate.addEventListener('change', (e) => {
      state.dateHarvested = e.target.value;
      renderPreview();
    });

    elements.inputTime.addEventListener('change', (e) => {
      state.timeHarvested = e.target.value;
      renderPreview();
    });

    elements.inputNotes.addEventListener('input', (e) => {
      state.notes = e.target.value;
      renderPreview();
    });

    // Typography
    elements.selectFont.addEventListener('change', (e) => {
      state.fontFamily = e.target.value;
      renderPreview();
    });

    // Template Style (Full Sheet No-Cut vs Cutout Net)
    elements.selectTemplateStyle.addEventListener('change', (e) => {
      state.templateStyle = e.target.value;
      const isFullSheet = state.templateStyle === 'fullsheet';
      elements.groupFinishedSize.style.display = isFullSheet ? 'none' : 'block';
      elements.templateStyleHint.textContent = isFullSheet
        ? '✓ Uses the entire 8.5×11 sheet. Zero cutting required—just fold along dashed lines!'
        : '✂ Cut around solid perimeter with scissors, then fold along dashed lines.';
      elements.templateStyleHint.style.color = isFullSheet ? '#2e5339' : '#8b3a2b';

      updatePreviewModeTag();
      renderPreview();
    });

    // Paper & Envelope Sizes
    elements.selectPaperSize.addEventListener('change', (e) => {
      state.paperSize = e.target.value;
      updatePageStyle();
      renderPreview();
      updateZoom();
    });

    elements.selectEnvelopeSize.addEventListener('change', (e) => {
      state.envelopeSize = e.target.value;
      renderPreview();
    });

    // Print Mode
    elements.selectPrintMode.addEventListener('change', (e) => {
      state.printMode = e.target.value;
      const isDuplex = state.printMode === 'duplex';
      elements.duplexNote.style.display = isDuplex ? 'block' : 'none';
      elements.duplexTabs.style.display = isDuplex ? 'flex' : 'none';
      updatePreviewModeTag();
      renderPreview();
    });

    // Duplex Preview Page Switcher
    elements.tabPage1.addEventListener('click', () => {
      state.activeDuplexPage = 1;
      elements.tabPage1.classList.add('active');
      elements.tabPage2.classList.remove('active');
      updatePreviewModeTag();
      renderPreview();
    });

    elements.tabPage2.addEventListener('click', () => {
      state.activeDuplexPage = 2;
      elements.tabPage2.classList.add('active');
      elements.tabPage1.classList.remove('active');
      updatePreviewModeTag();
      renderPreview();
    });

    // Toggle Fold Lines
    elements.toggleFoldLines.addEventListener('change', (e) => {
      state.showFoldLines = e.target.checked;
      renderPreview();
    });

    // Print Trigger
    elements.btnPrint.addEventListener('click', () => {
      preparePrintDOM();
      window.print();
    });

    // Folding Guide Modal
    elements.btnGuide.addEventListener('click', () => {
      elements.guideModal.classList.add('open');
    });

    elements.modalCloseBtn.addEventListener('click', () => {
      elements.guideModal.classList.remove('open');
    });

    elements.btnGuideGotIt.addEventListener('click', () => {
      elements.guideModal.classList.remove('open');
    });

    elements.guideModal.addEventListener('click', (e) => {
      if (e.target === elements.guideModal) {
        elements.guideModal.classList.remove('open');
      }
    });

    // Zoom Controls
    elements.btnZoomIn.addEventListener('click', () => {
      let currentScale = getCurrentScale();
      setZoom(Math.min(currentScale + 0.15, 2.0));
    });

    elements.btnZoomOut.addEventListener('click', () => {
      let currentScale = getCurrentScale();
      setZoom(Math.max(currentScale - 0.15, 0.35));
    });

    elements.btnZoomReset.addEventListener('click', () => {
      state.zoom = 'fit';
      updateZoom();
    });
  }

  function updatePreviewModeTag() {
    const isDuplex = state.printMode === 'duplex';
    const isFullSheet = state.templateStyle === 'fullsheet';
    const styleName = isFullSheet ? 'Full 8.5×11 Sheet • No-Cut' : 'Cutout Net';

    if (isDuplex) {
      elements.previewModeTag.textContent = `(${styleName} • Duplex Page ${state.activeDuplexPage})`;
    } else {
      elements.previewModeTag.textContent = `(${styleName} • Single Sheet)`;
    }
  }

  /**
   * Generates the SVG string for a given sheet page.
   * pageType: 'onesided' | 'duplex-1' | 'duplex-2'
   */
  function generateSheetSVG(pageType) {
    const metrics = calculateEnvelopeMetrics(state.templateStyle, state.envelopeSize, state.paperSize);
    const { paper, isFullSheet } = metrics;
    const foldLines = generateFoldLines(metrics);

    let contentSvg = '';

    if (isFullSheet) {
      // =========================================================================
      // FULL SHEET NO-CUT TEMPLATE (100% of 8.5x11 page utilized, zero cutting)
      // =========================================================================

      // Background paper frame
      contentSvg += `
        <rect x="0" y="0" width="${paper.width}" height="${paper.height}" fill="#ffffff" stroke="none" />
      `;

      if (pageType === 'onesided' || pageType === 'duplex-1') {
        // Front Artwork centered in its panel
        contentSvg += renderFrontPanelArtwork(state, metrics);

        // Outside decorations on flaps (Garden notes on back flap, seal on top flap)
        contentSvg += renderFullSheetOutsideDecorations(state, metrics);

        // Dashed Fold Lines
        if (state.showFoldLines) {
          foldLines.forEach(line => {
            contentSvg += `
              <line x1="${line.x1.toFixed(2)}" y1="${line.y1.toFixed(2)}" x2="${line.x2.toFixed(2)}" y2="${line.y2.toFixed(2)}"
                    stroke="#a6998d" stroke-width="0.30" stroke-dasharray="3 2" />
            `;
          });
        }

        // Margin Instructions
        contentSvg += `
          <text x="${(paper.width / 2).toFixed(2)}" y="${(paper.height - 4).toFixed(2)}"
                text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.6" fill="#8c7866">
            NO CUTTING REQUIRED • FOLD ENTIRE 8.5 × 11 SHEET ALONG DASHED LINES
          </text>
        `;
      } else if (pageType === 'duplex-2') {
        // Duplex Page 2 (Inside of sheet with folding creases & guidance)
        contentSvg += `
          <!-- Inside Folding Guidelines -->
          <g class="inside-creases">
        `;
        foldLines.forEach(line => {
          const mx1 = paper.width - line.x1;
          const mx2 = paper.width - line.x2;
          contentSvg += `
            <line x1="${mx1.toFixed(2)}" y1="${line.y1.toFixed(2)}" x2="${mx2.toFixed(2)}" y2="${line.y2.toFixed(2)}"
                  stroke="#5a4635" stroke-width="0.32" stroke-dasharray="3 2" />
          `;
        });

        // Inside center pocket prompt
        contentSvg += `
          <text x="${(paper.width / 2).toFixed(2)}" y="${(metrics.frontY + metrics.geom.H / 2).toFixed(2)}"
                text-anchor="middle" font-family="'IM Fell English', serif" font-size="3.4" fill="#a6998d">
            PLACE SEEDS HERE AFTER FOLDING SIDES &amp; BOTTOM
          </text>
          <text x="${(paper.width / 2).toFixed(2)}" y="${(paper.height - 4).toFixed(2)}"
                text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.6" fill="#8c7866">
            PAGE 2 OF 2 (INSIDE OF SHEET) • Mirrored for long-edge duplex printing
          </text>
          </g>
        `;
      }

    } else {
      // =========================================================================
      // TRADITIONAL CUTOUT NET MODE
      // =========================================================================
      const cutPath = generateCutOutlinePath(metrics);

      if (pageType === 'onesided') {
        contentSvg += renderFrontPanelArtwork(state, metrics);
        contentSvg += `<path d="${cutPath}" fill="none" stroke="#222222" stroke-width="0.32" stroke-linejoin="round" stroke-linecap="round" />`;

        if (state.showFoldLines) {
          foldLines.forEach(line => {
            contentSvg += `
              <line x1="${line.x1.toFixed(2)}" y1="${line.y1.toFixed(2)}" x2="${line.x2.toFixed(2)}" y2="${line.y2.toFixed(2)}"
                    stroke="#a6998d" stroke-width="0.28" stroke-dasharray="3 2" />
            `;
          });
        }

        contentSvg += `
          <text x="${(paper.width / 2).toFixed(2)}" y="${(paper.height - 8).toFixed(2)}"
                text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.6" fill="#756254">
            ✂ Cut along solid outline • - - - Fold along dashed lines
          </text>
        `;
      } else if (pageType === 'duplex-1') {
        contentSvg += renderFrontPanelArtwork(state, metrics);
        contentSvg += `
          <text x="${(paper.width / 2).toFixed(2)}" y="${(paper.height - 8).toFixed(2)}"
                text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.6" fill="#756254">
            PAGE 1 OF 2 (OUTSIDE ARTWORK) • Flip paper on LONG EDGE
          </text>
        `;
      } else if (pageType === 'duplex-2') {
        const mirroredCutPath = mirrorPathHorizontally(cutPath, paper.width);
        contentSvg += `<path d="${mirroredCutPath}" fill="none" stroke="#222222" stroke-width="0.32" stroke-linejoin="round" stroke-linecap="round" />`;

        if (state.showFoldLines) {
          foldLines.forEach(line => {
            const mx1 = paper.width - line.x1;
            const mx2 = paper.width - line.x2;
            contentSvg += `
              <line x1="${mx1.toFixed(2)}" y1="${line.y1.toFixed(2)}" x2="${mx2.toFixed(2)}" y2="${line.y2.toFixed(2)}"
                    stroke="#5a4635" stroke-width="0.32" stroke-dasharray="3 2" />
            `;
          });
        }

        contentSvg += `
          <text x="${(paper.width / 2).toFixed(2)}" y="${(paper.height - 8).toFixed(2)}"
                text-anchor="middle" font-family="'IM Fell English', serif" font-size="2.6" fill="#756254">
            PAGE 2 OF 2 (INSIDE NET &amp; CREASES) • Mirrored for duplex printing
          </text>
        `;
      }
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 ${paper.width} ${paper.height}"
           width="100%" height="100%"
           style="background-color: #ffffff; display: block;">
        ${contentSvg}
      </svg>
    `;
  }

  /**
   * Renders the current sheet into the screen preview pane.
   */
  function renderPreview() {
    let pageType = 'onesided';
    if (state.printMode === 'duplex') {
      pageType = state.activeDuplexPage === 1 ? 'duplex-1' : 'duplex-2';
    }

    elements.paperSheet.innerHTML = generateSheetSVG(pageType);
    updatePaperSheetDimensions();
  }

  /**
   * Sets paper preview dimensions matching true physical aspect ratio.
   */
  function updatePaperSheetDimensions() {
    const paper = ENVELOPE_CONFIG.papers[state.paperSize] || ENVELOPE_CONFIG.papers.letter;
    const aspectRatio = paper.height / paper.width;

    const baseWidthPx = 520;
    const baseHeightPx = baseWidthPx * aspectRatio;

    elements.paperSheet.style.width = `${baseWidthPx}px`;
    elements.paperSheet.style.height = `${baseHeightPx}px`;

    updateZoom();
  }

  /**
   * Populates the #print-root DOM right before printing.
   */
  function preparePrintDOM() {
    elements.printRoot.innerHTML = '';

    if (state.printMode === 'onesided') {
      const sheet = document.createElement('div');
      sheet.className = 'print-sheet';
      sheet.innerHTML = generateSheetSVG('onesided');
      elements.printRoot.appendChild(sheet);
    } else {
      const sheet1 = document.createElement('div');
      sheet1.className = 'print-sheet';
      sheet1.innerHTML = generateSheetSVG('duplex-1');

      const sheet2 = document.createElement('div');
      sheet2.className = 'print-sheet';
      sheet2.innerHTML = generateSheetSVG('duplex-2');

      elements.printRoot.appendChild(sheet1);
      elements.printRoot.appendChild(sheet2);
    }
  }

  /**
   * Zoom handling logic.
   */
  function getCurrentScale() {
    if (state.zoom === 'fit') {
      return calculateFitScale();
    }
    return typeof state.zoom === 'number' ? state.zoom : 1.0;
  }

  function calculateFitScale() {
    const stage = elements.previewStage;
    const stageWidth = stage.clientWidth - 60;
    const stageHeight = stage.clientHeight - 60;
    const paper = ENVELOPE_CONFIG.papers[state.paperSize];
    const aspectRatio = paper.height / paper.width;

    const baseWidth = 520;
    const baseHeight = baseWidth * aspectRatio;

    const scaleX = stageWidth / baseWidth;
    const scaleY = stageHeight / baseHeight;
    return Math.min(scaleX, scaleY, 1.25);
  }

  function setZoom(scale) {
    state.zoom = scale;
    elements.paperSheet.style.transform = `scale(${scale})`;
    elements.zoomLevelText.textContent = `${Math.round(scale * 100)}%`;
  }

  function updateZoom() {
    if (state.zoom === 'fit') {
      const fit = calculateFitScale();
      elements.paperSheet.style.transform = `scale(${fit})`;
      elements.zoomLevelText.textContent = 'Fit';
    } else {
      setZoom(state.zoom);
    }
  }

  // Run app on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
