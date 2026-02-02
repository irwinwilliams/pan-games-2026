import { gameMix } from "../data/gameMix.js";

export const GameMix = ({ onLaunchFestival, onLaunchPanMan }) => (
  <section className="game-mix">
    <div className="game-mix__header">
      <span className="eyebrow">Game mix</span>
      <h2>New blends in the Panorama pipeline</h2>
      <p>
        Two steelpan-centered ideas live side by side: one playable tuning journey
        and one ambitious orchestral strategy epic.
      </p>
    </div>

    <div className="game-mix__grid">
      {gameMix.map((game) => (
        <article
          key={game.id}
          className={`game-card${game.featured ? " game-card--featured" : ""}`}
        >
          <div className="game-card__header">
            <div>
              <span className="game-card__eyebrow">{game.status}</span>
              <h3>{game.title}</h3>
              <p className="game-card__tagline">"{game.tagline}"</p>
            </div>
            <div className="game-card__roles">
              {game.roles?.map((role) => (
                <span className="chip chip--bright" key={`${game.id}-${role}`}>
                  {role}
                </span>
              ))}
            </div>
          </div>

          <p className="game-card__summary">{game.summary}</p>

          {game.goal ? (
            <div className="game-card__goal">
              <span>Goal</span>
              <p>{game.goal}</p>
            </div>
          ) : null}

          {game.pillars ? (
            <ul className="game-card__list">
              {game.pillars.map((item, index) => (
                <li key={`${game.id}-pillar-${index}`}>{item}</li>
              ))}
            </ul>
          ) : null}

          {game.sections ? (
            <div className="game-card__sections">
              {game.sections.map((section) => (
                <div className="game-card__section" key={section.id}>
                  <div className="game-card__section-head">
                    <h4>{section.title}</h4>
                    {section.description ? <p>{section.description}</p> : null}
                  </div>
                  {section.blocks ? (
                    <div className="game-card__subgrid">
                      {section.blocks.map((block) => (
                        <div className="game-card__subcard" key={block.id}>
                          <h5>{block.title}</h5>
                          <ul>
                            {block.items.map((item, index) => (
                              <li key={`${block.id}-${index}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {section.bullets ? (
                    <ul className="game-card__list">
                      {section.bullets.map((item, index) => (
                        <li key={`${section.id}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="game-card__footer">
            {game.tags?.map((tag) => (
              <span className="chip chip--ghost" key={`${game.id}-${tag}`}>
                {tag}
              </span>
            ))}
          </div>
          <div className="game-card__actions">
            {game.id === "festival-of-pan" && onLaunchFestival ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={onLaunchFestival}
              >
                Enter Festival prototype
              </button>
            ) : null}
            {game.id === "pan-man" && onLaunchPanMan ? (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={onLaunchPanMan}
              >
                Open tuning journey
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  </section>
);
