// Concordance Module - extracted from concordance/app.js
// Enhanced with code word overlay and cross-reference support

const TOTAL_CHAPTERS = 66;
const COMMON_WORDS = new Set([
  'the','and','of','to','in','that','it','is','for','shall','his','he',
  'be','with','not','i','they','a','him','but','my','as','have','their',
  'them','all','was','will','her','she','we','me','are','ye','thy',
  'which','upon','from','thou','thee','hath','said','this','unto',
  'had','has','been','were','do','did','an','or','by',
  'on','at','no','so','if','up','when','who','how','also','than',
  'one','our','us','may','can','its','am','own','into','out','what'
]);

const Concordance = {
  data: {},
  index: {},
  currentChapter: 1,
  selectedWord: null,
  hideCommon: false,
  initialized: false,

  init() {
    if (this.initialized) return;
    this.data = (typeof ISAIAH_EMBEDDED_DATA !== 'undefined') ? ISAIAH_EMBEDDED_DATA : {};
    this.buildIndex();
    this.buildChapterNav();
    this.setupEvents();
    this.initialized = true;
  },

  buildIndex() {
    this.index = {};
    for (let ch = 1; ch <= TOTAL_CHAPTERS; ch++) {
      const chapter = this.data[String(ch)];
      if (!chapter) continue;
      for (const [vNum, text] of Object.entries(chapter)) {
        const words = this.extractWords(text);
        const seen = new Set();
        for (const w of words) {
          if (seen.has(w)) continue;
          seen.add(w);
          if (!this.index[w]) this.index[w] = [];
          this.index[w].push({ ch, v: parseInt(vNum), text });
        }
      }
    }
  },

  extractWords(text) {
    return text.toLowerCase().replace(/[^a-z'\-\s]/g, '').split(/\s+/)
      .map(w => w.replace(/^['\-]+|['\-]+$/g, '')).filter(w => w.length > 0);
  },

  normalizeWord(word) {
    return word.toLowerCase().replace(/[^a-z'\-]/g, '').replace(/^['\-]+|['\-]+$/g, '');
  },

  buildChapterNav() {
    const list = document.getElementById('chapterList');
    if (!list) return;
    list.innerHTML = '';
    for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
      const btn = document.createElement('button');
      btn.className = 'chapter-btn' + (i === 1 ? ' active' : '');
      btn.dataset.chapter = i;

      // Add rung color dot
      if (typeof getRungInfo === 'function') {
        const info = getRungInfo(i);
        if (info.color) {
          const dot = document.createElement('span');
          dot.className = 'rung-dot';
          dot.style.background = info.color;
          btn.appendChild(dot);
        }
      }

      const num = document.createTextNode(i);
      btn.appendChild(num);
      btn.addEventListener('click', () => this.showChapter(i));

      // Custom tooltip on hover (more visible than native title)
      btn.addEventListener('mouseenter', (e) => {
        let html = `<strong>Isaiah ${i}</strong>`;
        if (typeof getChiasmInfo === 'function') {
          const chi = getChiasmInfo(i);
          if (chi) html += `<div class="tip-chiasm">${chi.section}: ${chi.theme}</div>`;
        }
        if (typeof CHAPTER_HEADINGS !== 'undefined' && CHAPTER_HEADINGS[i]) {
          html += `<div class="tip-heading">${CHAPTER_HEADINGS[i]}</div>`;
        }
        if (typeof getChapterRungs === 'function') {
          const rungs = getChapterRungs(i);
          const all = [...rungs.primary, ...rungs.secondary];
          if (all.length > 0) {
            html += '<div class="tip-rungs">';
            for (const rNum of all) {
              const r = getRungById(rNum);
              if (r) html += `<span class="tip-rung" style="border-color:${r.color};color:${r.color}">${r.icon || ''} ${r.title}</span>`;
            }
            html += '</div>';
          }
        }
        this.showChapterTooltip(e.target, html);
      });
      btn.addEventListener('mouseleave', () => this.hideChapterTooltip());

      list.appendChild(btn);
    }
  },

  showChapter(num) {
    this.currentChapter = num;
    const title = document.getElementById('chapterTitle');
    if (title) title.textContent = `Isaiah ${num}`;

    // Chapter info: chiasm + rungs
    const infoBar = document.getElementById('rungBadge');
    if (infoBar && typeof getChapterRungs === 'function') {
      let html = '';

      // Chiastic structure
      if (typeof getChiasmInfo === 'function') {
        const chi = getChiasmInfo(num);
        if (chi) {
          const mirrorRange = chi.mirror.length > 1
            ? `Ch ${chi.mirror[0]}-${chi.mirror[chi.mirror.length - 1]}`
            : `Ch ${chi.mirror[0]}`;
          html += `<span class="chiasm-badge" title="Part ${chi.part} mirrors ${mirrorRange}: ${chi.mirrorTheme}">`;
          html += `<span class="chiasm-section">${chi.section}</span> `;
          html += `<span class="chiasm-theme">${chi.theme}</span>`;
          html += `</span> `;
        }
      }

      // Multi-rung badges (clickable to highlight keywords)
      const rungs = getChapterRungs(num);
      const allRungs = [...rungs.primary, ...rungs.secondary];
      for (const rNum of rungs.primary) {
        const r = getRungById(rNum);
        if (r) {
          html += `<span class="rung-badge rung-primary" style="background:${r.color}" data-rung="${rNum}" onclick="Concordance.highlightRungWords(${rNum})" title="Click to highlight ${r.title} words">${r.icon || ''} ${r.title}</span> `;
        }
      }
      for (const rNum of rungs.secondary) {
        const r = getRungById(rNum);
        if (r) {
          html += `<span class="rung-badge rung-secondary" style="border-color:${r.color};color:${r.color}" data-rung="${rNum}" onclick="Concordance.highlightRungWords(${rNum})" title="Click to highlight ${r.title} words">${r.icon || ''} ${r.title}</span> `;
        }
      }

      infoBar.innerHTML = html;
      infoBar.style.display = 'block';
    }

    // Update nav
    document.querySelectorAll('.chapter-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.chapter) === num);
    });
    const activeBtn = document.querySelector('.chapter-btn.active');
    if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest' });

    this.renderVerses(num);
    if (this.selectedWord) this.highlightWord(this.selectedWord);

    const panel = document.getElementById('readingPanel');
    if (panel) panel.scrollTop = 0;
  },

  renderVerses(chapterNum) {
    const container = document.getElementById('versesContainer');
    if (!container) return;
    container.innerHTML = '';

    const chapter = this.data[String(chapterNum)];
    if (!chapter) {
      container.innerHTML = '<p style="color:var(--text-muted);">Chapter not available.</p>';
      return;
    }

    const hasHighlighter = typeof Highlighter !== 'undefined' && Highlighter.initialized;

    const verseNums = Object.keys(chapter).map(Number).sort((a, b) => a - b);
    for (const vNum of verseNums) {
      const text = chapter[String(vNum)];
      const verseEl = document.createElement('div');
      verseEl.className = 'verse';
      verseEl.id = `v-${chapterNum}-${vNum}`;

      // Verse number (clickable for cross-refs)
      const numSpan = document.createElement('span');
      numSpan.className = 'verse-num';
      numSpan.textContent = vNum;
      numSpan.dataset.chapter = chapterNum;
      numSpan.dataset.verse = vNum;
      numSpan.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showCrossRefs(chapterNum, vNum);
      });
      verseEl.appendChild(numSpan);

      // Check for highlights on this verse
      const segments = hasHighlighter ? Highlighter.getSegments(chapterNum, vNum, text) : null;

      if (segments) {
        // Render with highlights baked in
        this.renderHighlightedVerse(verseEl, segments);
      } else {
        // Normal rendering (no highlights)
        this.renderPlainVerse(verseEl, text);
      }

      container.appendChild(verseEl);
    }
  },

  renderPlainVerse(verseEl, text) {
    const tokens = text.split(/(\s+)/);
    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        verseEl.appendChild(document.createTextNode(token));
        continue;
      }
      const match = token.match(/^([^a-zA-Z'\-]*)([a-zA-Z'\-]+)([^a-zA-Z'\-]*)$/);
      if (match) {
        if (match[1]) verseEl.appendChild(document.createTextNode(match[1]));
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.textContent = match[2];
        wordSpan.dataset.word = this.normalizeWord(match[2]);
        wordSpan.addEventListener('click', (e) => this.handleWordClick(e));
        // Apply decoder substitution if active
        if (typeof Decoder !== 'undefined' && Decoder.active) {
          Decoder.decorateWord(wordSpan);
        }
        verseEl.appendChild(wordSpan);
        if (match[3]) verseEl.appendChild(document.createTextNode(match[3]));
      } else {
        verseEl.appendChild(document.createTextNode(token));
      }
    }
  },

  renderHighlightedVerse(verseEl, segments) {
    // Each segment has { text, hl: { bgColor, ulColor, index } | null }
    // Supports BOTH highlight and underline on the same text
    for (const seg of segments) {
      if (seg.hl) {
        const hlSpan = document.createElement('span');
        hlSpan.dataset.hlIndex = seg.hl.index;

        // Build class and styles based on what's applied
        const classes = [];
        if (seg.hl.bgColor) {
          classes.push('hl-mark');
          hlSpan.style.setProperty('--hl-color', seg.hl.bgColor);
        }
        if (seg.hl.ulColor) {
          classes.push('ul-mark');
          hlSpan.style.setProperty('--ul-color', seg.hl.ulColor);
        }
        hlSpan.className = classes.join(' ');

        this.renderPlainVerse(hlSpan, seg.text);
        verseEl.appendChild(hlSpan);
      } else {
        this.renderPlainVerse(verseEl, seg.text);
      }
    }
  },

  handleWordClick(e) {
    // If highlighter is in highlight/underline mode with a color, highlight the clicked word
    if (typeof Highlighter !== 'undefined' && Highlighter.initialized) {
      if (Highlighter.activeColor && !Highlighter.erasing && Highlighter.mode !== 'concordance') {
        // Single-word highlight: find the word's position in the verse raw text
        const wordEl = e.target;
        const verse = wordEl.closest('.verse');
        if (verse) {
          const [, chStr, vStr] = verse.id.split('-');
          const ch = parseInt(chStr);
          const v = parseInt(vStr);
          const rawText = Highlighter.getVerseRawText(ch, v);
          if (rawText) {
            // Find this word's position in the raw text
            const wordText = wordEl.textContent;
            // Walk all text nodes to find position
            let offset = 0;
            const walker = document.createTreeWalker(verse, NodeFilter.SHOW_TEXT, {
              acceptNode(n) {
                if (n.parentElement.closest('.verse-num')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
              }
            });
            let found = false;
            let node;
            while ((node = walker.nextNode())) {
              if (node.parentElement === wordEl || node === wordEl) {
                // Found it — snap to word boundaries
                const snapped = Highlighter.snapToWordBounds(rawText, offset, offset + node.textContent.length);
                const verseKey = `${ch}:${v}`;
                if (!Highlighter.highlights[verseKey]) Highlighter.highlights[verseKey] = [];
                Highlighter.highlights[verseKey].push({
                  start: snapped.start,
                  end: snapped.end,
                  color: Highlighter.activeColor,
                  mode: Highlighter.mode,
                  colorKey: Highlighter.activeKey
                });
                Highlighter.save();
                Concordance.showChapter(ch);
                found = true;
                break;
              }
              offset += node.textContent.length;
            }
          }
        }
        return;
      }
      if (Highlighter.erasing) return;
    }
    const raw = e.target.dataset.word;
    if (!raw) return;
    if (this.hideCommon && COMMON_WORDS.has(raw)) {
      e.target.style.outline = '2px solid var(--text-muted)';
      setTimeout(() => e.target.style.outline = '', 300);
      return;
    }
    this.lookupWord(raw);
  },

  // Highlight all words in the current chapter that match a rung's keyword set
  highlightRungWords(rungNum) {
    if (typeof RUNG_KEYWORDS === 'undefined') return;
    const keywords = RUNG_KEYWORDS[rungNum];
    if (!keywords) return;
    const rung = getRungById(rungNum);
    if (!rung) return;

    // Clear previous rung highlights
    document.querySelectorAll('.word.rung-hl').forEach(el => {
      el.classList.remove('rung-hl');
      el.style.removeProperty('--rung-hl-color');
    });

    // Highlight matching words
    let count = 0;
    document.querySelectorAll('.word').forEach(el => {
      const w = el.dataset.word;
      if (w && keywords.includes(w)) {
        el.classList.add('rung-hl');
        el.style.setProperty('--rung-hl-color', rung.color);
        count++;
      }
    });

    // Show count in concordance panel
    const intro = document.getElementById('concordanceIntro');
    const resultsEl = document.getElementById('concordanceResults');
    const wordEl = document.getElementById('resultWord');
    const countEl = document.getElementById('resultCount');
    const listEl = document.getElementById('resultsList');

    if (intro) intro.style.display = 'none';
    if (resultsEl) { resultsEl.style.display = 'flex'; resultsEl.style.flexDirection = 'column'; }
    if (wordEl) wordEl.textContent = rung.title;
    if (countEl) countEl.textContent = `${count} words highlighted`;
    if (listEl) {
      listEl.innerHTML = `<div style="padding:0.8rem;font-size:0.85rem;line-height:1.6;">
        <p style="margin-bottom:0.5rem;"><strong>Rung ${rungNum}: ${rung.title}</strong> — ${rung.subtitle}</p>
        <p style="margin-bottom:0.5rem;color:var(--text-muted);">${rung.theme}</p>
        <p style="margin-bottom:0.5rem;"><strong>Keywords highlighted:</strong> ${keywords.join(', ')}</p>
        <p style="color:var(--text-muted);font-size:0.78rem;">Click another rung badge to switch, or click a word to do a concordance lookup.</p>
      </div>`;
    }
  },

  lookupWord(word) {
    word = this.normalizeWord(word);
    if (!word) return;
    this.selectedWord = word;
    this.highlightWord(word);
    this.showResults(word);

    // Check for code word
    if (typeof CodeOverlay !== 'undefined') {
      CodeOverlay.check(word);
    }
  },

  highlightWord(word) {
    document.querySelectorAll('.word.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.word').forEach(el => {
      if (el.dataset.word === word) el.classList.add('selected');
    });
  },

  showResults(word) {
    const results = this.index[word];
    const intro = document.getElementById('concordanceIntro');
    const resultsEl = document.getElementById('concordanceResults');
    const wordEl = document.getElementById('resultWord');
    const countEl = document.getElementById('resultCount');
    const listEl = document.getElementById('resultsList');

    if (intro) intro.style.display = 'none';
    if (resultsEl) { resultsEl.style.display = 'flex'; resultsEl.style.flexDirection = 'column'; }

    if (!results || results.length === 0) {
      if (wordEl) wordEl.textContent = `"${word}"`;
      if (countEl) countEl.textContent = '- not found';
      if (listEl) listEl.innerHTML = '<p style="padding:1rem;color:var(--text-muted);">No occurrences found.</p>';
      return;
    }

    if (wordEl) wordEl.textContent = `"${word}"`;
    if (countEl) countEl.textContent = `${results.length} verse${results.length !== 1 ? 's' : ''}`;

    const grouped = {};
    for (const r of results) {
      if (!grouped[r.ch]) grouped[r.ch] = [];
      grouped[r.ch].push(r);
    }

    if (listEl) {
      listEl.innerHTML = '';
      for (const ch of Object.keys(grouped).map(Number).sort((a, b) => a - b)) {
        const heading = document.createElement('div');
        heading.className = 'result-chapter-heading';
        heading.textContent = `Chapter ${ch}`;
        listEl.appendChild(heading);

        for (const r of grouped[ch]) {
          const item = document.createElement('div');
          item.className = 'result-item';
          item.addEventListener('click', () => this.jumpToVerse(r.ch, r.v));

          const ref = document.createElement('span');
          ref.className = 'result-ref';
          ref.textContent = `${r.ch}:${r.v}`;

          const text = document.createElement('span');
          text.className = 'result-text';
          text.innerHTML = this.highlightInText(r.text, word);

          item.appendChild(ref);
          item.appendChild(text);
          listEl.appendChild(item);
        }
      }
    }
    if (resultsEl) resultsEl.scrollTop = 0;
  },

  highlightInText(text, word) {
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const regex = new RegExp(`(\\b)(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(\\b)`, 'gi');
    return escaped.replace(regex, '$1<mark>$2</mark>$3');
  },

  jumpToVerse(chapter, verse) {
    if (this.currentChapter !== chapter) this.showChapter(chapter);
    requestAnimationFrame(() => {
      const el = document.getElementById(`v-${chapter}-${verse}`);
      if (el) {
        document.querySelectorAll('.verse.highlighted').forEach(v => v.classList.remove('highlighted'));
        el.classList.add('highlighted');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => el.classList.remove('highlighted'), 3000);
      }
      if (this.selectedWord) this.highlightWord(this.selectedWord);
    });
  },

  showCrossRefs(chapter, verse) {
    if (typeof CROSS_REFERENCES === 'undefined') return;
    const key = `${chapter}:${verse}`;
    const refs = CROSS_REFERENCES[key];
    const listEl = document.getElementById('resultsList');
    const intro = document.getElementById('concordanceIntro');
    const resultsEl = document.getElementById('concordanceResults');
    const wordEl = document.getElementById('resultWord');
    const countEl = document.getElementById('resultCount');

    if (intro) intro.style.display = 'none';
    if (resultsEl) { resultsEl.style.display = 'flex'; resultsEl.style.flexDirection = 'column'; }

    if (!refs || refs.length === 0) {
      if (wordEl) wordEl.textContent = `Isaiah ${key}`;
      if (countEl) countEl.textContent = '- no cross-references';
      if (listEl) listEl.innerHTML = '<p style="padding:1rem;color:var(--text-muted);">No cross-references for this verse.</p>';
      return;
    }

    if (wordEl) wordEl.textContent = `Isaiah ${key}`;
    if (countEl) countEl.textContent = `${refs.length} cross-reference${refs.length !== 1 ? 's' : ''}`;

    if (listEl) {
      listEl.innerHTML = '';
      // Group by source
      const sourceLabels = { bom: 'Book of Mormon', dc: 'Doctrine & Covenants', nt: 'New Testament', ot: 'Old Testament', pgp: 'Pearl of Great Price' };
      const grouped = {};
      for (const r of refs) {
        const src = r.source || 'ot';
        if (!grouped[src]) grouped[src] = [];
        grouped[src].push(r);
      }
      for (const [src, items] of Object.entries(grouped)) {
        const heading = document.createElement('div');
        heading.className = 'result-chapter-heading';
        heading.textContent = sourceLabels[src] || src;
        listEl.appendChild(heading);

        for (const r of items) {
          const item = document.createElement('div');
          item.className = 'result-item crossref-item';
          item.innerHTML = `<div class="crossref-ref">${r.ref}</div>` +
            (r.text ? `<div class="crossref-text">${r.text}</div>` : '') +
            (r.note ? `<div class="crossref-note">${r.note}</div>` : '');
          listEl.appendChild(item);
        }
      }
    }
    if (resultsEl) resultsEl.scrollTop = 0;
  },

  search(query) {
    const word = this.normalizeWord(query.trim());
    if (word) this.lookupWord(word);
  },

  setupEvents() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    const hideToggle = document.getElementById('hideCommonWords');

    if (searchBtn) searchBtn.addEventListener('click', () => this.search(searchInput?.value || ''));
    if (searchInput) searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.search(searchInput.value); });
    if (clearBtn) clearBtn.addEventListener('click', () => { if (searchInput) searchInput.value = ''; this.clearResults(); });
    if (hideToggle) hideToggle.addEventListener('change', (e) => { this.hideCommon = e.target.checked; });

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (TabRouter?.currentTab !== 'study') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.currentChapter < TOTAL_CHAPTERS) this.showChapter(this.currentChapter + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.currentChapter > 1) this.showChapter(this.currentChapter - 1);
      }
    });
  },

  clearResults() {
    this.selectedWord = null;
    document.querySelectorAll('.word.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.verse.highlighted').forEach(el => el.classList.remove('highlighted'));
    const intro = document.getElementById('concordanceIntro');
    const results = document.getElementById('concordanceResults');
    if (intro) intro.style.display = 'block';
    if (results) results.style.display = 'none';
    if (typeof CodeOverlay !== 'undefined') CodeOverlay.hide();
  },

  // Custom chapter tooltip
  showChapterTooltip(anchor, html) {
    let tip = document.getElementById('chapterTooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'chapterTooltip';
      tip.className = 'chapter-tooltip';
      document.body.appendChild(tip);
    }
    tip.innerHTML = html;
    tip.style.display = 'block';
    // Position: to the right of the sidebar, vertically aligned with button
    const rect = anchor.getBoundingClientRect();
    const navEl = document.querySelector('.chapter-nav');
    const navRight = navEl ? navEl.getBoundingClientRect().right : rect.right;
    // Clamp vertical position to stay on screen
    const top = Math.min(Math.max(60, rect.top - 10), window.innerHeight - 200);
    tip.style.top = top + 'px';
    tip.style.left = (navRight + 6) + 'px';
  },

  hideChapterTooltip() {
    const tip = document.getElementById('chapterTooltip');
    if (tip) tip.style.display = 'none';
  }
};
