export default function Stage1({ presets, setScreen, onSelectPreset }) {
    return (
              <div className="screen">

        <header className="header">

          <button
            className="back-button"
            onClick={() => setScreen("stageSelect")}
          >
            ←
          </button>

          <h2>STAGE 1</h2>

          <div className="header-spacer"></div>

        </header>

        <main className="preset-container">

          <div className="stage-heading">

            <span>
              STAGE 1
            </span>

            <h1>
              GRAPH BASICS
            </h1>

            <p>
              Choose a preset equation to study its graph.
            </p>

          </div>

          <div className="preset-grid">

            {presets.map((preset, index) => (

              <div
                className="preset-card"
                key={index}
              >

                <div className="preset-graph">

                  <div className="graph-axis-x"></div>
                  <div className="graph-axis-y"></div>

                  <div
                    className={`preset-line line-${index}`}
                  ></div>

                </div>

                <div className="preset-content">

                  <span className="preset-number">
                    PRESET {index + 1}
                  </span>

                  <h2>
                    {preset.equation}
                  </h2>

                  <h3>
                    {preset.title}
                  </h3>

                  <p>
                    {preset.description}
                  </p>

                  <button
                    className="select-button"
                    onClick={() => {
                      onSelectPreset(preset.equation);
                      setScreen("gameplay");
                    }}
                  >
                    PLAY PRESET
                  </button>

                </div>

              </div>

            ))}

          </div>

        </main>

      </div>
    );
}