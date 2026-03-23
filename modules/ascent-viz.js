// Ascent Visualization - renders the spiritual progression timeline
const AscentViz = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof ASCENT_STAGES === 'undefined') return;

    let html = '';

    // Promise section at top
    if (typeof LUCIFER_ANALYSIS !== 'undefined') {
      html += `<div class="ascent-promise">
        <h3>${LUCIFER_ANALYSIS.promise.title}</h3>
        <p>${LUCIFER_ANALYSIS.promise.text}</p>
        <div class="promise-refs">${LUCIFER_ANALYSIS.promise.refs.map(r => `<span class="ref-tag">${r}</span>`).join(' ')}</div>
      </div>`;
    }

    html += '<div class="ascent-timeline">';

    // Stages from top (7) to bottom (1)
    const stages = [...ASCENT_STAGES].reverse();
    for (const stage of stages) {
      html += `
        <div class="ascent-stage" style="--stage-color: ${stage.color}" data-rung="${stage.rung}">
          <div class="stage-dot"></div>
          <div class="stage-card">
            <div class="stage-header" onclick="AscentViz.toggle(this)">
              <span class="stage-number">Rung ${stage.rung}</span>
              <span class="stage-title">${stage.title}</span>
              <span class="stage-subtitle">${stage.subtitle}</span>
              <span class="stage-arrow">+</span>
            </div>
            <div class="stage-content" style="display:none;">
              <div class="three-columns">
                <div class="col">
                  <h4>Covenant Path</h4>
                  <h5>${stage.covenant.title}</h5>
                  <p>${stage.covenant.text}</p>
                  <div class="col-refs">${stage.covenant.refs.map(r => `<span class="ref-tag">${r}</span>`).join(' ')}</div>
                </div>
                <div class="col">
                  <h4>Beatitude</h4>
                  <h5>${stage.beatitude.title}</h5>
                  <p>${stage.beatitude.text}</p>
                  <div class="col-refs">${stage.beatitude.refs.map(r => `<span class="ref-tag">${r}</span>`).join(' ')}</div>
                </div>
                <div class="col">
                  <h4>D&C 4:6 Attribute</h4>
                  <h5>${stage.attribute.title}</h5>
                  <p>${stage.attribute.text}</p>
                  <div class="col-refs">${stage.attribute.refs.map(r => `<span class="ref-tag">${r}</span>`).join(' ')}</div>
                </div>
              </div>
              ${stage.warning ? `<div class="stage-warning">${stage.warning}</div>` : ''}
            </div>
          </div>
        </div>`;
    }
    html += '</div>';

    // Lucifer analysis
    if (typeof LUCIFER_ANALYSIS !== 'undefined') {
      html += `<div class="lucifer-section">
        <h3>${LUCIFER_ANALYSIS.title}</h3>
        <p>${LUCIFER_ANALYSIS.intro}</p>
        <div class="lucifer-scriptures">
          ${LUCIFER_ANALYSIS.scriptures.map(s => `<div class="lucifer-scripture"><span class="ref-tag">${s.ref}</span> <em>${s.text}</em></div>`).join('')}
        </div>
        <div class="lucifer-lesson">${LUCIFER_ANALYSIS.lesson}</div>
        <div class="ten-attributes">
          <h4>The Ten Attributes of D&C 4:6</h4>
          <div class="attr-grid">
            ${LUCIFER_ANALYSIS.tenAttributes.map((attr, i) => `<div class="attr-item ${LUCIFER_ANALYSIS.luciferHad[i] ? 'had' : 'lacked'}">${attr} ${LUCIFER_ANALYSIS.luciferHad[i] ? '' : '(LACKED)'}</div>`).join('')}
          </div>
        </div>
      </div>`;
    }

    container.innerHTML = html;
  },

  toggle(header) {
    const content = header.nextElementSibling;
    const arrow = header.querySelector('.stage-arrow');
    if (content.style.display === 'none') {
      content.style.display = 'block';
      arrow.textContent = '-';
    } else {
      content.style.display = 'none';
      arrow.textContent = '+';
    }
  }
};
