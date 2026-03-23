// Isaiah's Ladder to Heaven - 7 Rungs
// Based on Avraham Gileadi's framework
// Source: Isaiahs_Ladder_Study_Guide.pdf & The_Code_of_Spiritual_Ascension.pdf

const ISAIAH_LADDER = {
  rungs: [
    {
      number: 1,
      title: "Perdition",
      subtitle: "Open Rebellion",
      color: "#1A1A1A",
      icon: "\u2620",
      theme: "Those in open rebellion against God — who have known the truth and fight against it. Lucifer/Satan and the king of Assyria as archetypes.",
      attributes: [
        "Pride and self-exaltation to the level of God",
        "Active rebellion against God after knowing the truth",
        "Desire to destroy and control nations/people",
        "Boasting in one's own power and wisdom",
        "Refusing to release captives or show mercy"
      ],
      reflections: [
        "Do I seek power and control over others rather than serving them?",
        "Have I known the truth but actively fight against it?",
        "Do I take credit for accomplishments that belong to God?"
      ],
      keyVerses: ["14:12-17","10:5-7","10:13-15","37:23-24","66:24"],
      bofmParallels: ["2 Ne 24:12-17","2 Ne 20:5-7","2 Ne 20:13-15"],
      verseIndex: ["10:5","10:6","10:7","10:13","10:14","10:15","10:16","10:17","14:12","14:13","14:14","14:15","14:16","14:17","26:13","26:14","30:33","36:1","37:23","37:24","37:29","38:17","38:18","66:24"]
    },
    {
      number: 2,
      title: "Babylon/Chaldea",
      subtitle: "Worldliness",
      color: "#CC5500",
      icon: "\u{1F3DB}",
      theme: "Worldliness, materialism, and false security. Trust in wealth, pleasure, sorcery, and worldly wisdom rather than God. Living as though God doesn't exist.",
      attributes: [
        "Worldliness and materialism — trusting in riches",
        "Pride and arrogance: 'I am, and none else beside me'",
        "Careless living without concern for consequences",
        "Sorcery, enchantments, and false spiritual practices",
        "Making 'a covenant with death' — rationalizing sin",
        "Self-deception: believing sin has no consequences"
      ],
      reflections: [
        "Am I more focused on accumulating wealth than spiritual growth?",
        "Do I live as if God doesn't see or care about my choices?",
        "Have I made peace with certain sins, rationalizing them away?",
        "Do I seek comfort and pleasure as my primary goals?"
      ],
      keyVerses: ["13:1","13:9","13:19","47:7-11","28:14-18","48:20-22","52:11-12"],
      bofmParallels: ["2 Ne 23:1,9,19","1 Ne 20:20","3 Ne 20:41-42"],
      verseIndex: ["13:1","13:9","13:11","13:19","13:20","13:21","13:22","14:22","14:23","21:6","21:7","21:8","21:9","21:10","26:10","26:11","28:14","28:15","28:16","28:17","28:18","28:19","43:14","43:15","43:16","43:17","47:1","47:2","47:3","47:7","47:8","47:9","47:10","47:11","48:20","48:21","48:22","52:1","52:2","52:3","52:11","52:12"]
    },
    {
      number: 3,
      title: "Jacob/Israel",
      subtitle: "Covenant People Struggling",
      color: "#808080",
      icon: "\u2721",
      theme: "Covenant people who know God but are struggling — rebellious, stiff-necked, yet still within the covenant. Going through the motions of religion without real conversion.",
      attributes: [
        "Covenant members who are spiritually complacent",
        "Going through the motions without real conversion",
        "Complaining: 'My way is hid from the Lord' (40:27)",
        "Pride and stubbornness despite correction",
        "Hypocrisy — outward obedience, inward rebellion",
        "Blind and deaf despite having the truth (42:18-20)"
      ],
      reflections: [
        "Am I going through the motions without real conversion?",
        "Do I complain that God doesn't see or care about my struggles?",
        "Have I become complacent in my covenant keeping?",
        "Am I stuck — not progressing even though I 'know better'?"
      ],
      keyVerses: ["9:8-13","40:27","42:18-20","42:24-25","43:22-24","58:1-2","46:3-7"],
      bofmParallels: ["2 Ne 19:8-13","2 Ne 20:20-23","1 Ne 21:4"],
      verseIndex: ["8:11","8:12","8:13","8:14","8:15","9:8","9:9","9:10","9:11","9:12","9:13","9:14","9:15","9:16","9:17","10:20","10:21","10:22","10:23","17:3","17:4","17:5","17:6","17:7","17:8","27:9","40:27","42:6","42:7","42:17","42:18","42:19","42:20","42:21","42:22","42:23","42:24","42:25","43:22","43:23","43:24","46:3","46:4","46:5","46:6","46:7","46:11","46:12","46:13","49:4","50:4","58:1","58:2"]
    },
    {
      number: 4,
      title: "Zion/Jerusalem",
      subtitle: "The Gathered Faithful",
      icon: "\u26F0",
      color: "#228B22",
      theme: "The gathered, covenant-keeping community — those who have repented and are actively building God's kingdom. Learning, worshipping, walking in God's paths.",
      attributes: [
        "Actively walking in God's paths and keeping covenants",
        "Gathering together in community and worship",
        "Seeking to learn God's ways: 'He will teach us'",
        "Trusting in God as protector and refuge",
        "Joy and praise — 'Cry out and shout, thou inhabitant of Zion'",
        "Being a light and gathering place for others"
      ],
      reflections: [
        "Am I actively building Zion in my home and community?",
        "Do I seek to learn God's ways, not just know about them?",
        "Is my life characterized by joy and praise, or complaint?",
        "Am I a gathering place — do people feel light in my life?",
        "Have I 'put on my beautiful garments'?"
      ],
      keyVerses: ["2:3","12:6","33:20","33:24","40:9-11","52:1-2","59:20-21"],
      bofmParallels: ["2 Ne 12:3","2 Ne 22:6","3 Ne 20:36-37"],
      verseIndex: ["2:3","12:6","30:18","30:19","30:20","30:21","30:22","30:23","30:24","31:4","31:5","33:6","33:20","33:24","37:22","40:9","40:10","40:11","51:9","51:10","51:11","51:16","51:17","52:1","52:2","52:3","52:7","52:8","52:10","52:13","52:14","52:15","54:17","56:3","56:4","56:5","56:6","56:7","59:20","59:21","60:10","60:11","60:14","61:6","61:7","62:1","62:2","62:3","62:4","62:6","62:7","63:11","63:12","63:13","65:8","65:9","65:13","65:14","65:15","66:5","66:6","66:8","66:9","66:10","66:14"]
    },
    {
      number: 5,
      title: "Sons/Servants",
      subtitle: "Active Personal Ministry",
      icon: "\u{1F9CE}",
      color: "#E75480",
      theme: "Those who have moved beyond Zion membership to active, personal ministry. They serve God directly, intercede for others, and suffer willingly for God's purposes.",
      attributes: [
        "Personal, devoted service — not just membership",
        "Interceding and pleading on behalf of others",
        "Willingness to suffer for God's cause",
        "Faithfulness through trials and affliction",
        "Expanding God's kingdom: 'Enlarge thy tent'",
        "God's law written in their hearts (51:7)"
      ],
      reflections: [
        "Am I actively serving God, or just attending?",
        "Do I intercede in prayer for others — truly plead?",
        "Am I willing to suffer for what is right?",
        "When trials come, do I turn to God or away?",
        "Would God call me His servant, or just His follower?"
      ],
      keyVerses: ["37:15-20","51:7-8","54:1-3","43:5-7","60:1-4"],
      bofmParallels: ["2 Ne 8:7-8","3 Ne 22:1-3","1 Ne 21:20-23"],
      verseIndex: ["26:7","26:8","26:9","37:3","37:15","37:16","37:17","37:18","37:19","37:20","37:36","38:1","38:3","38:5","38:6","38:10","38:11","38:12","38:13","38:14","43:5","43:6","43:7","49:20","49:21","49:22","49:23","51:7","51:8","54:1","54:2","54:3","54:14","60:1","60:2","60:3","60:4"]
    },
    {
      number: 6,
      title: "Seraphs/Seraphim",
      subtitle: "Burning Ones",
      icon: "\u{1F525}",
      color: "#7B2D8E",
      theme: "The 'burning ones' — purified and empowered by God to operate as His direct agents on earth. Anointed leaders, deliverers, and warriors operating with divine power.",
      attributes: [
        "Operating with divine power and authority",
        "Anointed by God for specific missions (like Cyrus)",
        "Unwearying strength: 'mount up with wings as eagles'",
        "Executing God's judgments against the wicked",
        "Delivering the captive and oppressed",
        "Purified through fire — the 'burning ones'"
      ],
      reflections: [
        "Am I seeking to be purified by God's refining fire?",
        "Do I act with the spiritual power God has given me?",
        "Am I willing to be God's instrument in hard missions?",
        "Do I wait upon the Lord to renew my strength?",
        "Is my life characterized by spiritual power or passivity?"
      ],
      keyVerses: ["40:28-31","45:1","41:2","50:4-7","49:22-23"],
      bofmParallels: ["2 Ne 7:4-7","1 Ne 21:22-23","2 Ne 20:14-15"],
      verseIndex: ["1:23","1:24","3:14","6:2","6:6","13:14","24:21","24:22","30:33","40:28","40:29","40:30","40:31","41:2","45:1","48:14","48:15","49:7","49:22","49:23","50:4","50:5","50:6","50:7","50:8","50:9","50:10","50:11"]
    },
    {
      number: 7,
      title: "Jehovah/God of Israel",
      subtitle: "Fullness of God",
      icon: "\u{1F451}",
      color: "#E60000",
      theme: "The highest rung — Jehovah Himself, Jesus Christ. These verses reveal His character, suffering, glory, and promises. Understanding His attributes is the goal of our ascent.",
      attributes: [
        "Perfect love and compassion for His people",
        "Bearing sins and sorrows of all mankind (Isa 53)",
        "Eternal faithfulness: 'my salvation shall be for ever'",
        "Creator and Redeemer — both power and tenderness",
        "Making all things new: 'new heavens and a new earth'",
        "Everlasting light: 'The LORD shall be thine everlasting light'"
      ],
      reflections: [
        "Am I becoming more like the Savior in how I treat others?",
        "Do I bear others' burdens as He bore mine?",
        "Am I faithful to my covenants as He is to His?",
        "Do I truly know Him — not just know about Him?"
      ],
      keyVerses: ["53:4-6","25:1","25:4","25:8-9","12:1-3","63:7-9","60:19-20","65:16-17"],
      bofmParallels: ["Mosiah 14:4-6","2 Ne 22:1-3"],
      verseIndex: ["12:1","12:2","12:3","25:1","25:4","25:8","25:9","45:16","45:17","51:6","53:4","53:5","53:6","53:7","53:8","53:9","53:10","59:19","59:20","60:15","60:16","60:17","60:18","60:19","60:20","61:11","63:7","63:8","63:9","65:16","65:17"]
    }
  ]
};

