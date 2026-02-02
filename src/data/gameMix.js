export const gameMix = [
  {
    id: "pan-man",
    title: "Pan Man Chronicles: Tuner Triumphs",
    tagline: "A Trini-flavored, fact-grounded tuning adventure for tenor pan.",
    status: "Playable slice",
    roles: ["Tuner", "Field guide"],
    summary:
      "Travel the Panorama map, tune note zones, and balance the partials until the pan sings sweet.",
    pillars: [
      "Navigate 10 band stops across Trinidad and Tobago.",
      "Apply tuning steps: soften, pitch, octave, third partial, blend.",
      "Track live harmonic analysis and overall pan clarity."
    ],
    tags: ["Single-instrument focus", "Harmonic analysis", "Map-driven flow"]
  },
  {
    id: "festival-of-pan",
    title: "Festival of Pan: Master Arranger",
    tagline: "The Pan is not just an instrument; it is a movement.",
    status: "Design doc",
    roles: ["Arranger", "Captain"],
    summary:
      "A high-fidelity management and rhythm strategy game where you command a 120-piece steel orchestra.",
    goal:
      "Take a band from the dust of the Panyard to the glory of the Big Stage at Panorama, battling rival bands, judges' critiques, and the chaos of the Engine Room.",
    featured: true,
    sections: [
      {
        id: "core",
        title: "Core concept",
        bullets: [
          "You are the musical architect and field commander, shaping arrangements while leading performance execution.",
          "Complexity vs playability is a constant tension, and every section has distinct strengths and risks."
        ]
      },
      {
        id: "reality",
        title: "The Information Reality (NALIS research)",
        description:
          "The steelband is treated as a complex organism with distinct organs, moving away from generic music game tropes.",
        blocks: [
          {
            id: "frontline",
            title: "Frontline (The Voice)",
            items: [
              "Instruments: Tenor Pan (Soprano), Double Tenor.",
              "Game function: high-risk, high-reward melody lines. Precise timing is critical.",
              "If they fall out of sync, the Sweetness score drops rapidly."
            ]
          },
          {
            id: "mid",
            title: "Mid-Section (The Glue)",
            items: [
              "Instruments: Double Seconds, Triple Guitars, 3 and 4-Cello.",
              "Game function: the Strum and harmonic bed.",
              "If they overpower the Frontline, the arrangement sounds muddy."
            ]
          },
          {
            id: "background",
            title: "Background (The Foundation)",
            items: [
              "Instruments: Tenor Bass, 6-Bass, 9-Bass, 12-Bass (the Big Guns).",
              "Game function: heartbeat and raw power control.",
              "Hits generate visual Shockwaves that buffer crowd excitement."
            ]
          },
          {
            id: "engine",
            title: "The Engine Room (The Drive)",
            items: [
              "Instruments: Irons (Brake Drums), Scratchers, Congas, Cowbells.",
              "Game function: dictate tempo. The Iron Man is a special unit.",
              "If they drag, the whole band slows. If they rush, the band falls apart."
            ]
          }
        ]
      },
      {
        id: "loop",
        title: "Gameplay loop",
        blocks: [
          {
            id: "panyard",
            title: "Phase 1: The Panyard (Strategic Preparation)",
            items: [
              "Arrangement board: drag and drop musical modules like chromatic runs, modulations, and jam sections.",
              "Constraint: balance complexity vs playability; sections that are too hard trigger clashes (bad notes).",
              "Drilling: assign section leaders to drill parts. Focus on Tenors improves melody but can leave Bass sloppy."
            ]
          },
          {
            id: "drag",
            title: "Phase 2: The Drag (Logistics Mini-Game)",
            items: [
              "Move racks from the Yard to the Stage while managing stamina and morale.",
              "A Vibes check sets your opening penalty if morale is low before the stage."
            ]
          },
          {
            id: "stage",
            title: "Phase 3: The Big Stage (Performance)",
            items: [
              "Real-time tactical rhythm gameplay on the conductor's stand (or jumping with the band).",
              "Conductor mechanic: left hand controls dynamics, right hand taps tempo to keep the Engine Room in check.",
              "Ramajay gauge builds from perfect sync between Engine Room and Bass.",
              "When Ramajay is full: fireworks, crowd roar boosts score, band stamina drains slower."
            ]
          }
        ]
      },
      {
        id: "tech",
        title: "Technical implementation",
        blocks: [
          {
            id: "audio",
            title: "Audio Engine (Web Audio API)",
            items: [
              "Granular synthesis or sampler-based instancing; multi-track stemming is not enough.",
              "Spatial audio: camera position changes the mix. Stand near the Bass racks and the Tenors are drowned out.",
              "Procedural mistakes: low drill slightly randomizes pitch and timing to create realistic clatter."
            ]
          },
          {
            id: "visuals",
            title: "Visuals (WebGL / Three.js)",
            items: [
              "Instanced meshes to render 120+ animated musician models efficiently.",
              "Chrome shaders reflect environment lighting (Panyard glow vs Stage spotlights).",
              "Physics for pan sticks reacting to the drum surface."
            ]
          }
        ]
      },
      {
        id: "progression",
        title: "Progression (Season Mode)",
        bullets: [
          "Recruitment: scout a star Iron Man or a veteran Bass player from rivals.",
          "Politics: manage judges and choose songs that fit historical bias.",
          "Upgrades: better chroming for pans (clearer sound), uniform upgrades for style points."
        ]
      },
      {
        id: "roadmap",
        title: "Development roadmap (MVP)",
        bullets: [
          "Prototype: single section (Tenors) plus Engine Room to test the tempo drive mechanic.",
          "Alpha: full band rendering (dots for players) and basic arrangement UI.",
          "Beta: full 3D assets, refined audio engine, and the Ramajay mechanic."
        ]
      }
    ],
    tags: ["Management + rhythm strategy", "120-piece orchestra", "Season mode"]
  }
];
