import { useEffect, useState } from 'react';
import PresetCard from '../../Components/PresetCards.jsx';
import MathGraph from '../Gameplay/MathGraph';
import { getTrigonometricEquation } from '../../Game/Equations/EquationText.js';
import { getStage3Equation } from '../../Game/Equations/Stage3Equation.js';

const formatNumber = (value) => {
  const rounded = Number(value);
  if (!Number.isFinite(rounded)) return '0';
  return Number(rounded.toFixed(2)).toString();
};

const buildEquationString = (preset) => {
  if (!preset) return 'y = 0';

  const a = Number(preset.coefficients?.a ?? 0);
  const b = Number(preset.coefficients?.b ?? 0);
  if (preset.type === 'exponential' && preset.inverseFn) {
    return getStage3Equation(preset);
  }
  if (preset.type === 'trigonometric') {
    return getTrigonometricEquation(preset);
  }

  if (preset.type === 'quadratic') {
    return `y = ${formatNumber(a)}x² ${b >= 0 ? '+' : '-'} ${formatNumber(Math.abs(b))}`;
  }

  // Preserve cubic notation while coefficients are edited.
  if (preset.type === 'cubic') {
    return `y = ${formatNumber(a)}x³ ${b >= 0 ? '+' : '-'} ${formatNumber(Math.abs(b))}`;
  }

  return `y = ${formatNumber(a)}x ${b >= 0 ? '+' : '-'} ${formatNumber(Math.abs(b))}`;
};

export default function EditPreset({ currentPreset, onBack, onSave }) {
  const [preset, setPreset] = useState(currentPreset);

  useEffect(() => {
    setPreset(currentPreset);
  }, [currentPreset]);

  if (!preset) return null;

  function handleChange(id, key, value) {
    const safeValue = Number.isFinite(Number(value)) ? Number(Number(value).toFixed(2)) : 0;

    setPreset((prev) => {
      if (!prev) return prev;

      const next = {
        ...prev,
        coefficients: {
          ...(prev.coefficients || { a: 1, b: 0 }),
          [key]: safeValue
        }
      };

      next.equation = buildEquationString(next);
      return next;
    });
  }

  function handleSave() {
    const savedPreset = {
      ...preset,
      id: preset.id || `preset-${Date.now()}`,
      title:
        preset.type === 'exponential' && preset.inverseFn
          ? preset.title
          : preset.type === 'cubic'
          ? 'CUBIC EQUATION'
          : preset.type === 'quadratic'
            ? 'QUADRATIC EQUATION'
          : preset.type === 'trigonometric'
            ? (preset.waveType === 'classic'
                ? 'CLASSIC WAVE'
                : preset.waveType === 'multi'
                  ? 'MULTI-FREQUENCY'
                  : preset.waveType === 'damped'
                    ? 'DAMPED WAVE'
                    : 'TELEPORTING RAMP')
            : 'LINEAR EQUATION',
      description:
        preset.type === 'exponential' && preset.inverseFn
          ? preset.description
          : preset.type === 'cubic'
          ? 'An S-shaped graph with adjustable stretch and vertical shift.'
          : preset.type === 'quadratic'
            ? 'A curved graph with a vertical stretch and shift.'
          : preset.type === 'trigonometric'
            ? (preset.waveType === 'classic'
                ? 'Smooth repeating motion with a fixed ceiling and floor.'
                : preset.waveType === 'multi'
                  ? 'A larger wave with smaller ripples mixed together.'
                  : preset.waveType === 'damped'
                    ? 'A wave that fades back to rest after intense motion.'
                    : 'A sharp climbing curve with instant discontinuities.')
            : 'A straight-line graph with adjustable slope and intercept.',
      equation: buildEquationString(preset)
    };

    onSave(savedPreset);
  }

  return (
    <div className="screen edit-preset-screen">
      <header className="header edit-preset-header">
        <button className="back-button" onClick={onBack}>←</button>
        <h2>{
          preset.type === 'exponential' && preset.inverseFn
            ? `EDIT ${preset.title}`
            : preset.type === 'cubic'
            ? 'EDIT CUBIC'
            : preset.type === 'quadratic'
              ? 'EDIT QUADRATIC'
            : preset.type === 'trigonometric'
              ? (preset.waveType === 'classic'
                  ? 'EDIT CLASSIC WAVE'
                  : preset.waveType === 'multi'
                    ? 'EDIT MULTI-FREQUENCY'
                    : preset.waveType === 'damped'
                      ? 'EDIT DAMPED WAVE'
                      : 'EDIT TELEPORTING RAMP')
              : 'EDIT LINEAR'
        }</h2>
        <div className="header-spacer"></div>
      </header>

      <main className="edit-preset-content">
        <section className="edit-preset-preview" aria-label="Equation preview">
          <div className="edit-preset-graph">
            <MathGraph activePreset={preset} width={320} height={260} />
          </div>

          <div className="edit-preset-equation">
            {buildEquationString(preset)}
          </div>
        </section>

        <PresetCard preset={preset} onChange={handleChange} />

        <div className="edit-preset-actions">
          <button
            type="button"
            onClick={onBack}
            className="edit-preset-cancel"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="edit-preset-save"
          >
            Save Preset
          </button>
        </div>
      </main>
    </div>
  );
}
