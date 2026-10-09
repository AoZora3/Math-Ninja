import "../../Assets/Styles/SettingsStyle.css";

export default function Settings({ volume, onVolumeChange, setScreen }) {
    const handleVolumeChange = (event) => {
        onVolumeChange(Number(event.target.value));
    };

    return (
        <main className="settings-screen" onClick={() => setScreen("splash")}>
            <section
                className="settings-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="settings-title">Settings</h2>
                <div className="setting-item">
                    <div className="setting-volume-heading">
                        <label htmlFor="sound-volume">Background music</label>
                        <output htmlFor="sound-volume" aria-live="polite">{volume}%</output>
                    </div>
                    <input
                        type="range"
                        id="sound-volume"
                        min="0"
                        max="100"
                        step="1"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                    <div className="setting-volume-range" aria-hidden="true">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                    <p>Adjust the background music volume.</p>
                </div>
                <button className="settings-back-button" onClick={() => setScreen("splash")}>
                    Back
                </button>
            </section>
        </main>
    );
}