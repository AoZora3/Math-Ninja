import { useState } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("splash");

  // =========================
  // SPLASH SCREEN
  // =========================
  if (screen === "splash") {
    return (
      <div className="screen splash-screen">

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
          onClick={() => setScreen("stageSelect")}
        >
          START
        </button>

        <p className="version">
          MathNinja
        </p>

      </div>
    );
  }

  // =========================
  // STAGE SELECT
  // =========================
  if (screen === "stageSelect") {
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

  // =========================
  // STAGE 1 PRESET DISPLAY
  // =========================
  if (screen === "stage1") {

    const presets = [
      {
        equation: "y = x",
        title: "BASIC LINE",
        description:
          "A simple diagonal line with a positive slope.",
      },
      {
        equation: "y = 2x",
        title: "STEEP LINE",
        description:
          "Increasing the coefficient makes the line steeper.",
      },
      {
        equation: "y = x + 2",
        title: "UPWARD SHIFT",
        description:
          "The constant moves the line upward.",
      },
      {
        equation: "y = x - 2",
        title: "DOWNWARD SHIFT",
        description:
          "A negative constant moves the line downward.",
      },
    ];

    return (
      <div className="screen">

        <header className="header">

          <button
            className="back-button"
            onClick={() => setScreen("stageSelect")}
          >
            ←
          </button>

          <h2>STAGE 1</h2>

          <div className="header-spacer"></div>

        </header>

        <main className="preset-container">

          <div className="stage-heading">

            <span>
              STAGE 1
            </span>

            <h1>
              GRAPH BASICS
            </h1>

            <p>
              Choose a preset equation to study its graph.
            </p>

          </div>

          <div className="preset-grid">

            {presets.map((preset, index) => (

              <div
                className="preset-card"
                key={index}
              >

                <div className="preset-graph">

                  <div className="graph-axis-x"></div>
                  <div className="graph-axis-y"></div>

                  <div
                    className={`preset-line line-${index}`}
                  ></div>

                </div>

                <div className="preset-content">

                  <span className="preset-number">
                    PRESET {index + 1}
                  </span>

                  <h2>
                    {preset.equation}
                  </h2>

                  <h3>
                    {preset.title}
                  </h3>

                  <p>
                    {preset.description}
                  </p>

                  <button
                    className="select-button"
                    onClick={() =>
                      alert(
                        `${preset.equation}\n\n${preset.description}`
                      )
                    }
                  >
                    VIEW PRESET
                  </button>

                </div>

              </div>

            ))}

          </div>

        </main>

      </div>
    );
  }

  return null;
}

export default App;
