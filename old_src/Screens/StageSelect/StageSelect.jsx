import { useState } from 'react';

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
              onClick={() =>
                alert("Stage 2 is coming soon!")
              }
            >
              <div className="stage-number">
                2
              </div>

              <div className="stage-info">
                <h3>LINEAR SLASH</h3>

                <p>
                  Practice creating and identifying lines.
                </p>

                <span className="play-label">
                  🔓 PLAY
                </span>
              </div>
            </button>

            {/* STAGE 3 */}

            <button
              className="stage-card unlocked"
              onClick={() =>
                alert("Stage 3 is coming soon!")
              }
            >
              <div className="stage-number">
                3
              </div>

              <div className="stage-info">
                <h3>QUADRATIC ATTACK</h3>

                <p>
                  Explore curves and quadratic equations.
                </p>

                <span className="play-label">
                  🔓 PLAY
                </span>
              </div>
            </button>

            {/* STAGE 4 */}

            <button
              className="stage-card unlocked"
              onClick={() =>
                alert("Stage 4 is coming soon!")
              }
            >
              <div className="stage-number">
                4
              </div>

              <div className="stage-info">
                <h3>NINJA MASTER</h3>

                <p>
                  Put your graph skills to the ultimate test.
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