import { useContext } from "react";
import { GameContext } from "../../Context/GameContext.jsx";
import { getStage3Equation } from "../../Game/Equations/Stage3Equation.js";

export default function Stage3({ setScreen, onEditPreset, onAddEquation, onContinue }) {
  const { presets, setActivePreset } = useContext(GameContext);

  const getPresetSummary = (preset) => {
    return {
      equation: getStage3Equation(preset),
      inverseEquation: getStage3Equation(preset, true),
      title: preset.title,
      description: preset.description
    };
  };

  return (
    <div className="screen">
      <header className="header">
        <button className="back-button" onClick={() => setScreen("stageSelect")}>
          ←
        </button>

        <h2>STAGE 3</h2>

        <div className="header-spacer"></div>
      </header>

      <main className="preset-container">
        <div className="stage-heading">
          <span>STAGE 3</span>
          <h1>EXPONENTIALS + INVERSE LOGS</h1>
          <p>Compare each exponential curve with its inverse logarithm.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button
            type="button"
            onClick={onAddEquation}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#f59e0b",
              color: "#111827",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Add Equation
          </button>
        </div>

        <div className="preset-grid">
          {presets.map((preset, index) => {
            const summary = getPresetSummary(preset);

            return (
              <div className="preset-card" key={preset.id || index}>
                <div className="preset-content">
                  <span className="preset-number">PRESET {index + 1}</span>
                  <h2>{summary.equation}</h2>
                  <p><strong>Inverse:</strong> {summary.inverseEquation}</p>
                  <h3>{summary.title}</h3>
                  <p>{summary.description}</p>

                  <button
                    type="button"
                    className="select-button"
                    onClick={() => {
                      setActivePreset(preset);
                      onEditPreset(preset);
                    }}
                  >
                    Edit Preset
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 24 }}>
          <button
            type="button"
            onClick={onContinue}
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              border: "none",
              background: "#22c55e",
              color: "#052e16",
              fontWeight: 700,
              cursor: "pointer",
              minWidth: 180,
              position: "fixed",
              bottom: "20px",       /* Distance from the bottom of the screen */
              right: "auto",       /* Distance from the right of the screen */
              zIndex: 1000,         /* Ensures it stays on top of other content */
            }}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}
