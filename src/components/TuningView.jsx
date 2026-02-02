import { useMemo, useState } from "react";
import { tenorNotes } from "../data/tenorNotes.js";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer.js";
import { PanScene } from "./PanScene.jsx";

const tuningSteps = [
  {
    id: "soften",
    label: "Soften",
    note: "Relax the note before precision work."
  },
  {
    id: "pitch",
    label: "Pitch",
    note: "Pull the fundamental toward center."
  },
  {
    id: "octave",
    label: "Octave",
    note: "Match the octave partial."
  },
  {
    id: "third",
    label: "Third Partial",
    note: "Align the side-zone harmonic."
  },
  {
    id: "blend",
    label: "Blend",
    note: "Balance the note with its neighbors."
  }
];

const randomDetune = (range) => (Math.random() - 0.5) * range * 2;

const initNotes = () =>
  tenorNotes.map((note) => ({
    ...note,
    detune: randomDetune(18),
    octaveDetune: randomDetune(14),
    thirdDetune: randomDetune(12)
  }));

const formatCents = (value) => {
  const rounded = Math.round(value);
  if (Math.abs(rounded) < 1) return "0c";
  return `${rounded > 0 ? "+" : ""}${rounded}c`;
};

const formatHz = (value) => `${value.toFixed(1)} hz`;

export const TuningView = ({ band, onBack }) => {
  const [notes, setNotes] = useState(() => initNotes());
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id ?? null);
  const [lastAction, setLastAction] = useState("Select a note to hear it.");
  const { analysis, playNote } = useAudioAnalyzer();

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId),
    [notes, activeNoteId]
  );

  const overallClarity = useMemo(() => {
    const average =
      notes.reduce(
        (sum, note) =>
          sum +
          (Math.abs(note.detune) +
            Math.abs(note.octaveDetune) +
            Math.abs(note.thirdDetune)) /
            3,
        0
      ) /
      notes.length;
    return Math.max(0, Math.round(100 - average * 2.4));
  }, [notes]);

  const handleNotePress = (noteId) => {
    const note = notes.find((item) => item.id === noteId);
    if (!note) return;
    setActiveNoteId(noteId);
    playNote(note);
    setLastAction(`Listening to ${note.label}. Choose a tuning step.`);
  };

  const applyStep = (stepId) => {
    if (!activeNoteId) return;

    setNotes((prev) =>
      prev.map((note) => {
        if (note.id !== activeNoteId) return note;
        const next = { ...note };
        switch (stepId) {
          case "soften":
            next.detune *= 0.7;
            next.octaveDetune *= 0.75;
            next.thirdDetune *= 0.8;
            break;
          case "pitch":
            next.detune *= 0.55;
            break;
          case "octave":
            next.octaveDetune *= 0.55;
            break;
          case "third":
            next.thirdDetune *= 0.55;
            break;
          case "blend":
            next.detune *= 0.8;
            next.octaveDetune *= 0.8;
            next.thirdDetune *= 0.8;
            break;
          default:
            break;
        }
        return next;
      })
    );

    const note = notes.find((item) => item.id === activeNoteId);
    if (note) {
      const tuned = {
        ...note,
        detune:
          stepId === "pitch"
            ? note.detune * 0.55
            : stepId === "soften"
              ? note.detune * 0.7
              : stepId === "blend"
                ? note.detune * 0.8
                : note.detune,
        octaveDetune:
          stepId === "octave"
            ? note.octaveDetune * 0.55
            : stepId === "soften"
              ? note.octaveDetune * 0.75
              : stepId === "blend"
                ? note.octaveDetune * 0.8
                : note.octaveDetune,
        thirdDetune:
          stepId === "third"
            ? note.thirdDetune * 0.55
            : stepId === "soften"
              ? note.thirdDetune * 0.8
              : stepId === "blend"
                ? note.thirdDetune * 0.8
                : note.thirdDetune
      };
      playNote(tuned);
    }

    const step = tuningSteps.find((item) => item.id === stepId);
    setLastAction(step ? step.note : "Tuning step applied.");
  };

  return (
    <section className="tuning-view">
      <div className="tuning-header">
        <div>
          <span className="chip chip--ghost">{band.region}</span>
          <h2>{band.name}</h2>
          <p>{band.location}</p>
        </div>
        <button className="btn btn--ghost" type="button" onClick={onBack}>
          Back to map
        </button>
      </div>

      <div className="tuning-layout">
        <div className="pan-stage">
          <PanScene
            notes={notes}
            activeNoteId={activeNoteId}
            onNotePress={handleNotePress}
          />
          <div className="pan-stage__overlay">
            <p>{band.hook}</p>
          </div>
        </div>

        <div className="tuning-panel">
          <div className="panel-block">
            <h3>Field log</h3>
            <p>{band.challenge}</p>
            <p className="panel-block__note">{lastAction}</p>
          </div>

          <div className="panel-block">
            <h3>Active note</h3>
            {activeNote ? (
              <div className="note-card">
                <div>
                  <strong>{activeNote.label}</strong>
                  <span>{formatHz(activeNote.freq)}</span>
                </div>
                <div className="note-card__stats">
                  <span>Fundamental {formatCents(activeNote.detune)}</span>
                  <span>Octave {formatCents(activeNote.octaveDetune)}</span>
                  <span>Third {formatCents(activeNote.thirdDetune)}</span>
                </div>
              </div>
            ) : (
              <p>Select a note zone to begin.</p>
            )}
            <div className="note-grid">
              {notes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  className={`note-button${
                    note.id === activeNoteId ? " note-button--active" : ""
                  }`}
                  onClick={() => handleNotePress(note.id)}
                >
                  {note.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-block">
            <h3>Tuning steps</h3>
            <div className="step-grid">
              {tuningSteps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  className="step"
                  onClick={() => applyStep(step.id)}
                  disabled={!activeNoteId}
                >
                  <span>{step.label}</span>
                  <small>{step.note}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-block">
            <h3>Harmonic analysis</h3>
            <div className="analysis-score">
              <span>Clarity</span>
              <strong>{analysis.score}%</strong>
            </div>
            <div className="analysis-bar">
              <span style={{ width: `${analysis.score}%` }} />
            </div>
            <div className="analysis-rows">
              <div className="analysis-row">
                <span>Fundamental</span>
                <div className="analysis-meter">
                  <span style={{ width: `${analysis.fundamental.level * 100}%` }} />
                </div>
                <span>{formatCents(analysis.fundamental.cents)}</span>
              </div>
              <div className="analysis-row">
                <span>Octave</span>
                <div className="analysis-meter">
                  <span style={{ width: `${analysis.octave.level * 100}%` }} />
                </div>
                <span>{formatCents(analysis.octave.cents)}</span>
              </div>
              <div className="analysis-row">
                <span>Third</span>
                <div className="analysis-meter">
                  <span style={{ width: `${analysis.third.level * 100}%` }} />
                </div>
                <span>{formatCents(analysis.third.cents)}</span>
              </div>
            </div>
            <div className="analysis-score analysis-score--wide">
              <span>Pan clarity</span>
              <strong>{overallClarity}%</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
