import React, { useEffect, useRef } from "react";
import "../../../Assets/Styles/SettingsStyle.css";

export default function Settings({ volume, onVolumeChange, setScreen }) {
    const previewSound = useRef(null);

    useEffect(() => {
        const sound = new Audio(require("../../../Assets/SoundEffects/Temp.mp3"));
        previewSound.current = sound;

        return () => {
            sound.pause();
            previewSound.current = null;
        };
    }, []);

    const handleVolumeChange = (event) => {
        const nextVolume = Number(event.target.value);
        onVolumeChange(nextVolume);

        const sound = previewSound.current;
        if (!sound) {
            return;
        }

        sound.volume = nextVolume / 100;
        if (nextVolume === 0) {
            sound.pause();
            sound.currentTime = 0;
            return;
        }

        if (sound.paused || sound.ended) {
            sound.currentTime = 0;
            const playback = sound.play();
            if (playback) {
                playback.catch((error) => {
                    console.error("Unable to play the sound preview.", error);
                });
            }
        }
    };

    return (
        <main className="screen settings-screen">
            <section className="settings-panel" aria-labelledby="settings-title">
                <h2 id="settings-title">Settings</h2>
                <div className="setting-item">
                    <div className="setting-volume-heading">
                        <label htmlFor="sound-volume">Sound volume</label>
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
                    <p>Move the slider to preview the sound at the selected volume.</p>
                </div>
                <button className="settings-back-button" onClick={() => setScreen("splash")}>
                    Back
                </button>
            </section>
        </main>
    );
}