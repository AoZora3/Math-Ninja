import Settings from "../../Game/Settings/Settings.jsx";
import "../../Assets/Styles/TitleScreenStyle.css"

function TitleScreen({ onStart, screen, setScreen, musicVolume, onMusicVolumeChange }) {
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

        {screen === "settings" && (
          <Settings
            volume={musicVolume}
            onVolumeChange={onMusicVolumeChange}
            setScreen={setScreen}
          />
        )}
      </div>
    );
}
export default TitleScreen;