/* ============================================================
   WELLNESS ENGINE
   Calorie calculations, meal plan generation, grocery lists,
   symptom-based adjustments
   ============================================================ */

const Engine = {

  /* ── BMR & TDEE ──────────────────────────────────────── */

  calcBMR(profile) {
    // Mifflin-St Jeor (women)
    const wtKg = profile.weight * 0.453592;
    const htCm = profile.height * 2.54;
    return Math.round(10 * wtKg + 6.25 * htCm - 5 * profile.age - 161);
  },

  calcTDEE(profile) {
    const bmr = this.calcBMR(profile);
    const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    let tdee = Math.round(bmr * (mult[profile.activityLevel] || 1.375));
    // Breastfeeding adds ~400 cal
    if (profile.breastfeeding) tdee += 400;
    return tdee;
  },

  calcGoalCalories(profile) {
    const tdee = this.calcTDEE(profile);
    if (profile.goal === 'lose') return Math.round(tdee - 350); // gentle deficit
    if (profile.goal === 'gain') return Math.round(tdee + 300);
    return tdee;
  },

  /* ── MACRO TARGETS by carb day ───────────────────────── */

  getMacros(calories, carbLevel) {
    const splits = {
      low:      { c: 0.15, p: 0.40, f: 0.45 },
      moderate: { c: 0.30, p: 0.35, f: 0.35 },
      high:     { c: 0.45, p: 0.30, f: 0.25 }
    };
    const s = splits[carbLevel] || splits.moderate;
    return {
      calories,
      carbs: Math.round(calories * s.c / 4),
      protein: Math.round(calories * s.p / 4),
      fat: Math.round(calories * s.f / 9)
    };
  },

  /* ── MEAL PLAN GENERATOR ─────────────────────────────── */

  generateWeekPlan(profile) {
    const cals = this.calcGoalCalories(profile);
    const plan = [];

    window.WEEKLY_SCHEDULE.forEach((dayInfo, i) => {
      const carbLevel = dayInfo.carbLevel;
      const macros = this.getMacros(cals, carbLevel);
      const meals = this.pickMeals(carbLevel, macros);
      const workout = window.WORKOUTS.find(w => w.id === dayInfo.workout);

      // Scale portions to match target calories
      const rawTotal = this.sumMacros(meals);
      const mult = rawTotal.calories > 0 ? cals / rawTotal.calories : 1;
      const scaledMeals = {};
      Object.entries(meals).forEach(([key, recipe]) => {
        if (!recipe) { scaledMeals[key] = recipe; return; }
        scaledMeals[key] = Object.assign({}, recipe, {
          per: {
            cal: Math.round(recipe.per.cal * mult),
            p: Math.round(recipe.per.p * mult),
            c: Math.round(recipe.per.c * mult),
            f: Math.round(recipe.per.f * mult),
            fiber: Math.round((recipe.per.fiber || 0) * mult)
          },
          _portionMult: Math.round(mult * 10) / 10,
          _origPer: recipe.per
        });
      });

      plan.push({
        dayIndex: i,
        day: dayInfo.day,
        carbLevel,
        label: dayInfo.label,
        targetMacros: macros,
        meals: scaledMeals,
        actualMacros: this.sumMacros(scaledMeals),
        portionMultiplier: Math.round(mult * 10) / 10,
        workout
      });
    });

    return plan;
  },

  pickMeals(carbLevel, targetMacros) {
    const recipes = window.RECIPES;
    const pick = (meal, level) => {
      const pool = recipes.filter(r => r.meal === meal && r.carbLevel === level);
      if (pool.length === 0) {
        // fallback to moderate
        const fallback = recipes.filter(r => r.meal === meal && r.carbLevel === 'moderate');
        return fallback[Math.floor(Math.random() * fallback.length)] || recipes.find(r => r.meal === meal);
      }
      return pool[Math.floor(Math.random() * pool.length)];
    };

    // For snacks, pick 2 (morning + afternoon)
    const snackPool = recipes.filter(r => r.meal === 'snack' && r.carbLevel === carbLevel);
    const snackFallback = recipes.filter(r => r.meal === 'snack');
    const snack1 = snackPool[0] || snackFallback[0];
    const snack2 = snackPool[1] || snackFallback[1] || snack1;

    return {
      breakfast: pick('breakfast', carbLevel),
      morningSnack: snack1,
      lunch: pick('lunch', carbLevel),
      afternoonSnack: snack2,
      dinner: pick('dinner', carbLevel)
    };
  },

  sumMacros(meals) {
    let cal = 0, p = 0, c = 0, f = 0;
    Object.values(meals).forEach(r => {
      if (r && r.per) {
        cal += r.per.cal;
        p += r.per.p;
        c += r.per.c;
        f += r.per.f;
      }
    });
    return { calories: cal, protein: p, carbs: c, fat: f };
  },

  /* ── GROCERY LIST GENERATOR ──────────────────────────── */

  generateGroceryList(plan) {
    const items = {};

    plan.forEach(day => {
      const mult = day.portionMultiplier || 1;
      Object.values(day.meals).forEach(recipe => {
        if (!recipe || !recipe.ingredients) return;
        recipe.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase();
          if (!items[key]) {
            items[key] = { name: ing.name, amount: 0, unit: ing.unit, cat: ing.cat };
          }
          // Scale by servings and portion multiplier
          const perServing = ing.amount / (recipe.servings || 1);
          items[key].amount += perServing * mult;
        });
      });
    });

    // Round amounts nicely
    Object.values(items).forEach(item => {
      if (item.unit === 'whole' || item.unit === 'large' || item.unit === 'medium') {
        item.amount = Math.ceil(item.amount);
      } else if (item.unit === 'lbs') {
        item.amount = Math.round(item.amount * 4) / 4; // quarter pound
      } else {
        item.amount = Math.round(item.amount * 100) / 100;
      }
    });

    // Group by category
    const categories = {};
    const catLabels = {
      produce: '🥬 Produce',
      protein: '🥩 Protein',
      pantry: '🫙 Pantry',
      refrigerated: '🧊 Refrigerated',
      frozen: '❄️ Frozen'
    };

    Object.values(items).forEach(item => {
      const catKey = catLabels[item.cat] || '📦 Other';
      if (!categories[catKey]) categories[catKey] = [];
      categories[catKey].push(item);
    });

    // Sort each category alphabetically
    Object.keys(categories).forEach(cat => {
      categories[cat].sort((a, b) => a.name.localeCompare(b.name));
    });

    return categories;
  },

  /* ── SYMPTOM-BASED ADJUSTMENTS ───────────────────────── */

  getSymptomAdvice(symptoms) {
    const advice = [];
    const latest = symptoms[symptoms.length - 1];
    if (!latest) return advice;

    // Average last 3 entries
    const recent = symptoms.slice(-3);
    const avg = (key) => recent.reduce((s, e) => s + (e[key] || 3), 0) / recent.length;

    if (avg('energy') < 2.5) {
      advice.push({
        icon: '😴',
        title: 'Low Energy Detected',
        text: 'Consider increasing carbs by 10-15%. Add a serving of sweet potato or banana to your highest-activity day. Make sure you\'re getting enough iron from leafy greens and red meat.',
        action: 'increase_carbs'
      });
    }

    if (avg('bloating') > 3.5) {
      advice.push({
        icon: '🫧',
        title: 'Bloating Pattern',
        text: 'Try eliminating raw cruciferous veggies (broccoli, cabbage) for a week. Cook all vegetables well. Add bone broth and ginger tea. Consider a digestive enzyme.',
        action: 'reduce_fodmap'
      });
    }

    if (avg('sleep') < 2.5) {
      advice.push({
        icon: '🌙',
        title: 'Sleep Quality Low',
        text: 'Add magnesium-rich foods (leafy greens, avocado). Move carbs to dinner to boost serotonin. Avoid caffeine after noon. Try chamomile tea before bed.',
        action: 'sleep_support'
      });
    }

    if (avg('mood') < 2.5) {
      advice.push({
        icon: '🌈',
        title: 'Mood Support Needed',
        text: 'Increase omega-3s (salmon 3x/week). Add vitamin D-rich foods. Consider reducing workout intensity this week and prioritizing walks in sunlight.',
        action: 'mood_support'
      });
    }

    if (avg('digestion') < 2.5) {
      advice.push({
        icon: '🌿',
        title: 'Digestive Support',
        text: 'Incorporate more bone broth and cooked vegetables. Avoid raw foods temporarily. Add fermented foods slowly (coconut yogurt, sauerkraut). Chew food thoroughly.',
        action: 'gut_healing'
      });
    }

    if (avg('inflammation') > 3.5) {
      advice.push({
        icon: '🔥',
        title: 'Inflammation Flare',
        text: 'Strict AIP this week — remove any reintroduced foods. Double your turmeric and ginger intake. Focus on salmon and leafy greens. Replace HIIT with walking.',
        action: 'strict_aip'
      });
    }

    if (advice.length === 0) {
      advice.push({
        icon: '✨',
        title: 'Looking Great!',
        text: 'Your symptoms are trending well! Keep up the current plan. Your body is responding beautifully to the anti-inflammatory approach.',
        action: 'none'
      });
    }

    return advice;
  },

  /* ── MEASUREMENT ANALYSIS ────────────────────────────── */

  analyzeProgress(measurements) {
    if (measurements.length < 2) return null;
    const first = measurements[0];
    const last = measurements[measurements.length - 1];

    const diff = (key) => {
      if (first[key] && last[key]) return +(last[key] - first[key]).toFixed(1);
      return null;
    };

    const allKeys = ['weight','bodyFat','neck','shoulders','bust','underBust','waist','belly',
                     'hips','glutes','bicepL','bicepR','forearmL','forearmR','thighL','thighR','calfL','calfR'];
    const result = {
      duration: Math.round((new Date(last.date) - new Date(first.date)) / 86400000),
      totalEntries: measurements.length
    };
    allKeys.forEach(k => { result[k] = diff(k); });
    return result;
  },

  /* ── WEEKLY CALORIE SUMMARY ──────────────────────────── */

  weekCalorieSummary(plan) {
    let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
    plan.forEach(d => {
      const m = d.actualMacros;
      totalCal += m.calories;
      totalP += m.protein;
      totalC += m.carbs;
      totalF += m.fat;
    });
    return {
      avgCalories: Math.round(totalCal / 7),
      avgProtein: Math.round(totalP / 7),
      avgCarbs: Math.round(totalC / 7),
      avgFat: Math.round(totalF / 7),
      totalCalories: totalCal
    };
  },

  /* ── HELPER: format macros for display ───────────────── */

  formatUnit(amount, unit) {
    if (amount === 0) return '';
    if (unit === 'whole' || unit === 'large' || unit === 'medium') return `${amount}`;
    if (amount < 1) {
      const fracs = { 0.25: '1/4', 0.33: '1/3', 0.5: '1/2', 0.75: '3/4', 0.125: '1/8' };
      const closest = Object.keys(fracs).reduce((a, b) =>
        Math.abs(b - amount) < Math.abs(a - amount) ? b : a
      );
      if (Math.abs(closest - amount) < 0.1) return `${fracs[closest]} ${unit}`;
    }
    return `${amount} ${unit}`;
  }
};

