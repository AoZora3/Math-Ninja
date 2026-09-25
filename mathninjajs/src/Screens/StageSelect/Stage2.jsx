import { useContext } from "react";
import { GameContext } from "../../Context/GameContext.jsx";

export default function Stage2({ setScreen, onEditPreset, onAddEquation, onContinue }) {
  const { presets, setActivePreset } = useContext(GameContext);

  const getPresetSummary = (preset) => {
    const coefficients = preset.coefficients || { a: 1, b: 0, c: 0, d: 0 };
    const a = Number(coefficients.a ?? 1);
    const b = Number(coefficients.b ?? 1);
    const c = Number(coefficients.c ?? 0);
    const d = Number(coefficients.d ?? 0);

    if (preset.type === "trigonometric") {
      if (preset.waveType === "classic") {
        return {
          equation: `y = ${a}sin(${b}x)`,
          title: "CLASSIC WAVE",
          description: "Smooth repeating motion with a fixed ceiling and floor."
        };
      }

      if (preset.waveType === "multi") {
        return {
          equation: `y = ${a}sin(${b}x) + ${c}sin(${d}x)`,
          title: "MULTI-FREQUENCY",
          description: "A larger wave with smaller ripples mixed together."
        };
      }

      if (preset.waveType === "damped") {
        return {
          equation: `y = ${a}sin(${b}x) * exp(-${c}x)`,
          title: "DAMPED WAVE",
          description: "A wave that fades back to rest after intense motion."
        };
      }

      return {
        equation: `y = ${a}tan(${b}x)`,
        title: "TELEPORTING RAMP",
        description: "A sharp climbing curve with instant discontinuities."
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

        <h2>STAGE 2</h2>

        <div className="header-spacer"></div>
      </header>

      <main className="preset-container">
        <div className="stage-heading">
          <span>STAGE 2</span>
          <h1>TRIG WAVES</h1>
          <p>Choose a trig preset equation to study its graph.</p>
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
