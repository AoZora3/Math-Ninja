import GettingStarted from "./Tutorial/GettingStarted.jsx";
import Settings from "./Settings/Settings.jsx";
import "../../Assets/Styles/TitleScreenStyle.css"

import { useState } from "react";

function TitleScreen({ onStart, screen, setScreen }) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [soundVolume, setSoundVolume] = useState(50);
  
  if (screen === "settings") {
    return (
      <Settings
        volume={soundVolume}
        onVolumeChange={setSoundVolume}
        setScreen={setScreen}
      />
    );
  }

  // =========================
  // Title Screen
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

        <button className="start-button" onClick={onStart}> START </button>
        <button className="settings-button" onClick={() => setScreen("settings")}> SETTINGS </button>

        <p className="version">
          MathNinja
        </p>

      {showOnboarding && (
        <GettingStarted
          onClose={() => setShowOnboarding(false)}
          onFinish={() => setShowOnboarding(false)}
        />
      )}

      </div>
    );
}
export default TitleScreen;