/* ── ALLERGEN / SENSITIVITY SYSTEM ────────────────────── */

Engine.SENSITIVITIES = [
  { id: 'dairy',       label: 'Dairy',         icon: '🥛', desc: 'Milk, cheese, yogurt, butter, whey' },
  { id: 'eggs',        label: 'Eggs',           icon: '🥚', desc: 'Whole eggs, egg whites, mayo' },
  { id: 'gluten',      label: 'Gluten',         icon: '🌾', desc: 'Wheat, barley, rye, spelt' },
  { id: 'nuts',        label: 'Tree Nuts',      icon: '🥜', desc: 'Almonds, walnuts, cashews, pecans' },
  { id: 'seeds',       label: 'Seeds',          icon: '🌻', desc: 'Sunflower, sesame, flax, chia, hemp' },
  { id: 'nightshades', label: 'Nightshades',    icon: '🌶️', desc: 'Tomatoes, peppers, potatoes, eggplant' },
  { id: 'soy',         label: 'Soy',            icon: '🫘', desc: 'Tofu, tempeh, soy sauce, edamame' },
  { id: 'corn',        label: 'Corn',           icon: '🌽', desc: 'Corn, cornstarch, corn syrup' },
  { id: 'shellfish',   label: 'Shellfish',      icon: '🦐', desc: 'Shrimp, crab, lobster, mussels' },
  { id: 'fish',        label: 'Fish',           icon: '🐟', desc: 'Salmon, tuna, cod, sardines' },
  { id: 'coconut',     label: 'Coconut',        icon: '🥥', desc: 'Coconut milk, oil, cream, flakes' },
  { id: 'fodmap',      label: 'High FODMAP',    icon: '🧅', desc: 'Onions, garlic, apples, honey' },
  { id: 'histamine',   label: 'Histamine',      icon: '⚠️', desc: 'Fermented foods, aged meats, avocado' },
  { id: 'caffeine',    label: 'Caffeine',       icon: '☕', desc: 'Coffee, tea, chocolate' },
  { id: 'sugar',       label: 'Added Sugar',    icon: '🍬', desc: 'Maple syrup, honey, coconut sugar' }
];

