/* ============================================================
   WORKOUT TEMPLATES — Walking, HIIT, Light Weights
   Designed for postpartum/breastfeeding-friendly fitness
   ============================================================ */

window.WORKOUTS = [
  {
    id: 'hiit-full',
    name: 'Full Body HIIT Burn',
    type: 'hiit',
    duration: 25,
    difficulty: 'moderate',
    calsBurned: 250,
    warmup: '3 min march in place + arm circles',
    cooldown: '3 min walking + stretching',
    exercises: [
      { name: 'Squat Jumps', work: 30, rest: 15, icon: '🔥' },
      { name: 'Mountain Climbers', work: 30, rest: 15, icon: '⛰️' },
      { name: 'Burpees (modified)', work: 30, rest: 15, icon: '💪' },
      { name: 'High Knees', work: 30, rest: 15, icon: '🦵' },
      { name: 'Plank Jacks', work: 30, rest: 15, icon: '🏋️' },
      { name: 'Lateral Shuffles', work: 30, rest: 15, icon: '👟' }
    ],
    rounds: 3,
    restBetweenRounds: 60,
    notes: 'Modify burpees: step back instead of jump if needed. Stay hydrated!'
  },
  {
    id: 'hiit-lower',
    name: 'Booty & Legs HIIT',
    type: 'hiit',
    duration: 25,
    difficulty: 'moderate',
    calsBurned: 230,
    warmup: '3 min bodyweight squats + leg swings',
    cooldown: '3 min quad/hamstring stretch',
    exercises: [
      { name: 'Jump Squats', work: 30, rest: 15, icon: '🍑' },
      { name: 'Alternating Lunges', work: 30, rest: 15, icon: '🦵' },
      { name: 'Glute Bridges (pulse)', work: 30, rest: 15, icon: '🔥' },
      { name: 'Skater Jumps', work: 30, rest: 15, icon: '⛸️' },
      { name: 'Sumo Squat Pulses', work: 30, rest: 15, icon: '💪' },
      { name: 'Donkey Kicks', work: 30, rest: 15, icon: '🐴' }
    ],
    rounds: 3,
    restBetweenRounds: 60,
    notes: 'Focus on squeezing glutes at top of each movement.'
  },
  {
    id: 'hiit-core',
    name: 'Core Blast HIIT',
    type: 'hiit',
    duration: 20,
    difficulty: 'moderate',
    calsBurned: 200,
    warmup: '3 min cat-cow + torso twists',
    cooldown: '3 min child\'s pose + cobra stretch',
    exercises: [
      { name: 'Bicycle Crunches', work: 30, rest: 15, icon: '🚴' },
      { name: 'Plank Hold', work: 30, rest: 15, icon: '🧱' },
      { name: 'Mountain Climbers', work: 30, rest: 15, icon: '⛰️' },
      { name: 'Flutter Kicks', work: 30, rest: 15, icon: '🦋' },
      { name: 'Side Plank (L)', work: 20, rest: 10, icon: '➡️' },
      { name: 'Side Plank (R)', work: 20, rest: 10, icon: '⬅️' }
    ],
    rounds: 3,
    restBetweenRounds: 45,
    notes: 'Engage pelvic floor. Stop if any diastasis recti symptoms.'
  },
  {
    id: 'walk-moderate',
    name: 'Steady State Walk',
    type: 'walk',
    duration: 30,
    difficulty: 'easy',
    calsBurned: 140,
    warmup: '2 min slow pace',
    cooldown: '2 min slow pace + calf stretch',
    exercises: [
      { name: 'Moderate Walk', work: 1800, rest: 0, icon: '🚶‍♀️' }
    ],
    rounds: 1,
    restBetweenRounds: 0,
    notes: 'Target 3.0 mph pace. Perfect for stroller walks! Aim for 3,000-4,000 steps.'
  },
  {
    id: 'walk-power',
    name: 'Power Walk + Hills',
    type: 'walk',
    duration: 45,
    difficulty: 'moderate',
    calsBurned: 220,
    warmup: '3 min easy pace',
    cooldown: '3 min easy pace + stretch',
    exercises: [
      { name: 'Brisk Walk (flat)', work: 300, rest: 0, icon: '🚶‍♀️' },
      { name: 'Power Walk (incline/fast)', work: 120, rest: 0, icon: '⛰️' },
      { name: 'Recovery Walk', work: 120, rest: 0, icon: '🌸' }
    ],
    rounds: 5,
    restBetweenRounds: 0,
    notes: 'Target 3.5-4.0 mph. Use hills or treadmill incline. Aim for 5,000-6,000 steps.'
  },
  {
    id: 'weights-upper',
    name: 'Upper Body Sculpt',
    type: 'weights',
    duration: 25,
    difficulty: 'light',
    calsBurned: 150,
    warmup: '3 min arm circles + band pull-aparts',
    cooldown: '3 min shoulder/chest stretch',
    exercises: [
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '12', weight: '5-10 lbs', icon: '💪' },
      { name: 'Bent Over Rows', sets: 3, reps: '12', weight: '8-12 lbs', icon: '🏋️' },
      { name: 'Bicep Curls', sets: 3, reps: '12', weight: '5-8 lbs', icon: '💪' },
      { name: 'Tricep Dips (chair)', sets: 3, reps: '10', weight: 'bodyweight', icon: '🪑' },
      { name: 'Push-ups (modified)', sets: 3, reps: '10', weight: 'bodyweight', icon: '🔥' },
      { name: 'Lateral Raises', sets: 3, reps: '12', weight: '3-5 lbs', icon: '✨' }
    ],
    rounds: 1,
    restBetweenRounds: 0,
    notes: 'Light weights, high reps for toning. Rest 30-45 sec between sets.'
  },
  {
    id: 'weights-lower',
    name: 'Lower Body Sculpt',
    type: 'weights',
    duration: 25,
    difficulty: 'light',
    calsBurned: 170,
    warmup: '3 min bodyweight squats + hip circles',
    cooldown: '3 min pigeon pose + hamstring stretch',
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '12', weight: '10-15 lbs', icon: '🍑' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '12', weight: '10-15 lbs', icon: '🏋️' },
      { name: 'Walking Lunges', sets: 3, reps: '10 each', weight: '5-8 lbs', icon: '🦵' },
      { name: 'Glute Bridges (weighted)', sets: 3, reps: '15', weight: '10-15 lbs', icon: '🔥' },
      { name: 'Calf Raises', sets: 3, reps: '15', weight: '10 lbs', icon: '🦶' },
      { name: 'Fire Hydrants', sets: 3, reps: '12 each', weight: 'bodyweight', icon: '✨' }
    ],
    rounds: 1,
    restBetweenRounds: 0,
    notes: 'Focus on form over weight. Squeeze at top of each rep.'
  }
];

