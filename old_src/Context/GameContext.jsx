export default function PresetCard({ preset, onChange }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
      <p>{preset.label}</p>
      {Object.keys(preset.coefficients).map(key => (
        <label key={key} style={{ display: 'block' }}>
          {key}: {preset.coefficients[key]}
          <input
            type="range"
            min={preset.minMax[key][0]}
            max={preset.minMax[key][1]}
            step="0.5"
            value={preset.coefficients[key]}
            onChange={e => onChange(preset.id, key, parseFloat(e.target.value))}
          />
        </label>
      ))}
    </div>
  );
}