/* Map ingredient names → sensitivity IDs */
Engine.INGREDIENT_ALLERGENS = {
  'eggs':               ['eggs'],
  'egg whites':         ['eggs'],
  'coconut milk (full fat canned)': ['coconut'],
  'coconut oil':        ['coconut'],
  'coconut butter':     ['coconut'],
  'coconut flakes (unsweetened)': ['coconut'],
  'coconut yogurt (unsweetened)': ['coconut'],
  'coconut aminos':     ['coconut'],
  'wild salmon fillet':  ['fish'],
  'wild canned tuna':   ['fish'],
  'wild white fish (cod or mahi)': ['fish'],
  'chia seeds':         ['seeds'],
  'hemp hearts':        ['seeds'],
  'ground flaxseed':    ['seeds'],
  'sunflower seed butter': ['seeds'],
  'sesame oil (if tolerated)': ['seeds'],
  'yellow onion':       ['fodmap'],
  'garlic cloves':      ['fodmap'],
  'avocado':            ['histamine'],
  'maple syrup':        ['sugar'],
  'fresh blueberries':  [],
  'fresh raspberries':  [],
  'green apple':        ['fodmap'],
  'pitted dates':       ['fodmap','sugar'],
  'ripe banana':        ['fodmap'],
  'kalamata olives':    ['histamine'],
  'nutritional yeast (if tolerated)': ['histamine'],
  'collagen peptides':  [],
  'bone broth':         ['histamine'],
  'cassava flour':      [],
  'cassava tortillas':  [],
  'green plantain':     [],
  'sweet potato':       [],
};