// ===== GILEADI'S BIFID/CHIASTIC STRUCTURE =====
// Part I (1-33) mirrors Part II (34-66) — themes reverse
const CHIASTIC_SECTIONS = [
  { label: "A",  partI: [1,2,3,4,5],       partII: [58,59,60,61,62,63,64,65,66], themeI: "Ruin & Rebirth",              themeII: "Rebirth & Ruin" },
  { label: "B",  partI: [6,7,8],            partII: [55,56,57],                   themeI: "Rebellion & Compliance",       themeII: "Compliance & Rebellion" },
  { label: "C",  partI: [9,10,11,12],       partII: [51,52,53,54],                themeI: "Doom & Deliverance",           themeII: "Deliverance & Doom" },
  { label: "D",  partI: [13,14,15,16,17,18,19,20,21,22,23], partII: [41,42,43,44,45,46,47,48,49,50], themeI: "Punishment & Deliverance", themeII: "Deliverance & Punishment" },
  { label: "E",  partI: [24,25,26,27],      partII: [38,39,40],                   themeI: "Suffering & Salvation",         themeII: "Salvation & Suffering" },
  { label: "F",  partI: [28,29,30,31],      partII: [36,37],                      themeI: "Disloyalty & Loyalty",          themeII: "Loyalty & Disloyalty" },
  { label: "G",  partI: [32,33],            partII: [34,35],                      themeI: "Humiliation & Exaltation",      themeII: "Exaltation & Humiliation" }
];

