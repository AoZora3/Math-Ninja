import { useContext } from "react";
import { GameContext } from "../../Context/GameContext.jsx";
import "../../Assets/Styles/Stages.css";

export default function Stage1({ setScreen, onEditPreset, onAddEquation, onContinue }) {
  const { presets, setActivePreset } = useContext(GameContext);

  const getPresetSummary = (preset) => {
    const coefficients = preset.coefficients || { a: 1, b: 0 };
    const a = Number(coefficients.a ?? 1);
    const b = Number(coefficients.b ?? 0);

    // Stage 1 includes a cubic preset in addition to line and parabola presets.
    if (preset.type === "cubic") {
      return {
        equation: `y = ${a}x³ ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`,
        title: "CUBIC EQUATION",
        description: "An S-shaped graph with adjustable stretch and vertical shift."
      };
    }

    if (preset.type === "quadratic") {
      return {
        equation: `y = ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`,
        title: "QUADRATIC EQUATION",
        description: "A curved graph with a vertical stretch and shift."
      };
    }

    return {
      equation: `y = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`,
      title: "LINEAR EQUATION",
      description: "A straight-line graph with adjustable slope and intercept."
    };
  };

  return (
    <div className="screen">
      <header className="header">
        <button className="back-button" onClick={() => setScreen("stageSelect")}>
          ←
        </button>

        <h2>STAGE 1</h2>

        <div className="header-spacer"></div>
      </header>

      <main className="preset-container">
        <div className="stage-heading">
          <span>STAGE 1</span>
          <h1>GRAPH BASICS</h1>
          <p>Choose a preset equation to study its graph.</p>
        </div>

        <div className="preset-grid">
          {presets.map((preset, index) => {
            const summary = getPresetSummary(preset);

            return (
              <div className="preset-card" key={preset.id || index}>

                <div className="preset-content">
                  <span className="preset-number">PRESET {index + 1}</span>
                  <h2>{summary.equation}</h2>
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

        <div className="stage-actions">
          <button type="button" className="add-equation-btn" onClick={onAddEquation}>
            + Add Equation
          </button>
          <button type="button" className="continue-btn" onClick={onContinue}>
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}