/* Substitution map: ingredient → { for: [sensitivity], sub: replacement name, unit, cat } */
Engine.SUBSTITUTIONS = {
  'eggs': {
    for: ['eggs'],
    sub: 'gelatin egg (1 tbsp gelatin + 3 tbsp water per egg)',
    unit: 'large', cat: 'pantry', groceryName: 'unflavored gelatin'
  },
  'coconut milk (full fat canned)': {
    for: ['coconut'],
    sub: 'tiger nut milk',
    unit: 'cups', cat: 'pantry', groceryName: 'tiger nut milk'
  },
  'coconut oil': {
    for: ['coconut'],
    sub: 'avocado oil',
    unit: 'tbsp', cat: 'pantry', groceryName: 'avocado oil'
  },
  'coconut butter': {
    for: ['coconut'],
    sub: 'sunflower seed butter',
    unit: 'tbsp', cat: 'pantry', groceryName: 'sunflower seed butter'
  },
  'coconut flakes (unsweetened)': {
    for: ['coconut'],
    sub: 'crushed freeze-dried fruit',
    unit: 'tbsp', cat: 'pantry', groceryName: 'freeze-dried fruit'
  },
  'coconut yogurt (unsweetened)': {
    for: ['coconut'],
    sub: 'tiger nut yogurt (or cashew yogurt if tolerated)',
    unit: 'cup', cat: 'refrigerated', groceryName: 'dairy-free yogurt (non-coconut)'
  },
  'coconut aminos': {
    for: ['coconut'],
    sub: 'balsamic vinegar + sea salt',
    unit: 'tbsp', cat: 'pantry', groceryName: 'balsamic vinegar'
  },
  'wild salmon fillet': {
    for: ['fish'],
    sub: 'chicken thighs (boneless)',
    unit: 'lbs', cat: 'protein', groceryName: 'chicken thighs (boneless)'
  },
  'wild canned tuna': {
    for: ['fish'],
    sub: 'canned chicken breast',
    unit: 'cans (5oz)', cat: 'pantry', groceryName: 'canned chicken breast'
  },
  'wild white fish (cod or mahi)': {
    for: ['fish'],
    sub: 'chicken breast',
    unit: 'lbs', cat: 'protein', groceryName: 'chicken breast'
  },
  'chia seeds': {
    for: ['seeds'],
    sub: 'arrowroot powder',
    unit: 'cup', cat: 'pantry', groceryName: 'arrowroot powder'
  },
  'hemp hearts': {
    for: ['seeds'],
    sub: 'collagen peptides',
    unit: 'tbsp', cat: 'pantry', groceryName: 'collagen peptides'
  },
  'ground flaxseed': {
    for: ['seeds'],
    sub: 'extra collagen peptides',
    unit: 'tbsp', cat: 'pantry', groceryName: 'collagen peptides'
  },
  'sunflower seed butter': {
    for: ['seeds'],
    sub: 'coconut butter',
    unit: 'tbsp', cat: 'pantry', groceryName: 'coconut butter'
  },
  'sesame oil (if tolerated)': {
    for: ['seeds'],
    sub: 'extra virgin olive oil',
    unit: 'tsp', cat: 'pantry', groceryName: 'extra virgin olive oil'
  },
  'yellow onion': {
    for: ['fodmap'],
    sub: 'leek greens (green part only)',
    unit: 'medium', cat: 'produce', groceryName: 'leeks'
  },
  'garlic cloves': {
    for: ['fodmap'],
    sub: 'garlic-infused olive oil (1 tsp per clove)',
    unit: 'whole', cat: 'pantry', groceryName: 'garlic-infused olive oil'
  },
  'avocado': {
    for: ['histamine'],
    sub: 'mashed sweet potato or cucumber',
    unit: 'whole', cat: 'produce', groceryName: 'sweet potato'
  },
  'maple syrup': {
    for: ['sugar'],
    sub: 'mashed banana or date paste',
    unit: 'tbsp', cat: 'produce', groceryName: 'pitted dates'
  },
  'green apple': {
    for: ['fodmap'],
    sub: 'firm pear',
    unit: 'medium', cat: 'produce', groceryName: 'firm pear'
  },
  'pitted dates': {
    for: ['fodmap', 'sugar'],
    sub: 'mashed ripe plantain',
    unit: 'cup', cat: 'produce', groceryName: 'ripe plantain'
  },
  'ripe banana': {
    for: ['fodmap'],
    sub: 'mashed plantain',
    unit: 'medium', cat: 'produce', groceryName: 'green plantain'
  },
  'kalamata olives': {
    for: ['histamine'],
    sub: 'cucumber slices with sea salt',
    unit: 'whole', cat: 'produce', groceryName: 'cucumber'
  },
  'nutritional yeast (if tolerated)': {
    for: ['histamine'],
    sub: 'extra herbs and lemon zest',
    unit: 'tbsp', cat: 'produce', groceryName: 'fresh lemon'
  },
  'bone broth': {
    for: ['histamine'],
    sub: 'meat stock (cooked < 2 hours)',
    unit: 'cups', cat: 'pantry', groceryName: 'meat stock'
  },
};

