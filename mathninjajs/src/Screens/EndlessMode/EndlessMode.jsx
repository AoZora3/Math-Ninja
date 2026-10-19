import "../../Assets/Styles/Stages.css";

export default function EndlessMode({ presets, onBack, onAddEquation, onStart }) {
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
          <p>Fruit adds time. Bombs take time away.</p>
        </div>

        <section className="endless-presets-block" aria-labelledby="endless-presets-title">
          <h2 id="endless-presets-title">Unlocked presets available</h2>
          <p>Every formula unlocked in Stages 1–3 will be available in the run.</p>
          {presets.length > 0 ? (
            <ul>
              {presets.map((preset) => (
                <li key={preset.id}>{preset.label}</li>
              ))}
            </ul>
          ) : (
            <p>No stage formulas are unlocked yet.</p>
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