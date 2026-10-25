/**
 * Tapeless & Cutout Seed Envelope Maker - Application Controller
 */

(function () {
  'use strict';

  // Months array
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Application State
  const state = {
    seedName: "Zinnia",
    latinName: "Zinnia elegans",
    variety: "California Giant",
    packagedMonth: "October",
    packagedYear: "2026",
    datePrefix: "PACKAGED", // "PACKAGED" or "HARVESTED"
    notes: "Vibrant warm-season cut flower. Attracts butterflies. Sow in full sun.",
    clipArtId: "universal",
    customImage: null, // data URL string
    imageFilter: "monochrome", // 'monochrome' or 'color'
    fontFamily: "'Abril Fatface', serif",
    sheetLayout: "single", // 'single' (1 packet) or 'twin' (2 packets)
    foldingStyle: "classic", // 'classic', 'origami', 'tuckslot'
    paperSize: "letter",
    showFoldLines: true,
    badgeOpenPollinated: false,
    badgeTestedGermination: false,
    badgeHeirloom: false,
    badgeOrganic: false,
    zoom: 'fit'
  };

  // DOM Elements
  const elements = {
    inputSeedName: document.getElementById('input-seed-name'),
    plantSuggestions: document.getElementById('plant-suggestions'),
    lookupBadge: document.getElementById('lookup-badge'),
    btnApplyLookup: document.getElementById('btn-apply-lookup'),
    inputLatinName: document.getElementById('input-latin-name'),
    inputVariety: document.getElementById('input-variety'),
    selectDatePrefix: document.getElementById('select-date-prefix'),
    selectMonth: document.getElementById('select-month'),
    inputYear: document.getElementById('input-year'),
    inputNotes: document.getElementById('input-notes'),

    // Badges
    checkOpenPollinated: document.getElementById('badge-open-pollinated'),
    checkTestedGermination: document.getElementById('badge-tested-germination'),
    checkHeirloom: document.getElementById('badge-heirloom'),
    checkOrganic: document.getElementById('badge-organic'),

    // Artwork
    inputCustomImage: document.getElementById('input-custom-image'),
    uploadedImageInfo: document.getElementById('uploaded-image-info'),
    uploadedImageName: document.getElementById('uploaded-image-name'),
    btnRemoveImage: document.getElementById('btn-remove-image'),
    selectImageFilter: document.getElementById('select-image-filter'),
    clipArtGrid: document.getElementById('clip-art-grid'),
    clipArtSection: document.getElementById('clip-art-section'),

    // Layout & Sizing
    selectSheetLayout: document.getElementById('select-sheet-layout'),
    selectFoldingStyle: document.getElementById('select-folding-style'),
    foldingStyleHint: document.getElementById('folding-style-hint'),
    selectPaperSize: document.getElementById('select-paper-size'),
    selectFont: document.getElementById('select-font'),
    toggleFoldLines: document.getElementById('toggle-fold-lines'),

    // Preview & Printing
    previewModeTag: document.getElementById('preview-mode-tag'),
    paperSheet: document.getElementById('paper-sheet'),
    previewStage: document.getElementById('preview-stage'),
    printRoot: document.getElementById('print-root'),
    dynamicPageStyle: document.getElementById('dynamic-page-style'),
    btnPrint: document.getElementById('btn-print'),

    // Guide Modal
    btnGuide: document.getElementById('btn-guide'),
    guideModal: document.getElementById('guide-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    btnGuideGotIt: document.getElementById('btn-guide-got-it'),
    guideModalContent: document.getElementById('guide-modal-steps'),

    // Zoom
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),
    zoomLevelText: document.getElementById('zoom-level-text')
  };

  /**
   * Initializes the application.
   */
  function init() {
    // Set default month & year to current
    const now = new Date();
    state.packagedMonth = MONTHS[now.getMonth()];
    state.packagedYear = String(now.getFullYear());

    if (elements.selectMonth) {
      elements.selectMonth.value = state.packagedMonth;
    }
    if (elements.inputYear) {
      elements.inputYear.value = state.packagedYear;
    }

    // Populate datalist with botanical suggestions
    populatePlantSuggestions();

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
   * Populates the HTML <datalist> for plant name autocomplete.
   */
  function populatePlantSuggestions() {
    if (!elements.plantSuggestions || typeof BOTANICAL_DATABASE === 'undefined') return;
    elements.plantSuggestions.innerHTML = '';

    BOTANICAL_DATABASE.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.common;
      opt.label = `${item.latin} (${item.family})`;
      elements.plantSuggestions.appendChild(opt);
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
   * Checks the botanical database when the user types a plant name.
   */
  function checkBotanicalLookup(query) {
    if (typeof searchBotanicalDatabase === 'undefined') return;
    const match = searchBotanicalDatabase(query);

    if (match) {
      elements.lookupBadge.style.display = 'flex';
      elements.lookupBadge.innerHTML = `
        <span>Found botanical match: <strong>${match.latin}</strong> (${match.common})</span>
        <button type="button" id="btn-quick-fill-botany" class="btn-lookup-pill">Auto-Fill</button>
      `;
      const btn = document.getElementById('btn-quick-fill-botany');
      if (btn) {
        btn.addEventListener('click', () => applyBotanicalMatch(match));
      }

      // If exact common name match, auto-fill Latin name if Latin name is currently empty or matches previous botanical
      if (query.trim().toLowerCase() === match.common.toLowerCase() ||
          (match.synonyms && match.synonyms.includes(query.trim().toLowerCase()))) {
        applyBotanicalMatch(match);
      }
    } else {
      elements.lookupBadge.style.display = 'none';
    }
  }

  /**
   * Applies matched botanical data to state and inputs.
   */
  function applyBotanicalMatch(match) {
    if (!match) return;
    state.latinName = match.latin;
    elements.inputLatinName.value = match.latin;

    if (!elements.inputVariety.value || elements.inputVariety.value === "California Giant") {
      state.variety = match.variety || "";
      elements.inputVariety.value = state.variety;
    }

    if (!elements.inputNotes.value || elements.inputNotes.value.includes("Vibrant warm-season")) {
      state.notes = match.notes || "";
      elements.inputNotes.value = state.notes;
    }

    elements.lookupBadge.style.display = 'none';
    renderPreview();
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
        thumb.innerHTML = `<span style="font-size: 1.2rem; color: #8c7866;">∅</span>`;
      }

      const label = document.createElement('div');
      label.className = 'clip-label';
      label.textContent = art.name.split('(')[0].trim();

      item.appendChild(thumb);
      item.appendChild(label);

      item.addEventListener('click', () => {
        selectClipArt(art);
      });

      elements.clipArtGrid.appendChild(item);
    });
  }

  /**
   * Handles clip art selection.
   */
  function selectClipArt(art) {
    state.clipArtId = art.id;
    state.customImage = null; // Clear uploaded image when selecting preset

    // Update active class in grid
    const allItems = elements.clipArtGrid.querySelectorAll('.clip-item');
    allItems.forEach(el => {
      el.classList.toggle('active', el.dataset.id === art.id);
    });

    if (elements.uploadedImageInfo) {
      elements.uploadedImageInfo.style.display = 'none';
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
    // Seed Name Input with Botanical Lookup
    elements.inputSeedName.addEventListener('input', (e) => {
      state.seedName = e.target.value;
      checkBotanicalLookup(e.target.value);
      renderPreview();
    });

    elements.inputSeedName.addEventListener('change', (e) => {
      checkBotanicalLookup(e.target.value);
    });

    // Latin Name
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

    // Variety
    elements.inputVariety.addEventListener('input', (e) => {
      state.variety = e.target.value;
      renderPreview();
    });

    // Packaged Date (Month and Year, no time)
    elements.selectDatePrefix.addEventListener('change', (e) => {
      state.datePrefix = e.target.value;
      renderPreview();
    });

    elements.selectMonth.addEventListener('change', (e) => {
      state.packagedMonth = e.target.value;
      renderPreview();
    });

    elements.inputYear.addEventListener('input', (e) => {
      state.packagedYear = e.target.value;
      renderPreview();
    });

    // Notes
    elements.inputNotes.addEventListener('input', (e) => {
      state.notes = e.target.value;
      renderPreview();
    });

    // Badges Checkboxes
    elements.checkOpenPollinated.addEventListener('change', (e) => {
      state.badgeOpenPollinated = e.target.checked;
      renderPreview();
    });

    elements.checkTestedGermination.addEventListener('change', (e) => {
      state.badgeTestedGermination = e.target.checked;
      renderPreview();
    });

    elements.checkHeirloom.addEventListener('change', (e) => {
      state.badgeHeirloom = e.target.checked;
      renderPreview();
    });

    elements.checkOrganic.addEventListener('change', (e) => {
      state.badgeOrganic = e.target.checked;
      renderPreview();
    });

    // Custom Image Upload
    elements.inputCustomImage.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          state.customImage = uploadEvent.target.result;
          elements.uploadedImageInfo.style.display = 'flex';
          elements.uploadedImageName.textContent = file.name;

          // Clear clip art active item
          const allItems = elements.clipArtGrid.querySelectorAll('.clip-item');
          allItems.forEach(el => el.classList.remove('active'));

          renderPreview();
        };
        reader.readAsDataURL(file);
      }
    });

    elements.btnRemoveImage.addEventListener('click', () => {
      state.customImage = null;
      elements.inputCustomImage.value = '';
      elements.uploadedImageInfo.style.display = 'none';
      state.clipArtId = "universal";
      renderClipArtGrid();
      renderPreview();
    });

    elements.selectImageFilter.addEventListener('change', (e) => {
      state.imageFilter = e.target.value;
      renderPreview();
    });

    // Typography
    elements.selectFont.addEventListener('change', (e) => {
      state.fontFamily = e.target.value;
      renderPreview();
    });

    // Sheet Layout (1 Packet vs 2 Packets)
    const onLayoutChange = (e) => {
      state.sheetLayout = e.target.value;
      const isTwin = state.sheetLayout === 'twin';
      // If twin layout, origami and petal are 1-per-sheet designs
      if (isTwin && (state.foldingStyle === 'origami' || state.foldingStyle === 'petal')) {
        state.foldingStyle = 'classic';
        elements.selectFoldingStyle.value = 'classic';
      }
      updateFoldingStyleHint();
      updatePreviewModeTag();
      renderPreview();
    };
    elements.selectSheetLayout.addEventListener('change', onLayoutChange);
    elements.selectSheetLayout.addEventListener('input', onLayoutChange);

    // Folding Style
    const onFoldingStyleChange = (e) => {
      state.foldingStyle = e.target.value;
      if ((state.foldingStyle === 'origami' || state.foldingStyle === 'petal') && state.sheetLayout === 'twin') {
        state.sheetLayout = 'single';
        elements.selectSheetLayout.value = 'single';
      }
      updateFoldingStyleHint();
      updatePreviewModeTag();
      renderPreview();
    };
    elements.selectFoldingStyle.addEventListener('change', onFoldingStyleChange);
    elements.selectFoldingStyle.addEventListener('input', onFoldingStyleChange);

    // Paper Size
    elements.selectPaperSize.addEventListener('change', (e) => {
      state.paperSize = e.target.value;
      updatePageStyle();
      renderPreview();
      updateZoom();
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
      renderGuideModalSteps();
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

  function updateFoldingStyleHint() {
    if (state.foldingStyle === 'origami') {
      elements.foldingStyleHint.textContent = '★ 100% Glue-Free & Tapeless: Cut out square and fold into gardener\'s cup pouch.';
      elements.foldingStyleHint.style.color = '#2e5339';
    } else if (state.foldingStyle === 'petal') {
      elements.foldingStyleHint.textContent = '★ 100% Glue-Free: 4 curved flower petals fold into an interlocking pinwheel.';
      elements.foldingStyleHint.style.color = '#8b3a2b';
    } else if (state.foldingStyle === 'tuckslot') {
      elements.foldingStyleHint.textContent = '✂ Interlocking Tuck-Slot: Slice the marked back slot for glue-free closure.';
      elements.foldingStyleHint.style.color = '#7d3c22';
    } else {
      elements.foldingStyleHint.textContent = '✂ Classic Flap: Clean perimeter cut; side flaps fold behind and secure with glue stick or tape.';
      elements.foldingStyleHint.style.color = '#4a3d33';
    }
  }

  function updatePreviewModeTag() {
    const layoutName = state.sheetLayout === 'twin' ? '2 Packets / Sheet' : '1 Packet / Sheet';
    let styleName = 'Classic Flap';
    if (state.foldingStyle === 'origami') styleName = 'Origami Pouch';
    if (state.foldingStyle === 'petal') styleName = '4-Petal Flower';
    if (state.foldingStyle === 'tuckslot') styleName = 'Tuck-Slot';

    elements.previewModeTag.textContent = `(${layoutName} • ${styleName})`;
  }

  /**
   * Dynamically populates the Folding Guide Modal depending on active style.
   */
  function renderGuideModalSteps() {
    if (!elements.guideModalContent) return;

    if (state.foldingStyle === 'petal') {
      elements.guideModalContent.innerHTML = `
        <div class="guide-step">
          <div class="step-num">1</div>
          <div class="step-text">
            <h4>Cut Along Curved Petals</h4>
            <p>Cut along the solid outline to produce the four-petaled flower shape.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">2</div>
          <div class="step-text">
            <h4>Fold Top &amp; Right Petals</h4>
            <p>Fold the Top petal down over the center pocket. Fold the Right petal inward over the top petal.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">3</div>
          <div class="step-text">
            <h4>Fold Bottom Petal</h4>
            <p>Fold the Bottom petal upward over the right petal.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">4</div>
          <div class="step-text">
            <h4>Tuck Left Petal (Pinwheel Lock)</h4>
            <p>Fold the Left petal inward over the bottom petal, and tuck its rounded tip underneath the Top petal. It forms a self-locking flower pinwheel with zero tape or glue!</p>
          </div>
        </div>
      `;
    } else if (state.foldingStyle === 'origami') {
      elements.guideModalContent.innerHTML = `
        <div class="guide-step">
          <div class="step-num">1</div>
          <div class="step-text">
            <h4>Cut Out Square</h4>
            <p>Cut along the solid square perimeter with scissors. Fold diagonally in half corner-to-corner to form a large downward triangle (printed art faces forward).</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">2</div>
          <div class="step-text">
            <h4>Fold Left Corner Across</h4>
            <p>Take the left corner tip and fold it horizontally across to the right edge. Crease firmly.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">3</div>
          <div class="step-text">
            <h4>Fold Right Corner Across</h4>
            <p>Take the right corner tip and fold it horizontally across to the left edge, overlapping the previous fold. This forms an interlocking front pocket band.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">4</div>
          <div class="step-text">
            <h4>Insert Seeds &amp; Tuck In</h4>
            <p>Drop your seeds inside the cup. Fold the top triangular flap down and tuck it securely into the front pocket band. It is 100% leak-proof with no tape or glue!</p>
          </div>
        </div>
      `;
    } else if (state.foldingStyle === 'tuckslot') {
      elements.guideModalContent.innerHTML = `
        <div class="guide-step">
          <div class="step-num">1</div>
          <div class="step-text">
            <h4>Cut Perimeter &amp; Slit</h4>
            <p>Cut along the solid outer outline. Using scissors or a craft blade, make a small clean slice along the red dashed slit line on the bottom flap.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">2</div>
          <div class="step-text">
            <h4>Fold Side Flaps Inward</h4>
            <p>Crease both side flaps inward along the dashed vertical lines toward the back of the packet.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">3</div>
          <div class="step-text">
            <h4>Fold Bottom Up</h4>
            <p>Fold the bottom flap up over the side flaps along the bottom dashed crease.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">4</div>
          <div class="step-text">
            <h4>Insert Seeds &amp; Tuck Tongue</h4>
            <p>Place seeds inside the pouch. Fold the top flap down and slide the closure tongue firmly into the pre-cut slit.</p>
          </div>
        </div>
      `;
    } else {
      elements.guideModalContent.innerHTML = `
        <div class="guide-step">
          <div class="step-num">1</div>
          <div class="step-text">
            <h4>Cut Along Solid Outline</h4>
            <p>Cut out the envelope shape along the solid perimeter using scissors.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">2</div>
          <div class="step-text">
            <h4>Fold Side Flaps Inward</h4>
            <p>Fold the left and right flaps inward along the dashed vertical lines. The two flaps overlap down the center back.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">3</div>
          <div class="step-text">
            <h4>Fold Bottom Up &amp; Secure Seam</h4>
            <p>Fold the bottom flap up over the side flaps. Run a quick swipe of a glue stick or double-sided tape along the bottom and center overlap to seal the pouch.</p>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-num">4</div>
          <div class="step-text">
            <h4>Fill &amp; Seal</h4>
            <p>Place seeds inside. Fold down the top curved flap and secure with a sticker seal, dab of glue, or washi tape.</p>
          </div>
        </div>
      `;
    }
  }

  /**
   * Renders the current sheet into the screen preview pane.
   */
  function renderPreview() {
    elements.paperSheet.innerHTML = generateSheetSVG(state);
    updatePaperSheetDimensions();
  }

  /**
   * Sets paper preview dimensions matching true physical aspect ratio.
   */
  function updatePaperSheetDimensions() {
    const paper = ENVELOPE_CONFIG.papers[state.paperSize] || ENVELOPE_CONFIG.papers.letter;
    const aspectRatio = paper.height / paper.width;

    const baseWidthPx = 680;
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
    const sheet = document.createElement('div');
    sheet.className = 'print-sheet';
    sheet.innerHTML = generateSheetSVG(state);
    elements.printRoot.appendChild(sheet);
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
    if (!stage) return 1.0;
    const stageWidth = stage.clientWidth - 40;
    const stageHeight = stage.clientHeight - 40;
    const paper = ENVELOPE_CONFIG.papers[state.paperSize] || ENVELOPE_CONFIG.papers.letter;
    const aspectRatio = paper.height / paper.width;

    const baseWidth = 680;
    const baseHeight = baseWidth * aspectRatio;

    const scaleX = stageWidth / baseWidth;
    const scaleY = stageHeight / baseHeight;
    return Math.min(scaleX, scaleY, 1.4);
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
