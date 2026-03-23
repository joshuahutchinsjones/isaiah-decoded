/* ============================================================
   GLOW UP — Main App Logic
   State management, UI rendering, event handling
   ============================================================ */

const App = {

  /* ── STATE ─────────────────────────────────────────── */

  state: {
    profile: null,
    weekPlan: null,
    groceryList: null,
    groceryChecked: {},
    measurements: [],
    symptoms: [],
    currentTab: 'dashboard',
    dailyChecks: {},   // { 'YYYY-MM-DD': { taskId: true, ... } }
    xp: 0,
    streak: 0,
    lastCompleteDate: null
  },

  /* ── INIT ──────────────────────────────────────────── */

  init() {
    this.loadState();
    this.bindTabs();
    this.bindModal();
    this.renderCurrentTab();
  },

  loadState() {
    try {
      const saved = localStorage.getItem('glowup_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(this.state, parsed);
      }
    } catch (e) { /* fresh start */ }
  },

  saveState() {
    try {
      localStorage.setItem('glowup_state', JSON.stringify(this.state));
    } catch (e) { /* quota */ }
  },

  /* ── TAB ROUTING ───────────────────────────────────── */

  bindTabs() {
    document.getElementById('tabNav').addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
      document.getElementById('tab-' + tab).classList.add('active');
      this.state.currentTab = tab;
      this.renderCurrentTab();
    });
  },

  bindModal() {
    document.getElementById('recipeModal').addEventListener('click', (e) => {
      if (e.target.id === 'recipeModal' || e.target.classList.contains('modal-close')) {
        document.getElementById('recipeModal').classList.remove('open');
      }
    });
  },

  renderCurrentTab() {
    const tab = this.state.currentTab;
    const fn = {
      dashboard: () => this.renderDashboard(),
      today: () => this.renderToday(),
      profile: () => this.renderProfile(),
      meals: () => this.renderMeals(),
      grocery: () => this.renderGrocery(),
      workouts: () => this.renderWorkouts(),
      track: () => this.renderTrack()
    };
    if (fn[tab]) fn[tab]();
  },

  /* ── DASHBOARD ─────────────────────────────────────── */

  renderDashboard() {
    const el = document.getElementById('tab-dashboard');

    if (!this.state.profile) {
      el.innerHTML = `
        <div class="setup-screen">
          <div class="emoji">🌸</div>
          <h2>Welcome, Beautiful!</h2>
          <p>Let's set up your personalized wellness plan.<br>It only takes a minute!</p>
          <button class="btn btn-primary btn-full" onclick="App.goToTab('profile')">
            ✨ Get Started
          </button>
        </div>`;
      return;
    }

    const p = this.state.profile;
    const cals = Engine.calcGoalCalories(p);
    const tdee = Engine.calcTDEE(p);
    const dayIndex = new Date().getDay(); // 0=Sun
    const schedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Mon=0
    const todaySchedule = window.WEEKLY_SCHEDULE[schedIndex];
    const todayWorkout = window.WORKOUTS.find(w => w.id === todaySchedule.workout);
    const motivation = window.MOTIVATION[Math.floor(Math.random() * window.MOTIVATION.length)];

    // Today's meals from plan
    let todayMealsHTML = '';
    if (this.state.weekPlan) {
      const today = this.state.weekPlan[schedIndex];
      const mealOrder = [
        ['breakfast', '7:00 AM', '🌅'],
        ['morningSnack', '10:00 AM', '🍎'],
        ['lunch', '12:30 PM', '☀️'],
        ['afternoonSnack', '3:00 PM', '🍵'],
        ['dinner', '6:30 PM', '🌙']
      ];
      todayMealsHTML = mealOrder.map(([key, time, icon]) => {
        const meal = today.meals[key];
        if (!meal) return '';
        return `<div class="today-meal">
          <div class="today-time">${icon} ${time}</div>
          <div class="today-name" onclick="App.showRecipe('${meal.id}')">${meal.name}</div>
          <div class="today-cals">${meal.per.cal} cal | ${meal.per.p}g protein | ${meal.per.c}g carbs | ${meal.per.f}g fat</div>
        </div>`;
      }).join('');
    }

    // Recent symptom advice
    const advice = Engine.getSymptomAdvice(this.state.symptoms);

    el.innerHTML = `
      <div class="motivation-banner">${motivation}</div>

      <div class="dash-stats">
        <div class="dash-stat">
          <div class="icon">🔥</div>
          <div class="value">${cals}</div>
          <div class="label">Daily Cals</div>
        </div>
        <div class="dash-stat">
          <div class="icon">${todaySchedule.carbLevel === 'high' ? '⬆️' : todaySchedule.carbLevel === 'low' ? '⬇️' : '↔️'}</div>
          <div class="value" style="font-size:16px">${todaySchedule.carbLevel.toUpperCase()}</div>
          <div class="label">Carb Day</div>
        </div>
        <div class="dash-stat">
          <div class="icon">${todayWorkout.type === 'hiit' ? '🔥' : todayWorkout.type === 'walk' ? '🚶‍♀️' : '🏋️'}</div>
          <div class="value" style="font-size:14px">${todayWorkout.name.split(' ').slice(0,2).join(' ')}</div>
          <div class="label">${todayWorkout.duration} min</div>
        </div>
        <div class="dash-stat">
          <div class="icon">📏</div>
          <div class="value">${this.state.measurements.length > 0 ? this.state.measurements[this.state.measurements.length-1].weight || '--' : '--'}</div>
          <div class="label">Current lbs</div>
        </div>
      </div>

      ${this.state.weekPlan ? `
        <div class="card">
          <div class="card-title"><span class="icon">📋</span> Today's Menu — ${todaySchedule.day}</div>
          ${todayMealsHTML}
        </div>
      ` : `
        <div class="card">
          <div class="card-title"><span class="icon">🥗</span> Meal Plan</div>
          <p style="font-size:14px;color:var(--text-light);margin-bottom:12px;">Generate your personalized weekly meal plan!</p>
          <button class="btn btn-primary btn-full" onclick="App.generatePlan()">✨ Generate My Plan</button>
        </div>
      `}

      ${this.state.weekPlan ? `
        <div class="card">
          <div class="card-title"><span class="icon">🏋️</span> Today's Workout</div>
          <div style="font-weight:800;font-size:15px;margin-bottom:4px;">${todayWorkout.name}</div>
          <div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">${todayWorkout.duration} min | ~${todayWorkout.calsBurned} cal</div>
          <button class="btn btn-secondary btn-sm" onclick="App.goToTab('workouts')">View Full Workout →</button>
        </div>
      ` : ''}

      ${advice.length > 0 ? `
        <div class="card">
          <div class="card-title"><span class="icon">💡</span> Your Body Says...</div>
          ${advice.map(a => `
            <div class="advice-card">
              <div class="advice-title">${a.icon} ${a.title}</div>
              <div class="advice-text">${a.text}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  },

  /* ── PROFILE ───────────────────────────────────────── */

  renderProfile() {
    const el = document.getElementById('tab-profile');
    const p = this.state.profile || {};

    el.innerHTML = `
      <div class="card">
        <div class="card-title"><span class="icon">👩</span> About You</div>
        <div class="form-group">
          <label>Your Name</label>
          <input type="text" id="prof-name" value="${p.name || ''}" placeholder="Your beautiful name">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Age</label>
            <input type="number" id="prof-age" value="${p.age || ''}" placeholder="30">
          </div>
          <div class="form-group">
            <label>Height (inches)</label>
            <input type="number" id="prof-height" value="${p.height || ''}" placeholder="64">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Current Weight (lbs)</label>
            <input type="number" id="prof-weight" value="${p.weight || ''}" placeholder="150">
          </div>
          <div class="form-group">
            <label>Goal Weight (lbs)</label>
            <input type="number" id="prof-goal-weight" value="${p.goalWeight || ''}" placeholder="135">
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="icon">🏃‍♀️</span> Activity Level</div>
        <div class="toggle-group" data-field="activityLevel">
          ${['sedentary','light','moderate','active'].map(v =>
            `<button class="toggle-btn ${p.activityLevel === v ? 'active' : ''}" data-val="${v}">
              ${v === 'sedentary' ? '🛋️ Sedentary' : v === 'light' ? '🚶‍♀️ Light' : v === 'moderate' ? '💃 Moderate' : '🏃‍♀️ Active'}
            </button>`
          ).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="icon">🎯</span> Goal</div>
        <div class="toggle-group" data-field="goal">
          ${['lose','maintain','gain'].map(v =>
            `<button class="toggle-btn ${p.goal === v ? 'active' : ''}" data-val="${v}">
              ${v === 'lose' ? '📉 Lose Fat' : v === 'maintain' ? '⚖️ Maintain' : '💪 Build Muscle'}
            </button>`
          ).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="icon">🍼</span> Breastfeeding?</div>
        <div class="toggle-group" data-field="breastfeeding">
          <button class="toggle-btn ${p.breastfeeding === true ? 'active' : ''}" data-val="true">Yes 🤱</button>
          <button class="toggle-btn ${p.breastfeeding === false ? 'active' : ''}" data-val="false">No</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="icon">🫀</span> Body Type</div>
        <div class="toggle-group" data-field="bodyType">
          ${['ectomorph','mesomorph','endomorph'].map(v =>
            `<button class="toggle-btn ${p.bodyType === v ? 'active' : ''}" data-val="${v}">
              ${v === 'ectomorph' ? '🦋 Ecto (slim)' : v === 'mesomorph' ? '⚡ Meso (athletic)' : '🧸 Endo (curvy)'}
            </button>`
          ).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="icon">🚫</span> Food Sensitivities</div>
        <p style="font-size:12px;color:var(--text-light);margin-bottom:12px;">Select any foods you need to avoid. Your meal plan and grocery list will automatically substitute safe alternatives.</p>
        <div class="sensitivity-grid" id="sensitivityGrid">
          ${Engine.SENSITIVITIES.map(s => {
            const active = (p.sensitivities || []).includes(s.id);
            return `<button class="sensitivity-btn ${active ? 'active' : ''}" data-sid="${s.id}" onclick="this.classList.toggle('active')" title="${s.desc}">
              <span class="sens-icon">${s.icon}</span>
              <span class="sens-label">${s.label}</span>
            </button>`;
          }).join('')}
        </div>
        ${(p.sensitivities || []).length > 0 ? `
          <div style="margin-top:12px;padding:10px;background:var(--pink-light);border-radius:var(--radius-sm);font-size:12px;">
            <strong>Active:</strong> ${(p.sensitivities || []).map(sid => {
              const s = Engine.SENSITIVITIES.find(x => x.id === sid);
              return s ? s.icon + ' ' + s.label : sid;
            }).join(', ')}
            <br><span style="color:var(--text-light);">Recipes will show substitutions automatically.</span>
          </div>
        ` : ''}
      </div>

      <button class="btn btn-primary btn-full" onclick="App.saveProfile()" style="margin-top:8px">
        💖 Save My Profile
      </button>

      ${p.name ? `
        <div class="card" style="margin-top:16px;">
          <div class="card-title"><span class="icon">📊</span> Your Numbers</div>
          <div class="tracker-grid">
            <div class="tracker-stat">
              <div class="value">${Engine.calcBMR(p)}</div>
              <div class="label">BMR</div>
            </div>
            <div class="tracker-stat">
              <div class="value">${Engine.calcTDEE(p)}</div>
              <div class="label">TDEE</div>
            </div>
            <div class="tracker-stat">
              <div class="value">${Engine.calcGoalCalories(p)}</div>
              <div class="label">Target Cal</div>
            </div>
          </div>
          ${p.breastfeeding ? '<p style="font-size:12px;color:var(--text-light);text-align:center;">Includes +400 cal for breastfeeding 🤱</p>' : ''}
        </div>
      ` : ''}
    `;

    // Bind toggle groups
    el.querySelectorAll('.toggle-group').forEach(group => {
      group.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  },

  saveProfile() {
    const get = (id) => document.getElementById(id)?.value;
    const getToggle = (field) => {
      const active = document.querySelector(`.toggle-group[data-field="${field}"] .toggle-btn.active`);
      return active ? active.dataset.val : null;
    };

    const profile = {
      name: get('prof-name'),
      age: parseInt(get('prof-age')) || 30,
      height: parseInt(get('prof-height')) || 64,
      weight: parseFloat(get('prof-weight')) || 150,
      goalWeight: parseFloat(get('prof-goal-weight')) || 135,
      activityLevel: getToggle('activityLevel') || 'light',
      goal: getToggle('goal') || 'lose',
      breastfeeding: getToggle('breastfeeding') === 'true',
      bodyType: getToggle('bodyType') || 'mesomorph',
      sensitivities: [...document.querySelectorAll('.sensitivity-btn.active')].map(b => b.dataset.sid),
      startDate: this.state.profile?.startDate || new Date().toISOString().split('T')[0]
    };

    this.state.profile = profile;
    this.saveState();
    this.renderProfile();
    // Flash success
    const btn = document.querySelector('#tab-profile .btn-primary');
    if (btn) { btn.textContent = '✅ Saved!'; setTimeout(() => btn.textContent = '💖 Save My Profile', 1500); }
  },

  /* ── MEALS ─────────────────────────────────────────── */

  renderMeals() {
    const el = document.getElementById('tab-meals');

    if (!this.state.profile) {
      el.innerHTML = `<div class="empty-state"><span class="emoji">👩</span><p>Set up your profile first!</p>
        <button class="btn btn-primary" onclick="App.goToTab('profile')">Go to Profile</button></div>`;
      return;
    }

    if (!this.state.weekPlan) {
      el.innerHTML = `<div class="empty-state"><span class="emoji">🥗</span>
        <p>Ready to generate your personalized meal plan?</p>
        <button class="btn btn-primary btn-full" onclick="App.generatePlan()">✨ Generate My Meal Plan</button></div>`;
      return;
    }

    const plan = this.state.weekPlan;
    const summary = Engine.weekCalorieSummary(plan);

    let html = `
      <div class="card">
        <div class="card-title"><span class="icon">📊</span> Weekly Averages</div>
        <div class="macro-bar">
          <div class="macro-pill cal">🔥 ${summary.avgCalories}<br><small>cal/day</small></div>
          <div class="macro-pill protein">💪 ${summary.avgProtein}g<br><small>protein</small></div>
          <div class="macro-pill carbs">🌾 ${summary.avgCarbs}g<br><small>carbs</small></div>
          <div class="macro-pill fat">🥑 ${summary.avgFat}g<br><small>fat</small></div>
        </div>
      </div>
    `;

    plan.forEach((day, i) => {
      const mealOrder = ['breakfast','morningSnack','lunch','afternoonSnack','dinner'];
      const mealLabels = { breakfast:'Breakfast', morningSnack:'Morning Snack', lunch:'Lunch', afternoonSnack:'Afternoon Snack', dinner:'Dinner' };

      html += `
        <div class="day-card ${i === 0 ? 'open' : ''}" data-day="${i}">
          <div class="day-header ${day.carbLevel}" onclick="this.parentElement.classList.toggle('open')">
            <div>
              <div class="day-name">${day.day}</div>
              <div style="font-size:11px;color:var(--text-light)">${day.label}</div>
            </div>
            <span class="carb-badge ${day.carbLevel}">${day.carbLevel} carb</span>
          </div>
          <div class="day-body">
            ${mealOrder.map(key => {
              const meal = day.meals[key];
              if (!meal) return '';
              const portionNote = meal._portionMult && meal._portionMult !== 1
                ? `<div style="font-size:10px;color:var(--mint);font-weight:600;">${meal._portionMult}x serving</div>` : '';
              return `<div class="meal-item">
                <div style="flex:1;min-width:0;">
                  <div class="meal-label">${mealLabels[key]}</div>
                  <div class="meal-name" style="cursor:pointer" onclick="App.showRecipe('${meal.id}')">${meal.name}</div>
                  ${portionNote}
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                  <div class="meal-macros">${meal.per.cal} cal<br>${meal.per.p}p/${meal.per.c}c/${meal.per.f}f</div>
                  <button class="swap-btn" onclick="App.swapMeal(${i},'${key}')" title="Swap meal">🔄</button>
                </div>
              </div>`;
            }).join('')}
            <div class="macro-bar">
              <div class="macro-pill cal">🔥 ${day.actualMacros.calories}</div>
              <div class="macro-pill protein">💪 ${day.actualMacros.protein}g</div>
              <div class="macro-pill carbs">🌾 ${day.actualMacros.carbs}g</div>
              <div class="macro-pill fat">🥑 ${day.actualMacros.fat}g</div>
            </div>
          </div>
        </div>
      `;
    });

    html += `
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="btn btn-secondary" onclick="App.generatePlan()" style="flex:1">🔄 New Plan</button>
        <button class="btn btn-primary" onclick="App.goToTab('grocery')" style="flex:1">🛒 Grocery List</button>
      </div>
    `;

    el.innerHTML = html;
  },

  generatePlan() {
    if (!this.state.profile) {
      this.goToTab('profile');
      return;
    }
    this.state.weekPlan = Engine.generateWeekPlan(this.state.profile);
    this.state.groceryList = Engine.generateGroceryList(this.state.weekPlan);
    this.state.groceryChecked = {};
    this.saveState();
    this.renderCurrentTab();
  },

  swapMeal(dayIndex, mealKey) {
    const day = this.state.weekPlan[dayIndex];
    const current = day.meals[mealKey];
    if (!current) return;
    const pool = window.RECIPES.filter(r =>
      r.meal === current.meal && r.carbLevel === day.carbLevel && r.id !== current.id
    );
    if (pool.length === 0) return;
    day.meals[mealKey] = pool[Math.floor(Math.random() * pool.length)];
    day.actualMacros = Engine.sumMacros(day.meals);
    this.state.groceryList = Engine.generateGroceryList(this.state.weekPlan);
    this.state.groceryChecked = {};
    this.saveState();
    this.renderMeals();
  },

  showRecipe(recipeId) {
    const recipe = window.RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    const sens = this.state.profile?.sensitivities || [];
    const subs = Engine.getRecipeSubstitutions(recipe, sens);
    const subMap = {};
    subs.forEach(s => { subMap[s.original.toLowerCase()] = s; });

    const modal = document.getElementById('recipeModalBody');
    modal.innerHTML = `
      <button class="modal-close" onclick="document.getElementById('recipeModal').classList.remove('open')">✕</button>
      <h2>${recipe.name}</h2>
      <div style="display:flex;gap:8px;margin:8px 0 16px;flex-wrap:wrap;">
        <span class="carb-badge ${recipe.carbLevel}">${recipe.carbLevel} carb</span>
        <span class="workout-type-badge hiit" style="background:var(--mint-light);color:#2c8a6e;">
          ${recipe.prepFriendly ? '✅ Meal Prep' : '🍳 Fresh'}
        </span>
        ${recipe.aipFriendly ? '<span class="workout-type-badge walk">AIP ✓</span>' : ''}
      </div>
      <div class="macro-bar">
        <div class="macro-pill cal">🔥 ${recipe.per.cal}<br><small>cal</small></div>
        <div class="macro-pill protein">💪 ${recipe.per.p}g<br><small>protein</small></div>
        <div class="macro-pill carbs">🌾 ${recipe.per.c}g<br><small>carbs</small></div>
        <div class="macro-pill fat">🥑 ${recipe.per.f}g<br><small>fat</small></div>
      </div>
      <div style="font-size:13px;color:var(--text-light);margin:8px 0;">
        Serves ${recipe.servings} | Prep: ${recipe.prepTime} min${recipe.cookTime ? ' | Cook: ' + recipe.cookTime + ' min' : ''}
      </div>
      ${subs.length > 0 ? `
        <div class="sub-banner">
          <div style="font-weight:700;font-size:13px;margin-bottom:6px;">🔄 Substitutions Applied</div>
          ${subs.map(s => `<div class="sub-item">
            <span class="sub-original">${s.original}</span>
            <span class="sub-arrow">→</span>
            <span class="sub-replacement">${s.replacement}</span>
          </div>`).join('')}
        </div>
      ` : ''}
      <h3>Ingredients</h3>
      <ul class="ingredient-list">
        ${recipe.ingredients.map(ing => {
          const sub = subMap[ing.name.toLowerCase()];
          if (sub) {
            return `<li class="ing-subbed">
              <span style="text-decoration:line-through;color:var(--text-light);">${Engine.formatUnit(ing.amount, ing.unit)} ${ing.name}</span>
              <br><span style="color:var(--mint);font-weight:600;">↳ ${Engine.formatUnit(ing.amount, ing.unit)} ${sub.replacement}</span>
            </li>`;
          }
          return `<li>${Engine.formatUnit(ing.amount, ing.unit)} ${ing.name}</li>`;
        }).join('')}
      </ul>
      <h3>Instructions</h3>
      <ol class="instruction-list">
        ${recipe.instructions.map(s => `<li>${s}</li>`).join('')}
      </ol>
    `;
    document.getElementById('recipeModal').classList.add('open');
  },

  /* ── GROCERY LIST ──────────────────────────────────── */

  renderGrocery() {
    const el = document.getElementById('tab-grocery');

    if (!this.state.groceryList) {
      el.innerHTML = `<div class="empty-state"><span class="emoji">🛒</span>
        <p>Generate a meal plan first to get your grocery list!</p>
        <button class="btn btn-primary" onclick="App.generatePlan(); App.goToTab('grocery');">✨ Generate Plan</button></div>`;
      return;
    }

    const sens = this.state.profile?.sensitivities || [];
    // Deep-clone grocery list so we don't mutate state
    let list = JSON.parse(JSON.stringify(this.state.groceryList));
    if (sens.length > 0 && this.state.weekPlan) {
      list = Engine.applyGrocerySubs(list, this.state.weekPlan, sens);
    }
    const checked = this.state.groceryChecked;
    const totalItems = Object.values(list).reduce((s, items) => s + items.length, 0);
    const checkedCount = Object.keys(checked).length;

    let html = `
      <div class="card">
        <div class="card-title"><span class="icon">🛒</span> Weekly Grocery List</div>
        <div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">
          ${checkedCount} of ${totalItems} items checked
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${totalItems > 0 ? (checkedCount/totalItems*100) : 0}%"></div>
        </div>
      </div>
    `;

    Object.entries(list).forEach(([category, items]) => {
      html += `
        <div class="card grocery-category">
          <div class="grocery-cat-title">${category}</div>
          ${items.map(item => {
            const key = item.name.toLowerCase();
            const isChecked = checked[key];
            return `<div class="grocery-item ${isChecked ? 'checked' : ''}" onclick="App.toggleGrocery('${key.replace(/'/g, "\\'")}')">
              <div class="grocery-check ${isChecked ? 'checked' : ''}"></div>
              <span class="grocery-text">${item.name}</span>
              <span class="grocery-amount">${Engine.formatUnit(item.amount, item.unit)}</span>
            </div>`;
          }).join('')}
        </div>
      `;
    });

    html += `
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary" onclick="App.clearGroceryChecks()" style="flex:1">↩️ Uncheck All</button>
        <button class="btn btn-primary" onclick="window.print()" style="flex:1">🖨️ Print List</button>
      </div>
    `;

    el.innerHTML = html;
  },

  toggleGrocery(key) {
    if (this.state.groceryChecked[key]) {
      delete this.state.groceryChecked[key];
    } else {
      this.state.groceryChecked[key] = true;
    }
    this.saveState();
    this.renderGrocery();
  },

  clearGroceryChecks() {
    this.state.groceryChecked = {};
    this.saveState();
    this.renderGrocery();
  },

  /* ── WORKOUTS ──────────────────────────────────────── */

  renderWorkouts() {
    const el = document.getElementById('tab-workouts');
    const schedule = window.WEEKLY_SCHEDULE;
    const dayIndex = new Date().getDay();
    const todayIndex = dayIndex === 0 ? 6 : dayIndex - 1;

    let html = '<div class="card"><div class="card-title"><span class="icon">📅</span> This Week\'s Schedule</div>';

    schedule.forEach((day, i) => {
      const workout = window.WORKOUTS.find(w => w.id === day.workout);
      const isToday = i === todayIndex;

      html += `
        <div style="padding:10px 0;border-bottom:1px solid var(--pink-light);${isToday ? 'background:var(--pink-light);margin:0 -20px;padding:10px 20px;border-radius:8px;' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <span style="font-weight:800;font-size:14px;">${isToday ? '👉 ' : ''}${day.day}</span>
              <span class="carb-badge ${day.carbLevel}" style="margin-left:8px;">${day.carbLevel}</span>
            </div>
            <span style="font-size:12px;color:var(--text-light);">${workout.duration} min</span>
          </div>
          <div style="font-size:13px;color:var(--text);margin-top:2px;">${workout.name}</div>
        </div>
      `;
    });
    html += '</div>';

    // Today's full workout
    const todayWorkout = window.WORKOUTS.find(w => w.id === schedule[todayIndex].workout);
    html += this.renderWorkoutDetail(todayWorkout, true);

    // All workout details
    html += '<div style="margin-top:8px;">';
    window.WORKOUTS.forEach(w => {
      if (w.id !== todayWorkout.id) {
        html += this.renderWorkoutDetail(w, false);
      }
    });
    html += '</div>';

    el.innerHTML = html;
  },

  renderWorkoutDetail(workout, isToday) {
    const isHIIT = workout.type === 'hiit';
    const isWalk = workout.type === 'walk';

    let exerciseHTML = '';
    if (isHIIT || isWalk) {
      exerciseHTML = workout.exercises.map(ex => `
        <div class="exercise-item">
          <span class="exercise-icon">${ex.icon}</span>
          <span class="exercise-name">${ex.name}</span>
          <span class="exercise-detail">${ex.work}s on / ${ex.rest}s rest</span>
        </div>
      `).join('');
      if (workout.rounds > 1) {
        exerciseHTML += `<div style="text-align:center;padding:8px;color:var(--lavender);font-weight:700;font-size:13px;">
          🔁 Repeat ${workout.rounds}x (${workout.restBetweenRounds}s rest between rounds)
        </div>`;
      }
    } else {
      exerciseHTML = workout.exercises.map(ex => `
        <div class="exercise-item">
          <span class="exercise-icon">${ex.icon}</span>
          <span class="exercise-name">${ex.name}</span>
          <span class="exercise-detail">${ex.sets}×${ex.reps} @ ${ex.weight}</span>
        </div>
      `).join('');
    }

    return `
      <div class="workout-card">
        <span class="workout-type-badge ${workout.type}">${workout.type.toUpperCase()}</span>
        ${isToday ? '<span style="float:right;font-size:12px;font-weight:700;color:var(--pink-dark);">TODAY ✨</span>' : ''}
        <div class="workout-name">${workout.name}</div>
        <div class="workout-meta">
          ⏱️ ${workout.duration} min | 🔥 ~${workout.calsBurned} calories
        </div>
        <div style="font-size:12px;color:var(--mint);font-weight:600;margin-bottom:8px;">
          🟢 Warm-up: ${workout.warmup}
        </div>
        <ul class="exercise-list">${exerciseHTML}</ul>
        <div style="font-size:12px;color:var(--rose);font-weight:600;margin-top:8px;">
          🔴 Cool-down: ${workout.cooldown}
        </div>
        ${workout.notes ? `<div style="font-size:12px;color:var(--text-light);margin-top:8px;font-style:italic;">💡 ${workout.notes}</div>` : ''}
      </div>
    `;
  },

  /* ── TRACKING ──────────────────────────────────────── */

  renderTrack() {
    const el = document.getElementById('tab-track');

    // Progress analysis
    const progress = Engine.analyzeProgress(this.state.measurements);

    let html = '';

    // Measurement input
    html += `
      <div class="card">
        <div class="card-title"><span class="icon">📏</span> Log Measurements</div>
        <div class="form-row">
          <div class="form-group">
            <label>Weight (lbs)</label>
            <input type="number" id="track-weight" step="0.1" placeholder="150">
          </div>
          <div class="form-group">
            <label>Waist (in)</label>
            <input type="number" id="track-waist" step="0.1" placeholder="30">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Hips (in)</label>
            <input type="number" id="track-hips" step="0.1" placeholder="38">
          </div>
          <div class="form-group">
            <label>Bust (in)</label>
            <input type="number" id="track-bust" step="0.1" placeholder="36">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Arms (in)</label>
            <input type="number" id="track-arms" step="0.1" placeholder="12">
          </div>
          <div class="form-group">
            <label>Thighs (in)</label>
            <input type="number" id="track-thighs" step="0.1" placeholder="22">
          </div>
        </div>
        <button class="btn btn-primary btn-full" onclick="App.saveMeasurement()">📏 Save Measurements</button>
      </div>
    `;

    // Progress summary
    if (progress) {
      html += `
        <div class="card">
          <div class="card-title"><span class="icon">📈</span> Your Progress (${progress.duration} days)</div>
          <div class="tracker-grid">
            ${['weight','waist','hips','bust','arms','thighs'].map(key => {
              const val = progress[key];
              if (val === null) return '';
              const cls = val < 0 ? 'positive' : val > 0 ? 'negative' : '';
              return `<div class="tracker-stat ${cls}">
                <div class="value">${val > 0 ? '+' : ''}${val}"</div>
                <div class="label">${key}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Measurement history
    if (this.state.measurements.length > 0) {
      html += `
        <div class="card">
          <div class="card-title"><span class="icon">📋</span> History</div>
          ${this.state.measurements.slice().reverse().slice(0, 10).map(m => `
            <div class="history-item">
              <span class="history-date">${new Date(m.date).toLocaleDateString('en-US', {month:'short', day:'numeric'})}</span>
              <span class="history-values">
                ${m.weight ? m.weight + ' lbs' : ''}
                ${m.waist ? ' | W:' + m.waist + '"' : ''}
                ${m.hips ? ' | H:' + m.hips + '"' : ''}
              </span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Weight chart
    if (this.state.measurements.length >= 2) {
      html += `
        <div class="card">
          <div class="card-title"><span class="icon">📉</span> Weight Trend</div>
          <div class="chart-container"><canvas id="weightChart"></canvas></div>
        </div>
      `;
    }

    // Symptom tracking
    html += `
      <div class="card">
        <div class="card-title"><span class="icon">🩺</span> How Are You Feeling?</div>
        <p style="font-size:12px;color:var(--text-light);margin-bottom:12px;">Rate each 1-5 (1=worst, 5=best)</p>
        ${['Energy','Sleep','Mood','Bloating','Digestion','Inflammation'].map(s => `
          <div class="symptom-row">
            <span class="symptom-label">${s === 'Bloating' ? '🫧' : s === 'Inflammation' ? '🔥' : s === 'Energy' ? '⚡' : s === 'Sleep' ? '🌙' : s === 'Mood' ? '🌈' : '🌿'} ${s}</span>
            <input type="range" class="symptom-slider" id="sym-${s.toLowerCase()}" min="1" max="5" value="3"
              oninput="this.nextElementSibling.textContent=this.value">
            <span class="symptom-value">3</span>
          </div>
        `).join('')}
        <div class="form-group" style="margin-top:8px;">
          <label>Notes</label>
          <input type="text" id="sym-notes" placeholder="Anything else to note today...">
        </div>
        <button class="btn btn-primary btn-full" onclick="App.saveSymptoms()">🩺 Log Symptoms</button>
      </div>
    `;

    // Symptom advice
    const advice = Engine.getSymptomAdvice(this.state.symptoms);
    if (advice.length > 0 && this.state.symptoms.length > 0) {
      html += `
        <div class="card">
          <div class="card-title"><span class="icon">💡</span> Personalized Recommendations</div>
          ${advice.map(a => `
            <div class="advice-card">
              <div class="advice-title">${a.icon} ${a.title}</div>
              <div class="advice-text">${a.text}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    el.innerHTML = html;

    // Draw chart after DOM update
    if (this.state.measurements.length >= 2) {
      setTimeout(() => this.drawWeightChart(), 50);
    }
  },

  saveMeasurement() {
    const get = (id) => { const v = document.getElementById(id)?.value; return v ? parseFloat(v) : null; };

    const entry = {
      date: new Date().toISOString(),
      weight: get('track-weight'),
      waist: get('track-waist'),
      hips: get('track-hips'),
      bust: get('track-bust'),
      arms: get('track-arms'),
      thighs: get('track-thighs')
    };

    // Need at least weight
    if (!entry.weight) {
      alert('Please enter at least your weight!');
      return;
    }

    this.state.measurements.push(entry);

    // Update profile weight
    if (this.state.profile) {
      this.state.profile.weight = entry.weight;
    }

    this.saveState();
    this.renderTrack();
  },

  saveSymptoms() {
    const get = (id) => parseInt(document.getElementById(id)?.value) || 3;

    const entry = {
      date: new Date().toISOString(),
      energy: get('sym-energy'),
      sleep: get('sym-sleep'),
      mood: get('sym-mood'),
      bloating: get('sym-bloating'),
      digestion: get('sym-digestion'),
      inflammation: get('sym-inflammation'),
      notes: document.getElementById('sym-notes')?.value || ''
    };

    this.state.symptoms.push(entry);
    this.saveState();
    this.renderTrack();
  },

  /* ── WEIGHT CHART (simple canvas) ──────────────────── */

  drawWeightChart() {
    const canvas = document.getElementById('weightChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = 400;
    ctx.scale(2, 2);

    const data = this.state.measurements.map(m => m.weight).filter(Boolean);
    if (data.length < 2) return;

    const w = rect.width;
    const h = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 45 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    const min = Math.min(...data) - 2;
    const max = Math.max(...data) + 2;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#F5D5E5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#8A8A8A';
      ctx.font = '10px Nunito';
      ctx.textAlign = 'right';
      const val = max - ((max - min) / 4) * i;
      ctx.fillText(val.toFixed(0), padding.left - 5, y + 3);
    }

    // Line
    ctx.strokeStyle = '#E8A0BF';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    data.forEach((val, i) => {
      const x = padding.left + (plotW / (data.length - 1)) * i;
      const y = padding.top + plotH - ((val - min) / (max - min)) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Gradient fill
    const grad = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    grad.addColorStop(0, 'rgba(232,160,191,0.3)');
    grad.addColorStop(1, 'rgba(232,160,191,0)');
    ctx.lineTo(padding.left + plotW, h - padding.bottom);
    ctx.lineTo(padding.left, h - padding.bottom);
    ctx.fillStyle = grad;
    ctx.fill();

    // Dots
    data.forEach((val, i) => {
      const x = padding.left + (plotW / (data.length - 1)) * i;
      const y = padding.top + plotH - ((val - min) / (max - min)) * plotH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#BA90C6';
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Date labels
    ctx.fillStyle = '#8A8A8A';
    ctx.font = '9px Nunito';
    ctx.textAlign = 'center';
    const dates = this.state.measurements.filter(m => m.weight).map(m => m.date);
    const step = Math.max(1, Math.floor(dates.length / 5));
    dates.forEach((d, i) => {
      if (i % step === 0 || i === dates.length - 1) {
        const x = padding.left + (plotW / (dates.length - 1)) * i;
        const label = new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ctx.fillText(label, x, h - 8);
      }
    });
  },

  /* ── TODAY (GAMIFIED DAILY CHECKLIST) ────────────────── */

  getTodayKey() { return new Date().toISOString().split('T')[0]; },

  getTodayChecks() {
    const key = this.getTodayKey();
    if (!this.state.dailyChecks[key]) this.state.dailyChecks[key] = {};
    return this.state.dailyChecks[key];
  },

  getDailyTasks() {
    const dayIndex = new Date().getDay();
    const schedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    const todaySchedule = window.WEEKLY_SCHEDULE[schedIndex];
    const todayWorkout = window.WORKOUTS.find(w => w.id === todaySchedule.workout);

    const tasks = [
      { id: 'breakfast', icon: '🌅', text: 'Eat Breakfast', sub: this.state.weekPlan ? this.state.weekPlan[schedIndex]?.meals?.breakfast?.name : 'Follow meal plan', xp: 15 },
      { id: 'snack1',    icon: '🍎', text: 'Morning Snack', sub: this.state.weekPlan ? this.state.weekPlan[schedIndex]?.meals?.morningSnack?.name : 'Healthy snack', xp: 10 },
      { id: 'lunch',     icon: '☀️', text: 'Eat Lunch', sub: this.state.weekPlan ? this.state.weekPlan[schedIndex]?.meals?.lunch?.name : 'Follow meal plan', xp: 15 },
      { id: 'snack2',    icon: '🍵', text: 'Afternoon Snack', sub: this.state.weekPlan ? this.state.weekPlan[schedIndex]?.meals?.afternoonSnack?.name : 'Healthy snack', xp: 10 },
      { id: 'dinner',    icon: '🌙', text: 'Eat Dinner', sub: this.state.weekPlan ? this.state.weekPlan[schedIndex]?.meals?.dinner?.name : 'Follow meal plan', xp: 15 },
      { id: 'workout',   icon: todayWorkout.type === 'hiit' ? '🔥' : todayWorkout.type === 'walk' ? '🚶‍♀️' : '🏋️', text: `Complete Workout`, sub: `${todayWorkout.name} (${todayWorkout.duration} min)`, xp: 25 },
      { id: 'water',     icon: '💧', text: 'Drink 8 Glasses of Water', sub: 'Tap glasses below to track', xp: 15, type: 'water' },
      { id: 'supplements', icon: '💊', text: 'Take Supplements', sub: 'Vitamins, collagen, probiotics', xp: 10 },
      { id: 'sleep',     icon: '😴', text: 'Get 7+ Hours Sleep', sub: 'Wind down by 10pm', xp: 10 },
      { id: 'nosugar',   icon: '🚫', text: 'No Processed Sugar', sub: 'Stay anti-inflammatory!', xp: 15 },
      { id: 'symptoms',  icon: '📝', text: 'Log Symptoms', sub: 'Track how you feel today', xp: 10, action: 'track' },
    ];
    return tasks;
  },

  getLevel(xp) {
    const levels = [
      { min: 0, name: 'Seedling', icon: '🌱' },
      { min: 100, name: 'Sprout', icon: '🌿' },
      { min: 300, name: 'Bloomer', icon: '🌷' },
      { min: 600, name: 'Blossom', icon: '🌸' },
      { min: 1000, name: 'Rose', icon: '🌹' },
      { min: 1500, name: 'Sunflower', icon: '🌻' },
      { min: 2500, name: 'Butterfly', icon: '🦋' },
      { min: 4000, name: 'Crown', icon: '👑' },
      { min: 6000, name: 'Diamond', icon: '💎' },
      { min: 10000, name: 'Goddess', icon: '✨' },
    ];
    let current = levels[0];
    let next = levels[1];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].min) {
        current = levels[i];
        next = levels[i + 1] || null;
        break;
      }
    }
    return { current, next, progress: next ? (xp - current.min) / (next.min - current.min) : 1 };
  },

  renderToday() {
    const el = document.getElementById('tab-today');

    if (!this.state.profile) {
      el.innerHTML = `<div class="empty-state"><span class="emoji">👩</span><p>Set up your profile first!</p>
        <button class="btn btn-primary" onclick="App.goToTab('profile')">Go to Profile</button></div>`;
      return;
    }

    const checks = this.getTodayChecks();
    const tasks = this.getDailyTasks();
    const completedCount = tasks.filter(t => t.type === 'water' ? (checks.water >= 8) : checks[t.id]).length;
    const totalTasks = tasks.length;
    const pct = Math.round(completedCount / totalTasks * 100);

    const level = this.getLevel(this.state.xp);
    const streak = this.state.streak || 0;

    const todayXP = tasks.reduce((sum, t) => {
      if (t.type === 'water') return sum + (checks.water >= 8 ? t.xp : 0);
      return sum + (checks[t.id] ? t.xp : 0);
    }, 0);

    const motivation = pct === 100 ? "You're a queen! 👑 All done!"
      : pct >= 75 ? "Almost there, keep going! 💪"
      : pct >= 50 ? "Halfway through, you got this! 🔥"
      : pct >= 25 ? "Great start, keep it up! 🌟"
      : "Let's crush today! ✨";

    let html = `
      <div class="card checklist-header">
        <div style="display:flex;justify-content:center;gap:10px;margin-bottom:8px;">
          <span class="level-badge">${level.current.icon} ${level.current.name}</span>
          <span class="streak-badge">🔥 ${streak} day streak</span>
        </div>
        <div style="font-size:32px;font-weight:800;color:var(--pink-dark);">${pct}%</div>
        <div style="font-size:13px;color:var(--text-light);margin-bottom:4px;">${motivation}</div>
        <div class="xp-bar-container">
          <div class="xp-bar-fill" style="width:${pct}%"></div>
          <div class="xp-bar-text">${completedCount}/${totalTasks} tasks</div>
        </div>
        <div style="font-size:11px;color:var(--text-light);margin-top:4px;">
          ✨ ${todayXP} XP today | 💰 ${this.state.xp} XP total
          ${level.next ? ` | ${level.next.min - this.state.xp} XP to ${level.next.icon} ${level.next.name}` : ''}
        </div>
      </div>
    `;

    html += `<div class="card">`;
    tasks.forEach(task => {
      if (task.type === 'water') {
        const glasses = checks.water || 0;
        const waterDone = glasses >= 8;
        html += `
          <div class="check-task ${waterDone ? 'done' : ''}">
            <div class="check-circle">${task.icon}</div>
            <div class="check-info">
              <div class="check-text">${task.text}</div>
              <div class="check-sub">${glasses}/8 glasses</div>
              <div class="water-glasses">
                ${Array.from({length: 8}, (_, i) => `
                  <div class="water-glass ${i < glasses ? 'filled' : ''}" onclick="App.setWater(${i + 1})">
                    ${i < glasses ? '💧' : ''}
                  </div>
                `).join('')}
              </div>
            </div>
            <span class="check-xp">+${task.xp} XP</span>
          </div>
        `;
        return;
      }

      const done = !!checks[task.id];
      html += `
        <div class="check-task ${done ? 'done' : ''}" onclick="App.toggleDailyTask('${task.id}', ${task.xp}${task.action ? ", '" + task.action + "'" : ''})">
          <div class="check-circle"></div>
          <div class="check-info">
            <div class="check-text">${task.icon} ${task.text}</div>
            <div class="check-sub">${task.sub}</div>
          </div>
          <span class="check-xp">${done ? '✅' : '+'} ${task.xp} XP</span>
        </div>
      `;
    });
    html += `</div>`;

    // Bonus section
    html += `
      <div class="card">
        <div class="card-title"><span class="icon">🏆</span> Bonus Challenges</div>
        <div class="check-task ${checks.bonus_walk ? 'done' : ''}" onclick="App.toggleDailyTask('bonus_walk', 20)">
          <div class="check-circle"></div>
          <div class="check-info">
            <div class="check-text">🚶‍♀️ Extra 10-Min Walk</div>
            <div class="check-sub">Any time of day — stroller walks count!</div>
          </div>
          <span class="check-xp">+20 XP</span>
        </div>
        <div class="check-task ${checks.bonus_prep ? 'done' : ''}" onclick="App.toggleDailyTask('bonus_prep', 20)">
          <div class="check-circle"></div>
          <div class="check-info">
            <div class="check-text">🥘 Meal Prep for Tomorrow</div>
            <div class="check-sub">Prep breakfast or lunch ahead</div>
          </div>
          <span class="check-xp">+20 XP</span>
        </div>
        <div class="check-task ${checks.bonus_journal ? 'done' : ''}" onclick="App.toggleDailyTask('bonus_journal', 15)">
          <div class="check-circle"></div>
          <div class="check-info">
            <div class="check-text">📓 Gratitude Journal</div>
            <div class="check-sub">Write 3 things you're grateful for</div>
          </div>
          <span class="check-xp">+15 XP</span>
        </div>
      </div>
    `;

    el.innerHTML = html;
  },

  toggleDailyTask(taskId, xp, action) {
    const checks = this.getTodayChecks();
    if (checks[taskId]) {
      // Uncheck — remove XP
      delete checks[taskId];
      this.state.xp = Math.max(0, this.state.xp - xp);
    } else {
      checks[taskId] = true;
      this.state.xp += xp;
    }
    this.saveState();
    this.renderToday();

    // Check if all main tasks complete
    const tasks = this.getDailyTasks();
    const allDone = tasks.every(t => t.type === 'water' ? (checks.water >= 8) : checks[t.id]);
    if (allDone) this.celebrate();

    // Navigate to action tab if specified
    if (action && checks[taskId]) {
      setTimeout(() => this.goToTab(action), 300);
    }
  },

  setWater(count) {
    const checks = this.getTodayChecks();
    const prevCount = checks.water || 0;
    // Toggle: if clicking the same glass, unfill it
    if (count === prevCount) {
      checks.water = count - 1;
    } else {
      checks.water = count;
    }
    // Award XP when hitting 8
    if (prevCount < 8 && checks.water >= 8) {
      this.state.xp += 15;
    } else if (prevCount >= 8 && checks.water < 8) {
      this.state.xp = Math.max(0, this.state.xp - 15);
    }
    this.saveState();
    this.renderToday();

    const tasks = this.getDailyTasks();
    const allDone = tasks.every(t => t.type === 'water' ? (checks.water >= 8) : checks[t.id]);
    if (allDone) this.celebrate();
  },

  celebrate() {
    // Update streak
    const today = this.getTodayKey();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (this.state.lastCompleteDate === yesterday || this.state.lastCompleteDate === today) {
      if (this.state.lastCompleteDate !== today) this.state.streak++;
    } else {
      this.state.streak = 1;
    }
    this.state.lastCompleteDate = today;

    // Bonus XP for completion
    this.state.xp += 50;
    this.saveState();

    // Show celebration
    const overlay = document.getElementById('celebrationOverlay');
    const level = this.getLevel(this.state.xp);
    document.getElementById('celebrationXP').textContent = `+50 bonus XP! (${this.state.xp} total)`;

    // Generate confetti
    const confettiEl = document.getElementById('confetti');
    confettiEl.innerHTML = '';
    const colors = ['#E8A0BF', '#BA90C6', '#C0DBEA', '#F5C37D', '#7EC8B0', '#E6958A', '#FFD700'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.animationDuration = (1.5 + Math.random()) + 's';
      piece.style.width = (6 + Math.random() * 6) + 'px';
      piece.style.height = (6 + Math.random() * 6) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confettiEl.appendChild(piece);
    }

    overlay.classList.add('open');
  },

  closeCelebration() {
    document.getElementById('celebrationOverlay').classList.remove('open');
    this.renderToday();
  },

  /* ── HELPERS ───────────────────────────────────────── */

  goToTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    this.state.currentTab = tab;
    this.renderCurrentTab();
    window.scrollTo(0, 0);
  }
};

/* ── BOOT ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => App.init());
