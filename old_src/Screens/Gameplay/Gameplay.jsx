import { useEffect, useState } from 'react';

const weapons = ['y = x', 'y = 2x - 4', 'y = -x + 5', 'y = x² - 2', 'y = 0.5x + 1', 'y = -x² + 4'];
// Keep the target hitbox within plus or minus 0.5 graph units of the curve.
const COLLISION_TOLERANCE = 0.5;

// Check several nearby X positions so the full emoji collision box can touch the curve.
function isTargetHit(equation, target, xVariable, yVariable) {
	for (let xOffset = -COLLISION_TOLERANCE; xOffset <= COLLISION_TOLERANCE; xOffset += 0.1) {
		const curveY = evaluate(equation, target.x + xVariable + xOffset) + yVariable;
		if (Number.isFinite(curveY) && Math.abs(curveY - target.y) <= COLLISION_TOLERANCE) return true;
	}
	return false;
}

// Create one target at a random point inside the visible graph area.
function randomTarget(type) {
	return {
		id: `${type}-${Date.now()}-${Math.random()}`,
		type,
		x: Number((Math.random() * 14 - 7).toFixed(1)),
		y: Number((Math.random() * 14 - 7).toFixed(1)),
	};
}

// Start and refill each round with two fruits and one bomb.
function createTargets() {
	return [randomTarget('apple'), randomTarget('apple'), randomTarget('bomb')];
}

// Evaluate the supported equation formats without using dynamic code execution.
function evaluate(formula, x) {
	const expression = formula.replace(/^y\s*=\s*/i, '').replaceAll(' ', '');
	const constantTotal = (constants) => (constants || '').match(/[+-]?\d+(?:\.\d+)?/g)?.reduce((sum, value) => sum + Number(value), 0) || 0;
	const sineMatch = expression.match(/^([+-]?(?:\d+(?:\.\d+)?)?)sin\(x\)((?:[+-]\d+(?:\.\d+)?)+)?$/i);
	if (sineMatch) return (sineMatch[1] === '-' ? -1 : Number(sineMatch[1] || 1)) * Math.sin(x) + constantTotal(sineMatch[2]);

	const quadraticMatch = expression.match(/^(-?)(\d+(?:\.\d+)?)?x²((?:[+-]\d+(?:\.\d+)?)+)?$/i);
	if (quadraticMatch) return (quadraticMatch[1] === '-' ? -1 : 1) * Number(quadraticMatch[2] || 1) * x * x + constantTotal(quadraticMatch[3]);

	const linearMatch = expression.match(/^(-?)(\d+(?:\.\d+)?)?x((?:[+-]\d+(?:\.\d+)?)+)?$/i);
	if (linearMatch) return (linearMatch[1] === '-' ? -1 : 1) * Number(linearMatch[2] || 1) * x + constantTotal(linearMatch[3]);

	return Number(expression);
}

// Render the graph, equation curve, and currently active emoji targets.
function GameGraph({ equation, targets, xVariable, yVariable }) {
	const range = 8;
	const point = (x, y) => ({ x: 20 + ((x + range) / (range * 2)) * 360, y: 20 + ((range - y) / (range * 2)) * 300 });
	const curve = Array.from({ length: 161 }, (_, index) => {
		const x = -range + index / 10;
		const y = evaluate(equation, x + xVariable) + yVariable;
		return Number.isFinite(y) && Math.abs(y) <= range ? point(x, y) : null;
	});
	const path = curve.reduce((result, current) => {
		if (!current) return result;
		return `${result}${result && !result.endsWith('M') ? 'L' : 'M'} ${current.x.toFixed(1)} ${current.y.toFixed(1)} `;
	}, '');

	return (
		<svg className="game-graph" viewBox="0 0 400 340" role="img" aria-label="Gameplay graph">
			<rect width="400" height="340" className="graph-background" />
			{Array.from({ length: 9 }, (_, index) => {
				const offset = 20 + index * 45;
				return <g key={offset}><line x1={offset} y1="20" x2={offset} y2="320" className="graph-grid-line" /><line x1="20" y1={offset} x2="380" y2={offset} className="graph-grid-line" /></g>;
			})}
			<line x1="20" y1="170" x2="380" y2="170" className="graph-axis" />
			<line x1="200" y1="20" x2="200" y2="320" className="graph-axis" />
			<path d={path} className="graph-curve" />
			{targets.map((target) => {
				const position = point(target.x, target.y);
				return <text key={target.id} x={position.x} y={position.y + 12} className="graph-target" role="img" aria-label={target.type === 'bomb' ? 'bomb' : 'fruit'}>{target.type === 'bomb' ? '💣' : '🍎'}</text>;
			})}
		</svg>
	);
}

