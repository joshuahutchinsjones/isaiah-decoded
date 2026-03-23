// Code Word Overlay - detects code words and shows decoded meaning
const CodeOverlay = {
  check(word) {
    if (typeof CODE_WORD_INDEX === 'undefined') return;
    const key = CODE_WORD_INDEX[word];
    if (!key) { this.hide(); return; }
    const entry = CODE_WORDS[key];
    if (!entry) { this.hide(); return; }
    this.show(entry);
  },

  show(entry) {
    let el = document.getElementById('codeWordCard');
    if (!el) {
      el = document.createElement('div');
      el.id = 'codeWordCard';
      el.className = 'code-word-card';
      const resultsList = document.getElementById('resultsList');
      if (resultsList) resultsList.parentNode.insertBefore(el, resultsList);
    }
    el.style.display = 'block';
    el.innerHTML = `
      <div class="cwc-header">CODE WORD</div>
      <div class="cwc-term">${entry.term}</div>
      <div class="cwc-decoded">= ${entry.decoded}</div>
      <div class="cwc-verses">${entry.keyVerses.slice(0, 5).map(v => `<a href="#study/ch/${v.split(':')[0]}/v/${v.split(':')[1] || ''}" class="verse-link">${v}</a>`).join(' ')}</div>
      ${entry.gileadi ? '<div class="cwc-gileadi">Gileadi interpretation</div>' : ''}
    `;
  },

  hide() {
    const el = document.getElementById('codeWordCard');
    if (el) el.style.display = 'none';
  }
};
