import Stars from '../../Components/Stars.jsx';
import '../../Assets/Styles/StageResult.css';

export function calculateStars({ won, lives, hitRate, elapsedSeconds }) {
	if (!won) return 0;

	return Number(lives > 1) + Number(hitRate >= 80) + Number(elapsedSeconds <= 120);
}

export default function StageResult({ won, score, lives, hitRate, elapsedSeconds, onRetry, onBack }) {
	const stars = calculateStars({ won, lives, hitRate, elapsedSeconds });
	const resultMessage = won
		? 'Goal reached. Your run is complete.'
		: lives <= 0
			? 'You ran out of health before reaching the goal.'
			: 'Three minutes are up. The goal was not reached in time.';

	return (
		<main className={`result-screen ${won ? 'result-win' : 'result-loss'}`}>
			<section className="result-panel" aria-labelledby="result-title">
				<p className="result-kicker">RUN COMPLETE</p>
				<h1 id="result-title">{won ? 'Stage cleared' : 'Game over'}</h1>
				<p className="result-message">{resultMessage}</p>

				<Stars count={stars} />
				<p className="result-star-summary">{stars} of 3 stars earned</p>

				<div className="result-score" aria-label={`Final score ${score} points`}>
					<span>POINTS</span>
					<strong>{score}</strong>
				</div>

				<dl className="result-stats">
					<div>
						<dt>Health left</dt>
						<dd>{lives} / 3</dd>
					</div>
					<div>
						<dt>Hit rate</dt>
						<dd>{Math.floor(hitRate)}%</dd>
					</div>
					<div>
						<dt>Time</dt>
						<dd>{Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}</dd>
					</div>
				</dl>

				<div className="result-actions">
					<button type="button" className="result-button secondary" onClick={onBack}>Back to stage</button>
					<button type="button" className="result-button primary" onClick={onRetry}>Play again</button>
				</div>
			</section>
		</main>
	);
}
