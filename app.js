// Isaiah Decoded - Main App Controller

const tabInitialized = {};

document.addEventListener('DOMContentLoaded', () => {
  setupDarkMode();
  setupTabButtons();

  // Register tab callbacks
  TabRouter.onTabChange('start', initStartTab);
  TabRouter.onTabChange('study', initStudyTab);
  TabRouter.onTabChange('keys', initKeysTab);
  TabRouter.onTabChange('ascent', initAscentTab);
  TabRouter.onTabChange('deep', initDeepTab);
  TabRouter.onTabChange('codewords', initCodeWordsTab);

  setupSidebarResize();
  TabRouter.init();
});

function setupTabButtons() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      TabRouter.navigate(btn.dataset.tab);
    });
  });
}

function setupDarkMode() {
  const btn = document.getElementById('darkModeBtn');
  if (localStorage.getItem('isaiah_dark_mode') === '1') {
    document.body.classList.add('dark-mode');
    btn.textContent = '\u2600';
  }
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    btn.textContent = isDark ? '\u2600' : '\u263E';
    localStorage.setItem('isaiah_dark_mode', isDark ? '1' : '0');
  });
}

// ===== TAB INITIALIZERS =====

function initStartTab(state) {
  if (!tabInitialized.start) {
    LadderViz.render('ladderContainer');
    tabInitialized.start = true;
  }
}

function initStudyTab(state) {
  if (!tabInitialized.study) {
    Concordance.init();
    Highlighter.init();
    Grouper.init();
    Decoder.init();
    Grouper.renderPanel();
    Decoder.renderTab('sidebarCodeWordsContent');
    Concordance.showChapter(1);
    tabInitialized.study = true;
  }

  // Handle deep links: #study/ch/48/v/10
  if (state.section === 'ch' && state.param) {
    const ch = parseInt(state.param);
    if (ch >= 1 && ch <= 66) {
      Concordance.showChapter(ch);
      if (state.extra) {
        const v = parseInt(state.extra);
        setTimeout(() => Concordance.jumpToVerse(ch, v), 200);
      }
    }
  } else if (state.section === 'word' && state.param) {
    Concordance.lookupWord(state.param);
  }
}

function initKeysTab(state) {
  if (!tabInitialized.keys) {
    StudyRenderer.renderMasterKey('keys-master');
    renderHowToReadIsaiah('keys-howto');
    StudyRenderer.renderKingsQueens('keys-kings');
    StudyRenderer.renderDecoder('keys-decoder');
    renderMyKeysAndNotes('keys-mynotes');
    tabInitialized.keys = true;
  }

  // Handle sub-sections: #keys/master, #keys/kings, #keys/decoder
  if (state.section) {
    showKeysSection(state.section);
  }
}

function initAscentTab(state) {
  if (!tabInitialized.ascent) {
    AscentViz.render('ascentContainer');
    tabInitialized.ascent = true;
  }
}

