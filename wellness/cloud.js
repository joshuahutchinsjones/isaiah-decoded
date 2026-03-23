/* ============================================================
   CLOUD SYNC — Firebase auto-save/load
   Data persists in the cloud automatically.
   Falls back gracefully to localStorage if Firebase unavailable.
   ============================================================ */

const Cloud = {
  db: null,
  userId: null,
  ready: false,
  _saveTimeout: null,

  /* ── FIREBASE CONFIG ─────────────────────────────────
     Replace this with your Firebase project config.
     Free at https://console.firebase.google.com
     ─────────────────────────────────────────────────── */
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyDDU5i0fJISwrDzPAu2mqD8Wrk9AAgnv0I",
    authDomain: "glowup-aubree.firebaseapp.com",
    projectId: "glowup-aubree",
    storageBucket: "glowup-aubree.firebasestorage.app",
    messagingSenderId: "985029231488",
    appId: "1:985029231488:web:6f02c091630d239c3df765"
  },

  /* ── INIT ─────────────────────────────────────────── */

  async init() {
    try {
      if (typeof firebase === 'undefined') {
        console.log('Cloud: Firebase SDK not loaded, using localStorage only');
        this.setStatus('offline', 'Local only');
        return false;
      }

      // Check if config is still the placeholder
      if (this.FIREBASE_CONFIG.apiKey === 'AIzaSyDOCAbC123dEf456GhI789jKl012-MnO') {
        console.log('Cloud: Firebase not configured yet, using localStorage only');
        this.setStatus('offline', 'Local save');
        return false;
      }

      firebase.initializeApp(this.FIREBASE_CONFIG);
      this.db = firebase.firestore();

      // Anonymous auth — no login required
      this.setStatus('syncing', 'Connecting...');
      const cred = await firebase.auth().signInAnonymously();
      this.userId = cred.user.uid;

      // Store the uid in localStorage so we can reconnect to the same data
      const storedUid = localStorage.getItem('glowup_cloud_uid');
      if (storedUid && storedUid !== this.userId) {
        // If there was a previous UID, try to migrate
        console.log('Cloud: UID changed, keeping new one');
      }
      localStorage.setItem('glowup_cloud_uid', this.userId);

      this.ready = true;
      this.setStatus('synced', 'Synced ☁️');
      console.log('Cloud: Connected as', this.userId);
      return true;
    } catch (err) {
      console.warn('Cloud: Firebase init failed, using localStorage', err.message);
      this.setStatus('offline', 'Local save');
      return false;
    }
  },

  /* ── SAVE ─────────────────────────────────────────── */

  save(state) {
    // Always save to localStorage as backup
    try {
      localStorage.setItem('glowup_state', JSON.stringify(state));
    } catch (e) { /* quota */ }

    // Debounced cloud save
    if (!this.ready) return;

    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => {
      this._cloudSave(state);
    }, 1500); // Wait 1.5s of inactivity before syncing
  },

  async _cloudSave(state) {
    if (!this.ready || !this.db || !this.userId) return;

    try {
      this.setStatus('syncing', 'Saving...');

      // Clone state and remove photo data URLs to stay under Firestore limits
      const cleanState = JSON.parse(JSON.stringify(state));
      if (cleanState.photoMeals) {
        cleanState.photoMeals = cleanState.photoMeals.map(m => ({
          ...m,
          photo: null // Photos are too large for Firestore, keep locally only
        }));
      }

      await this.db.collection('users').doc(this.userId).set({
        state: cleanState,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        appVersion: '1.0'
      }, { merge: true });

      this.setStatus('synced', 'Synced ☁️');
    } catch (err) {
      console.warn('Cloud: Save failed', err.message);
      this.setStatus('error', 'Save failed');
      // Data is safe in localStorage
    }
  },

  /* ── LOAD ─────────────────────────────────────────── */

  async load() {
    // Always try localStorage first (instant)
    let localState = null;
    try {
      const saved = localStorage.getItem('glowup_state');
      if (saved) localState = JSON.parse(saved);
    } catch (e) { /* corrupt */ }

    // If Firebase isn't ready, return local
    if (!this.ready || !this.db || !this.userId) {
      return localState;
    }

    try {
      this.setStatus('syncing', 'Loading...');
      const doc = await this.db.collection('users').doc(this.userId).get();

      if (doc.exists) {
        const cloudState = doc.data().state;
        this.setStatus('synced', 'Synced ☁️');

        // Merge: cloud wins for most data, but keep local photos
        if (localState && localState.photoMeals) {
          cloudState.photoMeals = localState.photoMeals;
        }

        return cloudState;
      } else {
        // No cloud data yet — upload local state
        if (localState) {
          this._cloudSave(localState);
        }
        this.setStatus('synced', 'Synced ☁️');
        return localState;
      }
    } catch (err) {
      console.warn('Cloud: Load failed, using localStorage', err.message);
      this.setStatus('offline', 'Local save');
      return localState;
    }
  },

  /* ── STATUS INDICATOR ──────────────────────────────── */

  setStatus(type, text) {
    const el = document.getElementById('syncStatus');
    if (!el) return;
    const icons = { synced: '☁️', syncing: '🔄', offline: '📱', error: '⚠️' };
    el.textContent = text;
    el.className = 'sync-status ' + type;
  }
};

window.Cloud = Cloud;
