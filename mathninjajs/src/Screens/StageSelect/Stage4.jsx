import { useContext } from "react";
import { GameContext } from "../../Context/GameContext.jsx";

export default function Stage4({ setScreen, onEditPreset, onAddEquation, onContinue }) {
  const { presets, setActivePreset } = useContext(GameContext);

  const getPresetSummary = (preset) => {
    const coefficients = preset.coefficients || { a: 1, b: 1, h: 0, k: 0, l: 1 };
    const a = Number(coefficients.a ?? 1);
    const b = Number(coefficients.b ?? 1);
    const h = Number(coefficients.h ?? 0);
    const k = Number(coefficients.k ?? 0);
    const l = Number(coefficients.l ?? 1);

    if (preset.type === "exponential") {
      if (preset.formulaKind === "logistic") {
        return {
          equation: `y = ${l} / (1 + e^(-${b}(x - ${h})))`,
          title: "LANE SWITCHER",
          description: "A step curve that flips between two lanes."
        };
      }

      if (preset.formulaKind === "arch") {
        return {
          equation: `y = ${a}(e^(${b}(x - ${h})) + e^(-${b}(x - ${h}))) + ${k}`,
          title: "DEEP DIVE",
          description: "A U-shaped valley that dives and rebounds."
        };
      }

      return {
        equation: `y = ${a}e^(-${b}(x - ${h})) + ${k}`,
        title: "HOOK SHOT",
        description: "A steep hook that flattens into a flat glide."
      };
    }

    if (preset.type === "logarithmic") {
      return {
        equation: `y = ${a}ln(x - ${b}) + ${k}`,
        title: "LOGARITHMIC CURVE",
        description: "A sharp logarithmic bend that settles into place."
      };
    }

    return {
      equation: `y = ${a}sin(${b}x) + ${k}`,
      title: "TRIG EQUATION",
      description: "Wave patterns that rise and fall in cycles."
    };
  };

  return (
    <div className="screen">
      <header className="header">
        <button className="back-button" onClick={() => setScreen("stageSelect")}>
          ←
        </button>

        <h2>STAGE 4</h2>

        <div className="header-spacer"></div>
      </header>

      <main className="preset-container">
        <div className="stage-heading">
          <span>STAGE 4</span>
          <h1>EXPONENTIAL FUNCTIONS</h1>
          <p>Choose an exponential preset equation to study its graph.</p>
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
                <div className="preset-graph">
                  <div className="graph-axis-x"></div>
                  <div className="graph-axis-y"></div>
                  <div className={`preset-line line-${index}`}></div>
                </div>

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
              minWidth: 180
            }}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}
