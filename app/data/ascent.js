// The Code of Spiritual Ascension
// Three Parallel Paths to the Top of Isaiah's Ladder
// Source: The_Code_of_Spiritual_Ascension.pdf

const ASCENT_STAGES = [
  {
    rung: 1,
    title: "Perdition",
    subtitle: "Open Rebellion",
    color: "#1A1A1A",
    covenant: {
      title: "No Covenant / Broken Beyond Repair",
      text: "Those who have known the fullness and willfully deny and fight against it. Sons of Perdition.",
      refs: ["D&C 76:31-35","Heb 6:4-6","Alma 24:30"]
    },
    beatitude: {
      title: "The Opposite: Hardened in Heart",
      text: "They are the antithesis of 'poor in spirit' — they exalt themselves above God. 'I will exalt my throne above the stars of God' (Isa 14:13).",
      refs: ["Isa 14:12-15","Matt 5:3 (contrast)"]
    },
    attribute: {
      title: "The Absence of Faith — and Humility",
      text: "Without faith in God's plan, there is no foundation. Lucifer had knowledge but no faith — he trusted his own wisdom. And critically, he lacked humility. D&C 4 places humility near the END because it must be MAINTAINED at the highest levels.",
      refs: ["D&C 4:6","D&C 93:25","Moses 4:1","Isa 14:13"]
    },
    warning: "Lucifer was a seraph — he had knowledge, authority, and light. But he missed humility and charity. D&C 4:6 lists TEN attributes including HUMILITY and DILIGENCE unique to this list. They are the safety net. Without humility, even a seraph falls."
  },
  {
    rung: 2,
    title: "Babylon",
    subtitle: "Worldliness",
    color: "#CC5500",
    covenant: {
      title: "Pre-Baptism / Unbaptized",
      text: "Living by the world's standards. May believe in God generally but has not entered into covenant. Prioritizes comfort, wealth, status.",
      refs: ["Isa 47:8-10","Rev 18:4","1 Ne 13:5-9"]
    },
    beatitude: {
      title: "Blessed are the poor in spirit (Matt 5:3)",
      text: "The FIRST step out of Babylon is recognizing spiritual poverty — admitting 'I need God.' This is the awakening. 3 Nephi 12:3 adds: 'who come unto me.'",
      refs: ["Matt 5:3","3 Ne 12:3","Mosiah 4:5-7"]
    },
    attribute: {
      title: "Faith + Diligence begins",
      text: "The very first attribute. Faith is the decision to trust God's plan over Babylon's promises. And DILIGENCE also begins here — it is required at EVERY level, the sustained effort that prevents backsliding.",
      refs: ["D&C 4:6","Alma 32:21","Heb 11:1,6","D&C 58:27"]
    }
  },
  {
    rung: 3,
    title: "Jacob/Israel",
    subtitle: "Covenant People",
    color: "#808080",
    covenant: {
      title: "Baptism & Confirmation",
      text: "Entering the gate. Taking upon the name of Christ, receiving the gift of the Holy Ghost. Becoming a member of the covenant people — but this is only the beginning.",
      refs: ["2 Ne 31:17-18","D&C 20:37","Mosiah 18:8-10","3 Ne 27:20"]
    },
    beatitude: {
      title: "Blessed are they that mourn (Matt 5:4)",
      text: "After recognizing spiritual poverty comes godly sorrow — mourning for sin, mourning for the fallen state of the world. The Comforter (Holy Ghost) is the promise.",
      refs: ["Matt 5:4","2 Cor 7:10","Moroni 2:2"]
    },
    attribute: {
      title: "Virtue + Humility begins",
      text: "After faith, virtue — moral excellence, purity. This is the cleansing of baptism. And HUMILITY begins in earnest: baptism itself is an act of humility — going down into the water, submitting to God's ordinance.",
      refs: ["D&C 4:6","2 Peter 1:5","Moroni 9:9","D&C 112:10"]
    }
  },
  {
    rung: 4,
    title: "Zion/Jerusalem",
    subtitle: "The Gathered Faithful",
    color: "#228B22",
    covenant: {
      title: "Temple Endowment & Oath/Covenant of Priesthood",
      text: "Receiving the endowment — learning the laws of obedience, sacrifice, the gospel, chastity, and consecration. The oath and covenant of the priesthood (D&C 84:33-42).",
      refs: ["D&C 84:33-42","D&C 109:22","D&C 132:19-20"]
    },
    beatitude: {
      title: "Blessed are the meek & those who hunger for righteousness (Matt 5:5-6)",
      text: "TWO beatitudes occupy this rung. Meekness — submitting to God's will — is the posture of the endowed saint. Hungering for righteousness is the daily covenant life of Zion.",
      refs: ["Matt 5:5-6","3 Ne 12:5-6","Psalm 37:11","D&C 59:9"]
    },
    attribute: {
      title: "Knowledge, Temperance + Deepening Humility",
      text: "In the temple, you gain sacred knowledge — the plan, the symbols, the covenants. Temperance is the discipline to live those covenants daily. Here humility becomes critical: knowledge can breed pride.",
      refs: ["D&C 4:6","2 Peter 1:5-6","2 Ne 9:29","D&C 84:33"]
    }
  },
  {
    rung: 5,
    title: "Sons/Servants",
    subtitle: "Active Ministry",
    color: "#E75480",
    covenant: {
      title: "Celestial Marriage (Sealing) & Consecration",
      text: "The new and everlasting covenant of marriage. Sealing to spouse and children. Full consecration — giving all you have and are to building the kingdom.",
      refs: ["D&C 131:1-4","D&C 132:19-20","Jacob 1:19","Mosiah 2:17"]
    },
    beatitude: {
      title: "Blessed are the merciful & the pure in heart (Matt 5:7-8)",
      text: "At this level, you extend mercy — you intercede, forgive, serve. Your heart is purified through that service. 'They shall see God' — purity of heart is the prerequisite for seeing the divine.",
      refs: ["Matt 5:7-8","3 Ne 12:7-8","Alma 13:12","D&C 93:1"]
    },
    attribute: {
      title: "Patience, Brotherly Kindness + Diligence in Service",
      text: "These are the attributes of active service — you cannot minister without patience, and you cannot intercede without genuine love. True servants do not seek recognition.",
      refs: ["D&C 4:6","2 Peter 1:7","Mosiah 18:8-9","Moroni 7:45","Mosiah 2:17"]
    }
  },
  {
    rung: 6,
    title: "Seraphs/Seraphim",
    subtitle: "Burning Ones",
    color: "#7B2D8E",
    covenant: {
      title: "Calling & Election Made Sure",
      text: "The 'more sure word of prophecy.' Sealed by the Holy Spirit of Promise. The Second Comforter — the personal ministry of Christ.",
      refs: ["2 Peter 1:10-19","D&C 131:5","D&C 88:3-4","John 14:16-18"]
    },
    beatitude: {
      title: "Blessed are the peacemakers (Matt 5:9)",
      text: "Peacemakers are 'called the children of God' — because they have been sealed as His. The seraphs stand in God's presence. They bring divine peace and reconciliation.",
      refs: ["Matt 5:9","3 Ne 12:9","Isa 6:1-7","D&C 76:67"]
    },
    attribute: {
      title: "Godliness + HUMILITY IS CRITICAL HERE",
      text: "Godliness — becoming godlike. But D&C 4:6 uniquely adds HUMILITY after charity — because at the seraph level, the danger of pride is greatest. Godliness without humility is the formula for Lucifer's fall.",
      refs: ["D&C 4:6","2 Peter 1:6-7","Ezek 28:17","D&C 76:94-95","Ether 12:27"]
    },
    warning: "THIS IS WHERE LUCIFER FELL. He had knowledge, authority, godliness, and stood in God's presence. But he lacked CHARITY and HUMILITY. He sought his own honor (Moses 4:1). Pride replaced love. The higher you climb, the more essential humility becomes."
  },
  {
    rung: 7,
    title: "Jehovah",
    subtitle: "Fullness of God",
    color: "#E60000",
    covenant: {
      title: "Fullness of the Priesthood / Exaltation",
      text: "Receiving the fullness of the Father — becoming like God. 'All that my Father hath shall be given unto him' (D&C 84:38). 'Then shall they be gods' (D&C 132:20).",
      refs: ["D&C 84:38","D&C 132:20","D&C 76:94-95","3 Ne 28:10"]
    },
    beatitude: {
      title: "Blessed are they persecuted for righteousness' sake (Matt 5:10-12)",
      text: "The final beatitude is suffering for righteousness — the fullness of sacrifice. Those who reach this level are willing to sacrifice EVERYTHING, including life itself.",
      refs: ["Matt 5:10-12","3 Ne 12:10-12","D&C 135:1-4","D&C 138:12-13"]
    },
    attribute: {
      title: "Charity, Humility & Diligence — The Complete Ten",
      text: "The capstone is CHARITY — 'the bond of perfectness.' But even after obtaining charity, one must remain HUMBLE and DILIGENT. All ten attributes fully expressed IS the Jehovah level — the fullness of the divine nature.",
      refs: ["D&C 4:6","Moroni 7:46-48","1 Cor 13:1-3","Col 3:14","Moses 4:2","3 Ne 27:6"]
    }
  }
];

