import { useContext } from "react";
import { GameContext } from "../../Context/GameContext.jsx";

export default function Stage3({ setScreen, onEditPreset, onAddEquation, onContinue }) {
  const { presets, setActivePreset } = useContext(GameContext);

  const getPresetSummary = (preset) => {
    const coefficients = preset.coefficients || { a: 1, b: 1, c: 0 };
    const a = Number(coefficients.a ?? 1);
    const b = Number(coefficients.b ?? 1);
    const c = Number(coefficients.c ?? 0);

    if (preset.type === "logarithmic") {
      if (preset.formulaKind === "inverted") {
        return {
          equation: `y = ${c} - ${a}ln(x)`,
          title: "INVERTED LOG",
          description: "A sharp drop that flattens out into a horizontal tail."
        };
      }

      return {
        equation: `y = ${a}ln(x - ${b}) + ${c}`,
        title: "LOGARITHMIC CURVE",
        description: "A steep bend that quickly settles and flattens out."
      };
    }

    if (preset.type === "exponential") {
      if (preset.formulaKind === "logistic") {
        return {
          equation: `y = ${a} / (1 + e^(-${b}(x - ${c})))`,
          title: "LANE SWITCHER",
          description: "A smooth step between two lanes of motion."
        };
      }

      if (preset.formulaKind === "arch") {
        return {
          equation: `y = ${a}(e^(${b}(x - ${c})) + e^(-${b}(x - ${c}))) + ${Number(coefficients.k ?? 0)}`,
          title: "DEEP DIVE",
          description: "A U-shaped valley that dives and returns sharply."
        };
      }

      return {
        equation: `y = ${a}e^(-${b}(x - ${Number(coefficients.h ?? 0)})) + ${Number(coefficients.k ?? 0)}`,
        title: "HOOK SHOT",
        description: "A fast hook with a dramatic snap into a flat glide."
      };
    }

    return {
      equation: `y = ${a}sin(${b}x) + ${c}`,
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

        <h2>STAGE 3</h2>

        <div className="header-spacer"></div>
      </header>

      <main className="preset-container">
        <div className="stage-heading">
          <span>STAGE 3</span>
          <h1>LOGARITHMIC FUNCTIONS</h1>
          <p>Choose a logarithmic preset equation to study its graph.</p>
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
