import { useContext } from "react";
import { GameContext } from "../../Context/GameContext.jsx";
import { getStage3Equation } from "../../Game/Equations/Stage3Equation.js";
import { BUILD_CHALLENGE_BY_STAGE } from "../../Game/Equations/BuildChallengeData.js";
import "../../Assets/Styles/Stages.css";

export default function Stage3({ setScreen, onEditPreset, onAddEquation, onContinue, onBuildChallenge }) {
  const { presets, setActivePreset, formulaUnlocks = {} } = useContext(GameContext);

  const getPresetSummary = (preset) => {
    return {
      equation: getStage3Equation(preset),
      inverseEquation: getStage3Equation(preset, true),
      title: preset.title,
      description: preset.description
    };
  };

  const stageSteps = BUILD_CHALLENGE_BY_STAGE[3] || [];
  const visiblePresets = presets.filter((preset) =>
    formulaUnlocks[preset.id] || !stageSteps.some((step) => step.unlockedPresetId === preset.id)
  );
  const allStageFormulasUnlocked = stageSteps.every((step) => formulaUnlocks[step.unlockedPresetId]);
  const nextBuildStep = stageSteps.find((step) => !formulaUnlocks[step.unlockedPresetId]);

  const openPreset = (preset) => {
    if (!formulaUnlocks[preset.id]) {
      onBuildChallenge?.("stage3", preset.id);
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

        <h2>STAGE 3</h2>

        <div className="header-spacer"></div>
      </header>

      <main className="preset-container">
        <div className="stage-heading">
          <span>STAGE 3</span>
          <h1>EXPONENTIALS + INVERSE LOGS</h1>
          <p>Compare each exponential curve with its inverse logarithm.</p>
        </div>

        <div className="preset-grid">
          {visiblePresets.map((preset, index) => {
            const summary = getPresetSummary(preset);

            return (
              <div className="preset-card" key={preset.id || index}>
                <div className="preset-content">
                  <span className="preset-number">PRESET {index + 1}</span>
                  <h2>{summary.equation}</h2>
                  <p><strong>Inverse:</strong> {summary.inverseEquation}</p>
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
            <button type="button" className="continue-btn" onClick={() => onBuildChallenge?.("stage3", nextBuildStep.unlockedPresetId)}>
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
