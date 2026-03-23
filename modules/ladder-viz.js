// Ladder Visualization - renders the 7-rung ladder
const LadderViz = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof ISAIAH_LADDER === 'undefined') return;

    let html = '<div class="ladder-container">';
    // Render rungs from top (7) to bottom (1)
    const rungs = [...ISAIAH_LADDER.rungs].reverse();
    for (const rung of rungs) {
      const chRange = this.getChapterRange(rung.number);
      html += `
        <div class="ladder-rung" data-rung="${rung.number}" style="--rung-color: ${rung.color}">
          <div class="rung-number">${rung.number}</div>
          <div class="rung-body">
            <div class="rung-title">${rung.title}</div>
            <div class="rung-subtitle">${rung.subtitle}</div>
            <div class="rung-chapters">${chRange}</div>
            <div class="rung-theme">${rung.theme}</div>
            <div class="rung-details" style="display:none;">
              <div class="rung-section">
                <h4>Attributes</h4>
                <ul>${rung.attributes.map(a => `<li>${a}</li>`).join('')}</ul>
              </div>
              <div class="rung-section">
                <h4>Self-Reflection</h4>
                <ul class="reflection-list">${rung.reflections.map(r => `<li>${r}</li>`).join('')}</ul>
              </div>
              <div class="rung-section">
                <h4>Key Verses</h4>
                <div class="rung-verse-links">${rung.keyVerses.map(v => `<a href="#study/ch/${v.split(':')[0].split('-')[0]}" class="verse-link">Isaiah ${v}</a>`).join(' ')}</div>
              </div>
            </div>
            <button class="rung-expand-btn" onclick="LadderViz.toggle(this)">Show details</button>
          </div>
          <div class="rung-connector"></div>
        </div>`;
    }
    html += '</div>';
    container.innerHTML = html;
  },

  getChapterRange(rungNum) {
    const ranges = {1:'Ch 1-8', 2:'Ch 9-12', 3:'Ch 13-27', 4:'Ch 28-35', 5:'Ch 48-54', 6:'Ch 55-60', 7:'Ch 61-66'};
    return ranges[rungNum] || '';
  },

  toggle(btn) {
    const details = btn.previousElementSibling;
    if (details.style.display === 'none') {
      details.style.display = 'block';
      btn.textContent = 'Hide details';
    } else {
      details.style.display = 'none';
      btn.textContent = 'Show details';
    }
  }
};
