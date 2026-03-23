// Highlighter Module — highlight and underline scripture text
// Integrates into verse rendering rather than post-processing DOM

const Highlighter = {
  STORAGE_KEY: 'isaiah_highlights',
  LABELS_KEY: 'isaiah_custom_colors',
  highlights: {},   // { "48:10": [ { start, end, color, mode, colorKey } ] }
  activeColor: null,
  activeKey: null,
  mode: 'highlight', // 'highlight' | 'underline'
  erasing: false,
  initialized: false,
  visible: true,     // toggle highlights on/off visually

  RUNG_COLORS: [
    { key: 'rung-1', color: '#8B0000', label: 'Perdition',      icon: '\u2620' },  // skull
    { key: 'rung-2', color: '#CC5500', label: 'Babylon',        icon: '\u{1F3DB}' }, // classical building
    { key: 'rung-3', color: '#DAA520', label: 'Jacob/Israel',   icon: '\u2721' },  // star of david
    { key: 'rung-4', color: '#228B22', label: 'Zion/Jerusalem', icon: '\u26F0' },  // mountain
    { key: 'rung-5', color: '#6A0DAD', label: 'Sons/Servants',  icon: '\u{1F9CE}' }, // kneeling person
    { key: 'rung-6', color: '#DC143C', label: 'Seraphs',        icon: '\u{1F525}' }, // fire
    { key: 'rung-7', color: '#B22222', label: 'Jehovah',        icon: '\u{1F451}' }  // crown
  ],

  DEFAULT_CUSTOM: [
    { key: 'custom-1', color: '#2196F3', label: 'Custom 1' },
    { key: 'custom-2', color: '#4CAF50', label: 'Custom 2' },
    { key: 'custom-3', color: '#FF9800', label: 'Custom 3' },
    { key: 'custom-4', color: '#E91E63', label: 'Custom 4' },
    { key: 'custom-5', color: '#00BCD4', label: 'Custom 5' }
  ],

  customLabels: {},
  defaults: {},  // Default highlights baked into the app (from default-highlights.js)

  init() {
    if (this.initialized) return;
    // Load default highlights if available
    if (typeof DEFAULT_HIGHLIGHTS !== 'undefined') {
      this.defaults = DEFAULT_HIGHLIGHTS;
    }
    this.load();
    this.loadLabels();
    this.buildToolbar();
    this.setupSelectionListener();
    this.setupHoverPreview();
    this.initialized = true;
  },

  // ===== TOOLBAR =====
  buildToolbar() {
    const toolbar = document.getElementById('highlightToolbar');
    if (!toolbar) return;

    let html = '';

    // ROW 1: Tools
    html += '<div class="hl-row hl-row-tools">';
    html += '<button class="hl-mode-toggle hl-concordance-btn active" data-mode="concordance" title="Click words for concordance">Concordance</button>';
    html += '<button class="hl-mode-toggle" data-mode="highlight" title="Highlight text"><span class="hl-mode-icon hl-icon-highlight"></span>Highlight</button>';
    html += '<button class="hl-mode-toggle" data-mode="underline" title="Underline text"><span class="hl-mode-icon hl-icon-underline"></span>Underline</button>';
    html += '<button class="hl-eraser-toggle" title="Remove highlights">Eraser</button>';
    html += '<button class="hl-mode-toggle hl-group-btn" data-mode="group" title="Group words">Group</button>';
    html += '<button class="hl-decode-btn" id="decodeToggle" title="Decode code words" onclick="Decoder.toggle()">Decode</button>';
    html += '<span class="hl-spacer"></span>';
    html += '<label class="hl-show-label"><input type="checkbox" id="hlShowToggle" checked onchange="Highlighter.toggleVisibility()"> Highlights</label>';
    html += '<label class="hl-show-label"><input type="checkbox" id="gpShowToggle" checked onchange="Grouper.toggleVisibility()"> Groups</label>';
    html += '<button class="hl-export-btn" title="Export highlights">Export</button>';
    html += '<button class="hl-import-btn" title="Import highlights">Import</button>';
    html += '</div>';

    // ROW 2: Color key
    html += '<div class="hl-row hl-row-colors">';
    for (const c of this.RUNG_COLORS) {
      const shortLabel = c.label.length > 8 ? c.label.slice(0, 7) + '.' : c.label;
      html += `<button class="hl-btn" data-key="${c.key}" data-color="${c.color}" title="${c.label}" style="--btn-color:${c.color}"><span class="hl-rung-icon">${c.icon}</span><span class="hl-rung-label">${shortLabel}</span></button>`;
    }
    html += '<span class="hl-divider"></span>';
    for (const c of this.DEFAULT_CUSTOM) {
      const label = this.customLabels[c.key] || c.label;
      html += `<button class="hl-btn hl-custom-btn" data-key="${c.key}" data-color="${c.color}" title="${label}" style="--btn-color:${c.color}"><span class="hl-btn-dot"></span><span class="hl-btn-label" data-key="${c.key}">${label}</span></button>`;
    }
    html += '</div>';

    html += '</div>';
    toolbar.innerHTML = html;

    // Color button clicks — also switches out of concordance mode
    toolbar.querySelectorAll('.hl-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.erasing = false;
        toolbar.querySelector('.hl-eraser-toggle')?.classList.remove('active');
        this.setColor(btn.dataset.key, btn.dataset.color);
        toolbar.querySelectorAll('.hl-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // If in concordance mode, switch to last used mode (highlight or underline)
        if (this.mode === 'concordance') {
          this.mode = 'highlight';
          toolbar.querySelectorAll('.hl-mode-toggle').forEach(b => b.classList.remove('active'));
          toolbar.querySelector('.hl-mode-toggle[data-mode="highlight"]')?.classList.add('active');
        }
      });
    });

    // Custom label editing (double-click)
    toolbar.querySelectorAll('.hl-btn-label').forEach(lbl => {
      lbl.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const key = lbl.dataset.key;
        const current = lbl.textContent;
        const newLabel = prompt('Rename this color:', current);
        if (newLabel && newLabel.trim()) {
          lbl.textContent = newLabel.trim();
          this.customLabels[key] = newLabel.trim();
          lbl.closest('.hl-btn').title = newLabel.trim();
          this.saveLabels();
        }
      });
    });

    // Mode toggle
    toolbar.querySelectorAll('.hl-mode-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        this.mode = btn.dataset.mode;
        toolbar.querySelectorAll('.hl-mode-toggle').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.erasing = false;
        toolbar.querySelector('.hl-eraser-toggle')?.classList.remove('active');

        // Concordance mode = deactivate highlight color so word clicks do concordance
        if (this.mode === 'concordance') {
          this.activeColor = null;
          this.activeKey = null;
          toolbar.querySelectorAll('.hl-btn').forEach(b => b.classList.remove('active'));
        }

        // Group mode = switch sidebar to groups tab
        if (typeof Grouper !== 'undefined' && Grouper.initialized) {
          if (this.mode === 'group') {
            Grouper.active = true;
            switchSidebarTab('groups');
            this.activeColor = null;
            this.activeKey = null;
            toolbar.querySelectorAll('.hl-btn').forEach(b => b.classList.remove('active'));
          } else {
            Grouper.active = false;
            Grouper.hideSvgLines();
            Grouper.clearGroupHighlights();
          }
        }

        // Concordance mode = switch sidebar to concordance tab
        if (this.mode === 'concordance') {
          switchSidebarTab('concordance');
        }
      });
    });

    // Eraser
    const eraserBtn = toolbar.querySelector('.hl-eraser-toggle');
    if (eraserBtn) {
      eraserBtn.addEventListener('click', () => {
        this.erasing = !this.erasing;
        eraserBtn.classList.toggle('active', this.erasing);
        if (this.erasing) {
          toolbar.querySelectorAll('.hl-btn').forEach(b => b.classList.remove('active'));
          this.activeColor = null;
          this.activeKey = null;
        }
      });
    }

    // Export
    toolbar.querySelector('.hl-export-btn')?.addEventListener('click', () => this.exportHighlights());

    // Import
    toolbar.querySelector('.hl-import-btn')?.addEventListener('click', () => this.importHighlights());
  },

  setColor(key, color) {
    this.activeKey = key;
    this.activeColor = color;
    this.erasing = false;
  },

  toggleVisibility() {
    const cb = document.getElementById('hlShowToggle');
    this.visible = cb ? cb.checked : !this.visible;
    if (typeof Concordance !== 'undefined') {
      Concordance.showChapter(Concordance.currentChapter);
    }
  },

  // ===== HOVER PREVIEW =====
  // When hovering over highlighted/underlined text, light up the corresponding
  // color buttons in the toolbar so you can see which colors are applied
  setupHoverPreview() {
    const container = document.getElementById('versesContainer');
    if (!container) return;

    container.addEventListener('mouseover', (e) => {
      // Clear previous pulses
      document.querySelectorAll('.hl-btn.hl-hover-pulse, .hl-btn.hl-hover-ul-pulse').forEach(b => {
        b.classList.remove('hl-hover-pulse');
        b.classList.remove('hl-hover-ul-pulse');
      });

      const target = e.target.closest('.word');
      if (!target) return;

      // Find if this word is inside a highlight/underline mark
      const marks = [];
      let el = target;
      while (el && !el.classList.contains('verse')) {
        if (el.classList.contains('hl-mark') || el.classList.contains('ul-mark')) {
          marks.push(el);
        }
        el = el.parentElement;
      }

      if (marks.length === 0) return;

      for (const mark of marks) {
        // Get the highlight background color
        const bgColor = mark.style.getPropertyValue('--hl-color');
        const ulColor = mark.style.getPropertyValue('--ul-color');

        if (bgColor) {
          // Find the toolbar button with this color and pulse it as "highlight"
          const btn = document.querySelector(`.hl-btn[data-color="${bgColor}"]`);
          if (btn) btn.classList.add('hl-hover-pulse');
        }
        if (ulColor) {
          // Find the toolbar button with this color and pulse it as "underline"
          const btn = document.querySelector(`.hl-btn[data-color="${ulColor}"]`);
          if (btn) btn.classList.add('hl-hover-ul-pulse');
        }
      }
    });

    container.addEventListener('mouseout', (e) => {
      const target = e.target.closest('.word');
      if (!target) return;
      document.querySelectorAll('.hl-btn.hl-hover-pulse, .hl-btn.hl-hover-ul-pulse').forEach(b => {
        b.classList.remove('hl-hover-pulse');
        b.classList.remove('hl-hover-ul-pulse');
      });
    });
  },

  // ===== TEXT SELECTION =====
  setupSelectionListener() {
    const container = document.getElementById('versesContainer');
    if (!container) return;

    // Desktop: mouseup
    container.addEventListener('mouseup', () => {
      setTimeout(() => this.handleSelection(), 10);
    });

    // Mobile: detect when user selects text via long-press + drag handles
    // Show an "Apply" floating button when there's a selection
    document.addEventListener('selectionchange', () => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
        // Check if selection is inside verses
        const range = sel.getRangeAt(0);
        const node = range.startContainer.nodeType === 3 ? range.startContainer.parentElement : range.startContainer;
        if (node && node.closest && node.closest('.verse')) {
          this.showApplyButton();
        } else {
          this.hideApplyButton();
        }
      } else {
        this.hideApplyButton();
      }
    });

    // Eraser: click on highlighted text to remove
    container.addEventListener('click', (e) => {
      if (!this.erasing) return;
      const mark = e.target.closest('.hl-mark, .ul-mark');
      if (mark) {
        e.stopPropagation();
        e.preventDefault();
        const verse = mark.closest('.verse');
        if (verse) {
          const [, ch, v] = verse.id.split('-');
          const verseKey = `${ch}:${v}`;
          const idx = parseInt(mark.dataset.hlIndex);
          if (!isNaN(idx)) {
            this.removeHighlight(verseKey, idx);
            // Re-render the chapter to clean up
            Concordance.showChapter(parseInt(ch));
          }
        }
      }
    });
  },

  handleSelection() {
    if (this.erasing) return;
    if (!this.activeColor) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;

    const range = sel.getRangeAt(0);

    // Find containing verse
    const startNode = range.startContainer.nodeType === 3
      ? range.startContainer.parentElement
      : range.startContainer;
    const startVerse = startNode.closest('.verse');
    if (!startVerse) { sel.removeAllRanges(); return; }

    const endNode = range.endContainer.nodeType === 3
      ? range.endContainer.parentElement
      : range.endContainer;
    const endVerse = endNode.closest('.verse');

    // Only support highlighting within a single verse
    if (!endVerse || startVerse !== endVerse) {
      sel.removeAllRanges();
      return;
    }

    const [, chStr, vStr] = startVerse.id.split('-');
    const ch = parseInt(chStr);
    const v = parseInt(vStr);
    const verseKey = `${ch}:${v}`;

    // Get the verse's raw text (what we store offsets against)
    const rawText = this.getVerseRawText(ch, v);
    if (!rawText) { sel.removeAllRanges(); return; }

    // Map selection to raw text offsets
    const offsets = this.selectionToRawOffsets(startVerse, range, rawText);
    if (!offsets || offsets.start >= offsets.end) {
      sel.removeAllRanges();
      return;
    }

    // Snap to word boundaries — don't allow half-word highlights
    const snapped = this.snapToWordBounds(rawText, offsets.start, offsets.end);

    // Store highlight
    if (!this.highlights[verseKey]) this.highlights[verseKey] = [];
    this.highlights[verseKey].push({
      start: snapped.start,
      end: snapped.end,
      color: this.activeColor,
      mode: this.mode,
      colorKey: this.activeKey
    });

    this.save();
    sel.removeAllRanges();

    // Re-render to show the highlight
    Concordance.showChapter(ch);
  },

  // Get the raw text of a verse from the data (not DOM)
  getVerseRawText(ch, v) {
    if (typeof ISAIAH_EMBEDDED_DATA === 'undefined') return null;
    const chapter = ISAIAH_EMBEDDED_DATA[String(ch)];
    if (!chapter) return null;
    return chapter[String(v)] || null;
  },

  // Map a browser selection range to character offsets in the raw verse text
  selectionToRawOffsets(verseEl, range, rawText) {
    // Get all text in the verse (excluding verse-num), in DOM order
    const textParts = [];
    this.walkVerseText(verseEl, textParts);
    const domText = textParts.map(p => p.text).join('');

    // Calculate DOM-based start/end offsets
    let domStart = 0;
    let domEnd = 0;
    let found = false;

    let cumulative = 0;
    for (const part of textParts) {
      if (part.node === range.startContainer) {
        domStart = cumulative + range.startOffset;
      }
      if (part.node === range.endContainer) {
        domEnd = cumulative + range.endOffset;
        found = true;
      }
      cumulative += part.text.length;
    }

    if (!found) return null;

    // Map DOM text offsets to raw text offsets
    // The DOM text should closely match raw text (both are the same verse content)
    // but may differ in whitespace. Use a simple mapping:
    const rawStart = this.mapOffset(domText, rawText, domStart);
    const rawEnd = this.mapOffset(domText, rawText, domEnd);

    if (rawStart === -1 || rawEnd === -1) return null;
    return { start: rawStart, end: rawEnd };
  },

  walkVerseText(verseEl, parts) {
    const walker = document.createTreeWalker(verseEl, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (n.parentElement.closest('.verse-num')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      parts.push({ node, text: node.textContent });
    }
  },

  // Map an offset in domText to the equivalent position in rawText
  // Both should be nearly identical, but may differ in newlines/whitespace
  mapOffset(domText, rawText, domOffset) {
    // Normalize both by collapsing whitespace, then find the position
    const domBefore = domText.slice(0, domOffset);
    // Count non-whitespace characters before offset in DOM
    const domChars = domBefore.replace(/\s+/g, ' ');

    // Walk rawText to find the same logical position
    let rawIdx = 0;
    let domIdx = 0;
    const domNorm = domText.replace(/\s+/g, ' ');
    const rawNorm = rawText.replace(/\s+/g, ' ');

    // Simple approach: map proportionally through normalized text
    // Find offset in normalized DOM text
    let normDomOffset = 0;
    let origCount = 0;
    for (let i = 0; i < domText.length && origCount < domOffset; i++) {
      origCount++;
    }
    normDomOffset = domOffset;

    // For simple cases (which is most), DOM text ≈ raw text
    // Just clamp to raw text bounds
    return Math.min(normDomOffset, rawText.length);
  },

  // ===== RENDERING INTEGRATION =====
  // Supports BOTH highlight and underline on the same text with different colors
  getSegments(chapterNum, verseNum, rawText) {
    if (!this.visible) return null; // highlights hidden
    const verseKey = `${chapterNum}:${verseNum}`;
    const defaultMarks = this.defaults[verseKey] || [];
    const userMarks = this.highlights[verseKey] || [];
    const marks = [...defaultMarks, ...userMarks];
    if (marks.length === 0) return null;

    // Build TWO character-level maps: one for highlights, one for underlines
    const hlMap = new Array(rawText.length).fill(null);  // background highlights
    const ulMap = new Array(rawText.length).fill(null);  // underlines

    for (let i = 0; i < marks.length; i++) {
      const m = marks[i];
      const start = Math.max(0, m.start);
      const end = Math.min(rawText.length, m.end);
      const map = m.mode === 'underline' ? ulMap : hlMap;
      for (let c = start; c < end; c++) {
        map[c] = { color: m.color, index: i };
      }
    }

    // Combine into segments where both hl and ul can coexist
    const segments = [];
    let i = 0;
    while (i < rawText.length) {
      const hl = hlMap[i];
      const ul = ulMap[i];
      let j = i + 1;
      while (j < rawText.length) {
        const jHl = hlMap[j];
        const jUl = ulMap[j];
        const sameHl = (hl === null && jHl === null) || (hl !== null && jHl !== null && hl.color === jHl.color);
        const sameUl = (ul === null && jUl === null) || (ul !== null && jUl !== null && ul.color === jUl.color);
        if (sameHl && sameUl) { j++; continue; }
        break;
      }
      const hasAny = hl !== null || ul !== null;
      segments.push({
        text: rawText.slice(i, j),
        hl: hasAny ? {
          bgColor: hl ? hl.color : null,
          ulColor: ul ? ul.color : null,
          index: hl ? hl.index : (ul ? ul.index : 0)
        } : null
      });
      i = j;
    }
    return segments;
  },

  // ===== REMOVE =====
  removeHighlight(verseKey, index) {
    if (!this.highlights[verseKey]) return;
    this.highlights[verseKey].splice(index, 1);
    if (this.highlights[verseKey].length === 0) delete this.highlights[verseKey];
    this.save();
  },

  // ===== PERSISTENCE =====
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.highlights));
    } catch (e) { console.warn('Could not save highlights:', e); }
  },

  load() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) this.highlights = JSON.parse(data);
    } catch (e) { this.highlights = {}; }
  },

  saveLabels() {
    try {
      localStorage.setItem(this.LABELS_KEY, JSON.stringify(this.customLabels));
    } catch (e) {}
  },

  loadLabels() {
    try {
      const data = localStorage.getItem(this.LABELS_KEY);
      if (data) this.customLabels = JSON.parse(data);
    } catch (e) { this.customLabels = {}; }
  },

  // ===== WORD SNAPPING =====
  // Expand offsets to include full words (no half-word highlights)
  snapToWordBounds(text, start, end) {
    // Expand start backward to beginning of word
    while (start > 0 && /[a-zA-Z'\-]/.test(text[start - 1])) {
      start--;
    }
    // Expand end forward to end of word
    while (end < text.length && /[a-zA-Z'\-]/.test(text[end])) {
      end++;
    }
    return { start, end };
  },

  // ===== MOBILE APPLY BUTTON =====
  showApplyButton() {
    if (!this.activeColor && this.mode === 'concordance') return;
    let btn = document.getElementById('hlApplyBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'hlApplyBtn';
      btn.className = 'hl-apply-btn';
      btn.onclick = () => this.applyToCurrentSelection();
      document.body.appendChild(btn);
    }
    const modeLabel = this.mode === 'underline' ? 'Underline' : 'Highlight';
    btn.textContent = this.activeColor ? `${modeLabel} Selection` : 'Select a color first';
    btn.disabled = !this.activeColor;
    btn.style.display = 'flex';
  },

  hideApplyButton() {
    const btn = document.getElementById('hlApplyBtn');
    if (btn) btn.style.display = 'none';
  },

  applyToCurrentSelection() {
    if (!this.activeColor) return;
    // Use the existing handleSelection which reads window.getSelection()
    this.handleSelection();
    this.hideApplyButton();
  },

  // ===== EXPORT / IMPORT =====
  exportHighlights() {
    const data = {
      version: 1,
      highlights: this.highlights,
      customLabels: this.customLabels,
      exportDate: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'isaiah-highlights.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importHighlights() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          if (data.highlights) {
            // Merge imported highlights with existing (imported take priority)
            for (const [key, marks] of Object.entries(data.highlights)) {
              if (!this.highlights[key]) this.highlights[key] = [];
              this.highlights[key].push(...marks);
            }
            this.save();
          }
          if (data.customLabels) {
            Object.assign(this.customLabels, data.customLabels);
            this.saveLabels();
            // Update toolbar labels
            for (const [key, label] of Object.entries(data.customLabels)) {
              const lbl = document.querySelector(`.hl-btn-label[data-key="${key}"]`);
              if (lbl) {
                lbl.textContent = label;
                lbl.closest('.hl-btn').title = label;
              }
            }
          }
          // Re-render current chapter
          if (typeof Concordance !== 'undefined') {
            Concordance.showChapter(Concordance.currentChapter);
          }
          alert(`Imported highlights for ${Object.keys(data.highlights || {}).length} verses.`);
        } catch (err) {
          alert('Could not read highlights file: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
    input.click();
  },

  // ===== BAKE CURRENT HIGHLIGHTS AS DEFAULTS =====
  // Run this in the console to generate default-highlights.js content:
  // copy(Highlighter.generateDefaultsCode())
  generateDefaultsCode() {
    return `// Default highlights — baked into the app\n// Generated ${new Date().toISOString()}\nconst DEFAULT_HIGHLIGHTS = ${JSON.stringify(this.highlights, null, 2)};\n`;
  }
};