// Chapter headings (short summaries like Book of Mormon chapter headings)
const CHAPTER_HEADINGS = {
  1: "Israel's apostasy; sins like scarlet made white; Zion to be redeemed",
  2: "The mountain of the Lord's house exalted; Day of the Lord against the proud",
  3: "Judah and Jerusalem judged; daughters of Zion stripped of pride",
  4: "The Branch of the Lord; Zion purified by the spirit of burning",
  5: "Song of the vineyard; six woes; God's anger not turned away",
  6: "Isaiah's throne vision; seraphim cry Holy; Isaiah's lips cleansed and commission given",
  7: "Ahaz refuses a sign; the virgin shall conceive (Immanuel); Assyria comes",
  8: "Maher-shalal-hash-baz; waters of Shiloah refused; bind up the testimony",
  9: "A great light; unto us a child is born; God's hand stretched out still",
  10: "The Assyrian — rod of God's anger; the remnant shall return",
  11: "Rod of Jesse; Spirit of the Lord; wolf and lamb; root of Jesse as ensign",
  12: "Hymn of praise; draw water from wells of salvation; the Holy One in your midst",
  13: "Burden of Babylon; Day of the Lord; Babylon overthrown like Sodom",
  14: "Israel's rest; fall of Lucifer; the Assyrian broken; Philistia's burden",
  15: "Burden of Moab; Moab shall howl and weep",
  16: "Moab's plea for refuge; throne established in mercy",
  17: "Burden of Damascus; Ephraim's glory fades; gleaning remains",
  18: "Message to the land of buzzing wings beyond Ethiopia; offering to Zion",
  19: "Burden of Egypt; the Lord rides a cloud; altar to the Lord in Egypt",
  20: "Isaiah walks naked as a sign against Egypt and Ethiopia",
  21: "Fall of Babylon announced; burden of Dumah and Arabia; watchman's report",
  22: "Valley of Vision; Shebna replaced by Eliakim; key of David on his shoulder",
  23: "Burden of Tyre; the merchant city laid waste",
  24: "The earth is defiled; the Lord lays it waste; the Lord reigns in Zion",
  25: "Praise to God; feast of fat things; death swallowed up; tears wiped away",
  26: "Song of trust; the Lord is an everlasting rock; the dead shall live",
  27: "Leviathan slain; the vineyard tended; Israel gathered one by one",
  28: "Woe to Ephraim's crown of pride; covenant with death; the cornerstone in Zion",
  29: "Woe to Ariel; the sealed book; the deaf hear, the blind see",
  30: "Woe to those who go down to Egypt; in returning and rest is your strength",
  31: "Woe to those who trust horses; the Lord defends Jerusalem like a lion",
  32: "A king shall reign in righteousness; the Spirit poured out from on high",
  33: "Woe to the spoiler; the Lord is judge, lawgiver, and king; Zion secure",
  34: "The Lord's indignation upon all nations; vengeance for Zion; Edom desolate",
  35: "The desert blossoms; the ransomed return to Zion with singing and joy",
  36: "Sennacherib invades Judah; Rabshakeh mocks the Lord",
  37: "Hezekiah prays; the Lord delivers Jerusalem; 185,000 Assyrians slain",
  38: "Hezekiah's sickness and recovery; fifteen years added; writing of Hezekiah",
  39: "Babylonian envoys shown the treasures; prophecy of future captivity",
  40: "Comfort ye my people; prepare the way; the Creator faints not; eagles' wings",
  41: "The righteous man from the east; fear not, thou worm Jacob; I will help thee",
  42: "The Servant — my elect; a light to the Gentiles; the blind servant Israel",
  43: "I have redeemed thee; called by my name; Israel has not called upon me",
  44: "I will pour my Spirit; there is no God beside me; folly of idols; Cyrus named",
  45: "Cyrus the Lord's anointed; every knee shall bow; Israel saved with an everlasting salvation",
  46: "Bel and Nebo fall; God carries Israel; I am God, there is none like me",
  47: "Babylon personified — the lady of kingdoms brought down; I am and none else",
  48: "Israel reproved; refined in the furnace of affliction; the Servant speaks; go forth from Babylon",
  49: "The Servant called from the womb; a light to the Gentiles; graven on the palms; nursing fathers and mothers",
  50: "Israel's sins caused the separation; the Servant's tongue and suffering; face like a flint",
  51: "Look to Abraham; comfort Zion; awake, O arm of the Lord; the ransomed return",
  52: "Awake, put on beautiful garments; how beautiful the feet; the Servant marred and exalted",
  53: "The suffering Servant; wounded for our transgressions; with his stripes we are healed",
  54: "Sing, O barren; enlarge thy tent; covenant of peace; no weapon shall prosper",
  55: "Come to the waters without price; the word shall not return void; mountains sing",
  56: "Keep judgment; the Lord gathers the outcasts; blind watchmen; greedy dogs",
  57: "The righteous perish unnoticed; idolatry rebuked; God dwells with the contrite; peace to the far and near",
  58: "True fasting vs. false fasting; loose the bands of wickedness; the Sabbath a delight",
  59: "Sin separates from God; truth fallen in the street; the Redeemer comes to Zion",
  60: "Arise, shine; Gentiles come to thy light; kings minister; everlasting light",
  61: "The Spirit of the Lord upon the Servant; beauty for ashes; trees of righteousness",
  62: "Zion's new name; watchmen on the walls; the Lord's reward is with him",
  63: "Who comes from Edom? — the Lord treads the winepress alone; lovingkindness; in all their affliction he was afflicted",
  64: "Rend the heavens and come down; we are the clay, thou the potter",
  65: "I was found by those who sought me not; new heavens and new earth; the wolf and lamb feed together",
  66: "Heaven is my throne; Zion travails and brings forth; new heavens and earth; the Lord comes with fire"
};