/**
 * Get allergens present in a recipe, given active sensitivities
 */
Engine.getRecipeAllergens = function(recipe, sensitivities) {
  if (!sensitivities || sensitivities.length === 0 || !recipe.ingredients) return [];
  const found = new Set();
  recipe.ingredients.forEach(ing => {
    const key = ing.name.toLowerCase();
    // Check explicit map
    const mapped = this.INGREDIENT_ALLERGENS[ing.name] || this.INGREDIENT_ALLERGENS[key];
    if (mapped) {
      mapped.forEach(a => { if (sensitivities.includes(a)) found.add(a); });
    }
    // Keyword fallback
    sensitivities.forEach(s => {
      if (s === 'coconut' && key.includes('coconut')) found.add(s);
      if (s === 'eggs' && (key === 'eggs' || key.includes('egg '))) found.add(s);
      if (s === 'fish' && (key.includes('salmon') || key.includes('tuna') || key.includes('fish') || key.includes('cod') || key.includes('mahi'))) found.add(s);
      if (s === 'nuts' && (key.includes('almond') || key.includes('walnut') || key.includes('cashew') || key.includes('pecan'))) found.add(s);
      if (s === 'seeds' && (key.includes('seed') || key.includes('hemp') || key.includes('flax') || key.includes('chia') || key.includes('sesame'))) found.add(s);
      if (s === 'dairy' && (key.includes('milk') && !key.includes('coconut') && !key.includes('tiger nut') || key.includes('cheese') || key.includes('butter') && !key.includes('coconut') && !key.includes('sunflower') && !key.includes('seed'))) found.add(s);
      if (s === 'gluten' && (key.includes('wheat') || key.includes('flour') && !key.includes('cassava') && !key.includes('coconut') && !key.includes('arrowroot') && !key.includes('tapioca') && !key.includes('tigernut'))) found.add(s);
      if (s === 'nightshades' && (key.includes('tomato') || key.includes('pepper') && !key.includes('peppercorn') || key.includes('paprika') || key.includes('potato') && !key.includes('sweet potato'))) found.add(s);
    });
  });
  return [...found];
};

