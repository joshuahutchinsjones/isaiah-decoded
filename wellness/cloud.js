/* ============================================================
   CLOUD SYNC — Firebase with Google Sign-In
   Auto-saves to cloud. Google login for cross-device access.
   ============================================================ */

const Cloud = {
  db: null,
  userId: null,
  user: null,       // firebase user object
  ready: false,
  _saveTimeout: null,

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
        this.setStatus('offline', 'Local only');
        return false;
      }

      firebase.initializeApp(this.FIREBASE_CONFIG);
      this.db = firebase.firestore();

      // Listen for auth state changes
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user = user;
          this.userId = user.uid;
          this.ready = true;
          localStorage.setItem('glowup_cloud_uid', user.uid);
          this.updateAuthUI();
          this.setStatus('synced', 'Synced ☁️');
        }
      });

      // Try to sign in: check if already signed in, otherwise anonymous
      this.setStatus('syncing', 'Connecting...');
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        await firebase.auth().signInAnonymously();
      }
      this.user = firebase.auth().currentUser;
      this.userId = this.user.uid;
      this.ready = true;
      this.setStatus('synced', 'Synced ☁️');
      this.updateAuthUI();
      return true;
    } catch (err) {
      console.warn('Cloud: Init failed', err.message);
      this.setStatus('offline', 'Local save');
      return false;
    }
  },

  /* ── GOOGLE SIGN-IN ────────────────────────────────── */

  async signInWithGoogle() {
    try {
      this.setStatus('syncing', 'Signing in...');
      const provider = new firebase.auth.GoogleAuthProvider();
      const currentUser = firebase.auth().currentUser;

      let result;
      if (currentUser && currentUser.isAnonymous) {
        // Link anonymous account to Google — keeps existing data
        try {
          result = await currentUser.linkWithPopup(provider);
        } catch (linkErr) {
          if (linkErr.code === 'auth/credential-already-in-use') {
            // Google account already exists — sign in to that account instead
            // First save current anonymous data
            const anonData = await this._getCloudData(currentUser.uid);
            // Sign in with existing Google account
            result = await firebase.auth().signInWithPopup(provider);
            // If the Google account had no data, push the anonymous data there
            const googleData = await this._getCloudData(result.user.uid);
            if (!googleData && anonData) {
              await this.db.collection('users').doc(result.user.uid).set(anonData);
            }
          } else {
            throw linkErr;
          }
        }
      } else {
        result = await firebase.auth().signInWithPopup(provider);
      }

      this.user = firebase.auth().currentUser;
      this.userId = this.user.uid;
      this.ready = true;
      localStorage.setItem('glowup_cloud_uid', this.userId);
      this.updateAuthUI();
      this.setStatus('synced', 'Synced ☁️');

      // Reload app state from this account
      if (typeof App !== 'undefined') {
        await App.loadState();
        App.renderCurrentTab();
      }

      return true;
    } catch (err) {
      console.warn('Cloud: Google sign-in failed', err.message);
      this.setStatus('error', 'Sign-in failed');
      return false;
    }
  },

  async signOut() {
    try {
      await firebase.auth().signOut();
      // Sign back in anonymously so the app still works
      await firebase.auth().signInAnonymously();
      this.user = firebase.auth().currentUser;
      this.userId = this.user.uid;
      localStorage.setItem('glowup_cloud_uid', this.userId);
      this.updateAuthUI();
      this.setStatus('synced', 'Synced ☁️');

      // Clear state and reload
      if (typeof App !== 'undefined') {
        await App.loadState();
        App.renderCurrentTab();
      }
    } catch (err) {
      console.warn('Cloud: Sign out failed', err.message);
    }
  },

  async _getCloudData(uid) {
    try {
      const doc = await this.db.collection('users').doc(uid).get();
      return doc.exists ? doc.data() : null;
    } catch (e) { return null; }
  },

  /* ── AUTH UI ───────────────────────────────────────── */

  updateAuthUI() {
    const el = document.getElementById('authArea');
    if (!el) return;
    const user = this.user;

    if (user && !user.isAnonymous) {
      // Signed in with Google
      const name = user.displayName || 'You';
      const photo = user.photoURL;
      el.innerHTML = `
        <div class="auth-user">
          ${photo ? `<img src="${photo}" class="auth-avatar">` : '<span class="auth-avatar-placeholder">👩</span>'}
          <span class="auth-name">${name.split(' ')[0]}</span>
          <button class="auth-btn" onclick="Cloud.signOut()" title="Sign out">↩️</button>
        </div>
      `;
    } else {
      // Anonymous — show sign in button
      el.innerHTML = `
        <button class="auth-google-btn" onclick="Cloud.signInWithGoogle()">
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </button>
      `;
    }
  },

  /* ── SAVE ─────────────────────────────────────────── */

  save(state) {
    try {
      localStorage.setItem('glowup_state', JSON.stringify(state));
    } catch (e) { /* quota */ }

    if (!this.ready) return;
    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => this._cloudSave(state), 1500);
  },

  async _cloudSave(state) {
    if (!this.ready || !this.db || !this.userId) return;
    try {
      this.setStatus('syncing', 'Saving...');
      const cleanState = JSON.parse(JSON.stringify(state));
      if (cleanState.photoMeals) {
        cleanState.photoMeals = cleanState.photoMeals.map(m => ({ ...m, photo: null }));
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
    }
  },

  /* ── LOAD ─────────────────────────────────────────── */

  async load() {
    let localState = null;
    try {
      const saved = localStorage.getItem('glowup_state');
      if (saved) localState = JSON.parse(saved);
    } catch (e) { /* corrupt */ }

    if (!this.ready || !this.db || !this.userId) return localState;

    try {
      this.setStatus('syncing', 'Loading...');
      const doc = await this.db.collection('users').doc(this.userId).get();
      if (doc.exists) {
        const cloudState = doc.data().state;
        this.setStatus('synced', 'Synced ☁️');
        if (localState && localState.photoMeals) cloudState.photoMeals = localState.photoMeals;
        return cloudState;
      } else {
        if (localState) this._cloudSave(localState);
        this.setStatus('synced', 'Synced ☁️');
        return localState;
      }
    } catch (err) {
      console.warn('Cloud: Load failed', err.message);
      this.setStatus('offline', 'Local save');
      return localState;
    }
  },

  /* ── STATUS ────────────────────────────────────────── */

  setStatus(type, text) {
    const el = document.getElementById('syncStatus');
    if (!el) return;
    el.textContent = text;
    el.className = 'sync-status ' + type;
  }
};

window.Cloud = Cloud;
