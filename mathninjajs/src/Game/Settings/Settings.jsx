import { useState } from "react";
import "../../Assets/Styles/SettingsStyle.css";

export default function Settings({ volume, onVolumeChange, sfxVolume, onSfxVolumeChange, onResetProgress, onUnlockAllStages, setScreen }) {
    const [titleClicks, setTitleClicks] = useState(0);

    const handleVolumeChange = (event, onChange) => {
        onChange(Number(event.target.value));
    };

    // Three clicks on the settings title unlock all stage progression for testing.
    const handleSettingsTitleClick = () => {
        const nextClickCount = titleClicks + 1;
        if (nextClickCount === 3) {
            onUnlockAllStages();
            setTitleClicks(0);
            return;
        }
        setTitleClicks(nextClickCount);
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
                <h2 id="settings-title">
                    <button className="settings-title-button" type="button" onClick={handleSettingsTitleClick}>
                        Settings
                    </button>
                </h2>
                {/* Music and effects keep separate volume controls. */}
                <div className="setting-item">
                    <div className="setting-volume-heading">
                        <label htmlFor="music-volume">Background music</label>
                        <output htmlFor="music-volume" aria-live="polite">{volume}%</output>
                    </div>
                    <input
                        type="range"
                        id="music-volume"
                        min="0"
                        max="100"
                        step="1"
                        value={volume}
                        onChange={(event) => handleVolumeChange(event, onVolumeChange)}
                    />
                    <div className="setting-volume-range" aria-hidden="true">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                    <p>Adjust the background music volume.</p>
                </div>
                <div className="setting-item">
                    <div className="setting-volume-heading">
                        <label htmlFor="sfx-volume">Sound effects</label>
                        <output htmlFor="sfx-volume" aria-live="polite">{sfxVolume}%</output>
                    </div>
                    <input
                        type="range"
                        id="sfx-volume"
                        min="0"
                        max="100"
                        step="1"
                        value={sfxVolume}
                        onChange={(event) => handleVolumeChange(event, onSfxVolumeChange)}
                    />
                    <div className="setting-volume-range" aria-hidden="true">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                    <p>Adjust sound effects independently from music.</p>
                </div>
                <div className="setting-item">
                    {/* Reset progression only; audio settings and other saved data are preserved. */}
                    <button className="settings-reset-button" type="button" onClick={onResetProgress}>
                        Reset Progress
                    </button>
                    <p>Locks Stages 2-3 and Endless again. Other settings remain unchanged.</p>
                </div>
                <button className="settings-back-button" onClick={() => setScreen("splash")}>
                    Back
                </button>
            </section>
        </main>
    );
}