function getChiasmInfo(ch) {
  for (const sec of CHIASTIC_SECTIONS) {
    if (sec.partI.includes(ch)) {
      return { section: sec.label, part: 'I', theme: sec.themeI, mirror: sec.partII, mirrorTheme: sec.themeII, chapters: sec.partI };
    }
    if (sec.partII.includes(ch)) {
      return { section: sec.label + "'", part: 'II', theme: sec.themeII, mirror: sec.partI, mirrorTheme: sec.themeI, chapters: sec.partII };
    }
  }
  return null;
}

// ===== MULTI-RUNG CHAPTER MAPPING =====
// Each chapter can contain multiple spiritual categories (rungs)
// Primary = dominant theme, secondary = also present
const CHAPTER_RUNGS = {
  1: { primary: [3,2], secondary: [4] },  // Jacob/Israel indictment + Babylon traits + Zion promise
  2: { primary: [4,7], secondary: [2] },  // Zion exalted + Day of the Lord + Babylon pride
  3: { primary: [3,2], secondary: [1] },  // Jacob/Israel judgment + Babylon luxury
  4: { primary: [4,7], secondary: [5] },  // Zion purified + Jehovah's glory + Branch
  5: { primary: [3,2], secondary: [7] },  // Vineyard (Jacob) + Babylon woes + judgment
  6: { primary: [7,6], secondary: [5] },  // Jehovah throne + Seraphim + Servant commissioned
  7: { primary: [3,4], secondary: [7] },  // Jacob/Israel crisis + Zion promise + Immanuel
  8: { primary: [3,4], secondary: [7] },  // Jacob stumbles + Zion cornerstone
  9: { primary: [3,7], secondary: [1] },  // Jacob pride + Messianic king + Assyrian judgment
  10: { primary: [1,6], secondary: [3] }, // Assyrian (Perdition archetype) + Seraph agent + remnant
  11: { primary: [7,4], secondary: [6] }, // Messianic king + Zion peace + gathering
  12: { primary: [7,4], secondary: [] },  // Praise hymn + Zion joy
  13: { primary: [2,1], secondary: [7] }, // Babylon burden + Perdition + Day of Lord
  14: { primary: [1,2], secondary: [4,7] }, // Lucifer fall + Babylon + Zion rest + Jehovah's purpose
  15: { primary: [2], secondary: [3] },   // Moab burden
  16: { primary: [2], secondary: [4] },   // Moab continued
  17: { primary: [2,3], secondary: [] },  // Damascus + Ephraim
  18: { primary: [4], secondary: [6] },   // Gathering from distant lands
  19: { primary: [2], secondary: [4,7] }, // Egypt + future worship
  20: { primary: [5], secondary: [2] },   // Servant sign (Isaiah naked)
  21: { primary: [2,6], secondary: [] },  // Babylon falls + watchman
  22: { primary: [3,5], secondary: [6] }, // Jerusalem complacent + Eliakim/Shebna
  23: { primary: [2], secondary: [] },    // Tyre burden
  24: { primary: [2,7], secondary: [] },  // Earth judgment + Jehovah reigns
  25: { primary: [7,4], secondary: [] },  // Feast + praise + Jehovah's salvation
  26: { primary: [4,5], secondary: [7] }, // Zion song + trust + resurrection
  27: { primary: [3,4], secondary: [7] }, // Jacob purged + vineyard restored
  28: { primary: [3,2], secondary: [4,7] }, // Ephraim drunk + covenant with death + cornerstone
  29: { primary: [3], secondary: [4,7] }, // Ariel distress + sealed book + future reversal
  30: { primary: [3,2], secondary: [4,7] }, // Egypt alliance folly + Zion promise
  31: { primary: [3,2], secondary: [4,7] }, // Trust in Egypt + Lord defends Zion
  32: { primary: [4,5], secondary: [7] }, // Righteous king + Zion women + Spirit poured
  33: { primary: [4,7], secondary: [5] }, // Zion secure + Jehovah judge/king
  34: { primary: [1,2], secondary: [7] }, // Edom judgment + Day of vengeance
  35: { primary: [4,7], secondary: [5] }, // Highway to Zion + ransomed return + joy
  36: { primary: [1], secondary: [3,5] }, // Assyrian threat (Perdition archetype)
  37: { primary: [5,6], secondary: [7] }, // Hezekiah prays (Servant) + God delivers (Seraph power)
  38: { primary: [5,3], secondary: [7] }, // Hezekiah's illness + prayer + deliverance
  39: { primary: [2,3], secondary: [] },  // Babylon envoys + future captivity
  40: { primary: [7,4], secondary: [6] }, // Comfort Zion + Jehovah Creator + eagles
  41: { primary: [6,3], secondary: [7] }, // Righteous conqueror + Jacob worm + Holy One
  42: { primary: [5,3], secondary: [7] }, // Servant Song 1 + blind servant Israel
  43: { primary: [7,3], secondary: [5] }, // Redeemer + Jacob hasn't called on God
  44: { primary: [7,3], secondary: [2] }, // Spirit poured + idolatry foolishness
  45: { primary: [7,6], secondary: [] },  // Cyrus anointed + Jehovah alone is God
  46: { primary: [7,3], secondary: [2] }, // Idols carried vs God carries Israel
  47: { primary: [2,1], secondary: [] },  // Babylon's fall personified
  48: { primary: [3,5], secondary: [7,2] }, // Jacob hypocrisy + Servant voice + leave Babylon
  49: { primary: [5,7], secondary: [6,4] }, // Servant Song 2 + gathering + nursing fathers
  50: { primary: [5,6], secondary: [7] }, // Servant Song 3 + face like flint
  51: { primary: [4,5], secondary: [7] }, // Comfort Zion + Arm of Lord + ransomed return
  52: { primary: [4,5,7], secondary: [6] }, // Zion awake + beautiful feet + Servant marred
  53: { primary: [7,5], secondary: [] },  // Servant Song 4 + Atonement
  54: { primary: [4,5], secondary: [7] }, // Zion enlarged + covenant of peace
  55: { primary: [7,4], secondary: [] },  // Waters freely + word goes forth
  56: { primary: [4,3], secondary: [5] }, // Sabbath + foreigners gathered + blind watchmen
  57: { primary: [3,2], secondary: [7] }, // Idolatry + God with contrite
  58: { primary: [3,4], secondary: [5] }, // True fasting + Sabbath delight
  59: { primary: [3,7], secondary: [6] }, // Sin separates + Redeemer comes to Zion
  60: { primary: [4,5], secondary: [7,6] }, // Arise shine + kings come + everlasting light
  61: { primary: [5,7], secondary: [4] }, // Spirit upon Servant + year of Lord + beauty for ashes
  62: { primary: [4], secondary: [5,7] }, // Zion's new name + watchmen + gathering
  63: { primary: [7,6], secondary: [5] }, // Winepress of wrath + lovingkindness + afflicted with them
  64: { primary: [3,7], secondary: [] },  // Rend heavens + Potter and clay
  65: { primary: [4,7], secondary: [3,1] }, // New heavens + servants vs rebels
  66: { primary: [7,4], secondary: [1] }  // Heaven throne + Zion birth + final judgment
};

