import { useContext } from "react";
import { GameContext } from "../../Context/GameContext.jsx";
import { BUILD_CHALLENGE_BY_STAGE } from "../../Game/Equations/BuildChallengeData.js";
import "../../Assets/Styles/Stages.css";

export default function Stage1({ setScreen, onEditPreset, onAddEquation, onContinue, onBuildChallenge }) {
  const { presets, setActivePreset, formulaUnlocks = {} } = useContext(GameContext);

  const getPresetSummary = (preset) => {
    const coefficients = preset.coefficients || { a: 1, b: 0 };
    const a = Number(coefficients.a ?? 1);
    const b = Number(coefficients.b ?? 0);

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

  const stageSteps = BUILD_CHALLENGE_BY_STAGE[1] || [];
  const visiblePresets = presets.filter((preset) =>
    formulaUnlocks[preset.id] || !stageSteps.some((step) => step.unlockedPresetId === preset.id)
  );
  const allStageFormulasUnlocked = stageSteps.every((step) => formulaUnlocks[step.unlockedPresetId]);
  const nextBuildStep = stageSteps.find((step) => !formulaUnlocks[step.unlockedPresetId]);
  const hasFourFormulaPresets = visiblePresets.length >= 4;

  const openPreset = (preset) => {
    if (!formulaUnlocks[preset.id]) {
      onBuildChallenge?.("stage1", preset.id);
      return;
    }

    setActivePreset(preset);
    onEditPreset?.(preset);
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
          <p className="formula-progress">
            Formula presets: {visiblePresets.length}/4
            {!hasFourFormulaPresets && " — unlock four formulas to continue."}
          </p>
        </div>

        <div className="preset-grid">
          {visiblePresets.map((preset, index) => {
            const summary = getPresetSummary(preset);

            return (
              <div className="preset-card" key={preset.id || index}>

                <div className="preset-content">
                  <span className="preset-number">PRESET {index + 1}</span>
                  <h2>{summary.equation}</h2>
                  <h3>{summary.title}</h3>
                  <p>{summary.description}</p>

                  <button type="button" className="select-button" onClick={() => openPreset(preset)}>
                    Edit Preset
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="stage-actions">
          {allStageFormulasUnlocked && (
            <button type="button" className="add-equation-btn" onClick={onAddEquation}>
              + Add Equation
            </button>
          )}
          {nextBuildStep && (
            <button type="button" className="continue-btn" onClick={() => onBuildChallenge?.("stage1", nextBuildStep.unlockedPresetId)}>
              Build Formula
            </button>
          )}
          <button type="button" className="continue-btn" onClick={() => onContinue()} disabled={!hasFourFormulaPresets}>
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}