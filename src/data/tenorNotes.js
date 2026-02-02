const ringInner = 1.1;
const ringOuter = 1.85;

const noteLayout = [
  { id: "C4", label: "C4", freq: 261.63, ring: "inner", angle: 20 },
  { id: "D4", label: "D4", freq: 293.66, ring: "inner", angle: 80 },
  { id: "E4", label: "E4", freq: 329.63, ring: "inner", angle: 140 },
  { id: "F#4", label: "F#4", freq: 369.99, ring: "inner", angle: 200 },
  { id: "G4", label: "G4", freq: 392.0, ring: "inner", angle: 260 },
  { id: "A4", label: "A4", freq: 440.0, ring: "inner", angle: 320 },
  { id: "B4", label: "B4", freq: 493.88, ring: "outer", angle: 0 },
  { id: "C5", label: "C5", freq: 523.25, ring: "outer", angle: 60 },
  { id: "D5", label: "D5", freq: 587.33, ring: "outer", angle: 120 },
  { id: "E5", label: "E5", freq: 659.25, ring: "outer", angle: 180 },
  { id: "F#5", label: "F#5", freq: 739.99, ring: "outer", angle: 240 },
  { id: "G5", label: "G5", freq: 783.99, ring: "outer", angle: 300 }
];

export const tenorNotes = noteLayout.map((note) => {
  const radius = note.ring === "inner" ? ringInner : ringOuter;
  const angle = (note.angle * Math.PI) / 180;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  return {
    ...note,
    position: [x, 0.08, z]
  };
});