// Keywords associated with each rung (for click-to-highlight feature)
const RUNG_KEYWORDS = {
  1: ['lucifer','satan','assyria','assyrian','oppressor','destroy','pride','throne','exalt','rebel','perdition','dragon','serpent','leviathan','wicked','transgressed','worm'],
  2: ['babylon','chaldeans','chaldea','egypt','moab','tyre','sidon','tarshish','idols','gold','silver','drunk','drunken','sorcery','enchantments','harlot','pleasure','merchandise','rich','wealthy','careless'],
  3: ['jacob','israel','ephraim','samaria','blind','deaf','stubborn','stiff','hypocrite','complacent','weary','complained','motions','err','rebellion','dross','briers','thorns','transgression'],
  4: ['zion','jerusalem','mount','mountain','temple','holy','tabernacle','stakes','tent','gather','gathered','gathering','sanctuary','praise','joy','sing','singing','song','beautiful','garments','covenant','law','teach','paths','light','glory'],
  5: ['servant','servants','son','sons','daughter','daughters','minister','intercede','suffer','affliction','afflicted','furnace','refined','enlarge','expand','consecrate','sacrifice','mercy','merciful','pure','heart','mourn'],
  6: ['seraphim','seraphs','fire','burning','anointed','cyrus','eagle','eagles','wings','power','mighty','deliver','delivered','conquer','subdued','nations','righteous','judgment','execute','sword','flint'],
  7: ['lord','god','jehovah','redeemer','holy','saviour','creator','atonement','wounded','bruised','stripes','healed','griefs','sorrows','lamb','shepherd','everlasting','salvation','redeem','redeemed','compassion','lovingkindness','forgive','forgiven','new','heavens','earth','comforter']
};

// Get all rungs present in a chapter (primary + secondary)
function getChapterRungs(ch) {
  const data = CHAPTER_RUNGS[ch];
  if (!data) return { primary: [], secondary: [] };
  return data;
}

// Legacy compatibility
function getRungForChapter(ch) {
  const data = CHAPTER_RUNGS[ch];
  if (!data || data.primary.length === 0) return null;
  return data.primary[0];
}

function getRungInfo(ch) {
  const rungNum = getRungForChapter(ch);
  if (!rungNum) return { label: "Historical Bridge", color: "#888", number: null };
  const rung = ISAIAH_LADDER.rungs[rungNum - 1];
  return { label: `Rung ${rungNum}: ${rung.title}`, color: rung.color, number: rungNum, subtitle: rung.subtitle };
}

function getRungById(num) {
  return ISAIAH_LADDER.rungs[num - 1] || null;
}
