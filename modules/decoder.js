// Decoder Module — substitute code words in scripture text with decoded meanings
// e.g., "Judah" → "Utah", "Babylon" → "worldliness"
// Users can add/edit custom substitutions beyond Gileadi's defaults

const Decoder = {
  STORAGE_KEY: 'isaiah_custom_decoder',
  DISABLED_KEY: 'isaiah_disabled_codewords',
  active: false,         // true when decode mode is on
  customWords: {},       // user-defined: { "judah": "Utah", ... }
  disabledWords: {},     // words turned off: { "arm": true, ... }
  builtinWords: {},      // from CODE_WORDS data (built on init)
  initialized: false,

  init() {
    if (this.initialized) return;
    this.loadCustom();
    this.loadDisabled();
    this.buildBuiltinMap();
    this.initialized = true;
  },

  // Build a simple word → substitution map from CODE_WORDS
  // Only includes primary code words, not common English words
  buildBuiltinMap() {
    if (typeof CODE_WORDS === 'undefined') return;
    // Skip common English words that happen to be in term names
    const skip = new Set(['the','of','in','and','a','an','too','short','from','east','fat','things','upon','many','sure','one','prey','hand','out','that']);

    // Direct mapping: key word → short decoded meaning
    // Sources: Gileadi, D&C 113, Book of Mormon, NT, Joseph Smith teachings
    const directMap = {
      // === D&C 113 DEFINITIONS (Isaiah 11) ===
      'stem': 'Christ (D&C 113:1-2)',
      'rod': 'a servant holding authority, descendant of Jesse & Ephraim (D&C 113:3-4)',
      'root': 'a descendant of Jesse & Joseph with priesthood keys (D&C 113:5-6)',
      'jesse': 'the royal/covenant lineage of Christ (D&C 113:1-6)',

      // === PLACES (Gileadi + latter-day) ===
      'babylon': 'worldly system / spiritual captivity',
      'babel': 'worldly system / spiritual captivity',
      'assyria': 'end-time military superpower',
      'assyrian': 'end-time military superpower',
      'zion': 'covenant people / pure in heart',
      'jerusalem': 'Salt Lake City',
      'judah': 'Utah',
      'ephraim': 'wayward covenant people',
      'egypt': 'worldly power / false security',
      'edom': 'those who sold their birthright',
      'moab': 'people near the covenant but outside it',
      'ariel': 'Jerusalem / altar hearth of God',
      'sinim': 'distant lands (possibly China) — the worldwide gathering',
      'tarshish': 'distant commercial/maritime nations',
      'lebanon': 'the temple / glory / beauty',
      'carmel': 'fruitful land / covenant abundance',
      'sharon': 'fruitful plain / covenant blessings',

      // === PEOPLE & ROLES ===
      'servant': 'end-time agent of God',
      'branch': 'messianic / Davidic king (Jer 23:5; Zech 3:8)',
      'nursing': 'Gentile kings/queens who nurture Israel',
      'watchman': 'prophets / seers',
      'watchmen': 'prophets / seers',
      'seraphim': 'burning ones / divine agents',
      'seraphims': 'burning ones / divine agents',
      'remnant': 'faithful survivors who return',
      'lion': 'powerful entity / the Lord defending Zion',
      'lamb': 'Christ / meekness / sacrifice',
      'eagle': 'divine renewal / seraph-level strength',
      'eagles': 'divine renewal / seraph-level strength',
      'cyrus': 'God\'s anointed deliverer (type of end-time servant)',
      'eliakim': 'faithful steward given the key (Isa 22:20-25)',
      'shebna': 'unfaithful steward replaced (Isa 22:15-19)',
      'immanuel': 'God with us — Christ',

      // === OBJECTS & SYMBOLS ===
      'ensign': 'rallying point / restored gospel / standard to the nations',
      'banner': 'rallying point / restored gospel',
      'standard': 'rallying point / restored gospel',
      'cornerstone': 'Christ / foundation of Zion (1 Pet 2:6)',
      'rock': 'Christ / foundation / refuge (1 Cor 10:4)',
      'furnace': 'refining through affliction',
      'garments': 'covenants / righteousness',
      'sword': 'divine word / judgment (Heb 4:12)',
      'nail': 'servant fastened by God',
      'key': 'priesthood authority (D&C 113:5-6; Rev 3:7)',
      'crown': 'authority / rulership / covenant honor',
      'throne': 'God\'s seat of authority',
      'trumpet': 'prophetic warning / gathering call',
      'sackcloth': 'mourning / repentance',
      'cup': 'God\'s wrath poured out',

      // === NATURE SYMBOLS ===
      'vineyard': 'house of Israel (Isa 5:7)',
      'vine': 'covenant people',
      'cedar': 'proud leaders brought low',
      'cedars': 'proud leaders brought low',
      'oak': 'prominent individuals',
      'oaks': 'prominent individuals',
      'briers': 'wickedness / cursed conditions',
      'thorns': 'wickedness / cursed conditions',
      'chaff': 'the wicked — scattered by judgment',
      'stubble': 'the wicked — consumed by fire',
      'dross': 'sin / impurity to be refined away',
      'grass': 'mortal life / transience',
      'flower': 'mortal life / transience',

      // === CONCEPTS ===
      'mountain': 'nation / government / seat of power',
      'mountains': 'nations / governments',
      'hills': 'lesser nations / subordinate powers',
      'islands': 'distant nations / Americas',
      'isles': 'distant nations / Americas',
      'highway': 'covenant path of return',
      'wilderness': 'exile / testing / place of transformation',
      'desert': 'exile / barrenness / but also transformation',
      'darkness': 'apostasy / spiritual blindness',
      'light': 'truth / Christ / revelation',
      'fire': 'purification / judgment / God\'s presence',
      'arm': 'God\'s servant / covenant power (Isa 53:1)',
      'feast': 'millennial blessings / gospel fullness (Isa 25:6)',
      'waters': 'peoples / armies OR revelation / blessings (context)',
      'floods': 'invading armies',
      'rain': 'revelation / God\'s word descending',
      'dew': 'revelation / covenant blessings',
      'leviathan': 'Satan / anti-God forces (Isa 27:1)',

      // === D&C / JOSEPH SMITH ADDITIONS ===
      'sealed': 'hidden testimony preserved for future (Isa 29:11; D&C 113)',
      'book': 'the Book of Mormon (Isa 29:11-12; 2 Ne 27)',
      'learned': 'Professor Charles Anthon (Isa 29:11-12; JS-H 1:63-65)',
      'marvelous': 'the Restoration (Isa 29:14; 2 Ne 25:17)',

      // === BOOK OF MORMON ADDITIONS ===
      'gentiles': 'latter-day covenant nations / us',
      'promised': 'the Americas / covenant land (1 Ne 13)',
      'gathering': 'the return of scattered Israel to Zion'
    };

    // 1. Load the manual overrides first (D&C 113, etc.)
    for (const [word, meaning] of Object.entries(directMap)) {
      if (!skip.has(word)) {
        this.builtinWords[word] = meaning;
      }
    }

    // 2. Auto-populate from ALL CODE_WORDS entries (Gileadi's full dictionary)
    // Only adds words NOT already in directMap (so D&C 113 overrides stay)
    if (typeof CODE_WORDS !== 'undefined') {
      for (const [key, entry] of Object.entries(CODE_WORDS)) {
        // Get a short decoded phrase
        let decoded = entry.decoded.split('—')[0].trim();
        if (decoded.length > 60) decoded = decoded.split(',')[0].trim();
        if (decoded.length > 60) decoded = decoded.substring(0, 57) + '...';

        // Add the dictionary key itself
        const primaryWord = key.replace(/-/g, '');
        if (primaryWord.length > 2 && !skip.has(primaryWord) && !this.builtinWords[primaryWord]) {
          this.builtinWords[primaryWord] = decoded;
        }

        // Also extract individual meaningful words from the term name
        const termWords = entry.term.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
        for (const tw of termWords) {
          if (tw.length > 3 && !skip.has(tw) && !this.builtinWords[tw]) {
            this.builtinWords[tw] = decoded;
          }
        }
      }
    }
  },

  // Get the substitution for a word (custom takes priority over builtin)
  getSubstitution(word) {
    const normalized = word.toLowerCase().replace(/[^a-z]/g, '');
    if (this.disabledWords[normalized]) return null; // disabled by user
    if (this.customWords[normalized]) return this.customWords[normalized];
    if (this.builtinWords[normalized]) return this.builtinWords[normalized];
    return null;
  },

  toggleWord(key) {
    if (this.disabledWords[key]) {
      delete this.disabledWords[key];
    } else {
      this.disabledWords[key] = true;
    }
    this.saveDisabled();
    // Re-render if decode is active
    if (this.active && typeof Concordance !== 'undefined') {
      Concordance.showChapter(Concordance.currentChapter);
    }
  },

  saveDisabled() {
    try { localStorage.setItem(this.DISABLED_KEY, JSON.stringify(this.disabledWords)); } catch(e) {}
  },

  loadDisabled() {
    try {
      const data = localStorage.getItem(this.DISABLED_KEY);
      if (data) this.disabledWords = JSON.parse(data);
    } catch(e) { this.disabledWords = {}; }
  },

  // Toggle decode mode on/off
  toggle() {
    this.active = !this.active;
    // Update desktop button
    const btn = document.getElementById('decodeToggle');
    if (btn) btn.classList.toggle('active', this.active);
    // Update mobile button
    const mobBtn = document.getElementById('mobDecodeBtn');
    if (mobBtn) {
      mobBtn.style.background = this.active ? '#ff6f00' : '';
      mobBtn.style.color = this.active ? '#fff' : '';
    }
    // Re-render current chapter
    if (typeof Concordance !== 'undefined') {
      Concordance.showChapter(Concordance.currentChapter);
    }
  },

  // Show code words found in the current chapter — called from Code Words tab
  showChapterCodeWords() {
    const chapterNum = (typeof Concordance !== 'undefined') ? Concordance.currentChapter : 1;
    if (typeof ISAIAH_EMBEDDED_DATA === 'undefined') return;

    const chapter = ISAIAH_EMBEDDED_DATA[String(chapterNum)];
    if (!chapter) return;

    const allText = Object.values(chapter).join(' ').toLowerCase();
    const wordsInChapter = new Set(allText.replace(/[^a-z'\-\s]/g, '').split(/\s+/).filter(w => w.length > 2));

    const found = [];
    const allSubs = { ...this.builtinWords, ...this.customWords };
    for (const [word, decoded] of Object.entries(allSubs)) {
      if (this.disabledWords[word]) continue;
      if (wordsInChapter.has(word)) {
        const entry = this.findCodeEntry(word);
        found.push({ word, decoded, entry });
      }
    }

    found.sort((a, b) => a.word.localeCompare(b.word));

    const container = document.getElementById('sidebarCodeWordsContent') || document.getElementById('codeWordsTabContent');
    if (!container) return;

    let html = `<div style="padding:0.6rem 0.8rem;">
      <h3 style="font-family:-apple-system,sans-serif;font-size:0.95rem;color:var(--accent);margin-bottom:0.3rem;">Code Words in Isaiah ${chapterNum}</h3>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.6rem;line-height:1.5;">These words in this chapter have deeper symbolic meanings. Tap any to look up its concordance across all of Isaiah.</p>`;

    if (found.length === 0) {
      html += '<p style="color:var(--text-muted);font-size:0.82rem;">No code words found in this chapter.</p>';
    } else {
      for (const f of found) {
        html += `<div class="decode-suggestion" onclick="switchSidebarTab('concordance');Concordance.lookupWord('${f.word}')">`;
        html += `<span class="ds-word">${f.word}</span>`;
        html += `<span class="ds-arrow">&rarr;</span>`;
        html += `<span class="ds-decoded">${f.decoded}</span>`;
        if (f.entry && f.entry.keyVerses) {
          html += `<span class="ds-count">${f.entry.keyVerses.length} key verses</span>`;
        }
        html += '</div>';
      }
    }

    html += `<div style="margin-top:0.8rem;padding-top:0.6rem;border-top:1px solid var(--border);">
      <button onclick="Decoder.renderTab(this.closest('.sidebar-panel-content')?.querySelector('[id]')?.id || 'sidebarCodeWordsContent')" style="font-family:-apple-system,sans-serif;font-size:0.78rem;padding:0.35rem 0.7rem;border:1px solid var(--accent);border-radius:5px;background:none;color:var(--accent);cursor:pointer;">Show Full Dictionary (${Object.keys({...Decoder.builtinWords,...Decoder.customWords}).length} words)</button>
    </div>`;
    html += '</div>';
    container.innerHTML = html;
  },

  // Called by concordance renderPlainVerse — wraps decoded words with tooltip
  decorateWord(wordSpan) {
    if (!this.active) return;
    const word = wordSpan.dataset.word;
    if (!word) return;
    const sub = this.getSubstitution(word);
    if (!sub) return;

    // Show decoded text, keep original in tooltip
    const original = wordSpan.textContent;
    wordSpan.textContent = sub;
    wordSpan.classList.add('decoded-word');
    wordSpan.title = `Original: ${original}`;
    wordSpan.dataset.original = original;
  },

  // ===== CUSTOM WORD MANAGEMENT =====
  addCustomWord(original, decoded) {
    const key = original.toLowerCase().replace(/[^a-z]/g, '');
    if (!key || !decoded.trim()) return;
    this.customWords[key] = decoded.trim();
    this.saveCustom();
  },

  removeCustomWord(key) {
    delete this.customWords[key];
    this.saveCustom();
  },

  // ===== MANAGEMENT TAB RENDERING =====
  renderTab(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Merge builtin + custom for display
    const allWords = {};
    for (const [k, v] of Object.entries(this.builtinWords)) {
      allWords[k] = { decoded: v, source: 'gileadi' };
    }
    for (const [k, v] of Object.entries(this.customWords)) {
      allWords[k] = { decoded: v, source: 'custom' };
    }

    const sorted = Object.entries(allWords).sort((a, b) => a[0].localeCompare(b[0]));

    let html = `<div class="decoder-tab-content">
      <div class="dt-header">
        <h3>Code Word Substitutions</h3>
        <p>When Decode mode is on, these words are replaced in the text. Custom entries override Gileadi defaults.</p>
        <label class="dt-toggle">
          <input type="checkbox" id="dtToggle" ${this.active ? 'checked' : ''} onchange="Decoder.toggle()">
          <span>Decode mode ${this.active ? 'ON' : 'OFF'}</span>
        </label>
      </div>
      <div class="dt-add">
        <input type="text" id="dtOriginal" placeholder="Original word..." class="dt-input">
        <input type="text" id="dtDecoded" placeholder="Shows as..." class="dt-input">
        <button onclick="Decoder.addFromUI()" class="dt-add-btn">+ Add</button>
      </div>
      <div class="dt-filter">
        <input type="text" id="dtFilter" placeholder="Filter..." class="dt-input dt-filter-input" oninput="Decoder.filterList()">
        <span class="dt-count">${sorted.length} entries</span>
      </div>
      <div class="dt-list" id="dtList">`;

    for (const [key, info] of sorted) {
      const isCustom = info.source === 'custom';
      // Find the full CODE_WORDS entry for proof scriptures
      const codeEntry = this.findCodeEntry(key);

      const isDisabled = this.disabledWords[key];
      html += `<div class="dt-entry-wrap ${isDisabled ? 'dt-disabled' : ''}" data-key="${key}">
        <div class="dt-entry" onclick="this.parentElement.classList.toggle('expanded')">
          <input type="checkbox" class="dt-check" ${isDisabled ? '' : 'checked'} onclick="event.stopPropagation();Decoder.toggleWord('${key}')" title="Enable/disable in decode mode">
          <span class="dt-original">${key}</span>
          <span class="dt-arrow">→</span>
          <span class="dt-decoded ${isCustom ? 'dt-custom' : ''}">${info.decoded}</span>
          ${isCustom
            ? `<button class="dt-edit" onclick="event.stopPropagation();Decoder.editFromUI('${key}')" title="Edit">&#9998;</button><button class="dt-del" onclick="event.stopPropagation();Decoder.removeAndRefresh('${key}')" title="Remove">&times;</button>`
            : `<button class="dt-override" onclick="event.stopPropagation();Decoder.overrideFromUI('${key}','${info.decoded.replace(/'/g, "\\'")}')" title="Override with custom">&#9998;</button>`
          }
          <span class="dt-source-tag ${isCustom ? 'dt-tag-custom' : 'dt-tag-gileadi'}">${isCustom ? 'Custom' : 'Gileadi'}</span>
          ${codeEntry ? '<span class="dt-expand-icon">+</span>' : ''}
        </div>
        ${codeEntry ? this.renderProofScriptures(codeEntry) : ''}
      </div>`;
    }

    html += '</div></div>';
    container.innerHTML = html;

    // Enter key adds word
    setTimeout(() => {
      const decoded = document.getElementById('dtDecoded');
      if (decoded) decoded.addEventListener('keydown', (e) => { if (e.key === 'Enter') Decoder.addFromUI(); });
    }, 50);
  },

  addFromUI() {
    const orig = document.getElementById('dtOriginal');
    const dec = document.getElementById('dtDecoded');
    if (!orig?.value || !dec?.value) return;
    this.addCustomWord(orig.value, dec.value);
    orig.value = '';
    dec.value = '';
    this.renderTab('codeWordsTabContent');
    if (this.active && typeof Concordance !== 'undefined') {
      Concordance.showChapter(Concordance.currentChapter);
    }
  },

  editFromUI(key) {
    const newVal = prompt(`Change "${key}" substitution to:`, this.customWords[key] || '');
    if (newVal !== null && newVal.trim()) {
      this.customWords[key] = newVal.trim();
      this.saveCustom();
      this.renderTab('codeWordsTabContent');
      if (this.active && typeof Concordance !== 'undefined') {
        Concordance.showChapter(Concordance.currentChapter);
      }
    }
  },

  overrideFromUI(key, currentVal) {
    const newVal = prompt(`Override "${key}" (currently "${currentVal}") with:`, currentVal);
    if (newVal !== null && newVal.trim()) {
      this.customWords[key] = newVal.trim();
      this.saveCustom();
      this.renderTab('codeWordsTabContent');
      if (this.active && typeof Concordance !== 'undefined') {
        Concordance.showChapter(Concordance.currentChapter);
      }
    }
  },

  removeAndRefresh(key) {
    this.removeCustomWord(key);
    this.renderTab('codeWordsTabContent');
    if (this.active && typeof Concordance !== 'undefined') {
      Concordance.showChapter(Concordance.currentChapter);
    }
  },

  // Find the CODE_WORDS entry that matches a key
  findCodeEntry(key) {
    if (typeof CODE_WORDS === 'undefined') return null;
    // Direct match
    if (CODE_WORDS[key]) return CODE_WORDS[key];
    // Search by matching term words
    for (const [k, entry] of Object.entries(CODE_WORDS)) {
      const termWords = entry.term.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
      if (termWords.includes(key)) return entry;
    }
    return null;
  },

  // Render expandable proof scriptures section
  renderProofScriptures(entry) {
    const verses = entry.keyVerses || [];
    const crossRefs = entry.crossRefs || [];
    if (verses.length === 0 && crossRefs.length === 0) return '';

    let html = '<div class="dt-proof">';
    html += `<div class="dt-proof-header"><strong>${entry.term}</strong></div>`;
    html += `<div class="dt-proof-decoded">${entry.decoded}</div>`;

    if (entry.gileadi) {
      html += '<div class="dt-proof-gileadi">Gileadi typological interpretation</div>';
    }

    // Isaiah proof verses with full text
    if (verses.length > 0) {
      html += '<div class="dt-proof-section"><h4>Proof Scriptures in Isaiah</h4>';
      for (const ref of verses) {
        const parts = ref.split(':');
        const ch = parseInt(parts[0]);
        const v = parts[1] ? parseInt(parts[1].split('-')[0]) : null;
        let verseText = '';
        if (v && typeof ISAIAH_EMBEDDED_DATA !== 'undefined') {
          verseText = ISAIAH_EMBEDDED_DATA[String(ch)]?.[String(v)] || '';
        }
        html += `<div class="dt-proof-verse">
          <a href="#study/ch/${ch}${v ? '/v/' + v : ''}" class="dt-proof-ref">Isaiah ${ref}</a>
          ${verseText ? `<div class="dt-proof-text">${verseText}</div>` : ''}
        </div>`;
      }
      html += '</div>';
    }

    // Cross-references from other books
    if (crossRefs.length > 0) {
      html += '<div class="dt-proof-section"><h4>Cross-References</h4>';
      for (const ref of crossRefs) {
        html += `<div class="dt-proof-verse">
          <span class="dt-proof-ref">${ref}</span>
        </div>`;
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  },

  filterList() {
    const q = document.getElementById('dtFilter')?.value.toLowerCase() || '';
    document.querySelectorAll('.dt-entry').forEach(el => {
      const key = el.dataset.key;
      const decoded = el.querySelector('.dt-decoded')?.textContent.toLowerCase() || '';
      el.style.display = (key.includes(q) || decoded.includes(q)) ? 'flex' : 'none';
    });
  },

  // ===== PERSISTENCE =====
  saveCustom() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.customWords));
    } catch (e) {}
  },

  loadCustom() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) this.customWords = JSON.parse(data);
    } catch (e) { this.customWords = {}; }
  }
};
