import Settings from "../../Game/Settings/Settings.jsx";
import "../../Assets/Styles/TitleScreenStyle.css"

function TitleScreen({ onStart, screen, setScreen, musicVolume, onMusicVolumeChange, sfxVolume, onSfxVolumeChange, onResetProgress, onUnlockAllStages }) {
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

        {screen === "settings" && ( // Title settings menu
          <Settings
            volume={musicVolume}
            onVolumeChange={onMusicVolumeChange}
            sfxVolume={sfxVolume}
            onSfxVolumeChange={onSfxVolumeChange}
            onResetProgress={onResetProgress}
            onUnlockAllStages={onUnlockAllStages}
            setScreen={setScreen}
          />
        )}
      </div>
    );
}
export default TitleScreen;