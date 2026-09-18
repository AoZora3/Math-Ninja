const formatSliderValue = (value) => Number(value).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');

export default function PresetCard({ preset, onChange }) {
  const sliderStep = 0.01;

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12, borderRadius: 10 }}>
      <p style={{ margin: '0 0 12px', fontWeight: 700 }}>{preset.label}</p>
      {Object.keys(preset.coefficients).map(key => {
        const currentValue = Number(preset.coefficients[key]);

        return (
          <label key={key} style={{ display: 'block', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>{key}</span>
              <strong>{formatSliderValue(currentValue)}</strong>
            </div>
            <input
              type="range"
              min={preset.minMax[key][0]}
              max={preset.minMax[key][1]}
              step={sliderStep}
              value={currentValue}
              onChange={e => onChange(preset.id, key, Number.parseFloat(Number(e.target.value).toFixed(2)))}
              style={{ width: '100%' }}
            />
          </label>
        );
      })}
    </div>
  );
}