const LUCIFER_ANALYSIS = {
  title: "What Lucifer Missed: A Scriptural Analysis",
  intro: "Lucifer was 'an angel of God who was in authority in the presence of God' (D&C 76:25). In Isaiah's framework, this places him at the Seraph level. He had ascended through knowledge, power, and authority. But he fell from Seraph (Rung 6) all the way to Perdition (Rung 1) because he missed the final and most essential attributes.",
  scriptures: [
    { ref: "Moses 4:1", text: "Behold, here am I, send me, I will be thy son, and I will redeem all mankind... wherefore give me thine honor." },
    { ref: "D&C 76:25-26", text: "An angel of God who was in authority in the presence of God, who rebelled... was thrust down and was called Perdition." },
    { ref: "Isaiah 14:13-14", text: "I will ascend into heaven, I will exalt my throne above the stars of God... I will be like the most High." },
    { ref: "Ezekiel 28:15,17", text: "Thine heart was lifted up because of thy beauty, thou hast corrupted thy wisdom by reason of thy brightness." }
  ],
  lesson: "Lucifer's path shows that knowledge without charity and humility is not just insufficient — it is dangerous. He lacked three of the ten D&C 4:6 attributes: CHARITY (he sought his own honor), HUMILITY (his heart was lifted up), and DILIGENCE in righteousness (he abandoned the path when it required submission).",
  tenAttributes: ["Faith","Virtue","Knowledge","Temperance","Patience","Brotherly Kindness","Godliness","Charity","Humility","Diligence"],
  luciferHad: [true, true, true, true, true, true, true, false, false, false],
  promise: {
    title: "The Promise: Ask, and Ye Shall Receive",
    text: "D&C 4 lists the ten attributes (v.6), then gives the promise (v.7): 'Ask, and ye shall receive; knock, and it shall be opened unto you.' The Sermon on the Mount follows the same pattern: Beatitudes, then 'Ask, and it shall be given you' (Matt 7:7). The temple follows the same pattern: ascending covenants, then the veil — asking and knocking before entering God's presence. Three witnesses. One pattern. One code.",
    refs: ["D&C 4:7","Matt 7:7-8","D&C 88:63","James 1:5-6"]
  }
};
