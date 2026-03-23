// Tab Router - Hash-based navigation
const TabRouter = {
  callbacks: {},
  currentTab: null,

  init() {
    window.addEventListener('hashchange', () => this.route());
    this.route();
  },

  onTabChange(tab, callback) {
    this.callbacks[tab] = callback;
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  getState() {
    const hash = window.location.hash.slice(1) || 'start';
    const parts = hash.split('/');
    return { tab: parts[0], section: parts[1] || null, param: parts[2] || null, extra: parts[3] || null };
  },

  route() {
    const state = this.getState();
    const tab = state.tab;

    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show active tab
    const tabEl = document.getElementById('tab-' + tab);
    const btnEl = document.querySelector(`[data-tab="${tab}"]`);
    if (tabEl) {
      tabEl.style.display = 'block';
      if (btnEl) btnEl.classList.add('active');
    } else {
      // Default to start
      const def = document.getElementById('tab-start');
      if (def) def.style.display = 'block';
      const defBtn = document.querySelector('[data-tab="start"]');
      if (defBtn) defBtn.classList.add('active');
      state.tab = 'start';
    }

    this.currentTab = state.tab;

    // Call tab-specific callback
    if (this.callbacks[state.tab]) {
      this.callbacks[state.tab](state);
    }

    // Store last visited tab
    localStorage.setItem('isaiah_decoded_last_tab', state.tab);
  }
};
