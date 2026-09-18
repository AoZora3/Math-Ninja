const formatSliderValue = (value) => Number(value).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');

export default function PresetCard({ preset, onChange }) {
  const sliderStep = 0.01;
  const safePreset = preset || {};
  const coefficients = safePreset.coefficients || { a: 1, b: 0 };
  const minMax = safePreset.minMax || { a: [-5, 5], b: [-5, 5] };

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12, borderRadius: 10 }}>
      <p style={{ margin: '0 0 12px', fontWeight: 700 }}>{safePreset.label || 'Preset'}</p>
      {Object.keys(coefficients).map(key => {
        const currentValue = Number(coefficients[key] ?? 0);
        const bounds = minMax[key] || [-5, 5];

        return (
          <label key={key} style={{ display: 'block', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>{key}</span>
              <strong>{formatSliderValue(currentValue)}</strong>
            </div>
            <input
              type="range"
              min={bounds[0]}
              max={bounds[1]}
              step={sliderStep}
              value={currentValue}
              onChange={e => onChange?.(safePreset.id, key, Number.parseFloat(Number(e.target.value).toFixed(2)))}
              style={{ width: '100%' }}
            />
          </label>
        );
      })}
    </div>
  );
}