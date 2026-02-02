export const festivalModules = [
  {
    id: "chromatic-run",
    name: "Chromatic Run in G Minor",
    type: "Frontline",
    description: "A high-velocity climb that tests the tenor line's stamina.",
    complexity: 18
  },
  {
    id: "modulation-f",
    name: "Modulation to F",
    type: "Mid-Section",
    description: "A harmonic pivot that tightens the glue section.",
    complexity: 15
  },
  {
    id: "jam-section",
    name: "Jam Section",
    type: "Band",
    description: "Open-call improvisation with controlled chaos.",
    complexity: 12
  },
  {
    id: "bass-drop",
    name: "Bass Drop",
    type: "Background",
    description: "Big-gun hits that fire crowd shockwaves.",
    complexity: 10
  },
  {
    id: "engine-break",
    name: "Engine Break",
    type: "Engine Room",
    description: "A percussive stop-time passage for the Iron Man.",
    complexity: 14
  },
  {
    id: "call-response",
    name: "Call & Response",
    type: "Frontline",
    description: "Tenors and Seconds trade phrases across the yard.",
    complexity: 13
  },
  {
    id: "power-chorus",
    name: "Power Chorus",
    type: "Band",
    description: "Full-band unison that tests overall blend.",
    complexity: 16
  },
  {
    id: "sotto-bridge",
    name: "Sotto Voce Bridge",
    type: "Mid-Section",
    description: "Soft, sweet passage that demands dynamic control.",
    complexity: 11
  }
];

export const festivalSections = [
  {
    id: "frontline",
    name: "Frontline",
    role: "The Voice",
    detail: "Tenor Pan, Double Tenor",
    baseSkill: 0.78
  },
  {
    id: "mid",
    name: "Mid-Section",
    role: "The Glue",
    detail: "Double Seconds, Triple Guitars, 3 & 4-Cello",
    baseSkill: 0.74
  },
  {
    id: "background",
    name: "Background",
    role: "The Foundation",
    detail: "Tenor Bass, 6-Bass, 9-Bass, 12-Bass",
    baseSkill: 0.72
  },
  {
    id: "engine",
    name: "Engine Room",
    role: "The Drive",
    detail: "Irons, Scratchers, Congas, Cowbells",
    baseSkill: 0.7
  }
];

export const initialDrill = {
  frontline: 28,
  mid: 26,
  background: 24,
  engine: 22
};
