// Word Grouper — create named groups of words with visual connections
// Groups persist in localStorage

const Grouper = {
  STORAGE_KEY: 'isaiah_word_groups',
  groups: [],       // [{ id, name, color, words: [{ ch, v, start, end, text }] }]
  activeGroupId: null,
  active: false,    // true when in grouping mode
  visible: true,    // toggle group markers/lines on/off
  initialized: false,
  nextId: 1,
  svgEl: null,

  COLORS: ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e','#e91e63','#00bcd4'],
  colorIdx: 0,

  init() {
    if (this.initialized) return;
    this.load();
    this.buildPanel();
    this.setupWordClickListener();
    this.createSvgOverlay();
    this.initialized = true;
  },

  // ===== PANEL (in concordance sidebar) =====
  buildPanel() {
    // The panel will be shown/hidden by toggling
  },

  showPanel() {
    // Switch sidebar to groups tab
    switchSidebarTab('groups');
    this.renderPanel();
  },

  hidePanel() {
    this.clearGroupHighlights();
    this.hideSvgLines();
  },

  renderPanel() {
    const panel = document.getElementById('grouperPanel');
    if (!panel) return;

    let html = `<div class="gp-header">
      <h3>Word Groups</h3>
      <p class="gp-hint">Click words in the text to add them to the active group.</p>
    </div>
    <div class="gp-new">
      <input type="text" id="gpNewName" placeholder="New group name..." class="gp-input">
      <button onclick="Grouper.createGroup()" class="gp-add-btn">+ Add</button>
    </div>
    <div class="gp-list">`;

    for (const g of this.groups) {
      const isActive = g.id === this.activeGroupId;
      html += `<div class="gp-item ${isActive ? 'gp-active' : ''}" data-gid="${g.id}">
        <div class="gp-item-header" onclick="Grouper.selectGroup(${g.id})">
          <span class="gp-color-dot" style="background:${g.color}"></span>
          <span class="gp-name">${g.name}</span>
          <span class="gp-count">${g.words.length}</span>
          <button class="gp-del" onclick="event.stopPropagation();Grouper.deleteGroup(${g.id})" title="Delete group">&times;</button>
        </div>
        <div class="gp-words">
          ${g.words.map((w, i) => `<span class="gp-word-tag" style="border-color:${g.color}" onclick="event.stopPropagation();Grouper.jumpToGroupWord(${g.id},${i})">${w.text} <small>${w.ch}:${w.v}</small><button class="gp-word-del" onclick="event.stopPropagation();Grouper.removeWord(${g.id},${i})">&times;</button></span>`).join('')}
        </div>
      </div>`;
    }

    html += '</div>';

    if (this.groups.length > 0) {
      html += `<div class="gp-actions">
        <button onclick="Grouper.showAllGroups()" class="gp-show-all">Show All Lines</button>
        <button onclick="Grouper.hideAllGroups()" class="gp-hide-all">Hide Lines</button>
      </div>`;
    }

    panel.innerHTML = html;

    // Enter key creates group
    setTimeout(() => {
      const input = document.getElementById('gpNewName');
      if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') Grouper.createGroup(); });
    }, 50);
  },

  // ===== GROUP MANAGEMENT =====
  createGroup() {
    const input = document.getElementById('gpNewName');
    const name = input?.value.trim();
    if (!name) return;

    const color = this.COLORS[this.colorIdx % this.COLORS.length];
    this.colorIdx++;

    const group = {
      id: this.nextId++,
      name,
      color,
      words: []
    };
    this.groups.push(group);
    this.activeGroupId = group.id;
    this.active = true;
    this.save();
    if (input) input.value = '';
    this.renderPanel();
    this.showSelectMode(group);
  },

  // Show a banner telling user to select words, with a Done button
  showSelectMode(group) {
    // Remove any existing banner
    this.hideSelectMode();
    const banner = document.createElement('div');
    banner.id = 'gpSelectBanner';
    banner.className = 'gp-select-banner';
    banner.style.borderColor = group.color;
    banner.innerHTML = `
      <span class="gp-select-text">Tap words to add to <strong>${group.name}</strong></span>
      <button class="gp-select-done" onclick="Grouper.finishGrouping()">Done</button>
    `;
    const readingPanel = document.getElementById('readingPanel');
    if (readingPanel) readingPanel.insertBefore(banner, readingPanel.firstChild);

    // On mobile, close the panel so user can see the text
    if (window.innerWidth <= 850 && typeof MobileSheet !== 'undefined') {
      MobileSheet.snapTo('collapsed');
    }
  },

  hideSelectMode() {
    const banner = document.getElementById('gpSelectBanner');
    if (banner) banner.remove();
  },

  finishGrouping() {
    this.hideSelectMode();
    const group = this.groups.find(g => g.id === this.activeGroupId);
    if (group && group.words.length === 0) {
      // No words added — remove empty group
      this.groups = this.groups.filter(g => g.id !== this.activeGroupId);
    }
    this.save();
    this.renderPanel();
    // Show the group lines
    if (this.activeGroupId && this.visible) {
      Concordance.showChapter(Concordance.currentChapter);
      setTimeout(() => {
        this.highlightGroupWords(this.activeGroupId);
        this.showGroupLines(this.activeGroupId);
      }, 100);
    }
  },

  selectGroup(id) {
    this.activeGroupId = (this.activeGroupId === id) ? null : id;
    this.renderPanel();
    if (this.activeGroupId) {
      this.showGroupLines(id);
      this.highlightGroupWords(id);
    } else {
      this.hideSvgLines();
      this.clearGroupHighlights();
    }
  },

  deleteGroup(id) {
    this.groups = this.groups.filter(g => g.id !== id);
    if (this.activeGroupId === id) this.activeGroupId = null;
    this.save();
    this.renderPanel();
    this.hideSvgLines();
    this.clearGroupHighlights();
    // Re-render chapter to clear group markers
    if (typeof Concordance !== 'undefined') {
      Concordance.showChapter(Concordance.currentChapter);
    }
  },

  removeWord(groupId, wordIdx) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;
    group.words.splice(wordIdx, 1);
    this.save();
    this.renderPanel();
    if (typeof Concordance !== 'undefined') {
      Concordance.showChapter(Concordance.currentChapter);
    }
    if (this.activeGroupId === groupId) {
      this.showGroupLines(groupId);
      this.highlightGroupWords(groupId);
    }
  },

  // ===== WORD CLICK (add to group or erase from group) =====
  setupWordClickListener() {
    const container = document.getElementById('versesContainer');
    if (!container) return;

    container.addEventListener('click', (e) => {
      if (!this.active) return;

      const wordEl = e.target.closest('.word');
      if (!wordEl) return;

      // ERASER MODE: if eraser is active and word is grouped, remove it
      if (typeof Highlighter !== 'undefined' && Highlighter.erasing) {
        if (wordEl.classList.contains('grouped-word')) {
          const gid = parseInt(wordEl.dataset.groupId);
          const verse = wordEl.closest('.verse');
          if (verse && gid) {
            const [, chStr, vStr] = verse.id.split('-');
            const ch = parseInt(chStr);
            const v = parseInt(vStr);
            const wordText = wordEl.textContent;
            const group = this.groups.find(g => g.id === gid);
            if (group) {
              const idx = group.words.findIndex(w => w.ch === ch && w.v === v && w.text === wordText);
              if (idx !== -1) {
                group.words.splice(idx, 1);
                this.save();
                this.renderPanel();
                Concordance.showChapter(ch);
                if (this.activeGroupId) {
                  setTimeout(() => {
                    this.highlightGroupWords(this.activeGroupId);
                    this.showGroupLines(this.activeGroupId);
                  }, 100);
                }
              }
            }
          }
          return;
        }
        return;
      }

      // Normal mode: add word to active group
      if (!this.activeGroupId) return;

      const verse = wordEl.closest('.verse');
      if (!verse) return;

      const [, chStr, vStr] = verse.id.split('-');
      const ch = parseInt(chStr);
      const v = parseInt(vStr);
      const wordText = wordEl.textContent;

      // Get character offset in verse
      const rawText = (typeof ISAIAH_EMBEDDED_DATA !== 'undefined') ? ISAIAH_EMBEDDED_DATA[String(ch)]?.[String(v)] : null;
      let start = 0, end = 0;
      if (rawText) {
        // Find the word position
        let offset = 0;
        const walker = document.createTreeWalker(verse, NodeFilter.SHOW_TEXT, {
          acceptNode(n) {
            if (n.parentElement.closest('.verse-num')) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        let node;
        while ((node = walker.nextNode())) {
          if (node.parentElement === wordEl) {
            start = offset;
            end = offset + node.textContent.length;
            break;
          }
          offset += node.textContent.length;
        }
      }

      const group = this.groups.find(g => g.id === this.activeGroupId);
      if (!group) return;

      // Check if already in group
      const exists = group.words.some(w => w.ch === ch && w.v === v && w.start === start);
      if (exists) return;

      group.words.push({ ch, v, start, end, text: wordText });
      this.save();
      this.renderPanel();

      // Re-render to show group markers
      Concordance.showChapter(Concordance.currentChapter);
      setTimeout(() => {
        this.highlightGroupWords(this.activeGroupId);
        this.showGroupLines(this.activeGroupId);
      }, 100);
    });
  },

  // ===== VISUAL: HIGHLIGHT GROUP WORDS =====
  highlightGroupWords(groupId) {
    this.clearGroupHighlights();
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;

    const ch = (typeof Concordance !== 'undefined') ? Concordance.currentChapter : 0;
    const chapterWords = group.words.filter(w => w.ch === ch);

    document.querySelectorAll('.word').forEach(el => {
      const verse = el.closest('.verse');
      if (!verse) return;
      const [, , vStr] = verse.id.split('-');
      const v = parseInt(vStr);

      for (const gw of chapterWords) {
        if (gw.v === v && el.textContent === gw.text) {
          el.classList.add('grouped-word');
          el.style.setProperty('--group-color', group.color);
          el.dataset.groupId = groupId;
          break;
        }
      }
    });
  },

  clearGroupHighlights() {
    document.querySelectorAll('.word.grouped-word').forEach(el => {
      el.classList.remove('grouped-word');
      el.style.removeProperty('--group-color');
      delete el.dataset.groupId;
    });
  },

  // ===== VISUAL: SVG CONNECTING LINES =====
  createSvgOverlay() {
    this.svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgEl.id = 'grouperSvg';
    this.svgEl.classList.add('grouper-svg');
    document.body.appendChild(this.svgEl);

    // Recalculate on scroll
    const readingPanel = document.getElementById('readingPanel');
    if (readingPanel) {
      readingPanel.addEventListener('scroll', () => {
        if (this.activeGroupId && this.active) {
          this.showGroupLines(this.activeGroupId);
        }
      });
    }
    window.addEventListener('resize', () => {
      if (this.activeGroupId && this.active) {
        this.showGroupLines(this.activeGroupId);
      }
    });
  },

  showGroupLines(groupId) {
    if (!this.svgEl) return;
    this.svgEl.innerHTML = '';
    this.svgEl.style.display = 'block';

    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;

    const ch = (typeof Concordance !== 'undefined') ? Concordance.currentChapter : 0;
    const chapterWords = group.words.filter(w => w.ch === ch);
    if (chapterWords.length === 0) return;

    // Find all grouped word elements
    const wordEls = document.querySelectorAll(`.word.grouped-word[data-group-id="${groupId}"]`);
    if (wordEls.length === 0) return;

    // Create or find the group label element
    let labelEl = document.getElementById(`gp-label-${groupId}`);
    if (!labelEl) {
      labelEl = document.createElement('div');
      labelEl.id = `gp-label-${groupId}`;
      labelEl.className = 'gp-floating-label';
      labelEl.style.borderColor = group.color;
      labelEl.style.color = group.color;
      labelEl.textContent = group.name;
      labelEl.style.pointerEvents = 'auto';
      document.body.appendChild(labelEl);

      // Make draggable
      this.makeDraggable(labelEl, groupId);
    }

    // Position label in the right margin, not overlapping text
    const panelRect = document.getElementById('readingPanel')?.getBoundingClientRect();
    if (!panelRect) return;

    let sumY = 0;
    const wordRects = [];
    wordEls.forEach(el => {
      const r = el.getBoundingClientRect();
      wordRects.push(r);
      sumY += r.top + r.height / 2;
    });
    const avgY = sumY / wordRects.length;

    // Only set position if user hasn't manually dragged it
    if (!labelEl.dataset.dragged) {
      // Place in the right margin area (between text and concordance panel)
      const rightMarginX = panelRect.right - 20;
      const clampedY = Math.max(panelRect.top + 10, Math.min(avgY - 12, panelRect.bottom - 40));
      labelEl.style.position = 'fixed';
      labelEl.style.left = rightMarginX + 'px';
      labelEl.style.top = clampedY + 'px';
    }
    labelEl.style.display = 'block';

    // Draw lines from each word to the label
    const labelRect = labelEl.getBoundingClientRect();
    const labelCenterX = labelRect.left;
    const labelCenterY = labelRect.top + labelRect.height / 2;

    this.svgEl.setAttribute('width', window.innerWidth);
    this.svgEl.setAttribute('height', window.innerHeight);

    for (const wr of wordRects) {
      const x1 = wr.right + 2;
      const y1 = wr.top + wr.height / 2;
      const x2 = labelCenterX;
      const y2 = labelCenterY;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      // Curved line
      const midX = (x1 + x2) / 2 + 20;
      line.setAttribute('d', `M${x1},${y1} Q${midX},${y1} ${x2},${y2}`);
      line.setAttribute('stroke', group.color);
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('fill', 'none');
      line.setAttribute('opacity', '0.5');
      line.setAttribute('stroke-dasharray', '4,3');
      this.svgEl.appendChild(line);

      // Small dot at word end
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x1);
      dot.setAttribute('cy', y1);
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', group.color);
      dot.setAttribute('opacity', '0.7');
      this.svgEl.appendChild(dot);
    }
  },

  hideSvgLines() {
    if (this.svgEl) {
      this.svgEl.innerHTML = '';
      this.svgEl.style.display = 'none';
    }
    // Remove floating labels
    document.querySelectorAll('.gp-floating-label').forEach(el => el.remove());
  },

  showAllGroups() {
    const ch = (typeof Concordance !== 'undefined') ? Concordance.currentChapter : 0;
    this.clearGroupHighlights();

    // Highlight all groups' words
    for (const g of this.groups) {
      const chWords = g.words.filter(w => w.ch === ch);
      if (chWords.length === 0) continue;

      document.querySelectorAll('.word').forEach(el => {
        const verse = el.closest('.verse');
        if (!verse) return;
        const [, , vStr] = verse.id.split('-');
        const v = parseInt(vStr);
        for (const gw of chWords) {
          if (gw.v === v && el.textContent === gw.text) {
            el.classList.add('grouped-word');
            el.style.setProperty('--group-color', g.color);
            el.dataset.groupId = g.id;
          }
        }
      });
    }

    // Draw lines for all groups
    if (this.svgEl) this.svgEl.innerHTML = '';
    for (const g of this.groups) {
      this.showGroupLines(g.id);
    }
  },

  hideAllGroups() {
    this.clearGroupHighlights();
    this.hideSvgLines();
  },

  toggleVisibility() {
    const cb = document.getElementById('gpShowToggle');
    this.visible = cb ? cb.checked : !this.visible;
    if (this.visible) {
      if (this.activeGroupId) {
        this.highlightGroupWords(this.activeGroupId);
        this.showGroupLines(this.activeGroupId);
      }
    } else {
      this.clearGroupHighlights();
      this.hideSvgLines();
    }
  },

  jumpToGroupWord(groupId, wordIdx) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;
    const w = group.words[wordIdx];
    if (!w) return;

    if (typeof Concordance !== 'undefined') {
      Concordance.showChapter(w.ch);
      setTimeout(() => {
        Concordance.jumpToVerse(w.ch, w.v);
        this.highlightGroupWords(groupId);
        this.showGroupLines(groupId);
      }, 200);
    }
  },

  // ===== PERSISTENCE =====
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ groups: this.groups, nextId: this.nextId, colorIdx: this.colorIdx }));
    } catch (e) { console.warn('Could not save groups:', e); }
  },

  load() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.groups = parsed.groups || [];
        this.nextId = parsed.nextId || 1;
        this.colorIdx = parsed.colorIdx || 0;
      }
    } catch (e) { this.groups = []; }
  },

  // ===== DRAGGABLE LABELS =====
  makeDraggable(el, groupId) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    el.style.cursor = 'grab';

    const onStart = (x, y) => {
      isDragging = true;
      el.style.cursor = 'grabbing';
      startX = x;
      startY = y;
      startLeft = parseInt(el.style.left) || 0;
      startTop = parseInt(el.style.top) || 0;
    };
    const onMove = (x, y) => {
      if (!isDragging) return;
      el.style.left = (startLeft + (x - startX)) + 'px';
      el.style.top = (startTop + (y - startY)) + 'px';
      el.dataset.dragged = 'true';
      if (this.activeGroupId === groupId) this.redrawLines(groupId);
    };
    const onEnd = () => {
      if (isDragging) { isDragging = false; el.style.cursor = 'grab'; }
    };

    // Mouse
    el.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); onStart(e.clientX, e.clientY); });
    document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', onEnd);

    // Touch
    el.addEventListener('touchstart', (e) => { e.stopPropagation(); onStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    document.addEventListener('touchmove', (e) => { if (isDragging) onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    document.addEventListener('touchend', onEnd);
  },

  // Redraw just the SVG lines for a group (without repositioning the label)
  redrawLines(groupId) {
    if (!this.svgEl) return;
    this.svgEl.innerHTML = '';

    const group = this.groups.find(g => g.id === groupId);
    if (!group) return;

    const labelEl = document.getElementById(`gp-label-${groupId}`);
    if (!labelEl) return;

    const wordEls = document.querySelectorAll(`.word.grouped-word[data-group-id="${groupId}"]`);
    if (wordEls.length === 0) return;

    const labelRect = labelEl.getBoundingClientRect();
    const labelCenterX = labelRect.left;
    const labelCenterY = labelRect.top + labelRect.height / 2;

    this.svgEl.setAttribute('width', window.innerWidth);
    this.svgEl.setAttribute('height', window.innerHeight);
    this.svgEl.style.display = 'block';

    wordEls.forEach(el => {
      const wr = el.getBoundingClientRect();
      const x1 = wr.right + 2;
      const y1 = wr.top + wr.height / 2;
      const x2 = labelCenterX;
      const y2 = labelCenterY;

      const midX = (x1 + x2) / 2 + 20;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('d', `M${x1},${y1} Q${midX},${y1} ${x2},${y2}`);
      line.setAttribute('stroke', group.color);
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('fill', 'none');
      line.setAttribute('opacity', '0.5');
      line.setAttribute('stroke-dasharray', '4,3');
      this.svgEl.appendChild(line);

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x1);
      dot.setAttribute('cy', y1);
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', group.color);
      dot.setAttribute('opacity', '0.7');
      this.svgEl.appendChild(dot);
    });
  }
};
