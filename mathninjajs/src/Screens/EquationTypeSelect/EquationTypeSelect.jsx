export default function EquationTypeSelect({ onSelectType, onBack, allowedTypes = ['quadratic', 'linear'] }) {
  const typeLabels = {
    quadratic: 'Quadratic',
    linear: 'Linear',
    trigonometric: 'Trigonometric',
    logarithmic: 'Logarithmic',
    exponential: 'Exponential'
  };

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: 20 }}>
      <header className="header" style={{ marginBottom: 20 }}>
        <button className="back-button" onClick={onBack}>←</button>
        <h2>Select Equation Type</h2>
        <div className="header-spacer"></div>
      </header>

      <div style={{ display: 'grid', gap: 16 }}>
        {allowedTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelectType(type)}
            style={{
              padding: '18px 20px',
              borderRadius: 12,
              border: '1px solid #d1d5db',
              background: '#f3f4f6',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