export default function Gameplay({ setScreen, initialEquation }) {
	// Track the selected equation and the live X/Y graph adjustments.
	const [activeWeapon, setActiveWeapon] = useState(initialEquation || weapons[0]);
	const [xVariable, setXVariable] = useState(0);
	const [yVariable, setYVariable] = useState(0);
	// The round starts at zero and ends when the player reaches the target score.
	const [score, setScore] = useState(0);
	const [combo, setCombo] = useState(2);
	const [lives, setLives] = useState(3);
	// Store exactly three active targets and replace each target after a collision.
	const [targets, setTargets] = useState(createTargets);
	const [elapsed, setElapsed] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [message, setMessage] = useState('');
	const adjustedEquation = `${activeWeapon} | x ${xVariable >= 0 ? '+' : '-'} ${Math.abs(xVariable)}, y ${yVariable >= 0 ? '+' : '-'} ${Math.abs(yVariable)}`;

	// Keep elapsed time running once per second while the round is active.
	useEffect(() => {
		if (gameOver) return undefined;
		const tick = setInterval(() => {
			setElapsed((current) => current + 1);
		}, 1000);
		return () => clearInterval(tick);
	}, [gameOver]);

	// Wait two seconds after an equation or slider change before checking collisions.
	useEffect(() => {
		if (gameOver) return undefined;
		const collisionDelay = setTimeout(() => {
			// A target is touched when the equation is within the collision tolerance.
			const hits = targets.filter((target) => isTargetHit(activeWeapon, target, xVariable, yVariable));
			if (!hits.length) return;

			const bombHit = hits.some((target) => target.type === 'bomb');
			const fruitCount = hits.filter((target) => target.type === 'apple').length;
			// Bomb contact removes a heart and resets the fruit multiplier to 1x.
			if (bombHit) {
				setLives((current) => {
					const next = Math.max(0, current - 1);
					if (next === 0) setGameOver(true);
					return next;
				});
				setCombo(1);
				setMessage('BOMB HIT! -1 HEART');
			// Safe fruit contact awards five points per fruit, multiplied by the current bonus.
			} else if (fruitCount > 0) {
				setScore((current) => {
					const points = fruitCount * 5 * combo;
					const next = current + points;
					if (next >= 100) setGameOver(true);
					return next;
				});
				setCombo(2);
				setMessage(`SAFE SLICE! +${fruitCount * 5 * combo} PTS`);
			}

			// Refill only the target types that were cleared so the board stays balanced.
			const remaining = targets.filter((target) => !hits.includes(target));
			setTargets([...remaining, ...Array.from({ length: fruitCount }, () => randomTarget('apple')), ...Array.from({ length: hits.filter((target) => target.type === 'bomb').length }, () => randomTarget('bomb'))]);
		}, 2000);
		return () => clearTimeout(collisionDelay);
	}, [activeWeapon, combo, gameOver, targets, xVariable, yVariable]);

	// Reset every round value so the player can start a fresh game.
	const restart = () => {
		setScore(0);
		setLives(3);
		setCombo(2);
		setElapsed(0);
		setTargets(createTargets());
		setMessage('');
		setGameOver(false);
	};

	return (
		<div className="gameplay-screen screen">
			<header className="gameplay-header">
				<button className="back-button" onClick={() => setScreen('stage1')} aria-label="Back to presets">←</button>
				<div><span>SCORE</span><strong>{score} / 100</strong></div>
				<div className="gameplay-lives" aria-label={`${lives} lives`}>{'♥'.repeat(lives)}{'♡'.repeat(3 - lives)}</div>
			</header>
			<main className="gameplay-main">
				<div className="gameplay-status">{message || <>TIME: <strong>{elapsed}s</strong> | ACTIVE: <strong>{adjustedEquation}</strong></>}</div>
				<GameGraph equation={activeWeapon} targets={targets} xVariable={xVariable} yVariable={yVariable} />
				{gameOver && <div className="gameover-panel"><strong>{score >= 100 ? 'TARGET REACHED!' : 'OUT OF HEARTS'}</strong><span>FINAL SCORE: {score}</span><button className="select-button" onClick={restart}>RESTART</button></div>}
				<section className="weapon-panel">
					<div className="weapon-panel-title">⚔ EQUATION LOADOUT <span>{combo}x COMBO</span></div>
					<label className="variable-control" htmlFor="x-variable">
						<span>X VALUE <strong>{xVariable > 0 ? '+' : ''}{xVariable.toFixed(1)}</strong></span>
						<input id="x-variable" type="range" min="-10" max="10" step="0.1" value={xVariable} onChange={(event) => { setXVariable(Number(event.target.value)); setMessage(''); }} />
						<span className="variable-scale"><span>-10</span><span>0</span><span>+10</span></span>
					</label>
					<label className="variable-control" htmlFor="y-variable">
						<span>Y VALUE <strong>{yVariable > 0 ? '+' : ''}{yVariable.toFixed(1)}</strong></span>
						<input id="y-variable" type="range" min="-10" max="10" step="0.1" value={yVariable} onChange={(event) => { setYVariable(Number(event.target.value)); setMessage(''); }} />
						<span className="variable-scale"><span>-10</span><span>0</span><span>+10</span></span>
					</label>
					<div className="weapon-grid">
						{weapons.map((weapon) => <button key={weapon} className={weapon === activeWeapon ? 'weapon active' : 'weapon'} onClick={() => { setActiveWeapon(weapon); setMessage(''); }} disabled={gameOver}>{weapon}</button>)}
					</div>
				</section>
			</main>
		</div>
	);
}
