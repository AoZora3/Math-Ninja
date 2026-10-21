import GettingStarted from "./Tutorial/GettingStarted.jsx";
import "../../Assets/Styles/Stages.css";

const STAGES = [
  { key: "stage1", number: 1, title: "GRAPH BASICS", description: "Learn the fundamentals of graph equations." },
  { key: "stage2", number: 2, title: "TRIG WAVES", description: "Practice creating and identifying trigonometric functions." },
  { key: "stage3", number: 3, title: "EXPONENTIALS + INVERSE LOGS", description: "Compare exponential curves with their inverse logarithms." }
];

export default function StageSelect({
  setScreen,
  onBack,
  showOnboarding,
  setShowOnboarding,
  unlockedStep,
  stageStars = {},
  endlessHighScore = 0
}) {
  const stageUnlocked = (number) => number === 1 || unlockedStep >= number;
  const endlessUnlocked = unlockedStep >= 4;

  const renderStageStars = (stage) => {
    const count = stageStars[stage.key] || 0;
    return (
      <div className="stage-stars" role="img" aria-label={`Stage ${stage.number}: ${count} of 3 stars`}>
        {[0, 1, 2].map((star) => (
          <span className={star < count ? "earned" : ""} key={star} aria-hidden="true">
            {star < count ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="screen">
      <header className="header">
        <button className="back-button" onClick={onBack} aria-label="Back to title screen">←</button>
        <h2>STAGE SELECT</h2>
        <div className="header-spacer" />
        <button className="info-button" onClick={() => setShowOnboarding(true)} aria-label="How to play">i</button>
      </header>

      <main className="stage-container">
        {showOnboarding && (
          <GettingStarted
            onClose={() => setShowOnboarding(false)}
            onFinish={() => setShowOnboarding(false)}
          />
        )}

        <h1 className="page-title">CHOOSE YOUR STAGE</h1>
        <p className="page-description">Complete each stage to master mathematical graphs.</p>

        <div className="stage-grid">
          {STAGES.map((stage) => {
            const unlocked = stageUnlocked(stage.number);
            return (
              <article className={`stage-card ${unlocked ? "unlocked" : "locked"}`} key={stage.key}>
                <div className="stage-number">{stage.number}</div>
                <div className="stage-info">
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                  {renderStageStars(stage)}
                  <button
                    type="button"
                    className="stage-play-button"
                    disabled={!unlocked}
                    aria-label={unlocked ? `Play Stage ${stage.number}: ${stage.title}` : `Stage ${stage.number}: ${stage.title} locked`}
                    onClick={() => setScreen(stage.key)}
                  >
                    {unlocked ? "PLAY" : "LOCKED"}
                  </button>
                </div>
              </article>
            );
          })}

          <article className={`stage-card endless-card ${endlessUnlocked ? "unlocked" : "locked"}`}>
            <div className="endless-icon">∞</div>
            <div className="stage-info">
              <h3>ENDLESS MODE</h3>
              <p>Keep playing with randomly generated challenges.</p>
              <p className="endless-best">Highest score: <strong>{endlessHighScore}</strong></p>
              <button
                type="button"
                className="stage-play-button"
                disabled={!endlessUnlocked}
                aria-label={endlessUnlocked ? "Play Endless Mode" : "Endless Mode locked"}
                onClick={() => setScreen("endless")}
              >
                {endlessUnlocked ? "PLAY" : "LOCKED"}
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
