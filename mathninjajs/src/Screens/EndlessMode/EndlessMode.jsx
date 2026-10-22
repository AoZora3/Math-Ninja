import "../../Assets/Styles/Stages.css";
import {
  getPolynomialEquation,
  getTrigonometricEquation,
  getTrigonometricFunction,
  getTrigonometricFunctionName
} from "../../Game/Equations/EquationText.js";
import { getStage3Equation } from "../../Game/Equations/Stage3Equation.js";

const getPresetGroup = (preset) => preset.type === "trigonometric"
  ? `trigonometric-${getTrigonometricFunction(preset)}`
  : preset.type;

const getPresetName = (preset) => preset.type === "trigonometric"
  ? getTrigonometricFunctionName(getTrigonometricFunction(preset))
  : preset.type.charAt(0).toUpperCase() + preset.type.slice(1);

const getPresetEquation = (preset) => {
  if (preset.type === "trigonometric") return getTrigonometricEquation(preset);
  if (["linear", "quadratic", "cubic"].includes(preset.type)) return getPolynomialEquation(preset);
  if (preset.formulaKind) return getStage3Equation(preset);
  return preset.equation || preset.label;
};

export default function EndlessMode({ presets, highScore = 0, onBack, onAddEquation, onStart }) {
  const equationTypes = [...new Set(presets.map(getPresetGroup))]
    .map((group) => presets.find((preset) => getPresetGroup(preset) === group));

  return (
    <div className="screen">
      <header className="header">
        <button type="button" className="back-button" onClick={onBack} aria-label="Back to stage select">
          ←
        </button>
        <h2>ENDLESS MODE</h2>
        <div className="header-spacer" />
      </header>

      <main className="preset-container">
        <div className="stage-heading">
          <span>UNLIMITED RUN</span>
          <h1>ENDLESS FORMULAS</h1>
          <p>Start with one minute. Fruit adds time; bombs take time away.</p>
          <p className="endless-high-score">Highest score: <strong>{highScore}</strong></p>
        </div>

        <section className="endless-presets-block" aria-labelledby="endless-presets-title">
          <h2 id="endless-presets-title">Equation types in your hotbar</h2>
          <p>Choose a function during the run to switch curves.</p>
          {equationTypes.length > 0 ? (
            <ul>
              {equationTypes.map((preset) => (
                <li key={getPresetGroup(preset)}>
                  <strong>{getPresetName(preset)}:</strong> {getPresetEquation(preset)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No equation types are unlocked yet.</p>
          )}
        </section>

        <div className="stage-actions">
          <button type="button" className="add-equation-btn" onClick={onAddEquation}>
            + Add Equation
          </button>
          <button type="button" className="continue-btn" onClick={onStart} disabled={presets.length === 0}>
            Start Endless
          </button>
        </div>
      </main>
    </div>
  );
}