import { bands } from "../data/bands.js";

const MapMarker = ({ band, isActive, onSelect }) => (
  <button
    className={`map-marker${isActive ? " map-marker--active" : ""}`}
    style={{ "--x": `${band.map.x}%`, "--y": `${band.map.y}%` }}
    type="button"
    onClick={() => onSelect(band.id)}
    aria-pressed={isActive}
  >
    <span className="map-marker__dot" />
    <span className="map-marker__label">{band.location}</span>
  </button>
);

export const MapView = ({ activeBandId, onSelectBand, onTravel }) => {
  const activeBand = bands.find((band) => band.id === activeBandId) || bands[0];

  return (
    <section className="map-view">
      <div className="map-card">
        <div className="map-card__header">
          <h2>Panorama Map</h2>
          <p>Pick a band on the islands to start a tuning encounter.</p>
        </div>
        <div className="map" aria-label="Trinidad and Tobago map">
          <svg viewBox="0 0 640 420" aria-hidden="true">
            <path
              d="M118 90 C 78 120 60 190 88 255 C 120 340 240 360 330 338 C 430 312 520 245 540 175 C 555 120 505 70 420 58 C 325 44 205 55 118 90 Z"
              className="map__island"
            />
            <path
              d="M520 70 C 545 55 580 68 592 94 C 604 120 585 148 556 156 C 528 164 504 140 500 114 C 496 93 505 80 520 70 Z"
              className="map__island"
            />
          </svg>
          {bands.map((band) => (
            <MapMarker
              key={band.id}
              band={band}
              isActive={band.id === activeBandId}
              onSelect={onSelectBand}
            />
          ))}
        </div>
        <div className="map-card__footer">
          <span className="chip">10 bands</span>
          <span className="chip chip--ghost">Tenor journey</span>
        </div>
      </div>

      <aside className="band-panel">
        <div className="band-panel__head">
          <span className="chip chip--bright">Selected stop</span>
          <h3>{activeBand.name}</h3>
          <p className="band-panel__meta">
            {activeBand.location} · {activeBand.region}
          </p>
        </div>
        <div className="band-panel__story">
          <p>{activeBand.hook}</p>
          <p className="band-panel__challenge">{activeBand.challenge}</p>
        </div>
        <div className="band-panel__focus">
          <span>Focus</span>
          <strong>{activeBand.focus}</strong>
        </div>
        <button className="btn btn--primary" type="button" onClick={onTravel}>
          Travel to {activeBand.location}
        </button>
        <div className="band-panel__list">
          <p>Other stops</p>
          <div className="band-panel__tags">
            {bands
              .filter((band) => band.id !== activeBand.id)
              .map((band) => (
                <button
                  className="tag"
                  type="button"
                  key={band.id}
                  onClick={() => onSelectBand(band.id)}
                >
                  {band.location}
                </button>
              ))}
          </div>
        </div>
      </aside>
    </section>
  );
};
