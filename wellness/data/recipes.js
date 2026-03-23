/* ============================================================
   RECIPE DATABASE — Anti-Inflammatory / AIP-Friendly
   Carb-cycling tagged: low / moderate / high
   All recipes designed for weekly meal prep
   ============================================================ */

window.RECIPES = [

  /* ── BREAKFAST ─────────────────────────────────────────── */

  // LOW CARB
  { id:'b-egg-cups', name:'Turkey Spinach Egg Cups', meal:'breakfast', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto','mediterranean','lowfodmap'],
    servings:6, prepTime:10, cookTime:25,
    per:{ cal:210, p:22, c:3, f:12, fiber:1 },
    ingredients:[
      {name:'ground turkey',amount:1,unit:'lb',cat:'protein'},
      {name:'eggs',amount:6,unit:'large',cat:'refrigerated'},
      {name:'fresh spinach',amount:3,unit:'cups',cat:'produce'},
      {name:'extra virgin olive oil',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'garlic powder',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'turmeric',amount:0.25,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.25,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Preheat oven to 375 F. Grease muffin tin with olive oil.',
      'Brown turkey, season with garlic powder, turmeric, salt.',
      'Wilt spinach into turkey mixture.',
      'Divide into 6 muffin cups, crack 1 egg into each.',
      'Bake 20-25 min until eggs set. Store fridge 5 days.'
    ]},

  { id:'b-avo-scramble', name:'Avocado Bacon Egg Scramble', meal:'breakfast', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:false,
    diets:['antiinflam','aip','paleo','whole30','keto','lowfodmap'],
    servings:1, prepTime:5, cookTime:8,
    per:{ cal:380, p:20, c:6, f:30, fiber:4 },
    ingredients:[
      {name:'eggs',amount:3,unit:'large',cat:'refrigerated'},
      {name:'avocado',amount:0.5,unit:'whole',cat:'produce'},
      {name:'uncured bacon',amount:2,unit:'slices',cat:'protein'},
      {name:'coconut oil',amount:1,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.125,unit:'tsp',cat:'pantry'},
      {name:'fresh chives',amount:1,unit:'tbsp',cat:'produce'}
    ],
    instructions:[
      'Cook bacon until crispy, crumble.',
      'Scramble eggs in coconut oil over medium-low.',
      'Top with sliced avocado, bacon crumbles, chives.'
    ]},

  { id:'b-coco-parfait', name:'Coconut Yogurt Seed Parfait', meal:'breakfast', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto','lowfodmap'],
    servings:1, prepTime:5, cookTime:0,
    per:{ cal:250, p:8, c:10, f:20, fiber:5 },
    ingredients:[
      {name:'coconut yogurt (unsweetened)',amount:0.75,unit:'cup',cat:'refrigerated'},
      {name:'hemp hearts',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'ground flaxseed',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'coconut flakes (unsweetened)',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'cinnamon',amount:0.25,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Layer coconut yogurt in jar.',
      'Top with hemp hearts, flax, coconut flakes, cinnamon.',
      'Prep 5 jars for the week, keep refrigerated.'
    ]},

  // MODERATE CARB
  { id:'b-sp-hash', name:'Sweet Potato Turkey Breakfast Hash', meal:'breakfast', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:4, prepTime:10, cookTime:20,
    per:{ cal:320, p:24, c:28, f:12, fiber:4 },
    ingredients:[
      {name:'ground turkey',amount:1,unit:'lb',cat:'protein'},
      {name:'sweet potato',amount:2,unit:'medium',cat:'produce'},
      {name:'yellow onion',amount:1,unit:'medium',cat:'produce'},
      {name:'fresh kale',amount:2,unit:'cups',cat:'produce'},
      {name:'avocado oil',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'garlic cloves',amount:3,unit:'whole',cat:'produce'},
      {name:'smoked paprika',amount:1,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'turmeric',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Dice sweet potatoes into small cubes.',
      'Heat avocado oil, cook sweet potatoes 10 min until tender.',
      'Add diced onion and garlic, cook 3 min.',
      'Add turkey, break apart, cook through.',
      'Stir in kale, paprika, turmeric, salt. Cook 2 min.',
      'Divide into 4 containers. Reheat and serve with avocado.'
    ]},

  { id:'b-chia-pudding', name:'Coconut Chia Berry Pudding', meal:'breakfast', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','lowfodmap'],
    servings:4, prepTime:10, cookTime:0,
    per:{ cal:280, p:8, c:24, f:16, fiber:10 },
    ingredients:[
      {name:'chia seeds',amount:0.5,unit:'cup',cat:'pantry'},
      {name:'coconut milk (full fat canned)',amount:2,unit:'cups',cat:'pantry'},
      {name:'maple syrup',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'vanilla extract',amount:1,unit:'tsp',cat:'pantry'},
      {name:'fresh blueberries',amount:1,unit:'cup',cat:'produce'},
      {name:'fresh raspberries',amount:0.5,unit:'cup',cat:'produce'}
    ],
    instructions:[
      'Mix chia seeds, coconut milk, maple syrup, vanilla.',
      'Stir well, refrigerate overnight (or 4+ hours).',
      'Divide into 4 jars, top with berries before serving.',
      'Keeps 5 days refrigerated.'
    ]},

  { id:'b-banana-pancakes', name:'Banana Cassava Pancakes', meal:'breakfast', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:4, prepTime:10, cookTime:15,
    per:{ cal:300, p:10, c:38, f:12, fiber:3 },
    ingredients:[
      {name:'cassava flour',amount:1,unit:'cup',cat:'pantry'},
      {name:'ripe banana',amount:2,unit:'medium',cat:'produce'},
      {name:'eggs',amount:2,unit:'large',cat:'refrigerated'},
      {name:'coconut milk (full fat canned)',amount:0.5,unit:'cup',cat:'pantry'},
      {name:'coconut oil',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'baking soda',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'cinnamon',amount:1,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.125,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Mash bananas. Whisk in eggs and coconut milk.',
      'Add cassava flour, baking soda, cinnamon, salt. Mix until smooth.',
      'Heat coconut oil in skillet over medium.',
      'Pour 1/4 cup batter per pancake, cook 2-3 min each side.',
      'Freeze extras between parchment. Reheat in toaster.'
    ]},

  // HIGH CARB
  { id:'b-sp-bowl', name:'Sweet Potato Breakfast Bowl', meal:'breakfast', carbLevel:'high',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:4, prepTime:10, cookTime:30,
    per:{ cal:400, p:22, c:48, f:14, fiber:6 },
    ingredients:[
      {name:'sweet potato',amount:3,unit:'large',cat:'produce'},
      {name:'ground turkey sausage',amount:1,unit:'lb',cat:'protein'},
      {name:'ripe banana',amount:2,unit:'medium',cat:'produce'},
      {name:'coconut oil',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'cinnamon',amount:1,unit:'tsp',cat:'pantry'},
      {name:'collagen peptides',amount:4,unit:'scoops',cat:'pantry'},
      {name:'coconut flakes (unsweetened)',amount:0.25,unit:'cup',cat:'pantry'}
    ],
    instructions:[
      'Bake sweet potatoes at 400 F for 25-30 min until soft.',
      'Brown turkey sausage in coconut oil.',
      'Mash sweet potato with cinnamon.',
      'Assemble bowls: sweet potato base, turkey sausage, sliced banana.',
      'Top with collagen peptides and coconut flakes.',
      'Prep 4 containers, reheat and add banana fresh.'
    ]},

  { id:'b-plantain-pancakes', name:'Plantain Pancakes with Berry Compote', meal:'breakfast', carbLevel:'high',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','lowfodmap'],
    servings:4, prepTime:10, cookTime:15,
    per:{ cal:380, p:12, c:52, f:14, fiber:4 },
    ingredients:[
      {name:'green plantain',amount:2,unit:'large',cat:'produce'},
      {name:'eggs',amount:3,unit:'large',cat:'refrigerated'},
      {name:'coconut oil',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'cinnamon',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'frozen mixed berries',amount:2,unit:'cups',cat:'frozen'},
      {name:'maple syrup',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'lemon juice',amount:1,unit:'tbsp',cat:'produce'}
    ],
    instructions:[
      'Blend plantains, eggs, 1 tbsp coconut oil, cinnamon until smooth.',
      'Cook pancakes in remaining oil, 2-3 min each side.',
      'Simmer berries, maple syrup, lemon juice 10 min for compote.',
      'Freeze pancakes between parchment. Reheat in toaster.',
      'Warm compote separately.'
    ]},

  /* ── LUNCH ─────────────────────────────────────────────── */

  // LOW CARB
  { id:'l-salmon-wraps', name:'Salmon Avocado Lettuce Wraps', meal:'lunch', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto','mediterranean','lowfodmap'],
    servings:4, prepTime:15, cookTime:12,
    per:{ cal:340, p:30, c:6, f:22, fiber:4 },
    ingredients:[
      {name:'wild salmon fillet',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'butter lettuce',amount:2,unit:'heads',cat:'produce'},
      {name:'avocado',amount:2,unit:'whole',cat:'produce'},
      {name:'cucumber',amount:1,unit:'medium',cat:'produce'},
      {name:'lemon juice',amount:2,unit:'tbsp',cat:'produce'},
      {name:'extra virgin olive oil',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'fresh dill',amount:2,unit:'tbsp',cat:'produce'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Season salmon with olive oil, lemon, salt. Bake at 400 F 12 min.',
      'Flake salmon into large pieces.',
      'Dice cucumber and avocado.',
      'Assemble in lettuce cups: salmon, avocado, cucumber, dill.',
      'Store salmon and veggies separately. Assemble fresh each day.'
    ]},

  { id:'l-meatball-soup', name:'Turkey Meatball Zoodle Soup', meal:'lunch', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto'],
    servings:6, prepTime:15, cookTime:25,
    per:{ cal:280, p:28, c:8, f:14, fiber:2 },
    ingredients:[
      {name:'ground turkey',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'zucchini',amount:3,unit:'large',cat:'produce'},
      {name:'bone broth',amount:8,unit:'cups',cat:'pantry'},
      {name:'carrots',amount:2,unit:'medium',cat:'produce'},
      {name:'celery stalks',amount:3,unit:'whole',cat:'produce'},
      {name:'yellow onion',amount:1,unit:'medium',cat:'produce'},
      {name:'garlic cloves',amount:4,unit:'whole',cat:'produce'},
      {name:'fresh parsley',amount:0.25,unit:'cup',cat:'produce'},
      {name:'Italian seasoning',amount:1,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:1,unit:'tsp',cat:'pantry'},
      {name:'avocado oil',amount:1,unit:'tbsp',cat:'pantry'}
    ],
    instructions:[
      'Mix turkey with Italian seasoning, salt, minced parsley. Form 1-inch meatballs.',
      'Brown meatballs in avocado oil.',
      'Sauté diced onion, carrot, celery, garlic in same pot.',
      'Add bone broth, bring to simmer, add meatballs. Cook 15 min.',
      'Spiralize zucchini. Add zoodles last 2 minutes.',
      'Store soup and zoodles separately for best texture.'
    ]},

  { id:'l-chicken-salad', name:'Anti-Inflammatory Chicken Salad', meal:'lunch', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto','mediterranean','lowfodmap'],
    servings:4, prepTime:15, cookTime:20,
    per:{ cal:310, p:32, c:8, f:16, fiber:3 },
    ingredients:[
      {name:'chicken breast',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'mixed greens',amount:6,unit:'cups',cat:'produce'},
      {name:'cucumber',amount:1,unit:'medium',cat:'produce'},
      {name:'avocado',amount:1,unit:'whole',cat:'produce'},
      {name:'extra virgin olive oil',amount:3,unit:'tbsp',cat:'pantry'},
      {name:'lemon juice',amount:2,unit:'tbsp',cat:'produce'},
      {name:'turmeric',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'fresh ginger',amount:1,unit:'tsp',cat:'produce'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Season chicken with turmeric, ginger, salt, 1 tbsp olive oil.',
      'Bake at 400 F 20 min. Let cool, slice.',
      'Whisk remaining olive oil, lemon juice for dressing.',
      'Divide greens, cucumber, avocado into containers.',
      'Keep chicken and dressing separate. Assemble day of.'
    ]},

  // MODERATE CARB
  { id:'l-sp-chili', name:'Sweet Potato Turkey Chili', meal:'lunch', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:6, prepTime:15, cookTime:35,
    per:{ cal:350, p:28, c:30, f:12, fiber:6 },
    ingredients:[
      {name:'ground turkey',amount:2,unit:'lbs',cat:'protein'},
      {name:'sweet potato',amount:2,unit:'large',cat:'produce'},
      {name:'yellow onion',amount:1,unit:'large',cat:'produce'},
      {name:'garlic cloves',amount:4,unit:'whole',cat:'produce'},
      {name:'bone broth',amount:3,unit:'cups',cat:'pantry'},
      {name:'coconut aminos',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'cumin',amount:1,unit:'tsp',cat:'pantry'},
      {name:'turmeric',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'ginger powder',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:1,unit:'tsp',cat:'pantry'},
      {name:'avocado oil',amount:1,unit:'tbsp',cat:'pantry'}
    ],
    instructions:[
      'Dice sweet potatoes into 1/2 inch cubes.',
      'Brown turkey in avocado oil with onion and garlic.',
      'Add sweet potato, broth, coconut aminos, spices.',
      'Simmer 30 min until sweet potatoes are tender.',
      'Divide into 6 containers. Freezes well for 3 months.'
    ]},

  { id:'l-stir-fry', name:'Ginger Chicken Cauliflower Rice Bowl', meal:'lunch', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:4, prepTime:15, cookTime:15,
    per:{ cal:330, p:30, c:22, f:14, fiber:4 },
    ingredients:[
      {name:'chicken breast',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'cauliflower rice',amount:4,unit:'cups',cat:'produce'},
      {name:'broccoli florets',amount:2,unit:'cups',cat:'produce'},
      {name:'carrots',amount:2,unit:'medium',cat:'produce'},
      {name:'coconut aminos',amount:3,unit:'tbsp',cat:'pantry'},
      {name:'fresh ginger',amount:1,unit:'tbsp',cat:'produce'},
      {name:'garlic cloves',amount:3,unit:'whole',cat:'produce'},
      {name:'avocado oil',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'sesame oil (if tolerated)',amount:1,unit:'tsp',cat:'pantry'},
      {name:'green onions',amount:3,unit:'whole',cat:'produce'}
    ],
    instructions:[
      'Slice chicken thin. Stir-fry in avocado oil 5 min.',
      'Add broccoli, sliced carrots, ginger, garlic. Cook 5 min.',
      'Add cauliflower rice and coconut aminos. Cook 3 min.',
      'Drizzle sesame oil, top with sliced green onions.',
      'Divide into 4 containers. Reheats well.'
    ]},

  { id:'l-tuna-cakes', name:'Tuna Sweet Potato Cakes', meal:'lunch', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','mediterranean','lowfodmap'],
    servings:4, prepTime:15, cookTime:20,
    per:{ cal:300, p:28, c:24, f:10, fiber:3 },
    ingredients:[
      {name:'wild canned tuna',amount:3,unit:'cans (5oz)',cat:'pantry'},
      {name:'sweet potato',amount:1,unit:'large',cat:'produce'},
      {name:'green onions',amount:3,unit:'whole',cat:'produce'},
      {name:'fresh parsley',amount:0.25,unit:'cup',cat:'produce'},
      {name:'cassava flour',amount:0.25,unit:'cup',cat:'pantry'},
      {name:'lemon juice',amount:1,unit:'tbsp',cat:'produce'},
      {name:'garlic powder',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'avocado oil',amount:2,unit:'tbsp',cat:'pantry'}
    ],
    instructions:[
      'Bake sweet potato until soft, mash.',
      'Mix tuna, mashed sweet potato, green onions, parsley, cassava flour, lemon, seasoning.',
      'Form into 8 patties.',
      'Pan-fry in avocado oil 3-4 min each side.',
      'Store in fridge 5 days. Reheat in oven 350 F 10 min.'
    ]},

  // HIGH CARB
  { id:'l-stuffed-sp', name:'Turkey Stuffed Sweet Potatoes', meal:'lunch', carbLevel:'high',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:4, prepTime:10, cookTime:40,
    per:{ cal:420, p:30, c:48, f:12, fiber:7 },
    ingredients:[
      {name:'sweet potato',amount:4,unit:'large',cat:'produce'},
      {name:'ground turkey',amount:1,unit:'lb',cat:'protein'},
      {name:'fresh kale',amount:2,unit:'cups',cat:'produce'},
      {name:'yellow onion',amount:1,unit:'medium',cat:'produce'},
      {name:'garlic cloves',amount:2,unit:'whole',cat:'produce'},
      {name:'avocado oil',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'cumin',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'smoked paprika',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Bake sweet potatoes at 400 F 35-40 min.',
      'Brown turkey with onion, garlic, spices.',
      'Stir in kale until wilted.',
      'Split sweet potatoes, stuff with turkey mixture.',
      'Wrap individually. Reheat in oven 350 F 15 min.'
    ]},

  { id:'l-chicken-plantain', name:'Chicken Plantain Rice Bowl', meal:'lunch', carbLevel:'high',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','lowfodmap'],
    servings:4, prepTime:10, cookTime:25,
    per:{ cal:440, p:32, c:50, f:12, fiber:4 },
    ingredients:[
      {name:'chicken thighs (boneless)',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'green plantain',amount:2,unit:'large',cat:'produce'},
      {name:'cauliflower rice',amount:2,unit:'cups',cat:'produce'},
      {name:'avocado',amount:1,unit:'whole',cat:'produce'},
      {name:'fresh cilantro',amount:0.25,unit:'cup',cat:'produce'},
      {name:'lime juice',amount:2,unit:'tbsp',cat:'produce'},
      {name:'avocado oil',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'garlic powder',amount:1,unit:'tsp',cat:'pantry'},
      {name:'cumin',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Season chicken with garlic powder, cumin, salt. Bake 400 F 22 min.',
      'Slice plantains into rounds, pan-fry in avocado oil until golden.',
      'Cook cauliflower rice, toss with lime juice and cilantro.',
      'Assemble bowls: rice, sliced chicken, plantains, avocado.',
      'Store components separately.'
    ]},

  /* ── DINNER ─────────────────────────────────────────────── */

  // LOW CARB
  { id:'d-herb-salmon', name:'Herb Crusted Salmon with Roasted Broccoli', meal:'dinner', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto','mediterranean'],
    servings:4, prepTime:10, cookTime:18,
    per:{ cal:360, p:34, c:8, f:22, fiber:3 },
    ingredients:[
      {name:'wild salmon fillet',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'broccoli florets',amount:4,unit:'cups',cat:'produce'},
      {name:'extra virgin olive oil',amount:3,unit:'tbsp',cat:'pantry'},
      {name:'lemon juice',amount:2,unit:'tbsp',cat:'produce'},
      {name:'fresh dill',amount:2,unit:'tbsp',cat:'produce'},
      {name:'fresh parsley',amount:2,unit:'tbsp',cat:'produce'},
      {name:'garlic cloves',amount:3,unit:'whole',cat:'produce'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'lemon',amount:1,unit:'whole',cat:'produce'}
    ],
    instructions:[
      'Mix olive oil, lemon juice, minced herbs, garlic, salt.',
      'Coat salmon with herb mixture.',
      'Toss broccoli with remaining olive oil and salt.',
      'Roast everything at 400 F 15-18 min.',
      'Store in containers. Reheat gently at 325 F.'
    ]},

  { id:'d-lemon-chicken', name:'Lemon Herb Chicken with Roasted Vegetables', meal:'dinner', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto','mediterranean'],
    servings:4, prepTime:15, cookTime:25,
    per:{ cal:340, p:36, c:10, f:16, fiber:3 },
    ingredients:[
      {name:'chicken breast',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'zucchini',amount:2,unit:'medium',cat:'produce'},
      {name:'asparagus',amount:1,unit:'bunch',cat:'produce'},
      {name:'yellow onion',amount:1,unit:'medium',cat:'produce'},
      {name:'lemon juice',amount:3,unit:'tbsp',cat:'produce'},
      {name:'extra virgin olive oil',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'dried oregano',amount:1,unit:'tsp',cat:'pantry'},
      {name:'dried thyme',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'garlic cloves',amount:4,unit:'whole',cat:'produce'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Marinate chicken in lemon juice, olive oil, oregano, thyme, garlic.',
      'Chop zucchini and onion, trim asparagus.',
      'Spread vegetables on sheet pan with olive oil.',
      'Place chicken on top. Bake 400 F 22-25 min.',
      'Divide into 4 containers.'
    ]},

  { id:'d-turkey-boats', name:'Turkey Zucchini Boats', meal:'dinner', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto'],
    servings:4, prepTime:15, cookTime:25,
    per:{ cal:290, p:30, c:10, f:14, fiber:3 },
    ingredients:[
      {name:'zucchini',amount:4,unit:'large',cat:'produce'},
      {name:'ground turkey',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'yellow onion',amount:1,unit:'medium',cat:'produce'},
      {name:'garlic cloves',amount:3,unit:'whole',cat:'produce'},
      {name:'fresh basil',amount:0.25,unit:'cup',cat:'produce'},
      {name:'avocado oil',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'Italian seasoning',amount:1,unit:'tsp',cat:'pantry'},
      {name:'nutritional yeast (if tolerated)',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Halve zucchini lengthwise, scoop out centers.',
      'Sauté onion, garlic in avocado oil. Add turkey, cook through.',
      'Season with Italian seasoning, salt. Mix in chopped basil.',
      'Fill zucchini boats with turkey mixture.',
      'Bake 375 F 20 min. Top with nutritional yeast.',
      'Store in fridge 4 days. Reheat 350 F 12 min.'
    ]},

  // MODERATE CARB
  { id:'d-coconut-curry', name:'Chicken Sweet Potato Coconut Curry', meal:'dinner', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:6, prepTime:15, cookTime:30,
    per:{ cal:380, p:28, c:28, f:18, fiber:4 },
    ingredients:[
      {name:'chicken thighs (boneless)',amount:2,unit:'lbs',cat:'protein'},
      {name:'sweet potato',amount:2,unit:'large',cat:'produce'},
      {name:'coconut milk (full fat canned)',amount:2,unit:'cans (13.5oz)',cat:'pantry'},
      {name:'yellow onion',amount:1,unit:'large',cat:'produce'},
      {name:'garlic cloves',amount:4,unit:'whole',cat:'produce'},
      {name:'fresh ginger',amount:1,unit:'tbsp',cat:'produce'},
      {name:'turmeric',amount:1,unit:'tsp',cat:'pantry'},
      {name:'cumin',amount:1,unit:'tsp',cat:'pantry'},
      {name:'fresh spinach',amount:3,unit:'cups',cat:'produce'},
      {name:'coconut oil',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'sea salt',amount:1,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Cube chicken and sweet potatoes.',
      'Sauté onion, garlic, ginger in coconut oil.',
      'Add turmeric, cumin, salt. Stir 1 min.',
      'Add chicken, brown 5 min.',
      'Add sweet potato and coconut milk. Simmer 25 min.',
      'Stir in spinach last 2 min.',
      'Divide into 6 containers. Freezes great.'
    ]},

  { id:'d-turkey-meatloaf', name:'Turkey Meatloaf with Mashed Sweet Potato', meal:'dinner', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:6, prepTime:15, cookTime:40,
    per:{ cal:360, p:28, c:30, f:14, fiber:4 },
    ingredients:[
      {name:'ground turkey',amount:2,unit:'lbs',cat:'protein'},
      {name:'sweet potato',amount:3,unit:'large',cat:'produce'},
      {name:'yellow onion',amount:1,unit:'medium',cat:'produce'},
      {name:'garlic cloves',amount:3,unit:'whole',cat:'produce'},
      {name:'cassava flour',amount:0.25,unit:'cup',cat:'pantry'},
      {name:'coconut aminos',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'Italian seasoning',amount:1,unit:'tsp',cat:'pantry'},
      {name:'coconut oil',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'sea salt',amount:1,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Mix turkey, diced onion, garlic, cassava flour, coconut aminos, seasoning.',
      'Form into loaf on parchment-lined baking sheet.',
      'Bake 375 F 35-40 min.',
      'Boil sweet potatoes, mash with coconut oil and salt.',
      'Slice meatloaf, serve with mashed sweet potato.',
      'Stores 5 days. Freeze slices individually.'
    ]},

  { id:'d-salmon-root-veg', name:'Salmon with Root Vegetable Medley', meal:'dinner', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','mediterranean','lowfodmap'],
    servings:4, prepTime:10, cookTime:25,
    per:{ cal:400, p:32, c:28, f:18, fiber:5 },
    ingredients:[
      {name:'wild salmon fillet',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'parsnips',amount:2,unit:'medium',cat:'produce'},
      {name:'beets',amount:2,unit:'medium',cat:'produce'},
      {name:'carrots',amount:2,unit:'large',cat:'produce'},
      {name:'extra virgin olive oil',amount:3,unit:'tbsp',cat:'pantry'},
      {name:'fresh rosemary',amount:1,unit:'tbsp',cat:'produce'},
      {name:'fresh thyme',amount:1,unit:'tbsp',cat:'produce'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'lemon',amount:1,unit:'whole',cat:'produce'}
    ],
    instructions:[
      'Dice root vegetables into 1-inch pieces.',
      'Toss with 2 tbsp olive oil, rosemary, thyme, salt.',
      'Roast at 400 F 15 min.',
      'Place salmon on top, drizzle remaining oil.',
      'Roast 12 more min.',
      'Divide into 4 containers. Squeeze lemon before serving.'
    ]},

  // HIGH CARB
  { id:'d-sp-stew', name:'Chicken Sweet Potato Stew', meal:'dinner', carbLevel:'high',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:6, prepTime:15, cookTime:35,
    per:{ cal:420, p:30, c:46, f:12, fiber:6 },
    ingredients:[
      {name:'chicken thighs (boneless)',amount:2,unit:'lbs',cat:'protein'},
      {name:'sweet potato',amount:3,unit:'large',cat:'produce'},
      {name:'carrots',amount:3,unit:'large',cat:'produce'},
      {name:'celery stalks',amount:3,unit:'whole',cat:'produce'},
      {name:'yellow onion',amount:1,unit:'large',cat:'produce'},
      {name:'bone broth',amount:6,unit:'cups',cat:'pantry'},
      {name:'garlic cloves',amount:4,unit:'whole',cat:'produce'},
      {name:'fresh thyme',amount:1,unit:'tbsp',cat:'produce'},
      {name:'turmeric',amount:1,unit:'tsp',cat:'pantry'},
      {name:'avocado oil',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'sea salt',amount:1,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Cube chicken and all vegetables.',
      'Brown chicken in avocado oil.',
      'Add onion, garlic, celery. Sauté 3 min.',
      'Add sweet potato, carrots, broth, thyme, turmeric, salt.',
      'Simmer 30 min until everything tender.',
      'Divide into 6 containers. Freezes beautifully.'
    ]},

  { id:'d-fish-tacos', name:'Wild Fish Tacos (Cassava Tortillas)', meal:'dinner', carbLevel:'high',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','mediterranean','lowfodmap'],
    servings:4, prepTime:15, cookTime:15,
    per:{ cal:440, p:30, c:44, f:16, fiber:4 },
    ingredients:[
      {name:'wild white fish (cod or mahi)',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'cassava tortillas',amount:8,unit:'whole',cat:'pantry'},
      {name:'purple cabbage',amount:2,unit:'cups shredded',cat:'produce'},
      {name:'avocado',amount:2,unit:'whole',cat:'produce'},
      {name:'lime juice',amount:3,unit:'tbsp',cat:'produce'},
      {name:'fresh cilantro',amount:0.25,unit:'cup',cat:'produce'},
      {name:'avocado oil',amount:2,unit:'tbsp',cat:'pantry'},
      {name:'garlic powder',amount:1,unit:'tsp',cat:'pantry'},
      {name:'cumin',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Season fish with garlic powder, cumin, salt.',
      'Pan sear in avocado oil 3-4 min each side.',
      'Warm cassava tortillas.',
      'Mash avocado with lime juice and salt for guacamole.',
      'Assemble: tortilla, fish, cabbage, guacamole, cilantro.',
      'Prep fish and toppings separately. Assemble fresh.'
    ]},

  /* ── SNACKS ─────────────────────────────────────────────── */

  // LOW CARB
  { id:'s-celery-butter', name:'Celery with Sunflower Seed Butter', meal:'snack', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto','lowfodmap'],
    servings:1, prepTime:2, cookTime:0,
    per:{ cal:200, p:6, c:8, f:16, fiber:3 },
    ingredients:[
      {name:'celery stalks',amount:3,unit:'whole',cat:'produce'},
      {name:'sunflower seed butter',amount:2,unit:'tbsp',cat:'pantry'}
    ],
    instructions:['Cut celery into sticks. Spread or dip with sunflower seed butter.']},

  { id:'s-fat-bombs', name:'Coconut Collagen Fat Bombs', meal:'snack', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto','lowfodmap'],
    servings:12, prepTime:15, cookTime:0,
    per:{ cal:120, p:4, c:3, f:10, fiber:1 },
    ingredients:[
      {name:'coconut oil',amount:0.5,unit:'cup',cat:'pantry'},
      {name:'coconut butter',amount:0.25,unit:'cup',cat:'pantry'},
      {name:'collagen peptides',amount:4,unit:'scoops',cat:'pantry'},
      {name:'cinnamon',amount:1,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.125,unit:'tsp',cat:'pantry'},
      {name:'vanilla extract',amount:1,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Melt coconut oil and coconut butter together.',
      'Stir in collagen, cinnamon, salt, vanilla.',
      'Pour into silicone mold (12 cups).',
      'Freeze 1 hour. Store in fridge up to 2 weeks.'
    ]},

  { id:'s-jerky-olives', name:'Clean Beef Jerky with Olives', meal:'snack', carbLevel:'low',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','keto','lowfodmap'],
    servings:1, prepTime:2, cookTime:0,
    per:{ cal:180, p:14, c:4, f:12, fiber:1 },
    ingredients:[
      {name:'grass-fed beef jerky (no sugar added)',amount:1,unit:'oz',cat:'protein'},
      {name:'kalamata olives',amount:8,unit:'whole',cat:'pantry'}
    ],
    instructions:['Portion jerky and olives into snack containers.']},

  // MODERATE CARB
  { id:'s-apple-butter', name:'Apple Slices with Coconut Butter', meal:'snack', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:1, prepTime:3, cookTime:0,
    per:{ cal:220, p:2, c:22, f:14, fiber:4 },
    ingredients:[
      {name:'green apple',amount:1,unit:'medium',cat:'produce'},
      {name:'coconut butter',amount:1.5,unit:'tbsp',cat:'pantry'},
      {name:'cinnamon',amount:0.25,unit:'tsp',cat:'pantry'}
    ],
    instructions:['Slice apple. Warm coconut butter slightly. Dip or drizzle, sprinkle cinnamon.']},

  { id:'s-energy-balls', name:'Collagen Energy Balls', meal:'snack', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:12, prepTime:15, cookTime:0,
    per:{ cal:130, p:5, c:16, f:6, fiber:2 },
    ingredients:[
      {name:'pitted dates',amount:1,unit:'cup',cat:'produce'},
      {name:'coconut flakes (unsweetened)',amount:0.5,unit:'cup',cat:'pantry'},
      {name:'collagen peptides',amount:3,unit:'scoops',cat:'pantry'},
      {name:'coconut oil',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'cinnamon',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'sea salt',amount:0.125,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Blend dates in food processor until sticky paste.',
      'Add coconut flakes, collagen, coconut oil, cinnamon, salt. Pulse until combined.',
      'Roll into 12 balls.',
      'Refrigerate 1 hour. Store in fridge 2 weeks.'
    ]},

  { id:'s-plantain-guac', name:'Plantain Chips with Guacamole', meal:'snack', carbLevel:'moderate',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','lowfodmap'],
    servings:2, prepTime:10, cookTime:15,
    per:{ cal:240, p:3, c:26, f:14, fiber:5 },
    ingredients:[
      {name:'green plantain',amount:1,unit:'large',cat:'produce'},
      {name:'avocado',amount:1,unit:'whole',cat:'produce'},
      {name:'lime juice',amount:1,unit:'tbsp',cat:'produce'},
      {name:'fresh cilantro',amount:1,unit:'tbsp',cat:'produce'},
      {name:'sea salt',amount:0.25,unit:'tsp',cat:'pantry'},
      {name:'avocado oil',amount:1,unit:'tbsp',cat:'pantry'}
    ],
    instructions:[
      'Slice plantain very thin. Toss with avocado oil and salt.',
      'Bake at 375 F 12-15 min, flipping halfway, until crispy.',
      'Mash avocado with lime, cilantro, salt.',
      'Store chips in airtight container 5 days. Keep guac fresh daily.'
    ]},

  // HIGH CARB
  { id:'s-sp-fries', name:'Baked Sweet Potato Fries', meal:'snack', carbLevel:'high',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30','lowfodmap'],
    servings:2, prepTime:10, cookTime:25,
    per:{ cal:200, p:2, c:34, f:6, fiber:4 },
    ingredients:[
      {name:'sweet potato',amount:2,unit:'medium',cat:'produce'},
      {name:'avocado oil',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'sea salt',amount:0.25,unit:'tsp',cat:'pantry'},
      {name:'smoked paprika',amount:0.5,unit:'tsp',cat:'pantry'},
      {name:'garlic powder',amount:0.25,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Cut sweet potatoes into fry shapes.',
      'Toss with avocado oil, salt, paprika, garlic powder.',
      'Spread on baking sheet, single layer.',
      'Bake 400 F 20-25 min, flipping halfway.',
      'Best made fresh but can reheat in oven.'
    ]},

  { id:'s-banana-bites', name:'Banana Coconut Bites', meal:'snack', carbLevel:'high',
    aipFriendly:true, antiInflammatory:true, prepFriendly:true,
    diets:['antiinflam','aip','paleo','whole30'],
    servings:2, prepTime:5, cookTime:0,
    per:{ cal:190, p:3, c:30, f:8, fiber:3 },
    ingredients:[
      {name:'ripe banana',amount:1,unit:'large',cat:'produce'},
      {name:'coconut butter',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'coconut flakes (unsweetened)',amount:1,unit:'tbsp',cat:'pantry'},
      {name:'cinnamon',amount:0.25,unit:'tsp',cat:'pantry'}
    ],
    instructions:[
      'Slice banana into rounds.',
      'Drizzle with warmed coconut butter.',
      'Sprinkle coconut flakes and cinnamon.',
      'Freeze for frozen bites or eat fresh.'
    ]},

  /* ── CARNIVORE RECIPES ─────────────────────────────── */

  { id:'c-b-steak-eggs', name:'Steak & Eggs', meal:'breakfast', carbLevel:'low',
    aipFriendly:false, antiInflammatory:false, prepFriendly:false,
    diets:['carnivore','keto'],
    servings:1, prepTime:5, cookTime:10,
    per:{ cal:450, p:40, c:0, f:30, fiber:0 },
    ingredients:[
      {name:'ribeye steak',amount:6,unit:'oz',cat:'protein'},
      {name:'eggs',amount:3,unit:'large',cat:'refrigerated'},
      {name:'grass-fed butter',amount:1,unit:'tbsp',cat:'refrigerated'},
      {name:'sea salt',amount:0.25,unit:'tsp',cat:'pantry'}
    ],
    instructions:['Season steak with salt. Sear in butter 3-4 min each side.','Fry eggs in the same pan.','Serve together.']},

  { id:'c-l-burger-patties', name:'Bunless Burger Patties', meal:'lunch', carbLevel:'low',
    aipFriendly:false, antiInflammatory:false, prepFriendly:true,
    diets:['carnivore','keto'],
    servings:4, prepTime:5, cookTime:12,
    per:{ cal:350, p:30, c:0, f:25, fiber:0 },
    ingredients:[
      {name:'ground beef (80/20)',amount:1.5,unit:'lbs',cat:'protein'},
      {name:'sea salt',amount:1,unit:'tsp',cat:'pantry'},
      {name:'grass-fed butter',amount:2,unit:'tbsp',cat:'refrigerated'}
    ],
    instructions:['Form beef into 4 patties. Season with salt.','Cook in butter 5-6 min each side.','Store in fridge 5 days.']},

  { id:'c-d-ribeye', name:'Reverse Sear Ribeye', meal:'dinner', carbLevel:'low',
    aipFriendly:false, antiInflammatory:false, prepFriendly:false,
    diets:['carnivore','keto'],
    servings:1, prepTime:5, cookTime:25,
    per:{ cal:500, p:42, c:0, f:36, fiber:0 },
    ingredients:[
      {name:'ribeye steak',amount:10,unit:'oz',cat:'protein'},
      {name:'grass-fed butter',amount:1,unit:'tbsp',cat:'refrigerated'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:['Season steak. Bake at 250F on rack for 20 min until internal 115F.','Sear in ripping hot cast iron with butter 1 min each side.','Rest 5 min.']},

  { id:'c-s-jerky', name:'Homemade Beef Jerky', meal:'snack', carbLevel:'low',
    aipFriendly:false, antiInflammatory:false, prepFriendly:true,
    diets:['carnivore','keto','paleo','whole30'],
    servings:6, prepTime:15, cookTime:240,
    per:{ cal:120, p:18, c:0, f:5, fiber:0 },
    ingredients:[
      {name:'beef eye of round',amount:2,unit:'lbs',cat:'protein'},
      {name:'sea salt',amount:1,unit:'tsp',cat:'pantry'}
    ],
    instructions:['Slice beef very thin against the grain.','Season with salt.','Dehydrate at 160F for 4 hours or use oven at lowest setting with door cracked.']},

  { id:'c-b-bacon-liver', name:'Bacon Wrapped Liver Bites', meal:'breakfast', carbLevel:'low',
    aipFriendly:false, antiInflammatory:false, prepFriendly:true,
    diets:['carnivore','keto'],
    servings:4, prepTime:10, cookTime:15,
    per:{ cal:280, p:24, c:2, f:18, fiber:0 },
    ingredients:[
      {name:'beef liver',amount:0.5,unit:'lbs',cat:'protein'},
      {name:'uncured bacon',amount:8,unit:'slices',cat:'protein'},
      {name:'sea salt',amount:0.25,unit:'tsp',cat:'pantry'}
    ],
    instructions:['Cut liver into 1-inch cubes. Season with salt.','Wrap each cube in half a bacon slice, secure with toothpick.','Bake at 400F 12-15 min until bacon crispy.','Store in fridge 4 days.']},

  { id:'c-d-lamb-chops', name:'Herb Butter Lamb Chops', meal:'dinner', carbLevel:'low',
    aipFriendly:false, antiInflammatory:false, prepFriendly:false,
    diets:['carnivore','keto','paleo'],
    servings:2, prepTime:5, cookTime:10,
    per:{ cal:420, p:35, c:0, f:30, fiber:0 },
    ingredients:[
      {name:'lamb loin chops',amount:4,unit:'whole',cat:'protein'},
      {name:'grass-fed butter',amount:2,unit:'tbsp',cat:'refrigerated'},
      {name:'fresh rosemary',amount:1,unit:'tbsp',cat:'produce'},
      {name:'sea salt',amount:0.5,unit:'tsp',cat:'pantry'}
    ],
    instructions:['Season chops with salt.','Sear in hot pan 3-4 min each side.','Add butter and rosemary, baste for 30 seconds.','Rest 3 min.']}
];
