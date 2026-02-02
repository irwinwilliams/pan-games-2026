import { useMemo, useState } from "react";
import { bands } from "./data/bands.js";
import { MapView } from "./components/MapView.jsx";
import { TuningView } from "./components/TuningView.jsx";

function App() {
  const [activeBandId, setActiveBandId] = useState(bands[0]?.id ?? null);
  const [view, setView] = useState("map");

  const activeBand = useMemo(
    () => bands.find((band) => band.id === activeBandId) || bands[0],
    [activeBandId]
  );

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <span className="eyebrow">Panorama of Games</span>
          <h1>Pan Man Chronicles: Tuner Triumphs</h1>
          <p className="lede">
            A Trini-flavored, fact-grounded tuning adventure for tenor pan. Jump
            from band to band, press a note zone, and pick the right tuning step
            to bring the harmonics into line.
          </p>
          <div className="chip-row">
            <span className="chip">3D tenor pan</span>
            <span className="chip chip--ghost">Harmonic analysis</span>
            <span className="chip chip--ghost">10 band encounters</span>
          </div>
        </div>
        <div className="topbar__card">
          <h4>Travel log</h4>
          <p>
            "Don&apos;t panic," says the guide. "Just trust the partials and bring
            snacks."
          </p>
          <div className="topbar__meta">
            <span>Active stop</span>
            <strong>{activeBand.location}</strong>
          </div>
        </div>
      </header>

      {view === "map" ? (
        <MapView
          activeBandId={activeBandId}
          onSelectBand={setActiveBandId}
          onTravel={() => setView("tuning")}
        />
      ) : (
        <TuningView band={activeBand} onBack={() => setView("map")} />
      )}
    </div>
  );
}

export default App;
