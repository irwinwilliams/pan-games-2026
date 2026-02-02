import { useEffect, useMemo, useRef, useState } from "react";
import {
  festivalModules,
  festivalSections,
  initialDrill
} from "../data/festivalData.js";
import { useFestivalAudio } from "../hooks/useFestivalAudio.js";

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const formatPercent = (value) => `${Math.round(value)}%`;

const formatTempo = (value) => `${Math.round(value)} bpm`;

const initialStageState = (penalty) => ({
  isLive: false,
  conductorTempo: 120,
  engineTempo: 118,
  dynamics: 0.6,
  crowd: clamp(75 - penalty.crowd),
  stamina: clamp(92 - penalty.stamina),
  score: 0,
  ramajay: 0,
  ramajayActive: false,
  ramajayTime: 0,
  ironManActive: false,
  ironManTime: 0,
  ironManCooldown: 0,
  time: 0,
  sweetness: 0,
  sync: 0
});

export const FestivalOfPan = ({ onBack }) => {
  const [phase, setPhase] = useState("panyard");
  const [arrangement, setArrangement] = useState([]);
  const [drill, setDrill] = useState(initialDrill);
  const [dragState, setDragState] = useState({
    progress: 0,
    stamina: 90,
    morale: 78,
    pace: 1,
    active: false,
    log: "Racks stacked. Crew waiting on the whistle."
  });
  const [stagePenalty, setStagePenalty] = useState({ crowd: 0, stamina: 0 });
  const [stageState, setStageState] = useState(() =>
    initialStageState(stagePenalty)
  );
  const { enabled: audioEnabled, toggleAudio, playTick } = useFestivalAudio();
  const performanceRef = useRef(null);
  const lastBeatRef = useRef(Date.now());
  const tapTimesRef = useRef([]);

  const modulesById = useMemo(
    () =>
      festivalModules.reduce((acc, module) => {
        acc[module.id] = module;
        return acc;
      }, {}),
    []
  );

  const arrangementModules = useMemo(
    () => arrangement.map((id) => modulesById[id]).filter(Boolean),
    [arrangement, modulesById]
  );

  const complexityTotal = useMemo(
    () => arrangementModules.reduce((sum, module) => sum + module.complexity, 0),
    [arrangementModules]
  );

  const complexityScore = useMemo(() => {
    if (!arrangementModules.length) return 0;
    return complexityTotal / arrangementModules.length;
  }, [arrangementModules, complexityTotal]);

  const drillTotal = useMemo(
    () => Object.values(drill).reduce((sum, value) => sum + value, 0),
    [drill]
  );

  const overbookPenalty = Math.max(0, drillTotal - 100);
  const drillModifier = overbookPenalty > 0 ? 1 - Math.min(0.3, overbookPenalty / 200) : 1;

  const readiness = useMemo(
    () =>
      festivalSections.reduce((acc, section) => {
        const base = drill[section.id] ?? 0;
        const effective = base * drillModifier;
        acc[section.id] = clamp((effective / 100) * section.baseSkill, 0, 1);
        return acc;
      }, {}),
    [drill, drillModifier]
  );

  const readinessScore = useMemo(() => {
    const avg = Object.values(readiness).reduce((sum, value) => sum + value, 0) /
      Object.keys(readiness).length;
    return avg * 100;
  }, [readiness]);

  const playability = clamp(
    readinessScore - complexityScore * 2 + 20 - overbookPenalty * 0.5
  );

  const clashRisk = clamp(complexityScore * 3 - readinessScore * 0.5 + overbookPenalty);

  const performanceFactors = useMemo(
    () => ({
      readiness,
      clashRisk: clashRisk / 100,
      complexityScore,
      playability
    }),
    [readiness, clashRisk, complexityScore, playability]
  );

  useEffect(() => {
    performanceRef.current = performanceFactors;
  }, [performanceFactors]);

  useEffect(() => {
    if (phase === "stage") {
      setStageState(initialStageState(stagePenalty));
      lastBeatRef.current = Date.now();
    } else {
      setStageState((prev) => ({ ...prev, isLive: false }));
    }
  }, [phase, stagePenalty]);

  useEffect(() => {
    if (!dragState.active) return;

    const interval = setInterval(() => {
      setDragState((prev) => {
        if (prev.progress >= 100) {
          return { ...prev, active: false, progress: 100 };
        }
        const fatigue = prev.stamina < 40 ? 0.6 : 1;
        const progressGain = prev.pace * 4 * fatigue;
        const staminaDrain = prev.pace * 3.2;
        const moraleDrop = prev.stamina < 35 ? 1.2 : 0.4;

        const nextProgress = clamp(prev.progress + progressGain, 0, 100);
        const nextStamina = clamp(prev.stamina - staminaDrain, 0, 100);
        const nextMorale = clamp(prev.morale - moraleDrop, 0, 100);

        return {
          ...prev,
          progress: nextProgress,
          stamina: nextStamina,
          morale: nextMorale,
          log: "Pushing racks across the Savannah..."
        };
      });
    }, 420);

    return () => clearInterval(interval);
  }, [dragState.active]);

  useEffect(() => {
    if (phase !== "stage" || !stageState.isLive) return;

    const interval = setInterval(() => {
      setStageState((prev) => {
        const factors = performanceRef.current;
        if (!factors) return prev;

        const engineDrill = factors.readiness.engine;
        const bassPower = factors.readiness.background;
        const frontline = factors.readiness.frontline;
        const midBlend = factors.readiness.mid;

        const stabilityBoost = prev.ironManActive ? 0.08 : 0;
        const followRate = 0.02 + engineDrill * 0.12 + stabilityBoost;
        const drift = (Math.random() - 0.5) * (1 - engineDrill) * 1.1;
        const engineTempo = prev.engineTempo + (prev.conductorTempo - prev.engineTempo) * followRate + drift;

        const diff = Math.abs(engineTempo - prev.conductorTempo);
        const sync = clamp(1 - diff / 18, 0, 1);
        const sweetness = clamp((frontline * 0.55 + midBlend * 0.3 + bassPower * 0.15) * sync, 0, 1);

        const dynamicsFactor = prev.dynamics;
        const ramajayGain = sync > 0.86 && bassPower > 0.65
          ? (sync * bassPower * 3.5 + dynamicsFactor * 1.2)
          : -2.2;

        let ramajay = prev.ramajay;
        let ramajayActive = prev.ramajayActive;
        let ramajayTime = prev.ramajayTime;

        if (!ramajayActive) {
          ramajay = clamp(ramajay + ramajayGain, 0, 100);
          if (ramajay >= 100) {
            ramajayActive = true;
            ramajayTime = 12;
            ramajay = 0;
          }
        } else {
          ramajayTime = Math.max(0, ramajayTime - 0.4);
          if (ramajayTime <= 0) {
            ramajayActive = false;
          }
        }

        const clashPenalty = factors.clashRisk * 14;
        const crowdLift =
          sync * 6 +
          sweetness * 4 +
          dynamicsFactor * 2 +
          (ramajayActive ? 6 : 0) -
          clashPenalty;
        const crowd = clamp(prev.crowd + crowdLift * 0.12, 0, 100);

        const staminaDrain = (0.25 + dynamicsFactor * 0.6 + (1 - engineDrill) * 0.4) * (ramajayActive ? 0.6 : 1);
        const stamina = clamp(prev.stamina - staminaDrain * 0.35, 0, 100);

        const scoreGain = (sync * 1.4 + sweetness * 1.1 + crowd / 100) * (ramajayActive ? 2.2 : 1.2);
        const score = prev.score + scoreGain;

        const ironManCooldown = prev.ironManCooldown > 0 ? Math.max(0, prev.ironManCooldown - 0.4) : 0;
        const ironManTime = prev.ironManActive ? Math.max(0, prev.ironManTime - 0.4) : prev.ironManTime;
        const ironManActive = prev.ironManActive ? ironManTime > 0 : false;

        return {
          ...prev,
          engineTempo,
          sync,
          sweetness,
          ramajay,
          ramajayActive,
          ramajayTime,
          crowd,
          stamina,
          score,
          ironManCooldown,
          ironManActive,
          ironManTime,
          time: prev.time + 0.4
        };
      });
    }, 400);

    return () => clearInterval(interval);
  }, [phase, stageState.isLive]);

  useEffect(() => {
    if (phase !== "stage" || !stageState.isLive || !audioEnabled) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const beatDuration = 60000 / stageState.conductorTempo;
      if (now - lastBeatRef.current >= beatDuration) {
        lastBeatRef.current = now;
        playTick(820, 0.035, 0.35);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [audioEnabled, phase, playTick, stageState.conductorTempo, stageState.isLive]);

  const addModule = (id) => {
    setArrangement((prev) => [...prev, id]);
  };

  const removeModule = (index) => {
    setArrangement((prev) => prev.filter((_, idx) => idx !== index));
  };

  const moveModule = (index, direction) => {
    setArrangement((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleDrillChange = (sectionId, value) => {
    setDrill((prev) => ({ ...prev, [sectionId]: Number(value) }));
  };

  const handleDragAction = (action) => {
    setDragState((prev) => {
      if (prev.progress >= 100) return prev;
      switch (action) {
        case "push":
          return {
            ...prev,
            progress: clamp(prev.progress + prev.pace * 6, 0, 100),
            stamina: clamp(prev.stamina - 6, 0, 100),
            morale: clamp(prev.morale - 2, 0, 100),
            log: "Heavy push through the tight turn."
          };
        case "rally":
          return {
            ...prev,
            morale: clamp(prev.morale + 8, 0, 100),
            stamina: clamp(prev.stamina - 3, 0, 100),
            log: "Captain rallies the crew. Vibes rise."
          };
        case "water":
          return {
            ...prev,
            stamina: clamp(prev.stamina + 10, 0, 100),
            morale: clamp(prev.morale - 2, 0, 100),
            log: "Quick water break. Grip returns."
          };
        default:
          return prev;
      }
    });
  };

  const finalizeDrag = () => {
    const crowdPenalty = Math.max(0, 60 - dragState.morale) * 0.35;
    const staminaPenalty = Math.max(0, 55 - dragState.stamina) * 0.4;
    setStagePenalty({ crowd: crowdPenalty, stamina: staminaPenalty });
    setPhase("stage");
  };

  const handleTempoTap = () => {
    const now = Date.now();
    tapTimesRef.current = [...tapTimesRef.current.slice(-5), now];
    const taps = tapTimesRef.current;
    if (taps.length < 2) return;
    const intervals = taps.slice(1).map((tap, index) => tap - taps[index]);
    const avg = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
    const bpm = clamp(60000 / avg, 80, 160);
    setStageState((prev) => ({ ...prev, conductorTempo: bpm }));
  };

  const triggerIronMan = () => {
    setStageState((prev) => {
      if (prev.ironManCooldown > 0 || prev.ironManActive) return prev;
      return { ...prev, ironManActive: true, ironManTime: 6, ironManCooldown: 18 };
    });
  };

  const stopPerformance = () => {
    setStageState((prev) => ({ ...prev, isLive: false }));
  };

  const startPerformance = () => {
    setStageState((prev) => ({ ...prev, isLive: true }));
  };

  const performanceStatus = (() => {
    const diff = stageState.engineTempo - stageState.conductorTempo;
    if (Math.abs(diff) < 2.5) return "Locked";
    return diff < 0 ? "Dragging" : "Rushing";
  })();

  return (
    <section className="festival-view">
      <header className="festival-header">
        <div>
          <span className="eyebrow">Festival of Pan</span>
          <h2>Master Arranger Prototype</h2>
          <p className="lede">
            Command a 120-piece steel orchestra from the Panyard to Panorama with
            arrangement strategy, logistics grit, and conductor precision.
          </p>
          <div className="festival-phase">
            {[
              { id: "panyard", label: "Panyard" },
              { id: "drag", label: "The Drag" },
              { id: "stage", label: "Big Stage" }
            ].map((step) => (
              <button
                key={step.id}
                type="button"
                className={`phase-pill${phase === step.id ? " phase-pill--active" : ""}`}
                onClick={() => setPhase(step.id)}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>
        <div className="festival-header__actions">
          <button className="btn btn--ghost" type="button" onClick={onBack}>
            Back to map
          </button>
          {phase === "stage" ? (
            <button
              className="btn btn--primary"
              type="button"
              onClick={stageState.isLive ? stopPerformance : startPerformance}
            >
              {stageState.isLive ? "Pause performance" : "Start performance"}
            </button>
          ) : null}
        </div>
      </header>

      {phase === "panyard" ? (
        <div className="festival-grid">
          <div className="festival-card">
            <div className="festival-card__head">
              <h3>Arrangement board</h3>
              <div className="festival-card__meta">
                <span>Complexity {Math.round(complexityTotal)}</span>
                <span>Playability {Math.round(playability)}</span>
                <span>Clash risk {Math.round(clashRisk)}%</span>
              </div>
            </div>
            <div className="arrangement-board">
              <div className="arrangement-modules">
                {festivalModules.map((module) => (
                  <div className="module-card" key={module.id}>
                    <div>
                      <h4>{module.name}</h4>
                      <p>{module.description}</p>
                      <div className="module-card__meta">
                        <span>{module.type}</span>
                        <span>Complexity {module.complexity}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => addModule(module.id)}
                    >
                      Add module
                    </button>
                  </div>
                ))}
              </div>
              <div className="arrangement-timeline">
                <h4>Current arrangement</h4>
                {arrangementModules.length ? (
                  <ul>
                    {arrangementModules.map((module, index) => (
                      <li key={`${module.id}-${index}`}>
                        <div>
                          <strong>{module.name}</strong>
                          <span>{module.type}</span>
                        </div>
                        <div className="timeline-actions">
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => moveModule(index, -1)}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => moveModule(index, 1)}
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => removeModule(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">Add modules to build your Panorama chart.</p>
                )}
              </div>
            </div>
            <div className="festival-card__footer">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setPhase("drag")}
              >
                Send crew to The Drag
              </button>
            </div>
          </div>

          <aside className="festival-card festival-card--side">
            <h3>Section drilling</h3>
            <p className="muted">
              Allocate rehearsal hours. Overbooking reduces drill efficiency.
            </p>
            <div className="drill-meters">
              {festivalSections.map((section) => (
                <div className="drill-row" key={section.id}>
                  <div>
                    <strong>{section.name}</strong>
                    <span>{section.detail}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={drill[section.id]}
                    onChange={(event) =>
                      handleDrillChange(section.id, event.target.value)
                    }
                  />
                  <span>{Math.round(drill[section.id])} hrs</span>
                </div>
              ))}
            </div>
            <div className="drill-summary">
              <div>
                <span>Total hours</span>
                <strong>{Math.round(drillTotal)} / 100</strong>
              </div>
              <div>
                <span>Readiness</span>
                <strong>{Math.round(readinessScore)}%</strong>
              </div>
            </div>
            {overbookPenalty > 0 ? (
              <div className="callout">
                Overbooked by {Math.round(overbookPenalty)} hrs. Efficiency down
                {Math.round((1 - drillModifier) * 100)}%.
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}

      {phase === "drag" ? (
        <div className="festival-grid">
          <div className="festival-card">
            <div className="festival-card__head">
              <h3>The Drag</h3>
              <p className="muted">
                Move the racks, manage stamina and morale, and set the opening vibe.
              </p>
            </div>
            <div className="drag-track">
              <div className="drag-track__bar">
                <span style={{ width: `${dragState.progress}%` }} />
              </div>
              <div className="drag-track__meta">
                <span>Progress {Math.round(dragState.progress)}%</span>
                <span>Pace {dragState.pace.toFixed(1)}x</span>
              </div>
            </div>
            <div className="drag-actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setDragState((prev) => ({ ...prev, active: !prev.active }))}
              >
                {dragState.active ? "Pause drag" : "Start drag"}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => handleDragAction("push")}>
                Push hard
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => handleDragAction("rally")}>
                Rally crew
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => handleDragAction("water")}>
                Water break
              </button>
            </div>
            <div className="drag-pace">
              <span>Set pace</span>
              <input
                type="range"
                min="0.6"
                max="1.6"
                step="0.1"
                value={dragState.pace}
                onChange={(event) =>
                  setDragState((prev) => ({
                    ...prev,
                    pace: Number(event.target.value)
                  }))
                }
              />
            </div>
            <p className="drag-log">{dragState.log}</p>
            <div className="festival-card__footer">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setPhase("panyard")}
              >
                Back to Panyard
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={finalizeDrag}
                disabled={dragState.progress < 100}
              >
                Roll onto Big Stage
              </button>
            </div>
          </div>

          <aside className="festival-card festival-card--side">
            <h3>Vibes check</h3>
            <div className="stat-block">
              <span>Stamina</span>
              <strong>{Math.round(dragState.stamina)}%</strong>
              <div className="meter">
                <span style={{ width: `${dragState.stamina}%` }} />
              </div>
            </div>
            <div className="stat-block">
              <span>Morale</span>
              <strong>{Math.round(dragState.morale)}%</strong>
              <div className="meter">
                <span style={{ width: `${dragState.morale}%` }} />
              </div>
            </div>
            <div className="callout">
              Low morale on arrival means an opening penalty in crowd energy.
            </div>
          </aside>
        </div>
      ) : null}

      {phase === "stage" ? (
        <div className="festival-grid">
          <div className="festival-card">
            <div className="festival-card__head">
              <h3>Big Stage performance</h3>
              <p className="muted">
                Left hand controls dynamics, right hand taps tempo. Keep the Engine Room locked.
              </p>
            </div>
            <div className="stage-controls">
              <div className="control-card">
                <h4>Conductor</h4>
                <div className="control-row">
                  <span>Dynamics</span>
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={stageState.dynamics}
                    onChange={(event) =>
                      setStageState((prev) => ({
                        ...prev,
                        dynamics: Number(event.target.value)
                      }))
                    }
                  />
                  <strong>{formatPercent(stageState.dynamics * 100)}</strong>
                </div>
                <div className="control-row">
                  <span>Tempo</span>
                  <input
                    type="range"
                    min="80"
                    max="160"
                    step="1"
                    value={stageState.conductorTempo}
                    onChange={(event) =>
                      setStageState((prev) => ({
                        ...prev,
                        conductorTempo: Number(event.target.value)
                      }))
                    }
                  />
                  <strong>{formatTempo(stageState.conductorTempo)}</strong>
                </div>
                <div className="control-actions">
                  <button type="button" className="btn btn--ghost" onClick={handleTempoTap}>
                    Tap tempo
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={toggleAudio}>
                    {audioEnabled ? "Mute click" : "Audio click"}
                  </button>
                </div>
              </div>

              <div className="control-card">
                <h4>Engine Room</h4>
                <div className="engine-readout">
                  <div>
                    <span>Status</span>
                    <strong>{performanceStatus}</strong>
                  </div>
                  <div>
                    <span>Engine tempo</span>
                    <strong>{formatTempo(stageState.engineTempo)}</strong>
                  </div>
                  <div>
                    <span>Sync</span>
                    <strong>{formatPercent(stageState.sync * 100)}</strong>
                  </div>
                </div>
                <div className="control-actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={triggerIronMan}
                    disabled={stageState.ironManCooldown > 0 || stageState.ironManActive}
                  >
                    {stageState.ironManActive ? "Iron Man locked" : "Call Iron Man"}
                  </button>
                  <span className="muted">
                    {stageState.ironManActive
                      ? `Active ${stageState.ironManTime.toFixed(1)}s`
                      : stageState.ironManCooldown > 0
                        ? `Cooldown ${stageState.ironManCooldown.toFixed(1)}s`
                        : "Stability boost ready"}
                  </span>
                </div>
              </div>
            </div>

            <div className="stage-footer">
              <div className="stat-block">
                <span>Ramajay</span>
                <strong>
                  {stageState.ramajayActive
                    ? `LIVE ${stageState.ramajayTime.toFixed(1)}s`
                    : `${Math.round(stageState.ramajay)}%`}
                </strong>
                <div className="meter">
                  <span
                    style={{
                      width: `${stageState.ramajayActive ? 100 : stageState.ramajay}%`
                    }}
                  />
                </div>
              </div>
              <div className="stat-block">
                <span>Sweetness</span>
                <strong>{formatPercent(stageState.sweetness * 100)}</strong>
                <div className="meter">
                  <span style={{ width: `${stageState.sweetness * 100}%` }} />
                </div>
              </div>
              <div className="stat-block">
                <span>Score</span>
                <strong>{Math.round(stageState.score)}</strong>
              </div>
            </div>
          </div>

          <aside className="festival-card festival-card--side">
            <h3>Stage meters</h3>
            <div className="stat-block">
              <span>Crowd</span>
              <strong>{Math.round(stageState.crowd)}%</strong>
              <div className="meter">
                <span style={{ width: `${stageState.crowd}%` }} />
              </div>
            </div>
            <div className="stat-block">
              <span>Stamina</span>
              <strong>{Math.round(stageState.stamina)}%</strong>
              <div className="meter">
                <span style={{ width: `${stageState.stamina}%` }} />
              </div>
            </div>
            <div className="stat-block">
              <span>Arrangement</span>
              <strong>{Math.round(playability)}% playability</strong>
              <div className="meter">
                <span style={{ width: `${playability}%` }} />
              </div>
            </div>
            <div className="section-readiness">
              {festivalSections.map((section) => (
                <div key={section.id}>
                  <span>{section.name}</span>
                  <strong>{formatPercent(readiness[section.id] * 100)}</strong>
                </div>
              ))}
            </div>
            <div className="festival-card__footer">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setPhase("drag")}
              >
                Back to The Drag
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setStageState(initialStageState(stagePenalty))}
              >
                Reset performance
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
};