/* Weekly schedule template — aligns with carb cycling */
window.WEEKLY_SCHEDULE = [
  { day: 'Monday',    workout: 'hiit-full',     carbLevel: 'high',     label: 'HIIT + High Carb Fuel' },
  { day: 'Tuesday',   workout: 'weights-upper',  carbLevel: 'moderate', label: 'Upper Body + Moderate Carbs' },
  { day: 'Wednesday', workout: 'hiit-lower',     carbLevel: 'high',     label: 'HIIT Legs + High Carb Fuel' },
  { day: 'Thursday',  workout: 'weights-lower',  carbLevel: 'moderate', label: 'Lower Body + Moderate Carbs' },
  { day: 'Friday',    workout: 'hiit-core',      carbLevel: 'low',      label: 'Core HIIT + Low Carb Burn' },
  { day: 'Saturday',  workout: 'walk-power',     carbLevel: 'low',      label: 'Power Walk + Low Carb Burn' },
  { day: 'Sunday',    workout: 'walk-moderate',   carbLevel: 'low',      label: 'Rest Day Walk + Low Carb' }
];

/* Motivational messages */
window.MOTIVATION = [
  "You're doing amazing, mama! 💕",
  "Strong mamas raise strong babies! 💪",
  "One day at a time, one step at a time 🌸",
  "Your body is incredible — look what it created! ✨",
  "Progress, not perfection 🦋",
  "You showed up today, and that's everything 🌟",
  "Nourish your body, fuel your soul 💖",
  "Every healthy choice is a gift to yourself 🎀",
  "Rest is productive too, queen 👑",
  "Your consistency is your superpower! 🔥"
];
