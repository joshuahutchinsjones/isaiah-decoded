// Study Renderer - renders deep study content as expandable accordion
const StudyRenderer = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof DEEP_STUDIES === 'undefined') return;

    let html = '';
    for (const study of DEEP_STUDIES) {
      html += `
        <div class="study-item" id="study-${study.id}">
          <div class="study-header" onclick="StudyRenderer.toggleStudy(this)">
            <div class="study-title">${study.title}</div>
            <div class="study-summary">${study.summary}</div>
            <span class="study-arrow">+</span>
          </div>
          <div class="study-body" style="display:none;">
            ${study.sections.map(sec => `
              <div class="study-section">
                <h4 class="section-heading" onclick="StudyRenderer.toggleSection(this)">${sec.heading} <span class="sec-arrow">-</span></h4>
                <div class="section-content">
                  <p>${sec.content}</p>
                  <div class="section-verses">
                    ${sec.verses.map(v => `<a href="#study/ch/${v.split(':')[0].split('-')[0]}" class="verse-link">Isaiah ${v}</a>`).join(' ')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }
    container.innerHTML = html;
  },

  toggleStudy(header) {
    const body = header.nextElementSibling;
    const arrow = header.querySelector('.study-arrow');
    if (body.style.display === 'none') {
      body.style.display = 'block';
      arrow.textContent = '-';
    } else {
      body.style.display = 'none';
      arrow.textContent = '+';
    }
  },

  toggleSection(heading) {
    const content = heading.nextElementSibling;
    const arrow = heading.querySelector('.sec-arrow');
    if (content.style.display === 'none') {
      content.style.display = 'block';
      arrow.textContent = '-';
    } else {
      content.style.display = 'none';
      arrow.textContent = '+';
    }
  },

  // Keys tab: render code word dictionary
  renderDecoder(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof CODE_WORDS === 'undefined') return;

    const entries = Object.entries(CODE_WORDS).sort((a, b) => a[1].term.localeCompare(b[1].term));

    let html = `<div class="decoder-controls">
      <input type="text" id="decoderSearch" placeholder="Search code words..." class="decoder-search">
      <div class="decoder-filters">
        <button class="filter-pill active" data-cat="all">All</button>
        <button class="filter-pill" data-cat="places">Places</button>
        <button class="filter-pill" data-cat="people">People</button>
        <button class="filter-pill" data-cat="objects">Objects</button>
        <button class="filter-pill" data-cat="actions">Actions</button>
        <button class="filter-pill" data-cat="concepts">Concepts</button>
      </div>
    </div>
    <div id="decoderList" class="decoder-list">`;

    for (const [key, entry] of entries) {
      html += `
        <div class="decoder-entry" data-category="${entry.category}" data-term="${entry.term.toLowerCase()}">
          <div class="de-header" onclick="this.parentElement.classList.toggle('expanded')">
            <span class="de-term">${entry.term}</span>
            <span class="de-cat">${entry.category}</span>
            ${entry.gileadi ? '<span class="de-gileadi">Gileadi</span>' : ''}
          </div>
          <div class="de-decoded">${entry.decoded}</div>
          <div class="de-details">
            <div class="de-verses">${entry.keyVerses.slice(0, 8).map(v => `<a href="#study/ch/${v.split(':')[0].split('-')[0]}" class="verse-link">${v}</a>`).join(' ')}</div>
            ${entry.crossRefs.length ? `<div class="de-crossrefs">Cross-refs: ${entry.crossRefs.join(', ')}</div>` : ''}
          </div>
        </div>`;
    }
    html += '</div>';
    container.innerHTML = html;

    // Setup filter/search events
    document.getElementById('decoderSearch')?.addEventListener('input', (e) => this.filterDecoder(e.target.value, null));
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterDecoder(document.getElementById('decoderSearch')?.value || '', btn.dataset.cat);
      });
    });
  },

  filterDecoder(query, category) {
    const q = query.toLowerCase();
    const cat = category || document.querySelector('.filter-pill.active')?.dataset.cat || 'all';
    document.querySelectorAll('.decoder-entry').forEach(el => {
      const matchCat = cat === 'all' || el.dataset.category === cat;
      const matchQuery = !q || el.dataset.term.includes(q) || el.querySelector('.de-decoded')?.textContent.toLowerCase().includes(q);
      el.style.display = (matchCat && matchQuery) ? 'block' : 'none';
    });
  },

  // Kings & Queens tab
  renderKingsQueens(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof KINGS_QUEENS === 'undefined') return;

    let html = `<div class="kq-thesis">${KINGS_QUEENS.thesis}</div>`;

    // Isaiah foundation
    html += '<h3 class="kq-section-title">Isaiah Foundation</h3>';
    html += '<div class="kq-foundation">';
    for (const verse of KINGS_QUEENS.isaiahFoundation) {
      html += `<div class="kq-verse-card">
        <div class="kq-ref">Isaiah ${verse.ref}</div>
        <div class="kq-explanation">${verse.explanation}</div>
        <a href="#study/ch/${verse.ref.split(':')[0]}" class="verse-link">Read in context</a>
      </div>`;
    }
    html += '</div>';

    // Parables
    html += '<h3 class="kq-section-title">Christ\'s Parables as Royal Instruction</h3>';
    html += '<div class="kq-parables">';
    for (const p of KINGS_QUEENS.parablesMapped) {
      html += `<div class="parable-card">
        <div class="pc-title">${p.parable}</div>
        <div class="pc-ref">${p.reference}</div>
        <div class="pc-standard"><strong>Standard reading:</strong> ${p.standardReading}</div>
        <div class="pc-royal"><strong>Royal reading:</strong> ${p.royalReading}</div>
        <div class="pc-isaiah"><strong>Isaiah connection:</strong> ${p.isaiahConnection}</div>
      </div>`;
    }
    html += '</div>';

    // Supporting scriptures
    html += '<h3 class="kq-section-title">Supporting Scriptures</h3>';
    html += '<div class="kq-support">';
    for (const s of KINGS_QUEENS.supportingScriptures) {
      html += `<div class="support-card"><span class="ref-tag">${s.ref}</span> ${s.connection}</div>`;
    }
    html += '</div>';

    // Conclusion
    html += `<div class="kq-conclusion">${KINGS_QUEENS.conclusion}</div>`;

    container.innerHTML = html;
  },

  // Master Key tab (1 Nephi 20-21)
  renderMasterKey(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof ISAIAH_EMBEDDED_DATA === 'undefined') return;

    const ch48 = ISAIAH_EMBEDDED_DATA["48"];
    const ch49 = ISAIAH_EMBEDDED_DATA["49"];
    if (!ch48 || !ch49) return;

    let html = `<div class="mk-intro">
      <p>Nephi chose Isaiah 48 and 49 as his <strong>first</strong> Isaiah quotation for a reason. These two chapters are the Master Key that opens all of Isaiah. Chapter 48 is the <strong>diagnosis</strong> (Israel's hypocrisy vs. God's grace). Chapter 49 is the <strong>solution</strong> (the Servant, the gathering, "I have graven thee on the palms of my hands").</p>
      <p>Click any verse to expand its decoded meaning, cross-references, and connections.</p>
    </div>`;

    // Chapter 48
    html += '<h3 class="mk-chapter-title">Isaiah 48 <span class="mk-aka">(1 Nephi 20)</span></h3>';
    const verses48 = Object.keys(ch48).map(Number).sort((a, b) => a - b);
    for (const v of verses48) {
      const key = `48:${v}`;
      const refs = (typeof CROSS_REFERENCES !== 'undefined') ? CROSS_REFERENCES[key] || [] : [];
      const hasRefs = refs.length > 0;
      html += `<div class="mk-verse ${hasRefs ? 'has-refs' : ''}" onclick="this.classList.toggle('expanded')">
        <div class="mk-verse-text"><span class="mk-vnum">${v}</span> ${ch48[String(v)]}</div>
        ${hasRefs ? `<div class="mk-annotations">
          ${refs.map(r => `<div class="mk-ref"><span class="ref-tag">${r.ref}</span> ${r.note}</div>`).join('')}
        </div>` : ''}
      </div>`;
    }

    // Chapter 49
    html += '<h3 class="mk-chapter-title">Isaiah 49 <span class="mk-aka">(1 Nephi 21)</span></h3>';
    const verses49 = Object.keys(ch49).map(Number).sort((a, b) => a - b);
    for (const v of verses49) {
      const key = `49:${v}`;
      const refs = (typeof CROSS_REFERENCES !== 'undefined') ? CROSS_REFERENCES[key] || [] : [];
      const hasRefs = refs.length > 0;
      html += `<div class="mk-verse ${hasRefs ? 'has-refs' : ''}" onclick="this.classList.toggle('expanded')">
        <div class="mk-verse-text"><span class="mk-vnum">${v}</span> ${ch49[String(v)]}</div>
        ${hasRefs ? `<div class="mk-annotations">
          ${refs.map(r => `<div class="mk-ref"><span class="ref-tag">${r.ref}</span> ${r.note}</div>`).join('')}
        </div>` : ''}
      </div>`;
    }

    container.innerHTML = html;
  }
};
