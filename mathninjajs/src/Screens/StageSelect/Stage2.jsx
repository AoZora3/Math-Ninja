import { useContext } from "react";
import { GameContext } from "../../Context/GameContext.jsx";
import { getTrigonometricEquation } from "../../Game/Equations/EquationText.js";
import { BUILD_CHALLENGE_BY_STAGE } from "../../Game/Equations/BuildChallengeData.js";
import "../../Assets/Styles/Stages.css";

export default function Stage2({ setScreen, onEditPreset, onAddEquation, onContinue, onBuildChallenge }) {
  const { presets, setActivePreset, formulaUnlocks = {} } = useContext(GameContext);

  const getPresetSummary = (preset) => {
    const coefficients = preset.coefficients || { a: 1, b: 0, c: 0, d: 0 };
    const a = Number(coefficients.a ?? 1);
    const b = Number(coefficients.b ?? 1);
    if (preset.type === "trigonometric") {
      return {
        equation: getTrigonometricEquation(preset),
        title: preset.title || "TRIG FORMULA",
        description: preset.description || "A smooth repeating curve."
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

  const stageSteps = BUILD_CHALLENGE_BY_STAGE[2] || [];
  const visiblePresets = presets.filter((preset) =>
    formulaUnlocks[preset.id] || !stageSteps.some((step) => step.unlockedPresetId === preset.id)
  );
  const allStageFormulasUnlocked = stageSteps.every((step) => formulaUnlocks[step.unlockedPresetId]);
  const nextBuildStep = stageSteps.find((step) => !formulaUnlocks[step.unlockedPresetId]);

  const openPreset = (preset) => {
    if (!formulaUnlocks[preset.id]) {
      onBuildChallenge?.("stage2", preset.id);
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

        <h2>STAGE 2</h2>

        <div className="header-spacer"></div>
      </header>

      <main className="preset-container">
        <div className="stage-heading">
          <span>STAGE 2</span>
          <h1>TRIGONOMETRIC WAVES</h1>
          <p>Choose a trigonometric preset equation to study its graph.</p>
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
            <button type="button" className="continue-btn" onClick={() => onBuildChallenge?.("stage2", nextBuildStep.unlockedPresetId)}>
              Build Formula
            </button>
          )}
          <button type="button" className="continue-btn" onClick={onContinue}>
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}
