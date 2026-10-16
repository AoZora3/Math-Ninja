import GettingStarted from "./Tutorial/GettingStarted.jsx";

export default function StageSelect({ screen, setScreen, onBack, showOnboarding, setShowOnboarding, unlockedStep }) {
  // Step 4 is available only after the combined Stage 3 has been cleared.
  const stage2Unlocked = unlockedStep >= 2;
  const stage3Unlocked = unlockedStep >= 3;
  const endlessUnlocked = unlockedStep >= 4;

    return (
      <div className="screen">
        <header className="header">
          <button
            className="back-button"
            onClick={onBack}
          >
            ←
          </button>

          <h2>STAGE SELECT</h2>

          <div className="header-spacer"></div>

          <button className="info-button" 
          onClick = {() => setShowOnboarding(true)}>
            i
          </button>
          
        </header>

        <main className="stage-container">
          
          {showOnboarding && (
            <GettingStarted
              onClose={() => setShowOnboarding(false)}
              onFinish={() => setShowOnboarding(false)}
            />
          )}
        
          <h1 className="page-title">
            CHOOSE YOUR STAGE
          </h1>

          <p className="page-description">
            Complete each stage to master mathematical graphs.
          </p>

          <div className="stage-grid">

            {/* STAGE 1 */}

            <button
              className="stage-card unlocked"
              onClick={() => setScreen("stage1")}
            >
              <div className="stage-number">
                1
              </div>

              <div className="stage-info">
                <h3>GRAPH BASICS</h3>

                <p>
                  Learn the fundamentals of graph equations.
                </p>

                <span className="play-label">
                  🔓 PLAY
                </span>
              </div>
            </button>

            {/* STAGE 2 */}

            <button
              className={`stage-card ${stage2Unlocked ? "unlocked" : "locked"}`}
              disabled={!stage2Unlocked}
              onClick={() => setScreen("stage2")}
            >
              <div className="stage-number">
                2
              </div>

              <div className="stage-info">
                <h3>TRIG WAVES</h3>

                <p>
                  Practice creating and identifying Trigonomic Functions Lines.
                </p>

                <span className="play-label">
                  {stage2Unlocked ? "🔓 PLAY" : "🔒 LOCKED"}
                </span>
              </div>
            </button>

            {/* Stage 3 combines the former logarithmic and exponential stages. */}

            <button
              className={`stage-card ${stage3Unlocked ? "unlocked" : "locked"}`}
              disabled={!stage3Unlocked}
              onClick={() => setScreen("stage3")}
            >
              <div className="stage-number">
                3
              </div>

              <div className="stage-info">
                <h3>EXPONENTIALS + INVERSE LOGS</h3>

                <p>
                  Compare four exponential curves with their inverse logarithms.
                </p>

                <span className="play-label">
                  {stage3Unlocked ? "🔓 PLAY" : "🔒 LOCKED"}
                </span>
              </div>
            </button>

            {/* ENDLESS MODE */}

            <button
              className={`stage-card endless-card ${endlessUnlocked ? "unlocked" : "locked"}`}
              disabled={!endlessUnlocked}
              onClick={() =>
                alert("Endless Mode is coming soon!")
              }
            >
              <div className="endless-icon">
                ∞
              </div>

              <div className="stage-info">
                <h3>ENDLESS MODE</h3>

                <p>
                  Keep playing with randomly generated challenges.
                </p>

                <span className="endless-label">
                  {endlessUnlocked ? "∞ UNLOCKED" : "🔒 LOCKED"}
                </span>
              </div>
            </button>
          </div>

        </main>

      </div>
    );
  }