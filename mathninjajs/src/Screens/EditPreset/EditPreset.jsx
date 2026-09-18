import { useEffect, useState } from 'react';
import PresetCard from '../../Components/PresetCards.jsx';
import MathGraph from '../Gameplay/MathGraph';

const formatNumber = (value) => {
  const rounded = Number(value);
  if (!Number.isFinite(rounded)) return '0';
  return Number(rounded.toFixed(2)).toString();
};

const buildEquationString = (preset) => {
  if (!preset) return 'y = 0';

  const a = Number(preset.coefficients?.a ?? 0);
  const b = Number(preset.coefficients?.b ?? 0);

  if (preset.type === 'quadratic') {
    return `y = ${formatNumber(a)}x² ${b >= 0 ? '+' : '-'} ${formatNumber(Math.abs(b))}`;
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
      title: preset.type === 'quadratic' ? 'QUADRATIC EQUATION' : 'LINEAR EQUATION',
      description:
        preset.type === 'quadratic'
          ? 'A curved graph with a vertical stretch and shift.'
          : 'A straight-line graph with adjustable slope and intercept.',
      equation: buildEquationString(preset)
    };

    onSave(savedPreset);
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <header className="header" style={{ marginBottom: 12 }}>
        <button className="back-button" onClick={onBack}>←</button>
        <h2>{preset.type === 'quadratic' ? 'EDIT QUADRATIC' : 'EDIT LINEAR'}</h2>
        <div className="header-spacer"></div>
      </header>

      <div style={{ marginBottom: 16 }}>
        <MathGraph activePreset={preset} />
      </div>

      <div style={{
        marginBottom: 16,
        padding: '10px 12px',
        background: '#f3f4f6',
        borderRadius: 8,
        fontWeight: 700,
        textAlign: 'center'
      }}>
        {buildEquationString(preset)}
      </div>

      <PresetCard preset={preset} onChange={handleChange} />

      <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db' }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            background: '#2563eb',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Save Preset
        </button>
      </div>
    </div>
  );
}