function initDeepTab(state) {
  if (!tabInitialized.deep) {
    StudyRenderer.render('studiesContainer');
    tabInitialized.deep = true;
  }

  // Handle deep links: #deep/servants
  if (state.section) {
    const el = document.getElementById('study-' + state.section);
    if (el) {
      el.querySelector('.study-header')?.click();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function initCodeWordsTab(state) {
  if (typeof Decoder !== 'undefined') {
    Decoder.renderTab('codeWordsTabContent');
    Decoder.renderTab('sidebarCodeWordsContent');
  }
}

// ===== KEYS SUB-NAVIGATION =====

function showKeysSection(section) {
  document.querySelectorAll('.keys-section').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.keys-btn').forEach(btn => btn.classList.remove('active'));

  const sectionEl = document.getElementById('keys-' + section);
  const btnEl = document.querySelector(`.keys-btn[data-section="${section}"]`);
  if (sectionEl) sectionEl.style.display = 'block';
  if (btnEl) btnEl.classList.add('active');
}

// ===== SIDEBAR TAB SWITCHING =====

// ===== MOBILE BOTTOM SHEET =====

const MobileSheet = {
  state: 'collapsed', // 'collapsed' | 'half' | 'full'
  touchStartY: 0,
  touchCurrentY: 0,
  dragging: false,
  toolbarOpen: false,

  lastScrollY: 0,

  init() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    this.setupSwipe();
    this.setupAutoHide();
  },

  // Hide bottom bar on scroll down, show on scroll up
  setupAutoHide() {
    const readingPanel = document.getElementById('readingPanel');
    if (!readingPanel) return;
    readingPanel.addEventListener('scroll', () => {
      if (this.state !== 'collapsed') return; // only auto-hide when panel is collapsed
      const bar = document.getElementById('mobileBottomBar');
      if (!bar) return;
      const currentY = readingPanel.scrollTop;
      if (currentY > this.lastScrollY + 10) {
        // Scrolling down — hide bar
        bar.style.transform = 'translateY(100%)';
      } else if (currentY < this.lastScrollY - 10) {
        // Scrolling up — show bar
        bar.style.transform = 'translateY(0)';
      }
      this.lastScrollY = currentY;
    });
  },

  checkMobile() {
    const bar = document.getElementById('mobileBottomBar');
    const panel = document.getElementById('concordancePanelAside');
    if (!bar) return;
    if (window.innerWidth <= 850) {
      bar.style.display = 'flex';
      if (this.state === 'collapsed') {
        panel.classList.remove('mobile-open', 'mobile-full');
      }
    } else {
      bar.style.display = 'none';
      panel.classList.remove('mobile-open', 'mobile-full');
      this.state = 'collapsed';
    }
  },

  snapTo(target) {
    const panel = document.getElementById('concordancePanelAside');
    const bar = document.getElementById('mobileBottomBar');
    if (!panel) return;

    panel.style.transition = 'transform 0.3s ease, height 0.3s ease';

    const closeBtn = document.getElementById('mobFloatingClose');

    if (target === 'collapsed') {
      panel.classList.remove('mobile-open', 'mobile-full');
      bar.style.display = 'flex';
      bar.style.transform = 'translateY(0)';
      if (closeBtn) closeBtn.style.display = 'none';
      this.state = 'collapsed';
    } else if (target === 'half') {
      panel.classList.add('mobile-open');
      panel.classList.remove('mobile-full');
      bar.style.display = 'none';
      if (closeBtn) { closeBtn.style.display = 'flex'; closeBtn.style.top = 'calc(45vh - 52px)'; }
      this.state = 'half';
    } else if (target === 'full') {
      panel.classList.add('mobile-open', 'mobile-full');
      bar.style.display = 'none';
      if (closeBtn) { closeBtn.style.display = 'flex'; closeBtn.style.top = '138px'; }
      this.state = 'full';
    }

    setTimeout(() => { panel.style.transition = ''; }, 350);
  },

  cycle() {
    if (this.state === 'collapsed') this.snapTo('half');
    else if (this.state === 'half') this.snapTo('full');
    else this.snapTo('collapsed');
  },

  // Swipe gesture on drag handle AND sidebar tabs
  setupSwipe() {
    const handle = document.getElementById('mobDragHandle');
    const panel = document.getElementById('concordancePanelAside');
    if (!handle || !panel) return;

    // Attach swipe to both the handle and the tabs bar
    const swipeTargets = [handle, panel.querySelector('.sidebar-tabs')].filter(Boolean);

    const onStart = (y) => { this.touchStartY = y; this.touchCurrentY = y; this.dragging = true; };
    const onMove = (y) => { if (this.dragging) this.touchCurrentY = y; };
    const onEnd = () => {
      if (!this.dragging) return;
      this.dragging = false;
      const dy = this.touchCurrentY - this.touchStartY;
      if (Math.abs(dy) < 30) return;
      if (dy < 0) {
        if (this.state === 'collapsed') this.snapTo('half');
        else if (this.state === 'half') this.snapTo('full');
      } else {
        if (this.state === 'full') this.snapTo('half');
        else if (this.state === 'half') this.snapTo('collapsed');
      }
    };

    for (const el of swipeTargets) {
      el.addEventListener('touchstart', (e) => onStart(e.touches[0].clientY), { passive: true });
      el.addEventListener('touchmove', (e) => onMove(e.touches[0].clientY), { passive: true });
      el.addEventListener('touchend', onEnd);
      el.addEventListener('mousedown', (e) => onStart(e.clientY));
    }
    document.addEventListener('mousemove', (e) => onMove(e.clientY));
    document.addEventListener('mouseup', onEnd);
  },

  // Open a specific sidebar tab (auto-closes toolbar if open)
  openTab(tabName) {
    // Close toolbar if open
    if (this.toolbarOpen) {
      this.toolbarOpen = false;
      const toolbar = document.getElementById('highlightToolbar');
      if (toolbar) toolbar.classList.remove('mob-toolbar-open');
    }
    // Open panel to half if collapsed
    if (this.state === 'collapsed') this.snapTo('half');
    // Switch to the tab
    switchSidebarTab(tabName);
  },

  toggleToolbar() {
    // Close panel if open
    if (this.state !== 'collapsed') {
      this.snapTo('collapsed');
    }
    const toolbar = document.getElementById('highlightToolbar');
    if (!toolbar) return;
    this.toolbarOpen = !this.toolbarOpen;
    toolbar.classList.toggle('mob-toolbar-open', this.toolbarOpen);
    // Update button style
    const btn = document.getElementById('mobMarkupBtn');
    if (btn) {
      btn.style.background = this.toolbarOpen ? 'rgba(255,255,255,0.3)' : '';
    }
  }
};

// Init on load
document.addEventListener('DOMContentLoaded', () => setTimeout(() => MobileSheet.init(), 200));

// Auto-open sidebar on word click in mobile
function openMobileSidebarIfNeeded() {
  if (window.innerWidth <= 850) {
    if (MobileSheet.state === 'collapsed') {
      MobileSheet.snapTo('half');
    }
  }
}

function toggleMobileSidebar() {
  MobileSheet.cycle();
}

function checkMobileButton() {
  MobileSheet.checkMobile();
  // Show/hide mobile chapter button
  const chBtn = document.getElementById('mobChapterBtn');
  if (chBtn) chBtn.style.display = window.innerWidth <= 850 ? 'block' : 'none';
}

function toggleMobileChapterPicker() {
  const dropdown = document.getElementById('mobChapterDropdown');
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains('open');
  if (isOpen) {
    closeMobileChapterPicker();
  } else {
    // Build grid
    const grid = document.getElementById('mobChapterGridItems');
    if (grid) {
      let html = '';
      const currentCh = typeof Concordance !== 'undefined' ? Concordance.currentChapter : 1;
      for (let i = 1; i <= 66; i++) {
        const isActive = i === currentCh;
        let rungColor = '';
        if (typeof getRungForChapter === 'function') {
          const rNum = getRungForChapter(i);
          if (rNum && typeof getRungById === 'function') {
            const r = getRungById(rNum);
            if (r) rungColor = `border-left: 3px solid ${r.color};`;
          }
        }
        html += `<button class="mob-ch-btn ${isActive ? 'active' : ''}" style="${rungColor}" onclick="selectMobileChapter(${i})">${i}</button>`;
      }
      grid.innerHTML = html;
    }
    dropdown.classList.add('open');
  }
}

function closeMobileChapterPicker() {
  const dropdown = document.getElementById('mobChapterDropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function selectMobileChapter(ch) {
  closeMobileChapterPicker();
  if (typeof Concordance !== 'undefined') {
    Concordance.showChapter(ch);
  }
}

// ===== HOW TO READ ISAIAH =====

function renderHowToReadIsaiah(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="howto-content">
      <h2>How to Read Isaiah</h2>
      <p>Nephi gives us three essential keys for understanding Isaiah. Without these, the text remains sealed. With them, it opens like a flower.</p>

      <div class="howto-key">
        <div class="howto-key-header">
          <span class="howto-key-num">1</span>
          <h3>The Learning of the Jews</h3>
        </div>
        <div class="howto-ref">2 Nephi 25:1-5</div>
        <p>"For I, Nephi, have not taught them many things concerning the manner of the Jews; for their works were works of darkness, and their doings were doings of abominations. Wherefore, I write unto my people... that they may know concerning the judgments of God... <strong>for after the manner of the things of the Jews do I make it that I may write unto the Gentiles</strong>."</p>
        <div class="howto-explanation">
          <h4>What this means</h4>
          <p>Isaiah wrote using Hebrew literary forms that most modern readers don't recognize: <strong>chiasms</strong> (mirror structures), <strong>parallelism</strong> (repeated ideas in paired lines), <strong>typology</strong> (historical events as patterns for future ones), and <strong>code words</strong> (symbolic vocabulary with specific meanings). Learning these forms is like learning the grammar of Isaiah's language.</p>
          <p><strong>Chiastic structure:</strong> Isaiah's book mirrors itself — chapters 1-33 reflect 34-66. Each section has a parallel. Understanding the structure reveals the message.</p>
          <p><strong>Typology:</strong> Every event has a dual fulfillment — a historical "former thing" and a prophetic "new thing" for the latter days. Babylon = any worldly system. Assyria = any military superpower. The Servant = Christ AND an end-time agent.</p>
          <p><strong>Code words:</strong> Isaiah's vocabulary is a cipher. "Mountains" = nations. "Waters" = peoples. "Furnace" = refining. Learn the code and the text transforms. See the Code Words tab for the full dictionary.</p>
        </div>
      </div>

      <div class="howto-key">
        <div class="howto-key-header">
          <span class="howto-key-num">2</span>
          <h3>Likening Unto Yourself</h3>
        </div>
        <div class="howto-ref">1 Nephi 19:23; 2 Nephi 11:8</div>
        <p>"And I did read many things unto them which were written in the books of Moses; but that I might more fully persuade them to believe in the Lord their Redeemer <strong>I did read unto them that which was written by the prophet Isaiah; for I did liken all scriptures unto us, that it might be for our profit and learning</strong>."</p>
        <div class="howto-explanation">
          <h4>What this means</h4>
          <p>Isaiah is not ancient history — it is <strong>your story</strong>. Every judgment, every promise, every pattern applies to YOU in YOUR day. When Isaiah speaks of "Babylon," ask: where is Babylon in my life? When he speaks of "Zion," ask: am I building Zion? When he speaks of the "furnace of affliction," ask: what is God refining in me?</p>
          <p>The seven rungs of the ladder are not just categories of ancient Israel — they describe <strong>spiritual states you move through</strong>. Where are you on the ladder today? What rung's attributes do you see in yourself?</p>
          <p>This is why the Kings & Queens key is so powerful — when you realize YOU are the nursing father or nursing mother of Isaiah 49:22-23, every teaching of Christ becomes personal royal instruction.</p>
        </div>
      </div>

      <div class="howto-key">
        <div class="howto-key-header">
          <span class="howto-key-num">3</span>
          <h3>The Spirit of Prophecy</h3>
        </div>
        <div class="howto-ref">2 Nephi 25:4; Revelation 19:10</div>
        <p>"Wherefore, hearken, O my people, which are of the house of Israel, and give ear unto my words; for because <strong>the words of Isaiah are not plain unto you, nevertheless they are plain unto all those that are filled with the spirit of prophecy</strong>."</p>
        <p>"The testimony of Jesus is the spirit of prophecy." — Revelation 19:10</p>
        <div class="howto-explanation">
          <h4>What this means</h4>
          <p>The ultimate key is not intellectual — it is <strong>spiritual</strong>. Isaiah cannot be fully understood through scholarship alone. You need the Holy Ghost. The "spirit of prophecy" is the gift to see what Isaiah saw — to understand the patterns, feel the urgency, and know that his words describe real events that are coming.</p>
          <p>This is why the Ascent matters. The path from the furnace of affliction through the fullness of the Holy Ghost is not just doctrine — it is the <strong>prerequisite for understanding Isaiah</strong>. As you ascend the ladder spiritually, the sealed portions of Isaiah unseal before your eyes.</p>
          <p><strong>The testimony of Jesus</strong> is what unlocks everything. Every chapter, every symbol, every prophecy points to Christ — His atonement, His gathering, His return. When you read with the question "Where is Christ in this chapter?", the text comes alive.</p>
        </div>
      </div>

      <div class="howto-key">
        <div class="howto-key-header">
          <span class="howto-key-num">4</span>
          <h3>The Learning of the Gentiles (Gileadi's Addition)</h3>
        </div>
        <div class="howto-ref">Avraham Gileadi, "The Literary Message of Isaiah"</div>
        <p>Gileadi adds a fourth dimension: the <strong>literary analysis</strong> that reveals Isaiah's sophisticated structure — the bifid (two-part) design, the seven-rung ladder of spiritual categories, the servant typology, and the "former things / new things" framework that makes Isaiah simultaneously historical AND prophetic.</p>
        <div class="howto-explanation">
          <h4>What this means</h4>
          <p>Gileadi's contribution is showing that Isaiah is not a random collection of prophecies but a <strong>carefully structured masterwork</strong> with an intentional design. Understanding the structure reveals layers of meaning invisible to casual reading:</p>
          <ul>
            <li><strong>The Bifid Structure:</strong> Chapters 1-33 mirror 34-66 in a chiastic pattern (A-B-C-D-E-F-G | G'-F'-E'-D'-C'-B'-A')</li>
            <li><strong>The Seven Rungs:</strong> Every verse operates at one of seven spiritual levels — from Perdition to Jehovah</li>
            <li><strong>Former/New Things:</strong> Past fulfillments establish patterns; new fulfillments reveal what's coming</li>
            <li><strong>The Servant:</strong> Both corporate (Israel) and individual (Christ/end-time agent) — the key to the gathering</li>
          </ul>
        </div>
      </div>

      <div class="howto-summary">
        <h3>Putting It All Together</h3>
        <p>To read Isaiah, you need all four keys working simultaneously:</p>
        <ol>
          <li><strong>Learn the forms</strong> — Hebrew parallelism, chiasms, typology, code words</li>
          <li><strong>Liken to yourself</strong> — this is YOUR story, YOUR ladder, YOUR gathering</li>
          <li><strong>Seek the Spirit</strong> — the Holy Ghost is the master key to the sealed book</li>
          <li><strong>See the structure</strong> — the bifid design, the rungs, the servant patterns</li>
        </ol>
        <p>Start with 1 Nephi 20-21 (Isaiah 48-49) — the Master Key. Then expand outward. Use the tools in this app to decode, highlight, cross-reference, and group as you study. The text will open.</p>
      </div>
    </div>
  `;
}

// ===== MY KEYS & NOTES =====

const MY_KEYS_STORAGE = 'isaiah_my_keys_notes';

function renderMyKeysAndNotes(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let notes = [];
  try {
    const data = localStorage.getItem(MY_KEYS_STORAGE);
    if (data) notes = JSON.parse(data);
  } catch(e) { notes = []; }

  let html = `
    <div class="mynotes-content">
      <h2>My Keys & Notes</h2>
      <p>Record the keys and insights you discover as you study. These are patterns, connections, and revelations that the Spirit teaches you personally.</p>

      <div class="mynotes-add">
        <input type="text" id="noteTitle" placeholder="Key or insight title..." class="mynotes-input mynotes-title-input">
        <textarea id="noteBody" placeholder="Describe the key, pattern, or connection you found... Include scripture references." class="mynotes-input mynotes-body-input" rows="3"></textarea>
        <div class="mynotes-add-row">
          <input type="text" id="noteRefs" placeholder="References (e.g., Isaiah 48:10, D&C 121:7)" class="mynotes-input mynotes-refs-input">
          <button onclick="addMyNote()" class="mynotes-add-btn">+ Add Key</button>
        </div>
      </div>

      <div class="mynotes-list" id="myNotesList">`;

  for (let i = notes.length - 1; i >= 0; i--) {
    const n = notes[i];
    html += `<div class="mynotes-item">
      <div class="mynotes-item-header">
        <span class="mynotes-item-title">${n.title}</span>
        <span class="mynotes-item-date">${n.date || ''}</span>
        <button class="mynotes-item-del" onclick="deleteMyNote(${i})" title="Delete">&times;</button>
      </div>
      <div class="mynotes-item-body">${n.body.replace(/\n/g, '<br>')}</div>
      ${n.refs ? `<div class="mynotes-item-refs">${n.refs}</div>` : ''}
    </div>`;
  }

  html += `</div>
    </div>`;

  container.innerHTML = html;
}

function addMyNote() {
  const title = document.getElementById('noteTitle')?.value.trim();
  const body = document.getElementById('noteBody')?.value.trim();
  const refs = document.getElementById('noteRefs')?.value.trim();
  if (!title || !body) return;

  let notes = [];
  try {
    const data = localStorage.getItem(MY_KEYS_STORAGE);
    if (data) notes = JSON.parse(data);
  } catch(e) { notes = []; }

  notes.push({
    title,
    body,
    refs,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem(MY_KEYS_STORAGE, JSON.stringify(notes));

  document.getElementById('noteTitle').value = '';
  document.getElementById('noteBody').value = '';
  document.getElementById('noteRefs').value = '';

  renderMyKeysAndNotes('keys-mynotes');
}

function deleteMyNote(index) {
  let notes = [];
  try {
    const data = localStorage.getItem(MY_KEYS_STORAGE);
    if (data) notes = JSON.parse(data);
  } catch(e) { notes = []; }

  notes.splice(index, 1);
  localStorage.setItem(MY_KEYS_STORAGE, JSON.stringify(notes));
  renderMyKeysAndNotes('keys-mynotes');
}

// ===== SIDEBAR RESIZE =====

function setupSidebarResize() {
  const handle = document.getElementById('sidebarResizeHandle');
  const panel = document.getElementById('concordancePanelAside');
  if (!handle || !panel) return;

  let isDragging = false;
  let startX, startWidth;

  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startWidth = panel.offsetWidth;
    handle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = startX - e.clientX; // dragging left = wider panel
    const newWidth = Math.max(200, Math.min(700, startWidth + dx));
    panel.style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      handle.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      // Save width preference
      localStorage.setItem('isaiah_sidebar_width', panel.style.width);
    }
  });

  // Restore saved width
  const saved = localStorage.getItem('isaiah_sidebar_width');
  if (saved) panel.style.width = saved;
}

function switchSidebarTab(panel) {
  // Hide all panels, deactivate all tabs
  document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar-panel-content').forEach(p => p.style.display = 'none');

  // Show selected
  const tab = document.querySelector(`.sidebar-tab[data-panel="${panel}"]`);
  if (tab) tab.classList.add('active');

  const panelMap = { concordance: 'sidebarConcordance', groups: 'sidebarGroups', codewords: 'sidebarCodeWords' };
  const content = document.getElementById(panelMap[panel]);
  if (content) content.style.display = 'flex';

  // Tab-specific logic
  if (panel === 'groups' && typeof Grouper !== 'undefined') {
    Grouper.active = true;
    Grouper.renderPanel();
  } else if (typeof Grouper !== 'undefined') {
    Grouper.active = false;
  }

  if (panel === 'codewords' && typeof Decoder !== 'undefined') {
    Decoder.renderTab('sidebarCodeWordsContent');
  }
}
