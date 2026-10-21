import "../../Assets/Styles/Stages.css";

export default function EndlessMode({ presets, highScore = 0, onBack, onAddEquation, onStart }) {
  const equationTypes = [...new Set(presets.map((preset) => preset.type))];

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
          <p>Choose an equation type during the run to switch curves.</p>
          {equationTypes.length > 0 ? (
            <ul>
              {equationTypes.map((type) => <li key={type}>{type}</li>)}
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