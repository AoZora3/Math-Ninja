function TitleScreen({ onStart, screen }) {
  // =========================
  // SPLASH SCREEN
  // =========================
  return (
      <div className={`screen splash-screen ${screen === "splash" ? "active" : ""}`}>

        <div className="logo-container">
          <h1 className="math-title">MATH</h1>
          <h1 className="ninja-title">NINJA</h1>
        </div>

        <div className="ninja-character">
          🥷
        </div>

        <p className="tagline">
          Slice • Solve • Master
        </p>

        <button
          className="start-button"
          onClick={onStart}
        >
          START
        </button>

        <p className="version">
          MathNinja
        </p>

      </div>
    );
}
export default TitleScreen;