export default function StageSelect({ screen, setScreen }) {                                                                           
    return (
      <div className="screen">

        <header className="header">

          <button
            className="back-button"
            onClick={() => setScreen("splash")}
          >
            ←
          </button>

          <h2>STAGE SELECT</h2>

          <div className="header-spacer"></div>

        </header>

        <main className="stage-container">

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
              className="stage-card unlocked"
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
                  🔓 PLAY
                </span>
              </div>
            </button>

            {/* STAGE 3 */}

            <button
              className="stage-card unlocked"
              onClick={() => setScreen("stage3")}
            >
              <div className="stage-number">
                3
              </div>

              <div className="stage-info">
                <h3>LOGARITHMIC ATTACK</h3>

                <p>
                  Explore logarithmic equations.
                </p>

                <span className="play-label">
                  🔓 PLAY
                </span>
              </div>
            </button>

            {/* STAGE 4 */}

            <button
              className="stage-card unlocked"
              onClick={() => setScreen("stage4")}
            >
              <div className="stage-number">
                4
              </div>

              <div className="stage-info">
                <h3>EXPONENTIAL MASTER</h3>

                <p>
                  Put your graph skills to the exponential test.
                </p>

                <span className="play-label">
                  🔓 PLAY
                </span>
              </div>
            </button>

            {/* ENDLESS MODE */}

            <button
              className="stage-card endless-card"
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
                  ∞ ENDLESS
                </span>
              </div>
            </button>

          </div>

        </main>

      </div>
    );
  }