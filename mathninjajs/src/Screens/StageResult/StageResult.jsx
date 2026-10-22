import Stars from '../../Components/Stars.jsx';
import '../../Assets/Styles/StageResult.css';

export function calculateStars({ won, lives, hitRate, elapsedSeconds }) {
	if (!won) return 0;

	return Number(lives > 1) + Number(hitRate >= 80) + Number(elapsedSeconds <= 120);
}

export default function StageResult({
	won,
	score,
	lives,
	hitRate,
	elapsedSeconds,
	isEndless = false,
	highScore = 0,
	onRetry,
	onBack
}) {
	const stars = calculateStars({ won, lives, hitRate, elapsedSeconds });
	const resultMessage = isEndless
		? 'The timer ran out. Your endless run is over.'
		: won
		? 'Goal reached. Your run is complete.'
		: lives <= 0
			? 'You ran out of health before reaching the goal.'
			: 'Three minutes are up. The goal was not reached in time.';
	const starCriteria = [
		{ label: 'Have more than 1 health left', value: `${lives}/3` },
		{ label: 'Have at least 80% hit rate', value: `${Math.floor(hitRate)}%` },
		{
			label: 'Finish within 2 minutes',
			value: `${Math.floor(elapsedSeconds / 60)}:${String(Math.floor(elapsedSeconds % 60)).padStart(2, '0')}`
		}
	];

	return (
		<main className={`result-screen result-overlay ${won ? 'result-win' : 'result-loss'}`} role="dialog" aria-modal="true" aria-labelledby="result-title">
			<section className="result-panel" aria-labelledby="result-title">
				<p className="result-kicker">{isEndless ? 'ENDLESS RUN COMPLETE' : 'RUN COMPLETE'}</p>
				<h1 id="result-title">{isEndless ? 'Endless run over' : won ? 'Stage cleared' : 'Game over'}</h1>
				<p className="result-message">{resultMessage}</p>

				<div className="result-score" aria-label={`Final score ${score} points`}>
					<span>POINTS</span>
					<strong>{score}</strong>
				</div>
				{!isEndless && <Stars count={stars} criteria={starCriteria} />}
				{!isEndless && <p className="result-star-summary">{stars} of 3 stars earned</p>}
				{isEndless && <p className="result-star-summary">Highest endless score: {highScore}</p>}

				<div className="result-actions">
					<button type="button" className="result-button secondary" onClick={onBack}>{isEndless ? 'Back to Endless' : 'Return to stages'}</button>
					<button type="button" className="result-button primary" onClick={onRetry}>Play again</button>
				</div>
			</section>
		</main>
	);
}