/**
 * Get substitutions for a recipe given active sensitivities.
 * Returns array of { original, replacement, sensitivity }
 */
Engine.getRecipeSubstitutions = function(recipe, sensitivities) {
  if (!sensitivities || sensitivities.length === 0 || !recipe.ingredients) return [];
  const subs = [];
  recipe.ingredients.forEach(ing => {
    const subInfo = this.SUBSTITUTIONS[ing.name];
    if (subInfo && subInfo.for.some(s => sensitivities.includes(s))) {
      // Don't substitute if the substitution itself triggers another sensitivity
      // e.g., sub coconut butter for seeds, but user is also coconut sensitive
      const subAllergens = this.INGREDIENT_ALLERGENS[subInfo.groceryName] || [];
      const wouldTrigger = subAllergens.some(a => sensitivities.includes(a));
      subs.push({
        original: ing.name,
        replacement: wouldTrigger ? `omit or find alternative for ${ing.name}` : subInfo.sub,
        sensitivity: subInfo.for.find(s => sensitivities.includes(s)),
        groceryName: wouldTrigger ? null : subInfo.groceryName,
        groceryUnit: subInfo.unit,
        groceryCat: subInfo.cat,
        amount: ing.amount,
        unit: ing.unit
      });
    }
    // Also check keyword-based allergens that don't have explicit subs
    // e.g., smoked paprika triggers nightshades
    if (!subInfo) {
      const key = ing.name.toLowerCase();
      if (sensitivities.includes('nightshades') && key.includes('paprika')) {
        subs.push({ original: ing.name, replacement: 'turmeric', sensitivity: 'nightshades',
          groceryName: 'turmeric', groceryUnit: ing.unit, groceryCat: ing.cat, amount: ing.amount, unit: ing.unit });
      }
    }
  });
  return subs;
};

/**
 * Apply substitutions to a grocery list
 */
Engine.applyGrocerySubs = function(groceryList, plan, sensitivities) {
  if (!sensitivities || sensitivities.length === 0) return groceryList;

  const removals = new Set();
  const additions = {};

  plan.forEach(day => {
    Object.values(day.meals).forEach(recipe => {
      if (!recipe) return;
      const subs = this.getRecipeSubstitutions(recipe, sensitivities);
      subs.forEach(sub => {
        removals.add(sub.original.toLowerCase());
        if (sub.groceryName) {
          const key = sub.groceryName.toLowerCase();
          if (!additions[key]) {
            additions[key] = { name: sub.groceryName, amount: 0, unit: sub.groceryUnit, cat: sub.groceryCat };
          }
          const perServing = sub.amount / (recipe.servings || 1);
          additions[key].amount += perServing * (day.portionMultiplier || 1);
        }
      });
    });
  });

  // Remove flagged items and add substitutions
  const catLabels = {
    produce: '🥬 Produce', protein: '🥩 Protein', pantry: '🫙 Pantry',
    refrigerated: '🧊 Refrigerated', frozen: '❄️ Frozen'
  };

  // Remove
  Object.keys(groceryList).forEach(cat => {
    groceryList[cat] = groceryList[cat].filter(item => !removals.has(item.name.toLowerCase()));
    if (groceryList[cat].length === 0) delete groceryList[cat];
  });

  // Add substitutions
  Object.values(additions).forEach(item => {
    item.amount = Math.round(item.amount * 100) / 100;
    if (item.unit === 'whole' || item.unit === 'large' || item.unit === 'medium') item.amount = Math.ceil(item.amount);
    const catKey = catLabels[item.cat] || '📦 Other';
    if (!groceryList[catKey]) groceryList[catKey] = [];
    // Check if already in list
    const existing = groceryList[catKey].find(i => i.name.toLowerCase() === item.name.toLowerCase());
    if (existing) {
      existing.amount += item.amount;
    } else {
      groceryList[catKey].push(item);
    }
  });

  // Re-sort
  Object.keys(groceryList).forEach(cat => {
    groceryList[cat].sort((a, b) => a.name.localeCompare(b.name));
  });

  return groceryList;
};

window.Engine = Engine;
