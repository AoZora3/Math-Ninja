export default function EquationTypeSelect({ onSelectType, onBack }) {
  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: 20 }}>
      <header className="header" style={{ marginBottom: 20 }}>
        <button className="back-button" onClick={onBack}>←</button>
        <h2>Select Equation Type</h2>
        <div className="header-spacer"></div>
      </header>

      <div style={{ display: 'grid', gap: 16 }}>
        <button
          type="button"
          onClick={() => onSelectType('quadratic')}
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
          Quadratic
        </button>

        <button
          type="button"
          onClick={() => onSelectType('linear')}
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
          Linear
        </button>
      </div>
    </div>
  );
}
